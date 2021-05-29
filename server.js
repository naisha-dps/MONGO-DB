
const express =require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient

// db parameters
const db = require("./db");
const dbName = "cruddb";
const collectionName = "dtweet";
let dbCollectionGlobal = '';



db.initialize(dbName, collectionName, function(dbCollection) { 
    
    dbCollectionGlobal = dbCollection
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

   

}, function(err) { 
    throw (err);
});


app.use(bodyParser.urlencoded({ extended: true}))

app.get ('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})
app.post('/dtweet/create', (req,res)=>{
   
    const item = req.body
    dbCollectionGlobal.insertOne(item, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        dbCollectionGlobal.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            console.log("*********************** Collection inserted **************** ")
        
             console.log("Collection inserted : ", result)
             
        });
    });
})


app.get('/dtweet', (req,res) =>{
    //retrun all dtweets;
    console.log("*********************** Full Dataset **************** ")
        
    dbCollectionGlobal.find().toArray((error,result) => {
        if (error) throw error;
        console.log(result)
    })

})

app.get('/dtweet/:id', (req,res) =>{
    console.log(req.params)
    //retrun dtweets by id;
    const itemId = req.params.id;
    dbCollectionGlobal.findOne({id: itemId}, (error,result)=>{
        if (error) throw error;
        console.log("*********************** Found Collection **************** ")
        
        console.log(result);

    })
})

app.post('/dtweet/update', (req,res)=>{
    //update the dtweet
    const item = req.body

    dbCollectionGlobal.updateOne({ id: item.id }, { $set: item }, (error, result) => {
        if (error) throw error;
        console.log("*********************** Item Updated   **************** ")
       
        dbCollectionGlobal.find().toArray(function(_error, _result) {
            if (_error) throw _error;
           console.log(_result)
        });
    });

});
app.delete('/dtweet/:id', (req,res)=>{
    //delete the dtweet

    const itemId = req.params.id;
    dbCollectionGlobal.deleteOne({id: itemId}, (err,result)=>{
        if (error) throw error;

        console.log("*********************** Full Dataset **************** ")
        dbCollectionGlobal.find().toArray((error,result) => {
            if (error) throw error;
            console.log(result)
        })
    })
})


app.listen(port, () => {
    console.log(`Ëxpress app listening at http://localhost:${port}`)
})