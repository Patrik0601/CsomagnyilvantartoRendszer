import express from "express"
import * as Users from "../data/users.js"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "Missing required data" });

    if (Users.getUserByEmail(email))
        return res.status(400).json({ message: "Email already registered" });

    const hash = bcrypt.hashSync(password, 12);
    const saved = Users.saveUser(name, email, hash);

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
    const token = jwt.sign({id: user.id, email: user.email}, "secret_key",{expiresIn: "60s"});
    res.json({ token })
})

function auth(req, res, next){
    try{
        const accessToken = req.headers.authorization
        if(!accessToken){
            return res.status(401).json({message: "Unauthorized"});
        }
        const token = accessToken.split(' ')[1];
        const data = jwt.verify(token, "secret_key");
        req.userId = data.id;
        req.userEmail = data.email;
        next();
    }catch(err){
        res.status(401).json({message: "Invalid or expired token"});
    }
}

export default router;
export {auth} 