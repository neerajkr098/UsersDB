const { faker } = require("@faker-js/faker");
const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "user",
  password: "Neeraj@2005ee",
});

// GENERATE & INSERT 100 FAKE USERS USING FAKER
// const getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// let fakeUsers = [];
// for (let i = 0; i < 100; i++) {
//   fakeUsers.push(getRandomUser());
// }

// let seedQuery = "INSERT INTO users (id, username, email, password) VALUES ?";
// connection.query(seedQuery, [fakeUsers], (err, result) => {
//   if (err) {
//     console.error("Error inserting fake users:", err);
//   } else {
//     console.log(`Successfully inserted ${result.affectedRows} fake users into 'users' table!`);
//   }
// });

// HOME ROUTE
app.get("/", (req, res) => {
  let q = `SELECT COUNT(*) FROM users`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["COUNT(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching data from database");
  }
});

//SHOW ROUTE

app.get("/user", (req, res) => {
  let q = "SELECT * FROM users";

  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching users from database");
  }
});

// EDIT ROUTES

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("edit.ejs", { user: result[0] });
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching users from database");
  }
});

/// PATCH

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass, username: newUsername } = req.body;
  let q = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password) {
        res.send("wrong password");
      } else {
        let q2 = `UPDATE users SET username = '${newUsername}' WHERE id ='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error fetching users from database");
  }
});

// NEW USER FORM
app.get("/user/new", (req, res) => {
  res.render("newuser.ejs");
});

// CREATE USER
app.post("/user", (req, res) => {
  let { username, email, password } = req.body;
  let id = faker.string.uuid();
  let q = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
  try {
    connection.query(q, [id, username, email, password], (err, result) => {
      if (err) {
        console.log(err);
        return res.render("newuser.ejs", { error: "Email or Username already exists. Please try again." });
      }
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Error adding user to database");
  }
});

// DELETE USER FORM
app.get("/user/delete", (req, res) => {
  res.render("deleteuser.ejs");
});

// DELETE USER
app.delete("/user/delete", (req, res) => {
  let { email } = req.body;
  let q = `SELECT * FROM users WHERE email = ?`;
  try {
    connection.query(q, [email], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.render("deleteuser.ejs", { error: "No user found with that email." });
      }
      let q2 = `DELETE FROM users WHERE email = ?`;
      connection.query(q2, [email], (err2, result2) => {
        if (err2) throw err2;
        res.redirect("/user");
      });
    });
  } catch (err) {
    console.log(err);
    res.send("Error deleting user from database");
  }
});

app.listen("8080", () => {
  console.log("server is listenig to port 8080");
});
