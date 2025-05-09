/*import user from "../models/user.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export function saveUser(req, res) {
   
   if(req.body.role == "admin"){
    if(req.user==null){
        res.status(403).json({
            message: "please login as admin before creating an admin account ",
        });
        return;
    }
    if (req.user.role != "admin"){
        res.status(403).json({
            message:"You are not authorized to create an admin account",
        });
        return;
    }
   }
   
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role,
    });



    user.save()
        .then(() => {
            res.json({ message: "User saved successfully" });
        })
        .catch((error) => {
            console.error(error); // Debugging
            res.status(500).json({ message: "User not saved", error: error.message });
        });
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    user.findOne({
        email: email
    }).then((user) => {
        if (user == null) {
            res.json({
                message: "invalid email"
            });
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if (isPasswordCorrect) {
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    isDisable: user.isDisable,
                    isEmailVerified: user.isEmailVerified
                }
                const token = jwt.sign(userData, "random456")
                res.json({
                    message: "Login successful",
                    token: token,
                });

            } else {
                res.json({
                    message: "invalid password"
                });
            }
        }

    });

}
*/

import user from "../models/user.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function saveUser(req, res) {
    // Check if the user is trying to create an admin account
    if (req.body.role == "admin") {
        // Ensure the current user is logged in as admin
        if (req.user == null) {
            res.status(403).json({
                message: "Please login as admin before creating an admin account",
            });
            return;
        }
        // Check if the logged-in user is an admin
        if (req.user.role != "admin") {
            res.status(403).json({
                message: "You are not authorized to create an admin account",
            });
            return;
        }
    }

    // Hash the password before saving the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role,
    });

    // Save the user to the database
    user.save()
        .then(() => {
            res.json({ message: "User saved successfully" });
        })
        .catch((error) => {
            console.error(error); // Debugging
            res.status(500).json({ message: "User not saved", error: error.message });
        });
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Find the user by email
    user.findOne({
        email: email
    }).then((user) => {
        if (user == null) {
            res.json({
                message: "Invalid email"
            });
        } else {
            // Ensure that the user has a password field
            if (!user.password) {
                // If no password is found, return an error message
                return res.json({
                    message: "User password not found"
                });
            }

            // Compare the provided password with the stored password hash
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (isPasswordCorrect) {
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phone: user.phone,
                    isDisable: user.isDisable,
                    isEmailVerified: user.isEmailVerified
                };
                const token = jwt.sign(userData,process.env.JWT_KEY);
                res.json({
                    message: "Login successful",
                    token: token,
                    user:userData
                }); 
            } else {
                res.json({
                    message: "Invalid password"
                });
            }
        }
    }).catch(error => {
        // Handle any errors that occur during the query
        console.log(error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    });
}
