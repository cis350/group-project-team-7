import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

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

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${serverUrl}/delete_one_answer?_id=${postId}`, {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error("Failed to delete post");
            }
            toast.success("Deleted Answer!");
            setUserAnswers(userAnswers.filter((answer) => answer._id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div style={{ height: "100vh", padding: "5vh" }} className="w-100">
            <div className="text-center mb-4 text-4xl font-semibold">Your Post History:</div>
            <div className="grid grid-cols-3 gap-4">
                {userAnswers.map((answer, index) => (
                    <Card key={index} className="max-w-md mb-4">
                        <CardContent>
                            <Typography variant="h6" component="h2" className="mb-2">
                                Post {index + 1}
                            </Typography>
                            <Typography variant="body1" component="p" className="mb-2">
                                {answer.answer1}
                            </Typography>
                            <Typography variant="body1" component="p" className="mb-2">
                                {answer.answer2}
                            </Typography>
                            <Typography variant="body1" component="p" className="mb-2">
                                {answer.answer3}
                            </Typography>
                            <Typography variant="body1" component="p" className="mb-2">
                                {answer.answer4}
                            </Typography>
                            <Button onClick={() => handleDeletePost(answer._id)} color="error" variant="contained">
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="text-center">
                <Button
                    onClick={() => navigate("/form")}
                    variant="contained"
                    className="mt-4"
                >
                    Return to Form
                </Button>
            </div>
        </div>
    );
};

export default UserAnswers;
