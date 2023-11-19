CREATE DATABASE godutchapp;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    hashed_password VARCHAR(255),
    primary_payment_source VARCHAR(255),
    primary_payment_source_username VARCHAR(255),
    secondary_payment_source VARCHAR(255),
    secondary_payment_source_username VARCHAR(255),
    date_joined DATE DEFAULT CURRENT_DATE
);

CREATE TABLE dining_events (
    event_id SERIAL PRIMARY KEY,
    dining_date DATE DEFAULT CURRENT_DATE,
    restaurant_bar VARCHAR(255),
    title VARCHAR(255),
    primary_diner_username VARCHAR(255) REFERENCES users(username),
    tax DECIMAL(10, 2),
    tip DECIMAL(10, 2),
    total_meal_cost DECIMAL(10, 2),
    receipt_image bytea
);

CREATE TABLE additional_diners (
    diner_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES dining_events(event_id) ON DELETE CASCADE,
    additional_diner_username VARCHAR(255) REFERENCES users(username),
    diner_meal_cost DECIMAL(10, 2)
);