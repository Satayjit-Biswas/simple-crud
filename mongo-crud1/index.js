const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = 5000;
// cors 
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Running my Crud Server new');
});

app.listen(port,() => {
    console.log('Running Server',port);
})

// user information
// user name: dbuser1
// pass: 1kLuz13R31Hsw0dS


const uri = "mongodb+srv://dbuser1:1kLuz13R31Hsw0dS@cluster0.a744t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaser");
        const userCollection = database.collection("users");

        app.get('/users', async(req, res) =>{
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        
        // post api 
        app.post('/users', async(req,res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('hitting the post',req.body);
            res.json(result);
        });
        // update user 
        app.get('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const user = await userCollection.findOne(query)
            console.log("Update id",id)
            res.send(user)
        })
        // delete user 
        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log('Deleting user with id',id);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);