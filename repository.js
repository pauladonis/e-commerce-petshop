const { pool } = require('./dbConfig');
//user registration
const registerUser = async function(object) {
    const queryText = 'INSERT INTO users(email,password,full_name,billing_address,shipping_address,phone) VALUES($1,$2,$3,$4,$5,$6) RETURNING email, password'
    const response = await pool.query(queryText, [object.email, object.password, object.full_name, object.billing_address,object.shipping_address,object.phone])
    return response.rows;
}


//cart functions
const addToCart = async function(object) {
  const queryText = 'INSERT INTO cart(product_id,product_name,amount,user_id) VALUES($1,$2,$3,$4) RETURNING product_id, product_name,amount,user_id'
  const response = await pool.query(queryText, [object.product_id, object.product_name, object.amount, object.user_id])
  return response.rows;
}

const addToCartById = async function(cartId) {
  const queryText = `INSERT INTO cart(product_id, product_name) SELECT id, name FROM products WHERE id=${cartId} RETURNING product_id, product_name`
  const response = await pool.query(queryText);
  return response.rows;
}
 
const showCart = async function() {
  const queryText = 'SELECT * from cart'
  const response = await pool.query(queryText);
  return response.rows;
}

const showCartById = async function(cartId) {
  const queryText = `SELECT * from cart where id=${cartId}`
  
  const response = await pool.query(queryText);
  return response.rows;
}

const removeFromCartById = async function(cartId) {
  const queryText = `DELETE from cart where id=${cartId} RETURNING *`
  const response = await pool.query(queryText);
  return response.rows;
}
  
//product functions
const showProductsById = async function(productId) {
  const queryText = `SELECT * from products where id=${productId}`
  const response = await pool.query(queryText);
  return response.rows;
}

const showProductByCategory = async function(categoryName) {
  const queryText = `SELECT * from products where category='${categoryName}'`
  const response = await pool.query(queryText);
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
  const queryText = `UPDATE users set email=$2, password=$3, full_name=$4, billing_address=$5, shipping_address=$6, phone=$7 where id=$1 RETURNING id, email, password, full_name, billing_address, shipping_address, phone`;
  const response = await pool.query(queryText, [object.id, object.email, object.password, object.full_name, object.billing_address, object.shipping_address, object.phone]);
  return response.rows;
}

const removeUser = async function(object) {
  const queryText = `DELETE from users where email=$1 AND password=$2 RETURNING *`;
  const response = await pool.query(queryText, [object.email, object.password]);
  return response.rows;
}

//orders functions
const showOrders = async function() {
  const queryText = 'SELECT * from orders'
  const response = await pool.query(queryText);
  return response.rows;
}

const showOrdersById = async function(orderId) {
  const queryText = `SELECT * from orders where id=${orderId}`;
  const response = await pool.query(queryText);
  return response.rows;
}

const createOrder = async function(cartId) {
  const queryText = `INSERT INTO orders(cart_id, product_id, ordered_product_name) SELECT id, product_id, product_name FROM cart where id=${cartId} RETURNING cart_id, product_id, ordered_product_name`;
  const response = await pool.query(queryText);
  return response.rows;
}

module.exports = {registerUser, addToCart, addToCartById, showCart, showCartById, removeFromCartById, showProductsById, showProductByCategory, removeFromProductsById, updateProductById, showUsers, showUsersById, updateUserById, removeUser, showOrders, showOrdersById, createOrder};

