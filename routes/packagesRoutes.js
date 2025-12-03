import express from "express";
import * as Packages from "../data/packages.js"

const router = express.Router()

router.get('/me/packages', (req, res) =>{
    const packages = Packages.getPackageByUserID()
    res.send(packages)
})

router.post('/packages', (req, res) => {
    const {sender_name, sender_adress, recipient_name, recipient_address, content, weight} = req.body;
    if(!sender_name || !sender_adress || !recipient_name || !recipient_address || !content || !weight)
    {
        return res.status(400).json('Missing data')
    }
    try{
        const saved = Packages.newPackage(sender_name, sender_adress, recipient_name, recipient_address, content,
    weight);
        const packages = Packages.getPackages(saved.lastInsertRowid);
        res.status(201).json(packages);
    }
    catch(error)
    {
        res.status(400).json(error.message);
    }
})

router.get('/packages/:id', (req, res) => {
    const packages = Packages.getPackageByID(req.params.id);
    if(!packages){
        return res.status(404).json('Package not found')
    }
    res.status(200).json(packages);
})

router.put('/packages/:id', (req, res) =>{
    const id = req.params.id;
    const existing = db.getPackages(id);
    if(!existing){
        return res.status(404).json("Package not found");
    }
    const {sender_name, sender_adress, recipient_name, recipient_address, content, weight} = req.body;
    if(!sender_name || !sender_adress || !recipient_name || !recipient_address || !content || !weight)
    {
        return res.status(400).json('Missing data')
    }
    try{
        db.updateBook(id, title, author);
        const book = db.getBook(id);
        res.status(200).json(book);
    }
    catch(error){
        res.status(400).json(error.message);
    }
})

router.get('/packages/:trackingNumber', (req, res) => {
    const packages = Packages.getPackageByTrackinNumber(req.params.trackingNumber);
    if(!packages){
        return res.status(404).json('Package not found')
    }
    res.status(200).json(packages);
})

export default router