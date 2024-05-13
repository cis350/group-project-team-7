import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie, VictoryLabel } from "victory";
import WordCloud from "react-d3-cloud";


const serverUrl = process.env.REACT_APP_SERVER_URL;

const DataVisualization = () => {
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState("answer1");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${serverUrl}/get_answers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                console.log(data)
                setAnswers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Process the fetched data for visualization based on selected answer type
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

    // Process the fetched data for pie chart based on selected answer type
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



    // Analyze the most frequent usernames
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
        console.log(data, "tag")
        return data;
    };

    const mostFrequentUsernames = () => {
        const usernameCounts = answers.reduce((counts, answer) => {
            const username = answer.username || "Unknown"; // Use "Unknown" if username is not provided
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
        <div className="flex justify-center items-center flex-wrap">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
                <h2 className="text-lg font-semibold mb-4">Data Visualization - Bar Chart</h2>
                <div className="mb-4">
                    <label htmlFor="answerSelector" className="mr-2 font-medium">Select Answer Type:</label>
                    <select
                        id="answerSelector"
                        className="px-3 py-2 border rounded-md"
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                    >
                        <option value="answer1">Answer 1</option>
                        <option value="answer2">Answer 2</option>
                        <option value="answer3">Answer 3</option>
                    </select>
                </div>
                <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
                    <VictoryAxis tickFormat={(tick) => tick} />
                    <VictoryAxis dependentAxis />
                    <VictoryBar
                        data={processDataForBarChart()}
                        x="x"
                        y="y"
                        style={{ data: { fill: "steelblue" }, labels: { fontSize: 10, angle: 45, padding: 5 } }}
                        labelComponent={<VictoryLabel dy={-10} />}
                    />
                </VictoryChart>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
                <h2 className="text-lg font-semibold mb-4">Data Visualization - Pie Chart</h2>
                <VictoryPie
                    data={processDataForPieChart()}
                    colorScale={["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"]}
                    style={{ labels: { fontSize: 12 } }}
                    labelRadius={({ innerRadius }) => innerRadius + 20}
                />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
                <h2 className="text-lg font-semibold mb-4">Most Frequent Usernames</h2>
                <VictoryChart
                    domainPadding={20}
                    theme={VictoryTheme.material}
                    containerComponent={<VictoryContainer data-testid="bar-chart" />}
                >
                    <VictoryAxis />
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
            <div className="w-full p-4">
                <h2 className="text-lg font-semibold mb-4">Word Cloud</h2>
                <WordCloud
                    data={processDataForWordCloud()}
                    width={500}
                    height={100}
                    fontStyle="italic"
                    fontWeight="bold"
                    fontSize={(word) => Math.log2(word.value) * 5}
                    spiral="rectangular"
                    rotate={(word) => word.value % 360}
                    padding={5}
                    random={Math.random}

                />
            </div>

        </div>
    );
};

export default DataVisualization;