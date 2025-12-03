import db from './db.js'

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
)`).run();


export const getUserById = (id) => 
    db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export const getUserByEmail = (email) => 
    db.prepare("SELECT * FROM users WHERE email = ?").get(email);

export const saveUser = (name, email, password) => 
    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, password);
