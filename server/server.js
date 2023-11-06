const PORT = process.env.PORT ?? 8000;
const express = require("express");
const app = express();

const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "theobreaux",
  password: "cabrini33",
  host: "localhost",
  port: 5432,
  database: "godutchapp",
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});

//LOG IN TO GO DUTCH
app.post("/login", async (req, res) => {
  const { username, password, firstName, lastName, cityTown } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist!" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign(
      { username, firstName, lastName, cityTown },
      "secret",
      {
        expiresIn: "1hr",
      }
    );
    if (success) {
      res.json({
        email: users.rows[0].email,
        username: users.rows[0].username,
        firstName: users.rows[0].first_name,
        lastName: users.rows[0].last_name,
        cityTown: users.rows[0].city_town,
        token,
      });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});

// app.get("/users", (req, res) => {
//   pool.query("SELECT * FROM users", (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       res.status(500).send("Database error");
//     } else {
//       res.setHeader("Content-Type", "application/json");
//       res.send(JSON.stringify(result.rows, null, 2));
//     }
//   });
// });
