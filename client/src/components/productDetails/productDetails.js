import React, {useState, useEffect} from 'react';
import {useParams, Link} from "react-router-dom";
import axios from 'axios';
import './productDetails.css';
import { toast } from 'react-toastify';

function ProductDetails(props) {

    const [product, setProduct] = useState([]);
    const {productId} = useParams();
    const data=props.data;
    const cartId=props.cartId;

    const getProducts = async (productId) => {
        try{
            const response = await fetch(`/products/${productId}`);
            const jsonData = await response.json();
            setProduct(jsonData[0]);
        }catch(err){
            console.error(err);
        } 
    }

    const addToCart = (cartId, product_id, price) => {
        axios({
            method: "POST",
            data: {
                id: cartId,
                product_id,
                price
            },
            withCredentials: true,
            url: `/cart/${cartId}`
          }).then((res) => {
              toast.success("Product added to cart!");
          }).catch((error) => {
              toast.error("Something went wrong!");
          })
        }

    useEffect(() => {
        getProducts(productId);  
    }, [productId]);

    
    
    return(
        <div className="product-item">
            <p>{product.name}</p>
            <img src={product.image} alt={product.name} height="200em" width="auto"></img>
            <p id="description">{product.description}</p>
            <p>Price:£{product.price}</p>
            {data.length === 0 ? <Link className="link" to={'/login'}>Register/Login to shop </Link> :
                        <button className="button" onClick = {() => addToCart(cartId, product.id, product.price)}>Add to Cart</button>
                        }
        </div>
    )
}

export default ProductDetails;