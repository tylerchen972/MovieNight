const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/registerValidation')

//GET /api/auth/test
router.get("/test", (req, res)=>{
    res.send("Auth root working");
});

//POST /api/auth/register
router.post("/register", async (req, res)=> {
    try {
        const {errors, isValid} = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        //Checks for uppercase existing email
        const exists = await User.findOne({email: new RegExp("^" + req.body.email + "$", "i")});
        if (exists) {
            return res
                .status(400)
                .json({error: "The specified email already exists"})
        }
        //Hashing and storing user information
        const hash = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name
        });
        const savedUser = await newUser.save();
        return res.json(savedUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})
module.exports = router