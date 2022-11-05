const { Client } = require("pg");
const bcrypt = require("bcrypt");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "db-shopping",
  password: "123456",
  port: "5432",
  ssl: false,
});

const insertUser = async (request, response) => {
  const { username, password } = request.body;
  try {
    const salt = await bcrypt.genSalt(10);
    hash_password = await bcrypt.hash(password, salt);
    await client.connect();
    await client.query(
      `INSERT INTO "users" ("username", "password")  
             VALUES ($1, $2)`,
      [username, hash_password]
    ); // sends queries
    // return response.status(201).send(`register success`)
    response.redirect("/login");
  } catch (error) {
    console.error(error.stack);
    response.status(401).send(`error ${error.stack}`);
  }
};

const loginUser = async (request, response) => {
  const { username, password } = request.body;
  try {
    const query = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [1],
    }
    client.query(query, (error, result) => {
        if (err) {
            response.status(200).send(error);
        } else {
            response.status(400).json(result.rows[0]);
        }
      })
   
  } catch (error) {
    console.error(error.stack);
    response.status(401).send(`error ${error.stack}`);
  }
};
module.exports = {
  insertUser,
  loginUser,
};
