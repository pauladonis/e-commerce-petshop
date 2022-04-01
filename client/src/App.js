import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import Home from './components/home/home';
import SignUp from './components/SignUp/SignUp';
import Register from './components/register/register';
import Login from './components/login/login';
import Account from './components/account/account';
import Cart from './components/cart/cart';
import Products from './components/products/products';
import ProductDetails from './components/productDetails/productDetails';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import e from 'connect-flash';
 

function App() {
  const [data, setData] = useState([]);
  const [cartId, setCartId] = useState([]);
  const [loggedOut, setLoggedOut] = useState(true);


console.log(data);


  let value = 0;
  if (data.length !== 0) {
    value = data.id
  } 
  const userId = value;
  console.log(data.email);
  
  function handleData(e) {
    setData(e);
  }

  function handleLoggedOut(e) {
    setLoggedOut(e);
  }

  

  const getCartId = useCallback(async (userId) => {
    axios({
        method: "POST",
        data: {
            user_id: userId
        },
        withCredentials:true,
        url: '/cart'
    }).then(res => setCartId(res.data[0].id));
},[]
);

useEffect(() => {
  getCartId(userId);
}, [getCartId, userId]);

  return (
    <Router>
      <div className="navBar">
      <nav className="links">
        <Link to="/">All Aquaristik</Link>
        <Link to="/Products">Products</Link>
        {loggedOut === true ?  <Link to="/signUp">Sign Up/Log In</Link> 
        :
        <div id="loggedIn">
        <Link to="/cart" id="cart"><FontAwesomeIcon icon={faShoppingCart} /></Link>
        <Link to="/account">Account</Link>
        </div>}
      </nav>
      <div>
        <ToastContainer />
      </div>  
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/register" element={<Register data={data} />} />
        <Route path="/login" element={<Login data={data} loggedOut={loggedOut} handleData={handleData} handleLoggedOut={handleLoggedOut}/>} />
        <Route path="/cart" element={<Cart data={data} cartId={cartId} loggedOut={loggedOut}/>} />
        <Route path="/cart/:id" element={<Cart data={data} />} />
        <Route path="/products" element={<Products loggedOut={loggedOut} cartId={cartId} userId={userId}/>} />
        <Route path="/products/:productId" element={<ProductDetails data={data} cartId={cartId}/>} />
        <Route path="/succesLogin" element={<Products />} />
        <Route path="/account" element={<Account data={data} cartId={cartId} handleData={handleData} handleLoggedOut={handleLoggedOut} />} />
        <Route path="/logout" element={<Home />}/>
      </Routes>
    </Router>
  );
} 

export default App;
