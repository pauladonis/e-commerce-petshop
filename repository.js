const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const { response } = require('express');


//user registration
const registerUser = async function(object) {
    const queryText = 'INSERT INTO users(email,password) VALUES($1,$2) RETURNING email, password'
    const email = object.email;
    const password = await bcrypt.hash(object.password,10);
    const response = await pool.query(queryText, [email, password])
    return response.rows;
}


//cart functions
const createCart = async function(object) {
  const queryText1 = `select * from cart where user_id=${object.user_id} and status='new'`; 
  const response1 = await pool.query(queryText1);
  if(response1.rows.length === 0) {
    const queryText = 'INSERT INTO cart(status,user_id) VALUES($1,$2) RETURNING id, status, user_id'
  const response = await pool.query(queryText, ['new', object.user_id])
  return response.rows;
  } else {
    return response1.rows;
  }
}

const addToCartById = async function(cartId, product_id, price) {
  
  const queryTextQuantity = `SELECT id from cart_item where product_id=${product_id} and cart_id=${cartId}`
  const responseQuantity = await pool.query(queryTextQuantity);
  if (responseQuantity.rows.length === 0) {
  const queryInsert = `INSERT INTO cart_item(cart_id, product_id, quantity,price) VALUES(${cartId},${product_id},1,${price}) returning cart_id`
  const response = await pool.query(queryInsert);
  return response.rows;
  } else {
    const cart_item_id = responseQuantity.rows[0].id;
    const queryTextUpdate = `UPDATE cart_item set quantity=quantity+1 where id=${cart_item_id} returning quantity`;
    const responseUpdate = await pool.query(queryTextUpdate);    
    return responseUpdate.rows;
  }
}

 
const showCart = async function(userId) {
  const queryText = `SELECT id from cart where user_id=${userId}`
  const response = await pool.query(queryText);
  return response.rows;
}

const showCartById = async function(cartId) {
  const queryText = `select cart_item.*, products.name from cart join cart_item on (cart.id = cart_item.cart_id)
  join products on (products.id = cart_item.product_id)
  where cart.id=${cartId};`
  const response = await pool.query(queryText);
  return response.rows;
}

const removeFromCartById = async function(cartId, product_id) {
  const queryCartItem = `select id, quantity from cart_item where cart_id=${cartId} and product_id=${product_id}`;
  const responseCartItem = await pool.query(queryCartItem);
  if(responseCartItem.rows.length === 0) {
    return;
  } 
  
  const cart_item_id = responseCartItem.rows[0].id;
  if(responseCartItem.rows[0].quantity > 1) {
    const queryTextUpdate = `UPDATE cart_item set quantity=quantity-1 where id=${cart_item_id} returning quantity`;
    const responseUpdate = await pool.query(queryTextUpdate);
    return responseUpdate.rows;
  } 
  
  const queryDeleteCartItem = `DELETE from cart_item where id=${cart_item_id}`;
  const responseDelete = await pool.query(queryDeleteCartItem);
  return responseDelete.rows;
}
  
//product functions
const showProducts = async function() {
  const queryText = `SELECT * from products`
  const response = await pool.query(queryText);
  return response.rows;
}

const showProductsById = async function(productId) {
  const queryText = `SELECT * from products where id=${productId}`
  const response = await pool.query(queryText);
  return response.rows;
}

const showProductByCategory = async function(object) {
  const queryText = `SELECT * from products where category=$1`
  const response = await pool.query(queryText,[object.category]);
  return response.rows;
}

const removeFromProductsById = async function(productId) {
  const queryText = `DELETE from products where id=${productId} RETURNING *`;
  const response = await pool.query(queryText);
  return response.rows;
}

const updateProductById = async function(object) {
  const queryText = `UPDATE products set name=$2, description=$3, category=$4, price=$5, stock=$6 where id=$1 RETURNING name, description, category, price, stock`;
  
  const response = await pool.query(queryText, [object.id, object.name, object.description, object.category, object.price, object.stock]);
  return response.rows;
}

//users functions
const showUsers = async function() {
  const queryText = 'SELECT * from users'
  const response = await pool.query(queryText);
  return response.rows;
}

const showUsersById = async function(userId) {
  const queryText = `SELECT * from users where id=${userId}`;
  const response = await pool.query(queryText);
  return response.rows;
}

const updateUserById = async function(object) {
  const queryText = `UPDATE users set email=$2, password=$3 where id=$1 RETURNING id, email, password`;
  const passwordObj = object.password;
  const password = await bcrypt.hash(passwordObj,10);
  const response = await pool.query(queryText, [object.id, object.email, password]);
  return response.rows;
}

const removeUser = async function(object) {
  const queryText = `DELETE from users where email=$1 AND password=$2 RETURNING *`;
  const response = await pool.query(queryText, [object.email, object.password]);
  return response.rows;
}


//orders functions
const getOrderId = async function(cartId) {
  const queryText = `SELECT id from orders where cart_id=${cartId}`;
  const response = await pool.query(queryText);
  return response.rows;
}

const showOrders = async function() {
  const queryText = 'SELECT * from orders'
  const response = await pool.query(queryText);
  return response.rows;
}

const showOrdersById = async function(orderId) {
  const queryText = `SELECT order_item.*, products.name, orders.total_price from orders join order_item on (orders.id = order_item.order_id) join products on (products.id = order_item.product_id) where order_id=${orderId}`                     
  const response = await pool.query(queryText);
  return response.rows;
}

const createOrder = async function(cartId) {
  const queryCheckForOrder = `SELECT * from orders where cart_id=${cartId} and status='created'`;
  const responseCheckForOrder = await pool.query(queryCheckForOrder);
  if(responseCheckForOrder.rows.length===0) {
    const queryTotalPrice = `SELECT sum(quantity * price) from cart_item where cart_id=${cartId}`;
    const responseTotalPrice = await pool.query(queryTotalPrice);
    const totalPrice = responseTotalPrice.rows[0].sum;
    const queryCreateOrder = `INSERT INTO orders(total_price, status, cart_id) VALUES(${totalPrice}, 'created', ${cartId}) RETURNING id`;
    const responseCreateOrder = await pool.query(queryCreateOrder);
    return responseCreateOrder.rows;
  } else {
    return responseCheckForOrder.rows;
  }
}

const createOrderItem = async function(cartId) {
  const queryOrderId = `SELECT id from orders where cart_id=${cartId}`;
  const responseOrderId = await pool.query(queryOrderId);
  if(responseOrderId.rows.length) {
    const orderId = responseOrderId.rows[0].id;
    const queryCartItem = `SELECT * from cart_item where cart_id=${cartId}`;
    const responseCartItem = await pool.query(queryCartItem);
    for (let i=0; i < responseCartItem.rows.length; i++) {
      const productId = responseCartItem.rows[i].product_id;
      const quantity = responseCartItem.rows[i].quantity;
      const price = responseCartItem.rows[i].price;
      const queryInsertOrderItem = `INSERT INTO order_item(order_id, product_id, quantity, price) VALUES(${orderId}, ${productId}, ${quantity}, ${quantity * price}) returning product_id`;
      await pool.query(queryInsertOrderItem);
    }
  } else {
    const noOrderId = responseOrderId.rows;
    return noOrderId;
  }
}

module.exports = {registerUser, createCart, addToCartById, showCart, showCartById, removeFromCartById, showProducts, showProductsById, showProductByCategory, removeFromProductsById, updateProductById, showUsers, showUsersById, updateUserById, removeUser, getOrderId, showOrders, showOrdersById, createOrder, createOrderItem};

