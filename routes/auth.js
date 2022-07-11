const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/registerValidation');
const jwt = require('jsonwebtoken');
const requiresAuth = require('../middleware/permissions');

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

        const payload = {userId: savedUser._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure:process.env.NODE_ENV === "production"
        });

        //Delete return password even though its hashed
        const UsertoReturn = {...savedUser._doc};
        delete UsertoReturn.password;

        return res.json(UsertoReturn);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i"),
        })
        if(!user) {
            return res.status(400).json({error: "There is a problem with your login credentials"});
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!passwordMatch) {
            return res.status(400).json({error: "There is a problem with your login credentials"});
        }
        const payload = {userId: user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure:process.env.NODE_ENV === "production"
        });

        const UserToReturn = {...user._doc};
        delete UserToReturn.password;
        return res.json({
            token: token,
            user: UserToReturn
        })

    }catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
});

router.get("/current", requiresAuth, (req, res) => {
    if (!req.user) {
        return res.status(401).send("Unauthorised");
    }
    return res.json(req.user);
});

router.put("/logout", requiresAuth, async(req, res)=> {
    try {
        res.clearCookie("access-token");
        return res.json({success: true});
    }
    catch(err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
})
module.exports = router