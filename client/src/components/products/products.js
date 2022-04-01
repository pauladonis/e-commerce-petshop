import React, { useEffect, useState } from 'react';
import './products.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';


function Products(props) {

    const [products, setProducts] = useState([]);
    const cartId = props.cartId
    const loggedOut = props.loggedOut;
    const userId = props.userId;

    const getProducts = async () => {
        try{
            const response = await fetch("/products");
            const jsonData = await response.json();
        
            setProducts(jsonData);
        }catch(err){
            console.error(err);
        } 
    } 

    const createCart = (userId) => {
        axios({
            method: "POST",
            data: {
                user_id: userId
            },
            withCredentials:true,
            url: "/cart"
        })
    }

    const addToCart = (cartId, product_id, price) => {
        axios({
            method: "POST",
            data: {
                cartId,
                product_id,
                price
            },
            withCredentials: true,
            url: `/cart/${cartId}`
          }).then((res) => {
              toast.success("Product added to cart!");
          }).catch((error) => {
              toast.error("Something went wrong!");
          });
        }

    useEffect(() => {
        getProducts();  
        createCart(userId);
    }, [userId]);

    

    return(
   
        
        <div className="products">
            <h3>From aquariums to filters, specialist foods to test kits, you'll find everything you require to set up and maintain any type of Tropical, Marine and Coldwater aquarium. This is just a selection of the vast array of aquarium products that can be found throughout our stores. Please note that not all of our stores will have a particular item in stock, so we would always recommend calling them to check current availability. And if for any reason you still can’t find what you’re looking for, then we’ll do our very best to order it in for you. Additionally, many of these products are also available to purchase via our online store.</h3>
                <div className="product">
                    {products.map(product => (
                        <div className="product-item">
                        <Link className="link" to={`/products/${product.id}`}>
                            <div className="product-item" key={product.id}>
                                <p>{product.name}</p>
                                <img src={product.image} alt={product.name} height="auto" width="200em"></img>
                                <p>£{product.price}</p>
                            </div>
                        </Link> 
                        {loggedOut === true ? <Link className="link" to={'/login'}>Register/Login to shop </Link> :
                        <button className="button" onClick = {() => {addToCart(cartId, product.id, product.price)}}>Add to Cart</button>
                        }
                        </div>    
                   ))}
                </div>
        </div>
    )
}

export default Products;