import React, { useEffect, useState } from "react";
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryPie,
    VictoryLabel,
    VictoryContainer,
    VictoryLegend
} from "victory";
import WordCloud from "react-d3-cloud";
import { useNavigate } from "react-router-dom";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const DataVisualization = () => {
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState("answer1");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverUrl}/get_answers`, {
                    method: "GET",
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setAnswers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetch(`${serverUrl}/get_current_user`, {
            method: "GET",
            credentials: 'include',
        })
            .then((res) => res.text())
            .then((resText) => {
                if (!resText) {
                    navigate("/");
                }
            });
    }, [navigate]);

    const processDataForBarChart = () => {
        const answerCounts = answers.reduce((counts, answer) => {
            const selectedValue = answer[selectedAnswer] || "";
            counts[selectedValue] = (counts[selectedValue] || 0) + 1;
            return counts;
        }, {});

        const data = Object.keys(answerCounts).map((answer) => ({
            x: answer,
            y: answerCounts[answer],
        }));

        return data;
    };

    const processDataForPieChart = () => {
        const answerCounts = answers.reduce((counts, answer) => {
            const selectedValue = answer[selectedAnswer] || "";
            counts[selectedValue] = (counts[selectedValue] || 0) + 1;
            return counts;
        }, {});

        const data = Object.keys(answerCounts).map((answer) => ({
            x: answer,
            y: answerCounts[answer],
        }));

        return data;
    };

    const processDataForWordCloud = () => {
        const wordCloudData = answers.map((answer) => answer.answer4 || "");
        const wordsCount = wordCloudData.join(" ").split(/\s+/).reduce((counts, word) => {
            counts[word] = (counts[word] || 0) + 1;
            return counts;
        }, {});

        const data = Object.keys(wordsCount).map((word) => ({
            text: word,
            value: wordsCount[word],
        }));

        console.log(data, "word cloud data")

        return data;
    };

    const mostFrequentUsernames = () => {
        const usernameCounts = answers.reduce((counts, answer) => {
            const username = answer.username || "Unknown";
            counts[username] = (counts[username] || 0) + 1;
            return counts;
        }, {});

        const sortedUsernames = Object.keys(usernameCounts).sort(
            (a, b) => usernameCounts[b] - usernameCounts[a]
        );

        return sortedUsernames.map((username) => ({
            x: username,
            y: usernameCounts[username],
        }));
    };

    return (
        <div style={{ height: "100vh", padding: "5vh" }} className="w-100">
            <div style={{ marginBottom: "12vh" }} className="d-flex justify-content-center"></div>
            <div className="m-auto text-right mb-3">
                <button
                    type="button"
                    onClick={() => navigate("/form")}
                    className="text-white w-[10vw] bg-red-800 mt-4 hover:bg-red-900 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none"
                >
                    Return to Form
                </button>
            </div>
            <div className="text-center mb-4 text-xl">Data Visualization</div>
            <hr
                style={{
                    color: "black",
                    backgroundColor: "gray",
                    height: 2,
                    width: 1000,
                    margin: "auto",
                    marginBottom: "20px",
                }}
            />
            <div className="mb-4">
                <label htmlFor="answerSelector" className="mr-2 font-medium">Select Answer Type:</label>
                <select
                    id="answerSelector"
                    className="appearance-none peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                    <option value="answer1">Answer 1</option>
                    <option value="answer2">Answer 2</option>
                    <option value="answer3">Answer 3</option>
                </select>
            </div>

            <div className="flex justify-center space-x-6 mb-6">

                <div className="w-full p-4">
                    <h2 className="text-lg font-semibold mb-4">Response Frequencies</h2>

                    <VictoryChart domainPadding={{ x: 20, y: 50 }} theme={VictoryTheme.material}>
                        <VictoryAxis tickFormat={(tick) => tick} style={{ // adding padding here does nothing
                            tickLabels: { angle: -45, textAnchor: 'end' } // adding padding here does nothing
                        }}
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryBar


                            data={processDataForBarChart()}
                            x="x"
                            y="y"
                            style={{
                                data: { fill: "steelblue" },
                                labels: { fontSize: 10, padding: 5 }
                            }}
                            labelComponent={<VictoryLabel dy={-10} />}
                        />
                    </VictoryChart>
                </div>
                <div className="w-full p-4">
                    <h2 className="text-lg font-semibold mb-4">Response Distribution</h2>
                    <div className="flex justify-center items-center flex-col">
                        <VictoryPie
                            data={processDataForPieChart()}
                            colorScale={["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"]}
                            style={{ labels: { display: "none" } }}
                            labelRadius={({ innerRadius }) => innerRadius + 20}
                            padding={{ top: 20, bottom: 20, left: 100, right: 100 }}
                        />
                        <VictoryLegend
                            x={125} y={10}
                            title="Legend"
                            centerTitle
                            orientation="vertical"
                            gutter={20}
                            style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
                            data={processDataForPieChart().map((d, i) => ({
                                name: d.x,
                                symbol: { fill: ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"][i % 5] }
                            }))}
                        />
                    </div>
                </div>
                <div className="w-full p-4">
                    <h2 className="text-lg font-semibold mb-4">Frequent Responders</h2>
                    <VictoryChart
                        domainPadding={{ x: 20, y: 50 }}
                        theme={VictoryTheme.material}
                        containerComponent={<VictoryContainer data-testid="bar-chart" />}
                    >
                        <VictoryAxis style={{ // adding padding here does nothing
                            tickLabels: { angle: -45, textAnchor: 'end' } // adding padding here does nothing
                        }} />
                        <VictoryAxis dependentAxis />
                        <VictoryBar
                            data={mostFrequentUsernames()}
                            x="x"
                            y="y"
                            style={{ data: { fill: "steelblue" }, labels: { fontSize: 10 } }}
                            labelComponent={<VictoryLabel dy={-10} />}
                        />
                    </VictoryChart>
                </div>
            </div>
            <div className="w-full p-4 rounded-lg border border-gray-300" style={{ marginTop: "20px" }}>
                <h2 className="text-lg font-semibold mb-4">Word Cloud</h2>
                <WordCloud
                    data={processDataForWordCloud()}
                    width={300}
                    height={100}
                    fontStyle="italic"
                    fontWeight="bold"
                    fontSize={(word) => Math.log2(word.value) * 15}
                    spiral="rectangular"
                    rotate={(word) => word.value % 360}
                    random={Math.random}
                />
            </div>
        </div>
    );
};

export default DataVisualization;