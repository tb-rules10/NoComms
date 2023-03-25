import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.png';
import {ToastContainer, toast} from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

function Register() {

  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    // theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate('/');
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
      const {username, email, password} = values;
      const {data} = await axios.post(registerRoute, {
        username, email, password,
      });
      if(data.status === false){
        // alert(data.message);
        toast.error(data.message, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,JSON.stringify(data.user));
        navigate('/');
      }
    }
  };

  const handleChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
  };
  
  const handleValidation = () => {
    const {username, email, password, confirmPassword} = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length <= 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
           <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>NoComms</h1>
           </div>
           <input type="text" name="username" placeholder='Username' onChange={(e) => handleChange(e)} />
           <input type="email" name="email" placeholder='Email' onChange={(e) => handleChange(e)} />
           <input type="password" name="password" placeholder='Password' onChange={(e) => handleChange(e)} />
           <input type="password" name="confirmPassword" placeholder='Confirm Password' onChange={(e) => handleChange(e)} />
           <button type="submit">Create User</button>
           <span>Already have an account? <Link to="/login">Login</Link></span>
        </form>
      </FormContainer><ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand{
    align-items: center;
    justify-content: center;
    display: flex;
    gap: 1rem;
  }
  img{
    height: 5rem;
  }
  h1{
    color: white;
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
      background: transparent;
      padding: 1rem;
      border: 0.1rem solid #430eff;
      border-radius: 0.4rem;
      color: white;
      font-size: 1rem;
      &:focus{
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
  }
  button {
    background-color: #997af0;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    color: white;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover{
      background-color: #4e0eff;
      transition: 0.5s ease-in-out;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    font-size: 0.7rem;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register
