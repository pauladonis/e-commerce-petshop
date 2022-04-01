import React, { useState } from 'react';
import axios from 'axios';
import './register.css';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


function Register(props) {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    let navigate = useNavigate();

    const register = () => {
      axios({
        method: "POST",
        data: {
          email: registerEmail,
          password: registerPassword,
        },
        withCredentials: true,
        url: "/register"
      }).then((res) => {
        toast.success("You are now registered!");
        navigate('/login');
      }).catch((error) => {
        toast.error("This email is already registered!");
      });
    };
  
    return (
        <div className="register">
          
          <h1>Register</h1>
          <input placeholder="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)}/>
          <input placeholder="password" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)}/>
           <button onClick={register}>Submit</button>
          <a href="/login">Login Page</a>
          
        </div>
    )    
}

export default Register;