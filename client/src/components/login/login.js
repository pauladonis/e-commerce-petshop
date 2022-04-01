import React, { useState } from 'react';
import axios from 'axios';
import './login.css'
import googleLogo from '../../resources/googleLogo.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function Login(props) {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const handleData = props.handleData;
    const handleLoggedOut = props.handleLoggedOut;
    let navigate = useNavigate();


        const login = () => {
            axios({
              method: "POST",
              data: {
                email: loginEmail,
                password: loginPassword
              },
              withCredentials: true,
              url: "/login"
            }).then((res) => {
              handleData(res.data.user);
              handleLoggedOut(false);
              toast.success("You are now logged in!");
              navigate("/");
              }
            ).catch((error) => {
              toast.error("Email or password is incorrect!");
            });
        };
          

          const loginWithGoogle = () =>  {window.open("/auth/google", "_new");
           };

          const googleLogin = () => {
            axios({
              method: "GET",
              withCredentials: true,
              url:"/googleId"
            }).then((res) => {
              handleData(res.data.user.id);
              console.log(res.data.user.id);
              handleLoggedOut(false);
              navigate("/");
              toast.success("You are now logged in!");
            });
          }

    return (
  
        <div className="login">
          <div className="login"><h1>Login</h1>
          <input placeholder="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}/>
          <input placeholder="password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}/>
        
          <button onClick={login}>Submit</button>
          <a href="/register">Registration Page</a>
          <div className="googleLogin">  
          <img src={googleLogo} height="30"alt=""></img>
          <button onClick={() => {loginWithGoogle(); googleLogin()}}>Sign up with Google</button>
          </div>
          </div>
        </div>
      
    );
  } 
  
  export default Login;