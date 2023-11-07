const PORT = process.env.PORT ?? 8000;
const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "theobreaux",
  password: "cabrini33",
  host: "localhost",
  port: 5432,
  database: "godutchapp",
});

//CHECKING THAT I AM CONNECTED TO DATABASE
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});

//SIGN UP TO GO DUTCH - INITIAL USER INFO
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, username, password, state, cityTown } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await pool.query(
      `INSERT INTO users(first_name, last_name, email, username, hashed_password, state, city_town) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [firstName, lastName, email, username, hashedPassword, state, cityTown]
    );

    const token = jwt.sign(
      { email, username, firstName, lastName, cityTown },
      "secret",
      {
        expiresIn: "1hr",
      }
    );
    res.json({ email, username, firstName, lastName, cityTown, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

//SEND PAYMENT SOURCES INFO - UPDATE USER PROFILE
app.post("/users", async (req, res) => {
  const {
    primaryPaymentSource,
    primaryPaymentSourceUsername,
    secondaryPaymentSource,
    secondaryPaymentSourceUsername,
    email,
  } = req.body;

  console.log("NEW INFO:", primaryPaymentSource);
  console.log("NEW INFO:", email);

  try {
    const newUserPaymentInfo = await pool.query(
      `UPDATE users 
      SET primary_payment_source = $1, 
      primary_payment_source_username = $2, 
      secondary_payment_source = $3, 
      secondary_payment_source_username = $4
      WHERE email = $5`,
      [
        primaryPaymentSource,
        primaryPaymentSourceUsername,
        secondaryPaymentSource,
        secondaryPaymentSourceUsername,
        email,
      ]
    );

    // On success, send a 200 OK response
    res.status(200).json({ success: true });
    console.log("From server:", newUserPaymentInfo);
  } catch (error) {
    console.error(error);
    // On error, send a 500 Internal Server Error response with an error message
    res.status(500).json({ detail: error.detail });
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
