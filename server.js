const express = require('express')
const connectToMongo = require('./db')
const User = require('./Routes/User/User')
const Image = require('./Routes/Image/Image')
const app = express();
const port = 80 || process.env.PORT;

// middleware to parse incoming request body 
app.use(express.json());

// connecting to mongoDB 
connectToMongo();

// response to Homepage 
app.get('/', (req, res)=> {
  res.end('Happy hacking!')
})

// API routes 
app.use('/api/user', User);
app.use('/api/image', Image);

// listening to app 
app.listen(port, ()=> {
  console.log("server is running on port:", port);
})