import express from "express";
import * as Packages from "../data/packages.js";
import { auth, authorize } from "./usersRoutes.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
    const pkg = Packages.getPackagesByUser(req.userId);
    return res.json(pkg);
});

router.post("/", auth, (req, res) => {
    console.log("Received package data:", req.body);

    const { sender_name, sender_address, recipient_name, recipient_address, content, weight } = req.body;

    if (!sender_name || !sender_address || !recipient_name || !recipient_address || !content || !weight) {
        return res.status(400).json({ message: "Missing data" });
    }

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found." });
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

        if (saved && saved.lastInsertRowid) {
            const pkg = Packages.getPackageByID(saved.lastInsertRowid);
            if (pkg) {
                res.status(201).json(pkg);
            }
            else{
                res.status(500).json({ error: "Failed to retrieve newly created package after insertion." });
            }
        }
        else{
             res.status(500).json({ error: "Failed to create package: no ID returned upon insertion." });
        }

    } catch (err) {
        console.error("Error creating package:", err);
        res.status(400).json({ error: err.message });
    }
});

router.get("/:id", auth, (req, res) => {
    const pkg = Packages.getPackageByID(req.params.id);
    if (!pkg) return res.status(404).json("Package not found");

    if (pkg.userId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You do not own this package." });
    }

    res.json(pkg);
});

router.put("/:id", auth, authorize('admin'), (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const existing = Packages.getPackageByID(req.params.id);
    if (!existing) return res.status(404).json("Package not found");

    try {
        Packages.updatePackageStatus(req.params.id, status);
        const updated = Packages.getPackageByID(req.params.id); 
        res.json(updated);
    } catch (err) {
        console.error("Error updating package status:", err.message);
        res.status(400).json({ error: err.message });
    }
});

router.get("/tracking/:tracking_number", (req, res) => {
    const pkg = Packages.getPackageByTrackinNumber(req.params.tracking_number); // Use Packages (uppercase)
    if (!pkg) return res.status(404).json("Package not found");
    res.json(pkg);
});

export default router;