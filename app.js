const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;
const db = new sqlite3.Database("accommodations.db");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("API !");
});

app.get("/api/airbnb-database", (req, res) => {
    db.all("SELECT * FROM accommodations", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.get("/api/airbnb-database/:id", (req, res) => {
    db.all("SELECT * FROM accommodations WHERE id IN (?)", [req.params.id], (err, row) => {
        if (err) {
            throw err;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: "ID introuvable" });
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});


app.put("/api/airbnb-database/:id", (req, res) => {
    const id = req.params.id;
    // données de la requête
    const newData = req.body;

    // Mise à jour de la base de données
    db.run(
        "UPDATE accommodations SET favourite = ? WHERE id = ?",
        [newData.favourite, id],
        (err) => {
            if (err) {
                res.status(500).json({ error: "Erreur lors de la mise à jour" });
            } else {
                res.json({ message: "Mise à jour réussie" });
            }
        }
    );
});