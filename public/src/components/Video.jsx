import React from "react";
import { useNavigate } from "react-router-dom";
import { BiVideo } from "react-icons/bi";
import styled from "styled-components";
import'react-toastify/dist/ReactToastify.css';

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    
  };
  return (
    <Button onClick={handleClick}>
      <BiVideo />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;