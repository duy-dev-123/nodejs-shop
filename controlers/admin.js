const { Client } = require("pg");
const client = new Client({
    user:'harseggtektufs',
    password:'652952652f0a4b73ff536d5ee0711e9f92b7f57353904f75a130d95b4faac223',
    host:'ec2-44-195-100-240.compute-1.amazonaws.com',
    database:'d4bs0p4r9f27gm',
    port:5432,
    ssl: {
        rejectUnauthorized: false
    },
});
const selectProduct = async (request, response, next) => {
  if (request.query.delete) {
    await client.connect((err) => {
      if (err) {
        //   console.log(err);
      }
    });
    await client.query(
      `DELETE  FROM "products" WHERE id = $1`,
      [Number(request.query.delete)],
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      }
    ); // sends queries
  } else if (request.query.edit) {
    await client.connect((err) => {
      if (err) {
        //   console.log(err);
      }
    });
    await client.query(
      `SELECT * FROM "products" WHERE id = $1`,
      [Number(request.query.edit)],
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          request.edit = res.rows[0];
        }
      }
    ); // sends queries
  }
  try {
    await client.connect((err) => {
      if (err) {
        //   console.log(err);
      }
    });
    await client.query(`SELECT * FROM "products"`, (err, res) => {
      if (err) {
        next();
      } else {
        request.data = res.rows;
        next();
      }
    }); // sends queries
  } catch (error) {
    console.error(error.stack);
    response.status(400).send(`error ${error.stack}`);
  }
};
module.exports = {
  selectProduct,
};
