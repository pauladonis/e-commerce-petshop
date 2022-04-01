import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Orders from '../orders/orders';
import './account.css';

function Account(props) {
    const cartId = props.cartId;
    const handleLoggedOut = props.handleLoggedOut;
    const handleData = props.handleData;
    const [showOrders, setShowOrders] = useState(false);
    let navigate = useNavigate();

    const toggleOrders = () =>{
        if (showOrders === false){
            setShowOrders(true);
        } else {
            setShowOrders(false);
        }
    }

    const logOut = () => {
        axios({
            method: "POST",
            withCredentials: true,
            url: '/logout'
          }).then(navigate('/'));
        }
    

    return(
        <div className="account">
            <h1>User: {props.data.email}</h1>
            <button className="button" onClick={()=> toggleOrders()}>Order History</button>
            {showOrders === true ? <Orders cartId={cartId} /> : null }
            <button className="button" onClick={() => {logOut(); handleData([]); handleLoggedOut(true)}}>Logout</button>
        </div>
    )
}

export default Account;