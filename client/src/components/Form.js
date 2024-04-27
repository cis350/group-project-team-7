import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';


const serverUrl = process.env.REACT_APP_SERVER_URL;

/**
 * Form component
 */
const Form = () => {
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

  // check if user is logged in
  useEffect(() => {
    fetch(`${serverUrl}/get_current_user`, {
      method: "GET",
      credentials: 'include',
    }).then((res) => res.text())
      .then((resText) => {
        console.log(resText)
        if (resText) {
          console.log("Current User: ", resText)
        } else {
          // redirect to login
          navigate("/")
        }
      });
  }, []);

  // Submit form function
  const handleSubmit = () => {
    if (answer1.length === 0 | answer2.length === 0 | answer3.length === 0) {
      toast.error("Please answer all mandatory questions")
    } else {
      fetch(`${serverUrl}/update_answer?answer1=${answer1}&answer2=${answer2}&answer3=${answer3}&answer4=${answer4}`, {
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

  // Logout function
  const handleLogout = () => {
    fetch(`${serverUrl}/logout`, {
    method: "POST",
    credentials: 'include'
    }).then(() => {
        navigate("/login");
    });
  };

  return (
    <>
      <div style={{ height: "100vh", padding: "5vh" }} className="w-100">
        <div
          style={{ marginBottom: "12vh" }}
          className="d-flex justify-content-center"
        >
        </div>
        <div className="m-auto text-right mb-3">
          <button
            type="button"
            onClick={() => handleLogout()}
            className="text-white w-[10vw] bg-red-800 mt-4 hover:bg-red-900 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
            Logout
          </button>
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
            {"How helpful was today's tutoring session for you?*"}
          </p>
          <div>
            <select
              id={"select1"}
              className="appearance-none peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              color="primary"
              onChange={(choice) => {
                setAnswer1(choice.target.value);
              }}
            >
              <option value="">Answer:</option>
              {helpOptions.map(answer => (
                <option value={answer} key={answer}>{answer}</option>
              ))}
            </select>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"How comfortable did you feel asking questions or expressing confusion during the session?*"}
            </p>
            <div>
              <select
                id={"select2"}
                className="appearance-none peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                color="primary"
                onChange={(choice) => {
                  setAnswer2(choice.target.value);
                }}
              >
                <option value="">Answer:</option>
                {helpOptions.map((answer) => (
                  <option value={answer} key={answer}>{answer}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"How much do you feel like you belong at Moder Patshala?*"}
            </p>
            <div>
              <select
                id={"select3"}
                className="appearance-none peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                color="primary"
                onChange={(choice) => {
                  setAnswer3(choice.target.value);
                }}
              >
                <option value="">Answer:</option>
                {belongOptions.map((answer) => (
                  <option value={answer} key={answer}>{answer}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2">
            <p className="m-auto text-left text-m">
              {"Any other feedback? "}
            </p>
            <TextField
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
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
