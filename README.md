# UserDB

A small user-management web application built with Node.js, Express, EJS, and MySQL. It provides a browser-based interface for creating, viewing, updating, and deleting user records.

## Features

- View the total number of registered users
- List all users stored in MySQL
- Create a user with a unique username and email address
- Update a user's username after confirming their password
- Delete a user by email address
- Render pages with EJS templates

## Tech stack

- Node.js
- Express 5
- EJS
- MySQL and `mysql2`
- Faker (UUID generation)
- Method Override (HTML form support for `PATCH` and `DELETE`)

## Project structure

```text
.
|-- index.js          # Express application and routes
|-- index.sql         # MySQL users-table schema
|-- package.json      # Project dependencies
`-- views/            # EJS page templates
    |-- home.ejs
    |-- showusers.ejs
    |-- newuser.ejs
    |-- edit.ejs
    `-- deleteuser.ejs
```

## Prerequisites

- Node.js 18 or later
- MySQL Server

## Setup

1. Clone the repository and open the project directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a MySQL database named `user`:

   ```sql
   CREATE DATABASE user;
   USE user;
   ```

4. Create the table by running the SQL in `index.sql`:

   ```sql
   CREATE TABLE users (
     id VARCHAR(50) PRIMARY KEY,
     username VARCHAR(50) UNIQUE,
     email VARCHAR(50) UNIQUE NOT NULL,
     password VARCHAR(50) NOT NULL
   );
   ```

5. In `index.js`, update the MySQL connection settings to match your local MySQL account. Do not commit real passwords to version control.

6. Start the application:

   ```bash
   node index.js
   ```

7. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Dashboard with user count |
| `GET` | `/user` | List all users |
| `GET` | `/user/new` | Show the create-user form |
| `POST` | `/user` | Create a user |
| `GET` | `/user/:id/edit` | Show the edit-user form |
| `PATCH` | `/user/:id` | Update a username after password confirmation |
| `GET` | `/user/delete` | Show the delete-user form |
| `DELETE` | `/user/delete` | Delete a user by email |

## Notes

- The current project is intended as a learning project.
- Passwords are stored as plain text in the current implementation. For a production application, hash passwords with a library such as `bcrypt`, keep database credentials in environment variables, and use parameterized SQL queries for every database operation.

## License

This project is licensed under the ISC License.
