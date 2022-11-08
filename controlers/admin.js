const { Client } = require("pg");
const client = new Client( {
  user:'eejqgncwcgfgrt',
  password:'bb633485e9a74742afef1f8cf43945ec5067913487c1553ca8fc83947dd2fd50',
  host:'ec2-44-205-177-160.compute-1.amazonaws.com',
  database:'d6d9kaif595vup',
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


const selectIdProduct = async (request,response,next)=>{
  console.log(request.query);
  await client.connect((err) => {
    if (err) {
      //   console.log(err);
    }
  });
  await client.query(
    `SELECT * FROM "products" WHERE id = $1`,
    [Number(request.query.id)],
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        request.detail= res.rows[0];
        next()
      }
    }
  ); // sends queries
}
module.exports = {
  selectProduct,
  selectIdProduct
};
