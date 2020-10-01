const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = 5000;


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.oqqwn.mongodb.net:27017,cluster0-shard-00-01.oqqwn.mongodb.net:27017,cluster0-shard-00-02.oqqwn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-eg2ygn-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");


    // adding products to database
    // app.post('/addProduct', (req, res) => {     //temporary commented cause it was running the code automaticly
    //     const products = req.body;
    //     productsCollection.insertOne(products)
    //         .then(result => {
    //             console.log(result.insertedCount);
    //             res.send(result.insertedCount)
    //         })
    // })

    // function for geting the data..
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documnets) => {
                res.send(documnets)
            })
    })
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documnets) => {
                res.send(documnets[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documnets) => {
                res.send(documnets);
            })
    })
    app.post('/addOrder', (req, res) => {     //temporary commented cause it was running the code automaticly
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // it will show on terminal when database is connected successfully
    console.log('connected');

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})