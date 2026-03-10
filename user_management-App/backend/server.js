import express from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { UserApp } from './APIs/UserAPI'
config()
const app=exp()

app.use(exp.json())

app.use("/user-api",UserApp)



async function connectDB()
{
    try{
        await connect()
        const port = process.env.PORT || 4000
        
        app.listen(port,()=>{
            console.log(`Server running on port ${port}`)
        })
    }
    catch(err)
    {
        console.log("err in connecting",err)
    }
}
connectDB()

app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});
