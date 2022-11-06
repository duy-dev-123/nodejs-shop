var express = require("express");
var router = express.Router();
var database = require("../controlers/insertUser.js");
var middlewars = require("../middlewares/auth.js");
var admin = require("../controlers/admin.js");
/* GET home page. */
router.get("/", middlewars.verifyToken,admin.selectProduct ,function (req, res, next) {
  res.render("user/home", { title: "Home",data: req.data  });
});
/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login/index", { title: "Login" });
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register/index", { title: "Register" });
});

/* GET login page. */
router.get(
  "/admin",
  middlewars.verifyToken,
  admin.selectProduct,
  function (req, res, next) {
    console.log(req.edit);
    res.render("admin/index", { title: "Admin", data: req.data, edit: req.edit });
  }
);

/* POST login  */
router.post("/login", database.loginUser);

/* POST register  */
router.post("/register", database.insertUser);

/* POST add product  */
router.post("/add-product", middlewars.verifyToken, database.insertProduct);

/* POST update product  */
router.post("/update-product", middlewars.verifyToken, database.updateProduct);

router.post("/logout", function (req, res, next) {
  res.clearCookie("token");
  res.redirect('/login')
  next()
});
module.exports = router;
