import db from './db.js';
import bcrypt from 'bcrypt';

console.log("users.js: Starting script execution...");

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
)`).run();

console.log("users.js: Users table ensured.");

export const getUsers = () => {
  return db.prepare("SELECT * FROM users").all();
};

export const getUserById = (id) =>
    db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export const getUserByEmail = (email) =>
    db.prepare("SELECT * FROM users WHERE email = ?").get(email);

export const saveUser = (username, email, password, role = 'user') =>
    db.prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)").run(username, email, password, role);

//Admin user készítés ha üres a tábla
try { 
    const users = getUsers();
    console.log("users.js: Fetched users. Count:", users.length);

    if (users.length === 0) {
      console.log("users.js: No users found. Creating a default admin user...");
      const adminUsername = "admin";
      const adminEmail = "admin@example.com";
      const adminRawPassword = "adminpassword";

      if (!bcrypt) {
        console.error("users.js: bcrypt is not imported or available!");
        throw new Error("Bcrypt not available");
      }
      const adminHashedPassword = bcrypt.hashSync(adminRawPassword, 12);
      console.log("users.js: Admin password hashed.");

      try {
        saveUser(adminUsername, adminEmail, adminHashedPassword, 'admin');
        console.log("users.js: Default admin user created successfully.");
      } catch (error) {
        console.error("users.js: Error creating default admin user (inside saveUser):", error.message);
      }
    } else {
      console.log("users.js: Users already exist, skipping admin creation.");
    }
} catch (error) {
    console.error("users.js: Critical error during initial admin setup:", error);
}