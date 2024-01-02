const exp = require("express");
const userApp = exp.Router();
const  ObjectId = require('mongodb').ObjectId;
const dbConnectionString="mongodb+srv://madhu:madhu@clusterbackend.szevd.mongodb.net/myfirstdb?retryWrites=true&w=majority"
const MongoClient = require('mongodb').MongoClient;


//middleware to parse  body of req
userApp.use(exp.json());

//define routes
//route for GET req for all users
userApp.get("/get-users", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get data
  let users = await userCollectionObject.find().toArray();
  //send res
  response.send({ message: "users data", payload: users });
});



userApp.post("/signup", async (request, response) => {
    try {
      console.log("here")
        let { email} = request.body;

        const client = await MongoClient.connect(dbConnectionString);
        const dbObj = client.db("mindful");
        dataCollectionObject = dbObj.collection("data");
      // get user collection object
  
      // get user object from client
      let userObj = request.body;
  
      // verify if the username already exists
      let userOfDB = await dataCollectionObject.findOne({
        email:email,
      });
  
      // if user exists
      if (userOfDB !== null) {
        return response.status(400).send({ message: "email already exists" });
      } else {
        // if user does not exist, insert into MongoDB
        await dataCollectionObject.insertOne(userObj);
        return response.send({ message: "Signup successful" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).send({ message: "Internal Server Error" });
    }
  });

//route for POST req
userApp.post("/create-user", async (request, response) => {
  //get usercollectionobj
  console.log("here")
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;
  //verify existing user
  let userOfDB = await userCollectionObject.findOne({
    email: userObj.email,
  });

  
  //if user existed
  if (userOfDB !== null) {
    response.send({ message: "Duplicate Data && same email exist please login" });
  }
  //if user not existed
  else {
    await userCollectionObject.insertOne(userObj);
    //send res
    response.send({ message: "Post Request Successful" });
  }
});

//route for PUT req
userApp.put("/update-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;
  //update user by id
  let res= await userCollectionObject.updateOne(
    { username: userObj.username },
    { $set: { ...userObj } }
  );
  
  //send res
  if(res.modifiedCount===1)
  response.send({ message: "Put Request Successful" });
  else
  response.send({message:"put request failed"});
});

//route for DELETE req
userApp.delete("/remove-user/:id", async (request, response) => {
  //get usercollectionobj
  
  let userCollectionObject = request.app.get("userCollectionObject");
  //get url param
  
  let userId = request.params.id;
  //delete user
  let res =await userCollectionObject.deleteOne( {"_id":new ObjectId(userId)});
  //send res
  if(res.deletedCount===1)
  response.send({ message: "Data deleted" });
  else
  response.send({message:"deletion unsuccessful"})
});



userApp.post("/login", async (request, response) => {
    try {
      // get user collection object
      console.log("hdsbfxhd",request.body)
      let userCollectionObject = request.app.get("userCollectionObject");
  
      // get login credentials from client
      let { email, password } = request.body;
  
      // find user by username
      let userOfDB = await userCollectionObject.findOne({ email: email});

      console.log(userOfDB)
      // if user exists
      if (userOfDB !== null) {
        // check if the password matches
        if (userOfDB.password === password) {
          return response.send({ message: "Login successful" });
        } else {
          return response.status(401).send({ message: "Incorrect password" });
        }
      } else {
        return response.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).send({ message: "Internal Server Error" });
    }
  });
  

//export userApp
module.exports = userApp;