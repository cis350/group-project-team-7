import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';

// const serverHost = process.env.REACT_APP_SERVER_HOST;
// const serverPort = process.env.REACT_APP_SERVER_PORT;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Form = () => {
  const [username, setUsername] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${serverUrl}/get_current_user`, {
      method: "GET",
      credentials: 'include',
    }).then((res) => res.text())
      .then((resText) => {
        console.log(resText)
        if (resText) {
          console.log("wow")
        }
      });
  }, []);

  // Submit form function
  const handleSubmit = () => {
    if (answer1.length === 0 | answer2.length === 0 | answer3.length === 0 | answer4.length === 0) {
      toast.error("Please answer all the questions")
    } else {
      fetch(`${serverUrl}/submit_form?username=${username}&answer1=${answer1}&answer2=${answer2}&answer3=${answer3}&answer4=${answer4}`, {
        method: "POST",
        credentials: 'include'
      }).then((data) => {
        if (data.status === 201) {
          toast.success("Submitted Form!")
          navigate("/form");
        } else {
          toast.error("Server Error")
        }
      }
      );
    }
  };

  return (
    <>
      <div style={{ height: "100vh", padding: "5vh" }} className="w-100">
        <div
          style={{ marginBottom: "12vh" }}
          className="d-flex justify-content-center"
        >
          {/* <img
            className="m-auto text-center text-light"
            src={"https://w7.pngwing.com/pngs/773/201/png-transparent-airplane-aircraft-flight-logo-airplane-blue-logo-flight-thumbnail.png"}
            width="25"
          ></img> */}
        </div>
        <div className="text-center mb-4 text-xl">Survey Questions: </div>
        <hr
            style={{
                color: "black",
                backgroundColor: "gray",
                height: 2,
                width: 550,
                margin: "auto",
                marginBottom: "20px",
            }}
        />
        <div className="mx-auto w-fit">
          <div>
          <p className="m-auto text-left text-m">
            {"Question 1: "}
          </p>
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              defaultValue=""
              onChange={(e) => setAnswer1(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
                {"Question 2: "}
            </p>
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              defaultValue=""
              onChange={(e) => setAnswer2(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
                {"Question 3: "}
            </p>
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              defaultValue=""
              onChange={(e) => setAnswer3(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
                {"Question 4: "}
            </p>
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              defaultValue=""
              onChange={(e) => setAnswer4(e.target.value)}
            />
          </div>
          <div className="mt-2">
          {/* <tbody>
                {flightInfo[0] && (
                    <tr class="border-b border-gray-200">
                        <td
                            scope="row"
                            class="px-6 py-4 whitespace-nowrap bg-gray-50"
                        >
                            {flightInfo[0].AirlineName}
                        </td>
                        <td class="px-6 py-4">
                            {flightInfo[0].StartingAirport}
                        </td>
                        <td class="px-6 py-4 bg-gray-50">
                            {flightInfo[0].DestinationAirport}
                        </td>
                        <td class="px-6 py-4">
                            {flightInfo[0].TravelDuration}
                        </td>
                        <td class="px-6 py-4 bg-gray-50">
                            {flightInfo[0].TravelDistance}
                        </td>
                        <td class="px-6 py-4">
                            {flightInfo[0].isBasicEconomy.data[0] === 0
                                ? "No"
                                : "Yes"}
                        </td>
                        <td class="px-6 py-4 bg-gray-50">
                            {flightInfo[0].isRefundable.data[0] === 0
                                ? "No"
                                : "Yes"}
                        </td>
                        <td class="px-6 py-4">{flightInfo[0].Segments}</td>
                        <td class="px-6 py-4 bg-gray-50">
                            {"$" + flightInfo[0].TotalFare}
                        </td>
                    </tr>
                )}
            </tbody> */}
          </div>
        </div>
        <div className="m-auto text-center mb-3">
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="text-white w-[24vw] bg-lime-900 mt-4 hover:bg-lime-950 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Form;
