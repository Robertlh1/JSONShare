CREATE DATABASE ubuntu;
\c ubuntu

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS files CASCADE;

CREATE EXTENSION pgcrypto;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE files(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  hash VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  date_created timestamp NOT NULL,
  size BIGINT NOT NULL,
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id)
      REFERENCES users(id)
);
CREATE INDEX userIndex ON files(user_id);