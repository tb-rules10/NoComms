import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff, BiVideo } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import {ToastContainer, toast} from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';

export default function Logout() {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    // theme: "dark",
  };
  const navigate = useNavigate();
  const handleClick = async () => {
    const username = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    ).username;
    const data = await axios.get(`${logoutRoute}/${username}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
      toast("Logged Out", toastOptions);
    }
    // localStorage.clear();
    // navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
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