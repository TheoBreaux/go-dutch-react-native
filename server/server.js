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
  const { firstName, lastName, email, username, password, profileImageKey } =
    req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await pool.query(
      `INSERT INTO users(first_name, last_name, email, username, hashed_password, profile_image_key) VALUES($1, $2, $3, $4, $5, $6)
      RETURNING user_id`,
      [firstName, lastName, email, username, hashedPassword, profileImageKey]
    );

    const userId = newUser.rows[0].user_id;

    const token = jwt.sign(
      { email, username, firstName, lastName, userId },
      "secret",
      {
        expiresIn: "1hr",
      }
    );
    res.json({
      userId,
      email,
      username,
      firstName,
      lastName,
      token,
      profileImageKey,
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
  } catch (error) {
    console.error(error);
    // On error, send a 500 Internal Server Error response with an error message
    res.status(500).json({ detail: error.detail });
  }
});

// AWS - POST PROFILE IMAGES
app.post("/users/profileimages", upload.single("image"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  res.send({ imageKey: result.Key });
});

//AWS - UPDATE PROFILE IMAGES
app.post(
  "/users/profileimages/update",
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    try {
      const updatedProfileImage = await pool.query(
        "UPDATE users SET profile_image_key = $1 WHERE username = $2",
        [profileImageKey, username]
      );
      res.send({ imageKey: result.Key });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send("Error updating profile image");
    }
  }
);

//LOG IN TO GO DUTCH
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!user.rows.length) return res.json({ detail: "User does not exist!" });

    const success = await bcrypt.compare(
      password,
      user.rows[0].hashed_password
    );
    const token = jwt.sign({ username }, "secret", {
      expiresIn: "1hr",
    });
    if (success) {
      res.json({
        email: user.rows[0].email,
        username: user.rows[0].username,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name,
        bio: user.rows[0].bio,
        favoriteCuisine: user.rows[0].favorite_cuisine,
        birthday: user.rows[0].birthday,
        location: user.rows[0].location,
        userId: user.rows[0].user_id,
        dateJoined: user.rows[0].date_joined,
        profileImageKey: user.rows[0].profile_image_key,
        primaryPaymentSource: user.rows[0].primary_payment_source,
        primaryPaymentSourceUsername:
          user.rows[0].primary_payment_source_username,
        secondaryPaymentSource: user.rows[0].secondary_payment_source,
        secondaryPaymentSourceUsername:
          user.rows[0].secondary_payment_source_username,
        password: user.rows[0].hashed_password,
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
const saltRounds = 10; // Define the number of salt rounds
// Move the salt generation outside the route handler
const salt = bcrypt.genSaltSync(saltRounds);
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
    primaryPaymentSource,
    primaryPaymentSourceUsername,
    secondaryPaymentSource,
    secondaryPaymentSourceUsername,
    password,
    type,
  } = req.body;

  let query;
  let updatedInfo;
  let success;

  try {
    if (type === "userInfoProfileUpdate") {
      query = `UPDATE users SET first_name = $1, last_name = $2, email = $3, username = $4, bio = $5, favorite_cuisine = $6, birthday = $7, location = $8
      WHERE user_id = $9`;
    } else if (type === "paymentAndPasswordProfileUpdate") {
      const user = await pool.query(
        `SELECT hashed_password FROM users
      WHERE user_id = $1`,
        [userId]
      );

      //this means the incoming password is the same as what is in the database, meaning there was no password update
      success = await bcrypt.compare(password, user.rows[0].hashed_password);

      if (success) {
        query = `UPDATE users SET primary_payment_source = $1, primary_payment_source_username = $2, secondary_payment_source = $3, secondary_payment_source_username = $4 WHERE user_id = $5`;
      } else {
        query = `UPDATE users SET primary_payment_source = $1, primary_payment_source_username = $2, secondary_payment_source = $3, secondary_payment_source_username = $4, hashed_password = $5 WHERE user_id = $6`;
      }
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    if (type === "userInfoProfileUpdate") {
      updatedInfo = await pool.query(query, [
        firstName,
        lastName,
        email,
        username,
        bio,
        favoriteCuisine,
        birthday,
        location,
        userId,
      ]);
    } else if (type === "paymentAndPasswordProfileUpdate") {
      if (success) {
        updatedInfo = await pool.query(query, [
          primaryPaymentSource,
          primaryPaymentSourceUsername,
          secondaryPaymentSource,
          secondaryPaymentSourceUsername,
          userId,
        ]);
      } else {
        const hashedPassword = bcrypt.hashSync(password, salt); // Generate hash using the pre-defined salt
        updatedInfo = await pool.query(query, [
          primaryPaymentSource,
          primaryPaymentSourceUsername,
          secondaryPaymentSource,
          secondaryPaymentSourceUsername,
          hashedPassword,
          userId,
        ]);
      }
    }
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

//AWS - POST RECEIPT IMAGES
app.post(
  "/diningevents/receiptimages",
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    res.send({ imageKey: result.Key });
  }
);

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
    res.json({ eventId: eventId });
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

  try {
    const userExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)`,
      [username]
    );
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

  try {
    const newUserData = await pool.query(
      `UPDATE users 
      SET profile_image_key = $1
      WHERE username = $2`,
      [profileImageKey, username]
    );

    // On success, send a 200 OK response
    res.status(200).json({ success: true });
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

    const eventData = diningEvents.rows.map((event) => ({
      diningDate: event.dining_date,
      eventId: event.event_id,
      primaryDinerUsername: event.primary_diner_username,
      receiptImageKey: event.receipt_image_key,
      eventLocation: event.restaurant_bar,
      eventTitle: event.title,
    }));
    res.json({ eventData });
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
      `SELECT additional_diners.*, users.*, dining_events.*
      FROM additional_diners
      JOIN users ON additional_diners.additional_diner_username = users.username
      JOIN dining_events ON additional_diners.event_id = dining_events.event_id
      WHERE additional_diners.event_id = $1`,
      [eventId]
    );

    const dinerData = diningEvents.rows.map((event) => ({
      additionalDinerUsername: event.additional_diner_username,
      celebratingBirthday: event.celebrating_birthday,
      dinerMealCost: event.diner_meal_cost,
      bio: event.bio,
      location: event.location,
      birthday: event.birthday,
      favoriteCuisine: event.favorite_cuisine,
      dateJoined: event.date_joined,
      firstName: event.first_name,
      lastName: event.last_name,
      profileImageKey: event.profile_image_key,
      primaryDiner: event.primary_diner_username,
    }));

    const eventData = {
      eventLocation: diningEvents.rows[0].restaurant_bar,
      eventTitle: diningEvents.rows[0].title,
      totalMealCost: diningEvents.rows[0].total_meal_cost,
      tax: diningEvents.rows[0].tax,
      tip: diningEvents.rows[0].tip,
      subtotal: diningEvents.rows[0].subtotal,
    };

    res.json({ dinerData, eventData });
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
    res.json(profileImageKeys.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE FINAL VALUES FOR DINING EVENT
app.post("/diningevent/values", async (req, res) => {
  const { tax, tip, totalMealCost, subtotal, eventId } = req.body;

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
    coveringBirthdayDiners,
    evenlySplitItems,
  } = req.body;

  try {
    let allDinerMealCosts = 0; // Initialize allDinerMealCosts to accumulate the total meal cost
    let dinerMealCosts = []; // Array to store diner meal costs

    //calculate birthday diners meal costs
    let birthdayDinerMealCost = 0;
    for (const diner of birthdayDiners) {
      diner.items.forEach((item) => {
        birthdayDinerMealCost += parseFloat(item.price);
      });
    }

    // Calculate shared meal cost for birthday diners
    let numPayingDiners;
    //not covering birthday diners & sharing items
    if (!coveringBirthdayDiners && evenlySplitItems) {
      numPayingDiners = dinersUpdated.length - 1;
      //taking care of birhtday diners and sharing items
    } else if (coveringBirthdayDiners && evenlySplitItems) {
      numPayingDiners = dinersUpdated.length - birthdayDiners.length - 1;
      //taking care of birthday diners and not sharing items
    } else if (coveringBirthdayDiners && !evenlySplitItems) {
      numPayingDiners = dinersUpdated.length - birthdayDiners.length;
      //not taking care of birthday diners and not sharing items
    } else {
      numPayingDiners = dinersUpdated.length;
    }

    const sharedBirthdayDinerMealCosts =
      birthdayDinerMealCost / numPayingDiners;

    for (const diner of dinersUpdated) {
      //loop through diners items to get total
      let dinerMealCost = 0;
      //if the diner has a birthday
      if (diner.celebratingBirthday && coveringBirthdayDiners) {
        //set the birthday diners meal cost to 0
        dinerMealCost += 0;
      } else {
        //sum items
        diner.items.forEach((item) => {
          dinerMealCost += parseFloat(item.price);
        });

        dinerMealCost += sharedExpenses;
        //if there are birthday diners add their shared expense to other diners total meal cost
        if (birthdayDiners.length && coveringBirthdayDiners) {
          dinerMealCost += sharedBirthdayDinerMealCosts;
        } else {
          dinerMealCost += 0;
        }
      }

      // Add the current diner's meal cost to the total
      allDinerMealCosts += dinerMealCost;

      dinerMealCosts.push({
        additionalDinerUsername: diner.additionalDinerUsername,
        dinerMealCost: dinerMealCost.toFixed(2),
      });

      await pool.query(
        `UPDATE additional_diners
          SET diner_meal_cost = $1
          WHERE event_id = $2 AND additional_diner_username = $3`,
        [dinerMealCost.toFixed(2), eventId, diner.additionalDinerUsername]
      );
    }

    res.status(200).json({ dinerMealCosts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating diner meal costs");
  }
});

// GET FEATURED RESTAURANTS
app.get("/featuredrestaurants", async (req, res) => {
  try {
    const featuredRestaurants = await pool.query(
      `SELECT *
      FROM featured_restaurants;`
    );

    const featuredRestaurantData = featuredRestaurants.rows.map((row) => ({
      restaurantId: row.restaurant_id,
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state,
      zip: row.zip,
      website: row.website,
      rating: row.rating,
      phone: row.phone,
      bio: row.bio,
      cuisine: row.cuisine,
      imgUrl: row.img_url,
      isFavorited: row.is_favorited,
    }));

    res.json(featuredRestaurantData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET FAVORITE DINERS OR RESTAURANTS
app.get("/getfavorite", async (req, res) => {
  const { userId, type } = req.query;
  let query;

  try {
    if (type === "restaurants") {
      query = `SELECT * FROM favorite_restaurants WHERE user_id = $1`;
    } else if (type === "diners") {
      query = `SELECT users.*, favorite_diners.* 
      FROM favorite_diners
      JOIN users ON users.username = favorite_diners.username
      WHERE favorite_diners.user_id = $1`;
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const favorites = await pool.query(query, [userId]);

    if (type === "restaurants") {
      const favoriteRestaurantData = favorites.rows.map((row) => ({
        dateFavorited: row.date_favorited,
        favoriteRestaurantId: row.favorite_restaurant_id,
        imgUrl: row.img_url,
        isFavorited: row.is_favorited,
        userId: row.user_id,
        name: row.name,
        address: row.address,
        city: row.city,
        state: row.state,
        zip: row.zip,
        rating: row.rating,
        bio: row.bio,
        website: row.website,
        phone: row.phone,
        notes: row.notes,
      }));
      res.json(favoriteRestaurantData);
    } else if (type === "diners") {
      const favoriteDinerData = favorites.rows.map((row) => ({
        favoriteDinerId: row.favorite_diner_id,
        userId: row.user_id,
        username: row.username,
        dateFavorited: row.date_favorited,
        isFavorited: row.is_favorited,
        notes: row.notes,
        profileImageKey: row.profile_image_key,
        firstName: row.first_name,
        lastName: row.last_name,
        location: row.location,
        bio: row.bio,
        birthday: row.birthday,
        favoriteCuisine: row.favorite_cuisine,
        dateJoined: row.date_joined,
      }));
      res.json(favoriteDinerData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET RESTAURANT AND DINER FAVORITES STATUS
app.get("/getfavoritestatus", async (req, res) => {
  const { userId, restaurantId, favoriteDinerUsername } = req.query;

  let favoriteStatus;

  try {
    if (restaurantId) {
      favoriteStatus = await pool.query(
        `SELECT is_favorited, notes
        FROM favorite_restaurants
        WHERE user_id = $1 AND favorite_restaurant_id = $2`,
        [userId, restaurantId]
      );
    } else if (favoriteDinerUsername) {
      favoriteStatus = await pool.query(
        `SELECT is_favorited, notes
        FROM favorite_diners
        WHERE user_id = $1 AND username = $2`,
        [userId, favoriteDinerUsername]
      );
    }

    if (favoriteStatus.rows.length > 0) {
      if (restaurantId || favoriteDinerUsername) {
        const isFavorited = favoriteStatus.rows[0].is_favorited;
        const notes = favoriteStatus.rows[0].notes;
        res.status(200).json({ isFavorited, notes });
      }
    } else {
      // If there is no matching record, send the default value (false)
      res.status(200).json({ isFavorited: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//INSERT OR UPDATE FAVORITE RESTAURANTS OR FAVORITE DINERS
app.post("/updatefavorite", async (req, res) => {
  const {
    favoriteRestaurantId,
    userId,
    name,
    address,
    city,
    state,
    zip,
    rating,
    bio,
    website,
    phone,
    dateFavorited,
    isFavorited,
    imgUrl,
    favoriteDinerUsername,
    type,
  } = req.body;

  let existingFavorite;

  try {
    //check to see if record exists
    if (type === "restaurant") {
      existingFavorite = await pool.query(
        `SELECT * FROM favorite_restaurants 
        WHERE favorite_restaurant_id = $1 AND user_id = $2`,
        [favoriteRestaurantId, userId]
      );
    } else if (type === "diner") {
      existingFavorite = await pool.query(
        `SELECT * FROM favorite_diners
        WHERE user_id = $1 AND username = $2`,
        [userId, favoriteDinerUsername]
      );
    }

    if (existingFavorite.rows.length > 0) {
      if (type === "restaurant") {
        // update existing record
        await pool.query(
          `UPDATE favorite_restaurants 
          SET is_favorited = $1 
          WHERE favorite_restaurant_id = $2 AND user_id = $3`,
          [isFavorited, favoriteRestaurantId, userId]
        );
      } else if (type === "diner") {
        // update existing diner favorite record
        await pool.query(
          `UPDATE favorite_diners
          SET is_favorited = $1
          WHERE user_id = $2 AND username = $3`,
          [isFavorited, userId, favoriteDinerUsername]
        );
      }
    } else {
      if (type === "restaurant") {
        await pool.query(
          `INSERT INTO favorite_restaurants(favorite_restaurant_id, user_id, name, address, city,state,zip,rating,bio,website,phone, date_favorited, is_favorited, img_url) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [
            favoriteRestaurantId,
            userId,
            name,
            address,
            city,
            state,
            zip,
            rating,
            bio,
            website,
            phone,
            dateFavorited,
            isFavorited,
            imgUrl,
          ]
        );
      } else if (type === "diner") {
        await pool.query(
          `INSERT INTO favorite_diners(user_id, username, date_favorited, is_favorited) VALUES($1,$2,$3,$4)`,
          [userId, favoriteDinerUsername, dateFavorited, isFavorited]
        );
      }
    }
    res.status(200).json({ message: "Saved successfully" }); // Send success status if the update is successful
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Internal server error" }); // Send an appropriate error response
  }
});

//INSERT OR UPDATE NOTES ON RESTAURANT
app.post("/savenotes", async (req, res) => {
  const { notes, favoriteRestaurantId, username, userId, type } = req.body;

  let query;
  let newNotes;
  try {
    if (type === "restaurantNotes") {
      query = `UPDATE favorite_restaurants
               SET notes = $1
               WHERE favorite_restaurant_id = $2 AND user_id = $3`;
    } else if (type === "userNotes") {
      query = `UPDATE favorite_diners
      SET notes = $1
      WHERE username = $2 AND user_id = $3`;
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    if (type === "restaurantNotes") {
      newNotes = await pool.query(query, [notes, favoriteRestaurantId, userId]);
    } else if (type === "userNotes") {
      newNotes = await pool.query(query, [notes, username, userId]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Internal server error" }); // Send an appropriate error response
  }
});
