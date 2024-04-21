import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';


const serverUrl = process.env.REACT_APP_SERVER_URL;

const Form = () => {
  const [username, setUsername] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");

  const navigate = useNavigate();

  // All genres of movies
  const helpOptions = [
    "Extremely Helpful",
    "Very Helpful",
    "Somewhat Helpful",
    "Slightly Helpful",
    "Not Helpful"
  ];

  const belongOptions = [
    "I feel like I really belong",
    "I feel like I somewhat belong",
    "I'm not sure how I feel",
    "I feel like I don't belong much",
    "I feel like I don't belong at all"
  ];

  // useEffect(() => {
  //   fetch(`${serverUrl}/get_current_user`, {
  //     method: "GET",
  //     credentials: 'include',
  //   }).then((res) => res.text())
  //     .then((resText) => {
  //       console.log(resText)
  //       if (resText) {
  //         console.log("wow")
  //         setUsername(resText)
  //       }
  //     });
  // }, []);

  // Submit form function
  const handleSubmit = () => {
    fetch(`${serverUrl}/get_current_user`, {
      method: "GET",
      credentials: 'include',
    }).then((res) => res.text())
      .then((resText) => {
        console.log(resText)
        if (resText) {
          console.log("wow")
          setUsername(resText)
        }
        else {
          console.log('no res')
          setUsername("test_user")
        }
      });
    if (answer1.length === 0 | answer2.length === 0 | answer3.length === 0 | answer4.length === 0) {
      toast.error("Please answer all the questions")
    } else {
      fetch(`${serverUrl}/update_answer?username=ey&answer1=${answer1}&answer2=${answer2}&answer3=${answer3}&answer4=${answer4}`, {
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
          <p className="m-auto text-left text-m">
            {"How helpful was today's tutoring session for you?"}
          </p>
          <div>
            <select
              id={"select1"}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              color="primary"
              variant="outlined"
              onChange={(choice) => {
                setAnswer1(choice.target.value);
              }}
            >
              <option value="">Answer:</option>
              {helpOptions.map((answer) => (
                <option value={answer}>{answer}</option>
              ))}
            </select>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"How comfortable did you feel asking questions or expressing confusion during the session?"}
            </p>
            <div>
              <select
                id={"select2"}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                color="primary"
                variant="outlined"
                onChange={(choice) => {
                  setAnswer2(choice.target.value);
                }}
              >
                <option value="">Answer:</option>
                {helpOptions.map((answer) => (
                  <option value={answer}>{answer}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"How much do you feel like you belong at Moder Patshala?"}
            </p>
            <div>
              <select
                id={"select3"}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                color="primary"
                variant="outlined"
                onChange={(choice) => {
                  setAnswer3(choice.target.value);
                }}
              >
                <option value="">Answer:</option>
                {belongOptions.map((answer) => (
                  <option value={answer}>{answer}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"Any other feedback? "}
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
