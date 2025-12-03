import db from "./db.js";

db.prepare(`CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    tracking_number TEXT UNIQUE,
    sender_name TEXT,
    sender_address TEXT,
    recipient_name TEXT,
    recipient_address TEXT,
    content TEXT,
    weight TEXT,
    status TEXT,
    status_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
)`).run();

export const getPackageSByUserID = (userId) => 
    db.prepare("SELECT * FROM packages WHERE userId = ?").get(userId);

export const newPackage = (userId, sender_name, sender_address, recipient_name, recipient_address, content, weight) => 
    db.prepare("INSERT INTO packages (sender_name, sender_address, recipient_name, recipient_address, content, weight ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Waiting for pickup', jSON('[]')").run(userId, Date.now().toString(), sender_name, sender_address, recipient_name, recipient_address, content, weight);

export const getPackageByID = (id) => 
    db.prepare("SELECT * FROM packages WHERE id = ?").get(id);

export const updatePackageStatus = (id, newStatus) => db.prepare(`UPDATE packages SET status = ?, updated_at = CURRENT_TIMESTAMP,status_history = json_insert(COALESCE(status_history, json('[]')),'$[' || json_array_length(status_history) || ']',json_object('status', ?, 'time', CURRENT_TIMESTAMP))WHERE id = ?`).run(newStatus, newStatus, id);

export const getPackageByTrackinNumber = (tracking_number) => 
    db.prepare("SELECT * FROM packages WHERE tracking_number = ?").get(tracking_number);