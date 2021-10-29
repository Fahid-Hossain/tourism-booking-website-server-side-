const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = 5000

//middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!, I am Node')
})

//------- mongodb database connect -------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2qch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//node mongodb//

async function run() {
    try {
        await client.connect();
        const database = client.db("travel_rhythm");
        const tourCollection = database.collection("tours");

        // post api
        app.post("/tours",async(req,res)=>{
            const tours = req.body;
            console.log("hit the post api",tours);

            const result = await tourCollection.insertOne(tours);
            console.log(result);
            res.json(result);
        })
        
        // get api
        app.get("/tours",async(req, res)=>{
            const cursor = tourCollection.find({})
            const tours = await cursor.toArray();
            res.send(tours);
        })

        //get single service 
        app.get("/tours/:id", async(req, res)=>{
            const id = req.params.id;
            // console.log("load user with id",id);
            const query = {_id: ObjectId(id)};
            const tour = await tourCollection.findOne(query);
            res.send(tour);

        })

        //delete api
        app.delete("/tours/:id",async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await tourCollection.deleteOne(query);
            res.json(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
//node mongodb//


//--------mongodb db connect------
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})