const express = require('express')
const repository = require ('./repository')
const { pool } = require('./dbConfig') 
const passport = require("passport");
const initializePassport = require ('./passportConfig')
const app = express()
const port = process.env.PORT || 3000
const flash = require('connect-flash')
const session = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const e = require('connect-flash');
const swaggerJsDocs = YAML.load('./api.yaml');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const googleAuth = require("./googleAuth");
require('dotenv').config();


initializePassport(passport);
if(process.env.NODE_ENV === "production") {
  //server static content
  //npm run build
  app.use(express.static("./client/build"));
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
app.use(
  cors({
    origin: "http://localhost:3001", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 },
  key: 'userId', 
  secret: 'secret',
  resave: true, 
  saveUninitialized: true})
  );


app.use(cookieParser('secret'));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//cart endpoints
app.post('/cart', (req, res) => {
  const result = repository.createCart(req.body);
  result.then(value=>{
    if(!value.length) {
    res.status('400').send('Bad Request');
    } else {
      res.status('201').send(value);
    }
  });
});


app.post('/cart/:cartId', (req, res, next) => {
  const result = repository.addToCartById(req.params['cartId'], req.body.product_id, req.body.price);
  result.then(value=>{
    if(!value.length) {
      res.status('400').send('Bad Request')
    } else {
      res.status('201').send('Item added to cart');
    }
  }).catch(error=>{next(error)});
});

app.post('/cart/:cartId/checkout',async (req, res, next) => {
  const result1 = repository.showCartById(req.params['cartId']);
  const result2 = await repository.createOrder(req.params['cartId']);
  const result3 = await repository.createOrderItem(req.params['cartId']);
  result1.then(value1 => {
    if(!value1.length) {
      res.status('404').send('Cart not found');
    } else {
      result2;
        res.status('201').send(result2);
      
      
      result3;
    }
  }).catch(error=>{next(error)});
})


app.post('/carts', (req, res, next) => {
  const result = repository.showCart(req.body.userId); 
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Cart not found');
    } else {
      res.status('200').send(value);
    }
  }).catch(error=>{next(error)});
});

app.get('/cart/:cartId', (req, res, next) => {
  const result = repository.showCartById(req.params['cartId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Cart not found');
    } else {
      res.status('200').send(value);
    }
  }).catch(error=>{next(error)}); 
});

app.delete('/cart/:cartId', (req, res, next) => {
  const result = repository.removeFromCartById(req.params['cartId'], req.body.product_id);
  result.then(value=>{
    if(!value) {
      res.status('400').send('Bad Request');
    } else {
      res.status('204').send('Item removed from cart');
    }
  }).catch(error=>{next(error)});
  
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
  const result = repository.showProducts();
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Page Not Found');  
    } else {
      res.status('200').send(value)};
    });
});

app.get('/products', (req, res) => {
  const result = repository.showProductByCategory(req.query);
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
      res.status('404').send('User Not Found');
    } else {
      res.status('200').send(value)};
    }).catch(error=>{next(error)});
});

app.get('/users/:userId', (req, res, next) => {
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
app.get('/orders/:cartId', (req, res) => {
  const result = repository.getOrderId(req.params['cartId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Order Not Found');
    } else {
      res.status('200').send(value);
    }
  })
})

app.get('/orders', (req, res) => {
  const result = repository.showOrders();
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('Page Not Found');
    } else {
      res.status('200').send(value)};
    });
});

app.get('/order/:orderId', (req, res) => {
  const result = repository.showOrdersById(req.params['orderId']);
  result.then(value=>{
    if(!value.length) {
      res.status('404').send('User Not Found');
    } else {
      res.status('200').send(value)};
  });
});



//stripe payment
app.post('/payment', async (req, res) => {
  let {amount, id} = req.body;
  try{
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'GBP',
      description: 'All Aquaristik',
      payment_method: id,
      confirm: true
    })
    console.log('Payment: ', payment);
    res.json({
      message: 'Payment successfull',
      success: true
    })
  } catch (error) {
      console.log('Error', error);
      res.json({
        message: 'Payment failed',
        success: false
      })
  }
})

//user registration 
app.post('/register', (req, res, next) => {
  const result = repository.registerUser(req.body);
  result.then(value=>{
    console.log(value);
    if(!value.length) {
      res.status('400').send('Bad Request');
    } else {
      res.status('200').send(value);
    }
  }).catch(error=>{next(error)});
});

//passport login
app.post('/login',
  passport.authenticate('local', { successRedirect: '/succesLogin',
                                   failureRedirect: '/failedLogin',
                                   failureFlash: true })
);

app.get('/succesLogin', (req, res) => {
  res.status('200').send(req.session.passport);
});

app.get('/failedLogin', (req, res) => {
  res.status('401').send("Username or password is incorrect!");
});

app.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/products');
});

//google auth
app.get('/auth/google', passport.authenticate('google', { scope: 'email'}));

app.get('/auth/google/callback', passport.authenticate('google', {session: true}) ,(req, res) => {
  googleId = req.session.passport;
  res.send(req.session.passport);
});

let googleId = null;

app.get('/googleId', (req, res) => {
  res.send(googleId);
})

app.use((req, res, next) => {
  const error = new Error('Bad Request');
  error.status= 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
})

app.listen(process.env.port, () => {
  console.log(`Example app listening at http://localhost:${process.env.port}`)
});