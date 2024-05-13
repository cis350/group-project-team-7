import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const serverUrl = process.env.REACT_APP_SERVER_URL;

const UserAnswers = () => {
    const { username } = useParams();
    const [userAnswers, setUserAnswers] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserAnswers = async () => {
            try {
                const response = await fetch(`${serverUrl}/get_user_answers?username=${username}`, {
                    method: "GET",
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user answers");
                }
                const data = await response.json();
                setUserAnswers(data);
            } catch (error) {
                console.error("Error fetching user answers:", error);
            }
        };

        fetchUserAnswers();
    }, [username]);

    useEffect(() => {
        fetch(`${serverUrl}/get_current_user`, {
            method: "GET",
            credentials: 'include',
        }).then((res) => {
            console.log("Current User: ", res);
            res.text()
        })
            .then((resText) => {
                console.log(resText)
                if (resText) {
                    console.log("Current User: ", resText)
                } else {
                    // redirect to login
                    // navigate("/")
                }
            });
    }, []);


    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${serverUrl}/delete_one_answer?_id=${postId}`, {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) {
                console.log("error")
                throw new Error("Failed to delete post");
            }
            setUserAnswers(userAnswers.filter((answer) => answer._id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <button
                type="button"
                onClick={() => navigate("/form")}
                className="text-white w-[24vw] bg-blue-900 mt-4 hover:bg-blue-950 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
                Return to Form
            </button>
            <Typography variant="h4" component="h1" className="mb-4">
                Your Post History:
            </Typography>
            {userAnswers.map((answer, index) => (
                <Card key={index} className="w-full max-w-md">
                    <CardContent>
                        <Typography variant="h6" component="h2" className="mb-2">
                            Post {index + 1}
                        </Typography>
                        <Typography variant="body1" component="p">
                            {answer.answer1}
                        </Typography>
                        <Typography variant="body1" component="p">
                            {answer.answer2}
                        </Typography>
                        <Typography variant="body1" component="p">
                            {answer.answer3}
                        </Typography>
                        <Typography variant="body1" component="p">
                            {answer.answer4}
                        </Typography>
                        <Button
                            onClick={() =>
                                handleDeletePost(answer._id)
                            }
                            color="error"
                        >
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default UserAnswers;
