const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.8srq6fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotsCollection = client.db("spotsdb").collection("spots");
    const countryCollection = client.db("spotsdb").collection("country");
    
    app.get('/myspots', async(req, res)=>{
      const result = await spotsCollection.find().toArray();
      res.send(result);
    })

    app.get('/country', async(req, res)=>{
      const result = await countryCollection.find().toArray();
      res.send(result);
    })

    app.get("/country/:countryName", async(req, res)=> {
      const result = await spotsCollection.find({countryName : req.params.countryName}).toArray();
      console.log(req.params.countryName);
      res.send(result);
    })
    
    app.get("/find/:cost", async(req, res)=> {
      const result = await spotsCollection.find({cost: req.params.cost}).toArray();
      res.send(result);
    })

    // app.get("/myspots/:email", async (req, res) => {
    //   const result = await spotsCollection
    //     .find({ email: req.params.email })
    //     .toArray();
    //   res.send(result);
    // });



    app.post("/spots", async (req, res) => {
      const spots = req.body;
      const result = await spotsCollection.insertOne(spots);
      res.send(result);
      console.log(spots);
    });

    app.get("/update/:id", async (req, res) => {
      const result = await spotsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // app.get("/spotDetails/:id", async (req, res) => {
    //   const result = await spotsCollection.findOne({
    //     _id: new ObjectId(req.params.id),
    //   });
    //   res.send(result);
    // });

    app.patch("/update/:id", async (req, res) => {
      console.log(req.params.id);
      const body = req.body;
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: body.image,
          touristsSpotName: body.touristsSpotName,
          countryName: body.countryName,
          location: body.location,
          description: body.description,
          cost: body.cost,
          season: body.season,
          time: body.time,
          visitor: body.visitor,
        },
      }
      const result = await spotsCollection.updateOne(query, data);
      res.send(result);
      console.log(result);
    });

    app.delete('/delete/:id', async(req, res)=>{
      const query = req.params.id;
      const result = await spotsCollection.deleteOne({_id: new ObjectId(query)})
      console.log(result);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is server site");
});

app.listen(port, (req, res) => {
  console.log(`The Port : ${port}`);
});
 