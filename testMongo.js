import mongoose from "mongoose"

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log("CONNECTED"))
  .catch(err => console.error(err))
