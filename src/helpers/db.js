const mongoose=require('mongoose')
const URL= require('../configs/config')
const MongoClient = require('mongodb').MongoClient;

    //const URL = `mongodb+srv://mongodb:GYPpQvd8CWUY5tZV@cluster0.ovszz40.mongodb.net/`
    
    let Connection=''

    try {
        Connection=  mongoose.connect(URL.dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
      //  console.log('Database Connected Succesfully');
    } catch(error) {
        
        console.log('Error: ', error.message);
    }
    // const client = new MongoClient(URL.dbURL);
    // const db = client.db(URL.dbName);



module.exports=Connection