const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nnvexxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("TNTShop");
        const productCollection = database.collection("products");
        const purchaseCollection = database.collection("purchases");
        const offerCollection = database.collection("offers");
        const returnCollection = database.collection("returns");
        const notificationCollection = database.collection("notifications");

        app.get("/products", async (req, res) => {
            const products = await productCollection.find().toArray();

            res.send(products);
        });

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        app.patch("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const { title, description, price, discountPercentage, brand, thumbnail, images, stock, specialDiscount } = req.body;

            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    title, description, price, discountPercentage, brand, thumbnail, images, stock, specialDiscount
                }
            };
            const result = await productCollection.updateOne(query, update);
            res.send(result);
        })

        app.post("/addPurchase", async (req, res) => {
            const product = req.body;
            const result = await purchaseCollection.insertOne(product);
            res.send(result);
        })

        app.get("/purchases/:email", async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await purchaseCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/purchase/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const purchase = await purchaseCollection.findOne(query);
            res.send(purchase);

        })

        app.patch("/purchase/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const newPurchase = req.body;
            const update = {
                $set: {
                    ...newPurchase
                }
            };
            const result = await purchaseCollection.updateOne(query, update);
            res.send(result);
        })


        app.get("/offers", async (req, res) => {
            const offers = await offerCollection.find().toArray();
            res.send(offers);
        })

        app.get("/offers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const offer = await offerCollection.findOne(query);
            res.send(offer);
        })

        app.post("/addOffer", async (req, res) => {
            const offer = req.body;
            const result = await offerCollection.insertOne(offer);
            res.send(result);
        })

        app.put("/offers/:id", async (req, res) => {
            const id = req.params.id;
            const { type, threshold, discountAmount, minimumConsecutivePurchase, startDate, endDate } = req.body;

            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    type,
                    threshold,
                    discountAmount,
                    minimumConsecutivePurchase,
                    startDate,
                    endDate
                }
            };
            const result = await offerCollection.updateOne(query, update);

            res.send(result);
        });

        app.delete("/offers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await offerCollection.deleteOne(query);
            res.send(result);
        })

        app.post("/return", async (req, res) => {
            const items = req.body;
            const result = await returnCollection.insertOne(items);
            res.send(result)
        })

        app.get("/returnRequests", async (req, res) => {
            const query = { status: "pending" };
            const result = await returnCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/return/:id", async (req, res) => {
            const id = req.params.id;
            const query = { purchaseId: id };
            const result = await returnCollection.findOne(query);
            res.send(result);
        })

        app.patch("/approveReturn/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    status: "approved"
                }
            }
            const result = await returnCollection.updateOne(query, update);
            res.send(result);
        });

        app.post("/notification", async (req, res) =>{
            const notification = req.body;
            const result = await notificationCollection.insertOne(notification);
            res.send(result);
        })

        app.get("/notifications", async (req, res) =>{
            const notifications = await notificationCollection.find().toArray();
            res.send(notifications);
        })

        app.get("/notifications/:email", async (req, res) =>{
            const email = req.params.email;
            const query = {userEmail: email};
            const notifications = await notificationCollection.find(query).toArray();
            res.send(notifications);
        })

        app.get("/unseenNotifications/:email", async (req, res) =>{
            const email = req.params.email;
            const query = {userEmail: email, status: "unseen"};
            const notifications = await notificationCollection.find(query).toArray();
            res.send(notifications);
        })

        app.patch("/notification/:id", async (req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const update = {
                $set: {
                    status: "seen"
                }
            }
            const result = await notificationCollection.updateOne(query, update);
            res.send(result);
        })
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("TNT is blusted......");
})

app.listen(port, () => {
    console.log(`TNT will be blust at ${port}`);
})