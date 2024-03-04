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

// CONFIRM THAT USER EXISTS IN DB SO CAN BE ADDED AS DINER
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);

  try {
    const userExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)`,
      [username]
    );
    console.log(userExists);
    res.json(userExists.rows[0].exists);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ADDITIONAL DINERS TO THE DATABASE PER DINING EVENT
app.post("/additionaldiners", async (req, res) => {
  const { event_id, additionalDiners, dinerMealCost, birthday } = req.body;

  try {
    for (const diner of additionalDiners) {
      await pool.query(
        `INSERT INTO additional_diners(event_id, additional_diner_username, diner_meal_cost, birthday) VALUES($1, $2, $3, $4)`,
        [
          event_id,
          diner.additional_diner_username,
          diner.diner_meal_cost,
          diner.birthday,
        ]
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

// GETS ALL DINING EVENTS FROM DATABASE WHERE LOGGED IN USER IS INVOLVED
app.get("/diningevents/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const diningEvents = await pool.query(
      `SELECT *
      FROM dining_events
      WHERE primary_diner_username = $1
      UNION 
      SELECT dining_events.* 
      FROM dining_events
      JOIN additional_diners ON additional_diners.event_id = dining_events.event_id
      WHERE additional_diners.additional_diner_username = $1;`,
      [username]
    );
    res.json(diningEvents.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GETS ALL ADDITIONAL DINERS FROM DATABASE WHERE LOGGED IN USER IS INVOLVED
app.get("/additionaldiners/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const diningEvents = await pool.query(
      `SELECT * FROM additional_diners WHERE event_id = $1`,
      [eventId]
    );
    res.json(diningEvents.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GETS ALL PROFILE PIC PATHS FOR EVENT
app.get("/additionaldiners/profilepics/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const profilePicPaths = await pool.query(
      `SELECT additional_diners.event_id, username, profile_pic_image_path
      FROM users 
      JOIN additional_diners on users.username = additional_diners.additional_diner_username
      WHERE additional_diners.event_id = $1`,
      [eventId]
    );

    console.log(profilePicPaths);
    res.json(profilePicPaths.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE FINAL VALUES FOR DINING EVENT
app.post("/diningevent/values", async (req, res) => {
  const { tax, tip, totalMealCost, eventId } = req.body;

  try {
    const diningEventData = await pool.query(
      `UPDATE dining_events 
      SET tax = $1,
      tip = $2,
      total_meal_cost = $3
      WHERE event_id = $4`,
      [tax, tip, totalMealCost, eventId]
    );
    // On success, send a 200 OK response
    res.status(200).json({ success: true });
    console.log("From server:", diningEventData);
  } catch (error) {
    console.error(error);
    // On error, send a 500 Internal Server Error response with an error message
    res.status(500).json({ detail: error.detail });
  }
});

// UPDATE FINAL VALUES FOR ADDITIONAL DINERS
app.post("/additionaldiners/values", async (req, res) => {
  const { sharedExpenses, dinersUpdated, eventId } = req.body;

  console.log("SHARED EXPENSES", sharedExpenses);
  console.log("DINERS UPDATED", dinersUpdated);
  console.log("EVENT ID", eventId);

  try {
    for (const diner of dinersUpdated) {
      //loop through diners items to get total
      let dinerMealCost = 0;

      diner.items.forEach((item) => {
        dinerMealCost += parseFloat(item.price);
      });

      dinerMealCost += sharedExpenses;

      await pool.query(
        `UPDATE additional_diners
          SET diner_meal_cost = $1
          WHERE event_id = $2 AND additional_diner_username = $3`,
        [dinerMealCost.toFixed(2), eventId, diner.additional_diner_username]
      );
    }
    res.status(200).send("Diner meal costs updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating diner meal costs");
  }
});
