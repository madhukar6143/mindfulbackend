const exp=require("express");
const mongoClient=require("mongodb").MongoClient;
const app=exp()
const cors = require('cors')
app.use(cors())
const dataApi=require("./APIS/DataApi");
app.use(exp.json());

const dbConnectionString="mongodb+srv://madhu:madhu@clusterbackend.szevd.mongodb.net/myfirstdb?retryWrites=true&w=majority"




//connect to DB
mongoClient.connect(dbConnectionString)
.then(client=>{
  //create DB object
  const dbObj=client.db("mindful");
  //get collection object
  const userCollectionObject=dbObj.collection("data")
  //share userCollectionObj
  app.set("userCollectionObject",userCollectionObject)
  console.log("Connected to DB successfully")
})
.catch(err=>console.log("err in connecting to DB ",err))


app.use("/user",dataApi)


//assign port
const port=4000;
app.listen(port,()=>console.log("server on port 4000..."))