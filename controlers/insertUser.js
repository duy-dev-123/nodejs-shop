const { Client } = require("pg");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "db-shopping",
  password: "123456",
  port: "5432",
  ssl: false,
});

const insertUser = async (request, response) => {
  const { username, password, role } = request.body;
  const roles = role !== undefined ? true : false
  try {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    console.log(roles);
    await client.query(
      `INSERT INTO "users" ("username", "password", "roles")  
             VALUES ($1, $2, $3)`,
      [username, hash_password, roles]
    ); // sends queries
    response.redirect("/login");
  } catch (error) {
    console.error(error.stack);
    response.status(400).send(`error ${error.stack}`);
  }
};

const loginUser = async (request, response) => {
  const { username, password } = request.body;
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `SELECT * FROM "users" WHERE "username" = $1`,
      [username],
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          if (res.rows.length > 0) {
            var passwordIsValid = bcrypt.compareSync(
              password,
              res.rows[0].password
            );
            if (passwordIsValid) {
              console.log(res.rows[0].id);
              var token = jwt.sign({ id: res.rows[0].id,roles: res.rows[0].roles }, "demo123_key");
              response.cookie("token", token);
              if(res.rows[0].roles === false){
                response.redirect("/");
              }
              else{
                response.redirect("/admin");
              }
            } else {
              response.status(401).send("Wrong username or password");
            }
          } else {
            response.status(401).send("Wrong username or password");
          }
        }
      }
    );
  } catch (error) {
    console.error(error.stack);
    response.status(400).send(`error ${error.stack}`);
  }
};

const insertProduct = async (request, response) => {
  const {product, price} = await request.body
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `INSERT INTO "products" ("name", "price")  
             VALUES ($1, $2)`,
      [product, price]
    ); // sends queries
    response.redirect("/admin");
  } catch (error) {
    console.error(error.stack);
    response.status(400).send(`error ${error.stack}`);
  }
}

const updateProduct = async (req,res)=>{
  const id = req.query
  const {product, price} = await req.body
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `UPDATE "products" set "name" =$1, price=$2 WHERE id = $3`,
      [product, price, id.id]
    ); // sends queries
    res.redirect("/admin");
  } catch (error) {
    console.error(error.stack);
    res.status(400).send(`error ${error.stack}`);
  }
}
module.exports = {
  insertUser,
  loginUser,
  insertProduct,
  updateProduct
};
