import express from "express"
import * as Users from "../data/users.js" 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "Missing required data" });

    if (Users.getUserByEmail(email))
        return res.status(400).json({ message: "Email already registered" });

    const hash = bcrypt.hashSync(password, 12);
    
    const saved = Users.saveUser(name, email, hash, 'user');

    const user = Users.getUserById(saved.lastInsertRowid);
    delete user.password;

    res.status(201).json(user);
});

router.post("/login", (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message: "Missing required data"});
    }
    let user = Users.getUserByEmail(email)
    if (!user){
        return res.status(400).json({message: "Invalid credentials"})
    }
    if(!bcrypt.compareSync(password, user.password)){
        return res.status(400).json({message: "Invalid credentials"})
    }
    const token = jwt.sign({id: user.id, email: user.email, role: user.role}, "secret_key",{expiresIn: "1h"});
    res.json({ token })
})

export const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        console.log("No token sent");
        return res.status(401).json({ message: "No token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    try {
        const SECRET_KEY = "secret_key";
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        console.log("User authenticated:", req.userId);
        next();
    } catch(err) {
        console.log("Token invalid:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];

    return (req, res, next) => {
        if (!req.userRole || (roles.length > 0 && !roles.includes(req.userRole))) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};

export default router;