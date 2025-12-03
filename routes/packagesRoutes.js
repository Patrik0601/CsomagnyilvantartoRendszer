import express from "express";
import * as Packages from "../data/packages.js";
import { auth } from "./usersRoutes.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
    const packages = Packages.getPackagesByUser(req.userId);
    res.json(packages);
});

router.post("/", auth, (req, res) => {
    const { sender_name, sender_address, recipient_name, recipient_address, content, weight } = req.body;

    if (!sender_name || !sender_address || !recipient_name || !recipient_address || !content || !weight) {
        return res.status(400).json({ message: "Missing data" });
    }

    try {
        const saved = Packages.newPackage(
            req.userId,
            sender_name,
            sender_address,
            recipient_name,
            recipient_address,
            content,
            weight
        );

        const pkg = Packages.getPackageByID(saved.lastInsertRowid);
        res.status(201).json(pkg);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/:id", auth, (req, res) => {
    const pkg = Packages.getPackageByID(req.params.id);
    if (!pkg) return res.status(404).json("Package not found");
    res.json(pkg);
});

router.put("/:id", (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const existing = Packages.getPackageByID(req.params.id);
    if (!existing) return res.status(404).json("Package not found");

    Packages.updatePackageStatus(req.params.id, status);

    const updated = Packages.getPackageByID(req.params.id);
    res.json(updated);
});

router.get("/tracking/:tracking_number", (req, res) => {
    const pkg = Packages.getPackageByTracking(req.params.tracking_number);
    if (!pkg) return res.status(404).json("Package not found");
    res.json(pkg);
});

export default router;
