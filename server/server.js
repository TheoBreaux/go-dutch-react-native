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
  const { firstName, lastName, email, username, password, profilePicPath } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await pool.query(
      `INSERT INTO users(first_name, last_name, email, username, hashed_password, profile_pic_image_path) VALUES($1, $2, $3, $4, $5, $6)`,
      [firstName, lastName, email, username, hashedPassword, profilePicPath]
    );

    const token = jwt.sign({ email, username, firstName, lastName }, "secret", {
      expiresIn: "1hr",
    });
    res.json({ email, username, firstName, lastName, token, profilePicPath });
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
  const { username, password, firstName, lastName } = req.body;

  try {
    const users = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist!" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ username, firstName, lastName }, "secret", {
      expiresIn: "1hr",
    });
    if (success) {
      res.json({
        email: users.rows[0].email,
        username: users.rows[0].username,
        firstName: users.rows[0].first_name,
        lastName: users.rows[0].last_name,
        profilePicPath: users.rows[0].profile_pic_image_path,
        token,
      });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});

// SEND NEW DINING EVENTS TO DATABASE
app.post("/diningevents", async (req, res) => {
  const {
    dining_date,
    restaurant_bar,
    title,
    primary_diner_username,
    tax,
    tip,
    total_meal_cost,
    receipt_image_path,
  } = req.body;

  try {
    const newDiningEvent = await pool.query(
      `INSERT INTO dining_events(dining_date, restaurant_bar, title, primary_diner_username, tax, tip, total_meal_cost, receipt_image_path) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id`,
      [
        dining_date,
        restaurant_bar,
        title,
        primary_diner_username,
        tax,
        tip,
        total_meal_cost,
        receipt_image_path,
      ]
    );
    const eventId = newDiningEvent.rows[0].event_id;
    res.json({ event_id: eventId });
  } catch (error) {
    console.error(error);
  }
});

// AUTOCOMPLETE TO SEE IF DINER IS ALREADY IN DATABASE
app.get("/additionaldiners/suggestions", async (req, res) => {
  const userInput = req.query.input;

  try {
    const autoCompleteDiner = await pool.query(
      `SELECT username, first_name, last_name, profile_pic_image_path FROM users WHERE username ILIKE $1 OR first_name ILIKE $1 LIMIT 15;`,
      [`%${userInput}%`]
    );
    const suggestions = autoCompleteDiner.rows.map((row) => ({
      username: row.username,
      firstName: row.first_name,
      lastName: row.last_name,
      profilePicPath: row.profile_pic_image_path,
    }));
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ADDITIONAL DINERS TO THE DATABASE PER DINING EVENT
app.post("/additionaldiners", async (req, res) => {
  const { event_id, additionalDiners } = req.body;

  try {
    for (const diner of additionalDiners) {
      await pool.query(
        `INSERT INTO additional_diners(event_id, additional_diner_username, diner_meal_cost) VALUES($1, $2, $3)`,
        [event_id, diner.additional_diner_username, diner.diner_meal_cost]
      );
    }
  } catch (error) {
    console.error(error);
  }
});

//UPDATE DEFAULT PHOTO TO REAL PHOTO
app.post("/profilephoto", async (req, res) => {
  const { profilePicPath, username } = req.body;

  console.log(profilePicPath, username);

  try {
    const newUserData = await pool.query(
      `UPDATE users 
      SET profile_pic_image_path = $1
      WHERE username = $2`,
      [profilePicPath, username]
    );

    // On success, send a 200 OK response
    res.status(200).json({ success: true });
    console.log("From server:", newUserData);
  } catch (error) {
    console.error(error);
    // On error, send a 500 Internal Server Error response with an error message
    res.status(500).json({ detail: error.detail });
  }
});

// SEND TAX ON RECEIPT TO DATABASE(dining_events)
// app.post("/diningevents", async (req, res) => {
//   const { tax, event_id } = req.body;
//   console.log(tax);
//   console.log(event_id);

//   try {
//     const addTax = await pool.query(
//       `UPDATE dining_events
//       SET tax = $1
//       WHERE event_id = $2`,
//       [tax, event_id]
//     );
//     res.json({
//       success: true,
//       message: "Tax information updated successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

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
