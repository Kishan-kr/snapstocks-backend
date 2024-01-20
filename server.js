const express = require('express')
const connectToMongo = require('./db')
const app = express();
const port = 80 || process.env.PORT;
const cors = require('cors')
const fileUpload = require('express-fileupload')

// import routes 
const User = require('./Routes/User/User')
const Image = require('./Routes/Image/Image')
const CollectionRoutes = require('./Routes/Collection/CollectionRoutes')
const FollowingRoutes = require('./Routes/Following/FollowingRoutes')

// configure cors 
const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(fileUpload())

// middleware to parse incoming request body 
app.use(express.json());

// connecting to mongoDB 
connectToMongo();

// response to Homepage 
app.get('/', (req, res)=> {
  res.end('Happy Hacking!');
})

// API routes 
app.use('/api/users', User);
app.use('/api/images', Image);
app.use('/api/collections', CollectionRoutes);
app.use('/api/following', FollowingRoutes);

// listening to app 
app.listen(port, ()=> {
  console.log("server is running on port:", port);
})