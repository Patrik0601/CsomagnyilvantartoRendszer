import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    tracking_number INTEGER UNIQUE,
    sender_name TEXT,
    sender_adress TEXT,
    recipient_name TEXT,
    recipient_address TEXT,
    content TEXT,
    weight INTEGER,
    status TEXT,
    status_history TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (userId) REFERENCES users(id)
)`).run();

export const getPackageByUserID = (userId) => 
    db.prepare("SELECT * FROM packages WHERE userId = ?").get(userId);

export const newPackage = (sender_name, sender_adress, recipient_name, recipient_address, content, weight) => 
    db.prepare("INSERT INTO packages (sender_name, sender_adress, recipient_name, recipient_address, content, weight ) VALUES (?, ?, ?)").run(sender_name, sender_adress, recipient_name, recipient_address, content, weight);

export const getPackageByID = (id) => 
    db.prepare("SELECT * FROM packages WHERE id = ?").get(id);

export const updatePackageStatus = (status) => 
    db.prepare("UPDATE packages SET status = ? WHERE id = ?").run(status, id);

export const getPackageByTrackinNumber = (tracking_number) => 
    db.prepare("SELECT * FROM packages WHERE tracking_number = ?").get(tracking_number);