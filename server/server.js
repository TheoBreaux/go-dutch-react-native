const PORT = process.env.PORT ?? 8000;
const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pool = require("pg").Pool;
require("dotenv").config();

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream } = require("./s3");

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
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
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    profileImageKey,
    bio,
    favoriteCuisine,
    birthday,
    location,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await pool.query(
      `INSERT INTO users(first_name, last_name, email, username, hashed_password, profile_image_key, bio, favorite_cuisine, birthday, celebrating_birthday, location) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        profileImageKey,
        bio,
        favoriteCuisine,
        birthday,
        celebrating_birthday,
        location,
      ]
    );

    const token = jwt.sign({ email, username, firstName, lastName }, "secret", {
      expiresIn: "1hr",
    });
    res.json({
      email,
      username,
      firstName,
      lastName,
      token,
      profileImageKey,
      bio,
      favoriteCuisine,
      birthday,
      celebratingBirthday,
      location,
    });
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
        bio: users.rows[0].bio,
        favoriteCuisine: users.rows[0].favorite_cuisine,
        celebratingBirthday: users.rows[0].celebrating_birthday,
        birthday: users.rows[0].birthday,
        location: users.rows[0].location,
        userId: users.rows[0].user_id,
        dateJoined: users.rows[0].date_joined,
        profileImageKey: users.rows[0].profile_image_key,
        token,
      });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});

//UPDATE USER PROFILE VALUES
app.post("/updateprofile", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    bio,
    favoriteCuisine,
    birthday,
    location,
    userId,
  } = req.body;

  try {
    const newUser = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3, username = $4, bio = $5, favorite_cuisine = $6, birthday = $7, location = $8
       WHERE user_id = $9`,

      [
        firstName,
        lastName,
        email,
        username,
        bio,
        favoriteCuisine,
        birthday,
        location,
        userId,
      ]
    );
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

// SEND NEW DINING EVENTS TO DATABASE
app.post("/diningevents", async (req, res) => {
  const {
    diningDate,
    restaurantBar,
    title,
    primaryDinerUsername,
    tax,
    tip,
    totalMealCost,
    receiptImageKey,
  } = req.body;

  try {
    const newDiningEvent = await pool.query(
      `INSERT INTO dining_events(dining_date, restaurant_bar, title, primary_diner_username, tax, tip, total_meal_cost, receipt_image_key) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id`,
      [
        diningDate,
        restaurantBar,
        title,
        primaryDinerUsername,
        tax,
        tip,
        totalMealCost,
        receiptImageKey,
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
      `SELECT username, first_name, last_name, profile_image_key, bio, location, birthday, favorite_cuisine, date_joined FROM users WHERE username ILIKE $1 OR first_name ILIKE $1 LIMIT 15;`,
      [`%${userInput}%`]
    );
    const suggestions = autoCompleteDiner.rows.map((row) => ({
      username: row.username,
      firstName: row.first_name,
      lastName: row.last_name,
      bio: row.bio,
      location: row.location,
      birthday: row.birthday,
      favoriteCuisine: row.favorite_cuisine,
      dateJoined: row.date_joined,
      profileImageKey: row.profile_image_key,
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
  const { eventId, additionalDiners, dinerMealCost, celebratingBirthday } =
    req.body;

  try {
    for (const diner of additionalDiners) {
      await pool.query(
        `INSERT INTO additional_diners(event_id, additional_diner_username, diner_meal_cost, celebrating_birthday) VALUES($1, $2, $3, $4)`,
        [
          eventId,
          diner.additionalDinerUsername,
          diner.dinerMealCost,
          diner.celebratingBirthday,
        ]
      );
    }
  } catch (error) {
    console.error(error);
  }
});

//UPDATE DEFAULT PHOTO TO REAL PHOTO
app.post("/profilephoto", async (req, res) => {
  const { profileImageKey, username } = req.body;

  console.log(profileImageKey, username);

  try {
    const newUserData = await pool.query(
      `UPDATE users 
      SET profile_image_key = $1
      WHERE username = $2`,
      [profileImageKey, username]
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
      `SELECT additional_diners.*, users.*
      FROM additional_diners
      JOIN users ON additional_diners.additional_diner_username = users.username
      WHERE additional_diners.event_id = $1`,
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
    const profileImageKeys = await pool.query(
      `SELECT additional_diners.event_id, username, profile_image_key
      FROM users 
      JOIN additional_diners on users.username = additional_diners.additional_diner_username
      WHERE additional_diners.event_id = $1`,
      [eventId]
    );

    console.log(profileImageKeys);
    res.json(profileImageKeys.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE FINAL VALUES FOR DINING EVENT
app.post("/diningevent/values", async (req, res) => {
  const { tax, tip, totalMealCost, subtotal, eventId } = req.body;

  console.log("DINING EVENT VALUES", req.body);

  try {
    const diningEventData = await pool.query(
      `UPDATE dining_events 
      SET tax = $1,
      tip = $2,
      total_meal_cost = $3,
      subtotal = $4
      WHERE event_id = $5`,
      [tax, tip, totalMealCost, subtotal, eventId]
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
  const {
    sharedExpenses,
    dinersUpdated,
    birthdayDiners,
    eventId,
    totalMealCost,
  } = req.body;

  try {
    // Initialize allDinerMealCosts to accumulate the total meal cost
    let allDinerMealCosts = 0;
    //sum birthday diner(s) meal costs
    let birthdayDinerMealCost = 0;

    //calculate birthday diners meal costs
    for (const diner of birthdayDiners) {
      diner.items.forEach((item) => {
        birthdayDinerMealCost += parseFloat(item.price);
      });
    }

    for (const diner of dinersUpdated) {
      //loop through diners items to get total
      let dinerMealCost = 0;
      //calculate shared birthday diner(s) meal costs
      const sharedBirthdayDinerMealCosts =
        birthdayDinerMealCost / (dinersUpdated.length - birthdayDiners.length);
      //if the diner has a birthday
      if (diner.celebratingBirthday) {
        //set the birthday diners meal cost to 0
        dinerMealCost += 0;
      } else {
        //sum items
        diner.items.forEach((item) => {
          dinerMealCost += parseFloat(item.price);
        });

        dinerMealCost += sharedExpenses;
        //if there are birthday diners add their shared expense to other diners total meal cost
        dinerMealCost += sharedBirthdayDinerMealCosts;

        console.log("IN THE LOOOP - SHARED EXPESNES", sharedExpenses);
        console.log(
          "IN THE LOOOP - SHARED BIRTHDAY DINER EXPESNES",
          sharedBirthdayDinerMealCosts
        );
        console.log("IN THE LOOOP - ALL DINER MEAL COSTS", allDinerMealCosts);
      }

      // Add the current diner's meal cost to the total
      allDinerMealCosts += dinerMealCost;
      // Round up allDinerMealCosts to 2 decimal places
      // allDinerMealCosts = Math.ceil(allDinerMealCosts * 100) / 100;
      allDinerMealCosts.toFixed(2);

      console.log("ALL DINER MEAL COSTS TOTAL IN DATABASE", allDinerMealCosts);
      console.log("TOTAL MEAL COSTS", totalMealCost);

      await pool.query(
        `UPDATE additional_diners
          SET diner_meal_cost = $1
          WHERE event_id = $2 AND additional_diner_username = $3`,
        [dinerMealCost.toFixed(2), eventId, diner.additionalDinerUsername]
      );
    }
    res.status(200).send("Diner meal costs updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating diner meal costs");
  }
});

// AWS - POST PROFILE IMAGES
app.post("/users/profileimages", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  res.send({ imageKey: result.Key });
});

//AWS - UPDATE PROFILE IMAGES
app.post(
  "/users/profileimages/update",
  upload.single("image"),
  async (req, res) => {
    console.log(req.body);
    const file = req.file;
    console.log(file);
    const result = await uploadFile(file);
    await unlinkFile(file.path);

    try {
      const updatedProfileImage = await pool.query(
        "UPDATE users SET profile_image_key = $1 WHERE username = $2",
        [profileImageKey, username]
      );
      console.log(updatedProfileImage); // Log the result of the database query
      res.send({ imageKey: result.Key });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send("Error updating profile image");
    }
  }
);

//AWS - POST RECEIPT IMAGES
app.post(
  "/diningevents/receiptimages",
  upload.single("image"),
  async (req, res) => {
    console.log(req.body);
    const file = req.file;
    console.log(file);
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    res.send({ imageKey: result.Key });
  }
);
