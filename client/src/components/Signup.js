import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';

const serverUrl = process.env.REACT_APP_SERVER_URL;

console.log("serverUrl", serverUrl);

/**
 * Signup component
 */
const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(`${serverUrl}/get_current_user`, {
      method: "GET",
      credentials: 'include',
    }).then((res) => res.text())
      .then((resText) => {
        if (resText) {
          console.log("no way")
        }
      });
  }, []);

  // Login function
  const handleSignup = () => {
    if (username.length === 0) {
      toast.error("Username must be filled")
    } else if (password.length === 0) {
      toast.error("Password must be filled")
    } else {
      fetch(`${serverUrl}/signup?username=${username}&password=${password}`, {
        method: "POST",
        credentials: 'include'
      }).then((data) => {
        if (data.status === 201) {
          toast.success("Signed up!")
        } else {
          toast.error("Username in use")
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
        </div>
        <div className="text-center mb-4 text-2xl font-semibold">Create your account</div>
        <div className="mx-auto w-fit">
          <div>
            <TextField
              name="Username"
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Username"
              defaultValue=""
              onChange={(e) => setUsername(e.target.value)}
              data-testid = 'username-input'
            />
          </div>
          <div className="mt-2">
            <TextField
              name="Password"
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Password"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
              data-testid = 'password-input'
            />
          </div>
        </div>
        <div className="m-auto text-center mb-3">
          <button
            type="button"
            onClick={() => handleSignup()}
            className="text-white w-[24vw] bg-lime-900 mt-4 hover:bg-lime-950 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
            Continue
          </button>
        </div>
        <p className="m-auto text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 text-decoration-none">
            Log in
          </a>
        </p>
      </div>
    </>
  );
};

export default Signup;
