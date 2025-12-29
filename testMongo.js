const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/safepath?retryWrites=true&w=majority"


async function test() {
  const client = new MongoClient(uri)
  await client.connect()
  console.log("MongoDB connected")
  await client.close()
}

test()
