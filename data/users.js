import db from './db.js'

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE
    email TEXT UNIQUE,
    password_hash TEXT
)`).run();

export const getUsers = () => db.prepare("SELECT * FROM users").all();

export const getUserById = (id) => 
    db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export const getUserByEmail = (email) => 
    db.prepare("SELECT * FROM users WHERE email = ?").get(email);

export const saveUser = (name, email, password) => 
    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, password);

export const deleteUser = (id) => 
    db.prepare("DELETE FROM users WHERE id = ?").run(id);

export const updateUser = (name, email, password) => 
    db.prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?").run(name, email, password, id);