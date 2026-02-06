import express from "express";
import "dotenv/config";
import { pool } from "./db.js";
import { createController } from "./notes.controller.js";

const app = express();

// HTMX forms send urlencoded by default
app.use(express.urlencoded({ extended: false }));
// keep JSON for api/fetch JSON
app.use(express.json());

// static assets (optional)
app.use(express.static("public"));

// EJS templates
app.set("view engine", "ejs");

createController(app, { pool });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
