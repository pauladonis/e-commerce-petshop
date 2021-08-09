const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'postgres',
  port: 5432,
})
pool.query('SELECT stock from products', (err, res) => {
  console.log(err, res)

})

const registerUser = function(object) {
    const queryText = 'INSERT INTO customers(email,password,full_name,billing_address,shipping_address,phone) VALUES($1,$2,$3,$4,$5,$6)'
    pool.query(queryText, [object.email, object.password, object.full_name, object.billing_address,object.shipping_address,object.phone])
}

module.exports = {registerUser};

