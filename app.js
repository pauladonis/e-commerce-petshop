var bodyParser = require('body-parser')
const express = require('express')
const repository = require ('./repository')
const client = require('pg')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req,res) => {
  console.log(req.body)
  repository.registerUser(req.body)
  res.send('200') 
})

app.post('/login', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})