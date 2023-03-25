import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        async function setData() {
            setUserName(
                await JSON.parse(
                    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                ).username
            );
        }
        setData();
    }, []);
    return (
        <Container>
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 18.5rem;
    margin: 1.5rem;
  }
  span {
    color: #4e0eff;
  }
`;