import express from "express";
import * as Packages from "../data/packages.js"

const router = express.Router()

router.get('/me/packages', (req, res) =>{
    const posts = Packages.getPackageByUserID()
    res.send(posts)
})

export default router