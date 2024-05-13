import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const UserAnswers = () => {
    const { username } = useParams();
    const [userAnswers, setUserAnswers] = useState([]);



    useEffect(() => {
        const fetchUserAnswers = async () => {
            try {
                const response = await fetch(`${serverUrl}/get_user_answers`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user answers");
                }
                const data = await response.json();
                setUserAnswers(data);
                console.log(data)
                console.log(username)

            } catch (error) {
                console.error("Error fetching user answers:", error);
            }
        };

        fetchUserAnswers();
    }, [username]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
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
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default UserAnswers;
