const express = require('express')
const repository = require ('./repository')
const { pool } = require('./dbConfig') 
const passport = require("passport");
const initializePassport = require ('./passportConfig')
const client = require('pg')
const app = express()
const port = process.env.PORT || 3000
const flash = require('connect-flash')
const session = require('express-session')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const e = require('connect-flash');
const swaggerJsDocs = YAML.load('./api.yaml');
const cors = require('cors');


initializePassport(passport);


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'secret',
  resave: false, 
  saveUninitialized: false}));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});


//user registration 
app.post('/register', (req, res, next) => {
  const result = repository.registerUser(req.body);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('201').send('User Registered');
    }
  }).catch(error=>{next(error)});
});


//cart endpoints
app.post('/cart', (req, res, next) => {
  const result = repository.addToCart(req.body);
  result.then(value=>{
    if(!value.length) {
    res.status('400').send('Bad Request');
    } else {
      res.status('201').send(value);
    }
  }).catch(error=>{next(error)});
});


app.post('/cart/:cartId', ( req, res, next) => {
  const result = repository.addToCartById(req.params['cartId']);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request')
    } else {
      res.status('201').send('Item added to cart');
    }
  }).catch(error=>{next(error)});
});

app.post('/cart/:cartId/checkout', (req, res, next) => {
  const result1 = repository.showCartById(req.params['cartId']);
  const result2 = repository.createOrder(req.params['cartId']);
  result1.then(value1 => {
    if(!value1.length) {
      res.status('404').send('Cart not found');
    } else {
      result2.then(value2=>{res.send('Order Created');
         })
    }
  }).catch(error=>{next(error)});
})


app.get('/cart', (req, res) => {
  const result = repository.showCart() 
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Cart not found');
    } else {
      res.status('200').send(value);
    }
  });
});

app.get('/cart/:cartId', (req, res) => {
  const result = repository.showCartById(req.params['cartId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Cart not found');
    } else {
      res.status('200').send(value);
    }
  });  
});

app.delete('/cart/:cartId', (req, res) => {
  const result = repository.removeFromCartById(req.params['cartId']);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('200').send('Item removed from cart');
    }
  })
  
});

//product endpoints
app.get('/products/:productId', (req, res) => {
  const result = repository.showProductsById(req.params['productId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Product Not Found')
    } else {
    res.status('200').send(value)};
    });
});

app.get('/products', (req, res) => {
  const result = repository.showProductByCategory(req.query.category);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Page Not Found');  
    } else {
      res.status('200').send(value)};
    });
});

app.delete('/products/:productId', (req, res, next) => {
  const result = repository.removeFromProductsById(req.params['productId']);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
        res.status('204').send('Product Deleted');
    }
  }).catch(error=>{next(error)});
});

app.put('/products', (req, res, next) => {
  const result = repository.updateProductById(req.body);
  result.then(value => {
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('200').send(value);
    }
  }).catch(error=>{next(error)});
})


//users endpoints
app.get('/users', (req, res, next) => {
  const result = repository.showUsers();
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Page Not Found');
    } else {
      res.status('200').send(value)};
    }).catch(error=>{next(error)});
});

app.get('/users/:userId', (req, res, next) => {
  console.log('aici');
  const result = repository.showUsersById(req.params['userId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('User Not Found');
    } else {
      res.status('200').send(value)};
    }).catch(error=>{next(error)});
});

app.put('/users/:userId', (req, res, next) => {
  const result = repository.updateUserById(req.body);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('200').send('OK Success')}
  }).catch(error=>{next(error)});
});

app.delete('/users', (req, res, next) => {
  const result = repository.removeUser(req.body);
  result.then(value=> {
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('204').send('User Deleted');
    }
  }).catch(error=>{next(error)});
});

//orders endpoints
app.get('/orders', (req, res) => {
  const result = repository.showOrders();
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Page Not Found');
    } else {
      res.status('200').send(value)};
    });
});

app.get('/orders/:orderId', (req, res) => {
  const result = repository.showOrdersById(req.params['orderId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('User Not Found');
    } else {
      res.status('200').send(value)};
  });
});

//passport login
app.post('/login',
  passport.authenticate('local', { successRedirect: '/succesLogin',
                                   failureRedirect: '/failLogin',
                                   failureFlash: true })
);

app.get('/succesLogin', (req,res) => {
  res.status('200').send('You are now logged in')
});

app.get('/failLogin', (req,res) => {
  res.status('401').send('Login failure');
});

app.use((req, res, next) => {
  const error = new Error('Bad Request');
  error.status= 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});