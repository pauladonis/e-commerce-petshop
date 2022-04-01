import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import { toast } from 'react-toastify';
import StripeContainer from '../Checkout/stripeContainer';



function Cart(props) {
    const [cart, setCart] = useState([]);
    const [checkingOut, setCheckingOut] = useState(false);
    const loggedOut = props.loggedOut;
    const cartId = props.cartId;
   
    console.log(cartId)
    const getCart = async (cartId) => {
        try{
            const response = await fetch(`/cart/${cartId}`);
            const jsonData = await response.json();
            setCart(jsonData);
        }catch(err){
            console.error(err);
        } 
    }


    const deleteFromCart = (cartId,product_id) => {
        axios({
            method: "DELETE",
            data: {
                id: cartId,
                product_id
            },
            withCredentials: true,
            url: `/cart/${cartId}`
        }).then((res) => {
            toast.success("Product deleted from cart!");
        }).catch((error) => {
            toast.error("Something went wrong!");
        });
    }

    useEffect(() => {
        getCart(cartId);
    }, []);

     

    
    return(
        <div>
            {loggedOut === false ? <div className="cart">
                <h2>Cart Items</h2>
                <div className="cart-container">
                        {cart.map(product => (
                            <div >
                                <div key={product.id}>
                                    <p>{product.name}</p>
                                    <p>Quantity:{product.quantity}</p>
                                    <p>Price:{product.price*product.quantity}£</p>
                                </div>
                            <button className="button" onClick = {() => deleteFromCart(cartId,product.product_id)}>Remove Item</button>
                            </div>      
                    ))}
                    <div>{!checkingOut ?           
                        <button className="button" onClick = {() => setCheckingOut(true)}>Go to checkout</button>
                        :
                        <div>
                            <StripeContainer id="StripeContainer" cart={cart} cartId={cartId} />
                        </div>}
                    </div>
                </div>  
            </div> : 
            <Link className="cart-link" to={'/login'}>Register/Login to see your cart</Link>}
        </div>
    )
}

export default Cart;