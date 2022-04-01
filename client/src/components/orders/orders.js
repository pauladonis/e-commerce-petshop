import React, { useState, useEffect, useCallback } from 'react';
import './orders.css';

function Orders(props) {
const [orderId, setOrderId] = useState([]);
const [orders, setOrders] = useState([]);
const cartId = props.cartId;


const getOrderId = useCallback(async (cartId) => {
    try{
        const response = await fetch(`/orders/${cartId}`);
        const jsonData = await response.json(); 
        setOrderId(jsonData[0].id); 
    }catch(err){
        console.error(err);
}},[]
);

const getOrders = useCallback(async (orderId) => {
    try {
    const response2 = await fetch(`/order/${orderId}`);
    const jsonData2 = await response2.json();
    setOrders(jsonData2);
    }catch(err){
        console.error(err);
    }
}, []
);


useEffect(() => {
    getOrderId(cartId,orderId);
},[cartId, orderId]);

useEffect(() => {
    getOrders(orderId);
}, [orderId]);

    return (
        <div className="orders">
            <h2>Orders</h2>
            {orders.map(order => (
                        <div>
                            <div key={order.id}>
                                <p>{order.name}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Price: £{order.price}</p>
                            </div> 
                        </div>      
                   ))}
            {orders.length ?
            <div>Order total: £{orders[0].total_price}</div> :
            <div></div>
            }
        </div>
    )
}

export default Orders;