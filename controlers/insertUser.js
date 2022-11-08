const { Client } = require("pg");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
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

const insertUser = async (request, response) => {
  const { username, password, role } = request.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    await client.connect((err) => {
      if (err) {
        console.log(err);
      }
    });
    await client.query(
      `INSERT INTO "users" ("username", "password", "roles")  
             VALUES ($1, $2, $3)`,
      [username, hash_password, role],(err)=>{
        console.log(err);
      }
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
              if(res.rows[0].roles === 'admin'){
                response.redirect("/admin");
              }
              else if(res.rows[0].roles === 'shop'){
                response.redirect("/shop");
              }
              else{
                response.redirect("/user");
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
  const {product, price, img, qty} = await request.body
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `INSERT INTO "products" ("name", "price","img","qty")  
             VALUES ($1, $2, $3,$4)`,
      [product, price, img, qty]
    ); // sends queries
    response.redirect("/shop");
  } catch (error) {
    console.error(error.stack);
    response.status(400).send(`error ${error.stack}`);
  }
}

const updateProduct = async (req,res)=>{
  const id = req.query
  const {product, price, img, qty} = await req.body
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `UPDATE "products" set "name" =$1, price=$2,"img"=$3,"qty"=$4 WHERE id = $5`,
      [product, price,img,qty ,id.id]
    ); // sends queries
    res.redirect("/shop");
  } catch (error) {
    console.error(error.stack);
    res.status(400).send(`error ${error.stack}`);
  }
}

const insertOrder = async (req,res,next)=>{
  const {id_product,name,price,img} = req.query
  const {qty} = req.body
  const {id} = req.data_user
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `INSERT INTO "order" ("id_user","id_product", "qty","price","name_product","img")  
             VALUES ($1, $2, $3, $4, $5, $6)`,
      [id,id_product,Number(qty),Number(price),name,img]
    );
    res.redirect("/user");
  } catch (error) {
    res.status(400).send(`error ${error.stack}`);
  }
}

const selectIdOrder = async(request,response,next)=>{
  const {id} = request.data_user
  try {
    await client.connect((err) => {
      if (err) {
        // console.log(err);
      }
    });
    await client.query(
      `SELECT * FROM "order" WHERE id_user = $1`,
      [Number(id)],
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          request.cart = res.rows;
          next()
        }
      }
    ); // sends queries
  } catch (error) {
    response.status(400).send(`error ${error.stack}`);
  }

}

const removeCart = async(request,response,next)=>{

  await client.connect((err) => {
    if (err) {
      //   console.log(err);
    }
  });
  await client.query(
    `DELETE  FROM "order" WHERE id_order = $1`,
    [Number(request.query.id)],
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        response.redirect('/cart')
        next()
      }
    }
  ); // sends queries
}

const selectAllUser= async (request,response,next)=>{
  await client.connect((err) => {
    if (err) {
      //   console.log(err);
    }
  });
  await client.query(`SELECT * FROM "users"`, (err, res) => {
    if (err) {
      next();
    } else {
      request.data_all_user = res.rows;
      next();
    }
  });

}
module.exports = {
  insertUser,
  loginUser,
  insertProduct,
  updateProduct,
  insertOrder,
  selectIdOrder,
  removeCart,
  selectAllUser
};
