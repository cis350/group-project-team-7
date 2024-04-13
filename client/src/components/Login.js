import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';

// const serverHost = process.env.REACT_APP_SERVER_HOST;
// const serverPort = process.env.REACT_APP_SERVER_PORT;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  // Login function
  const handleLogin = () => {
    if (username.length === 0) {
      toast.error("Username must be filled")
    } else if (password.length === 0) {
      toast.error("Password must be filled")
    } else {
      fetch(`${serverUrl}/login?username=${username}&password=${password}`, {
        method: "POST",
        credentials: 'include'
      }).then((data) => {
        if (data.status === 201) {
          toast.success("Logged in!")
          navigate("/domestic");
        } else {
          toast.error("Username or password is incorrect")
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
        <div className="text-center mb-4 text-4xl font-semibold">Moder Patshala </div>
        <div className="text-center mb-4 text-m">Guiding Students and Parents to a Brighter Future Since 2004</div>
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
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Username"
              defaultValue=""
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Password"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="m-auto text-center mb-3">
          <button
            type="button"
            onClick={() => handleLogin()}
            className="text-white w-[24vw] bg-lime-900 mt-4 hover:bg-lime-950 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
            Continue
          </button>
        </div>
        <p className="m-auto text-center text-sm">
          {"Don't have an account? "}
          <a href="/signup" className="text-blue-500 text-decoration-none">
            Sign up
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
