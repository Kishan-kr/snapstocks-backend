const mongoose = require('mongoose')
const URI = "mongodb://localhost:27017/snapstock";

const connectToMongo = () => { 
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=> {
    console.log("connected to MongoDb successfully");
  }).catch((err)=> {
    console.log(err)
  });
}
module.exports = connectToMongo;