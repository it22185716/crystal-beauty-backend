import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./userRoutes.js";
import jwt, { decode } from "jsonwebtoken";
import productRouter from "./productRouter.js";
import verifyJWT from "./middleware/auth.js";
import oderRouter from "./oderRouter.js";
import dotenv from "dotenv";
dotenv.config();




const app = express();

mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log("connected to the database");
    }  
).catch(
    () => {
        console.log("connection failed");
    }
)

app.use(bodyParser.json());
app.use(verifyJWT);

app.use("/api/user", userRouter);
app.use("/api/product",productRouter);
app.use("/api/oder",oderRouter);


app.listen(5000, () => {
    console.log("server is runing on port 5000");
})

app.post("/",
    (req, res) => {

        //Saving the student to the database

        const student = new student(req.body);

        student.save().then(
            () => {
                res.json({
                    message: "Student save successfully"
                })
            }
        ).catch(
            () => {
                res.json(
                    {
                        message: "student save failed"
                    }
                )
            }
        )
    })
