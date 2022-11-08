var express = require("express");
var router = express.Router();
var database = require("../controlers/insertUser.js");
var middlewars = require("../middlewares/auth.js");
var shop = require("../controlers/admin.js");

/* GET login langing. */
router.get("", function (req, res, next) {
  res.redirect('/login')
});
/* GET home page. */
router.get("/user", middlewars.verifyToken,shop.selectProduct ,function (req, res, next) {
  res.render("user/home", { title: "Home",data: req.data  });
});

/* GET home page. */
router.get("/user/detail-product", middlewars.verifyToken,shop.selectIdProduct ,function (req, res, next) {
  res.render("user/detail", { title: "Detail",detail:req.detail });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login/index", { title: "Login" });
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register/index", { title: "Register" });
});
/* GET cart page. */
router.get("/cart",middlewars.verifyToken,database.selectIdOrder ,function (req, res, next) {
  res.render("user/cart", { title: "Cart", cart:req.cart });
});

/* GET login page. */
router.get(
  "/shop",
  middlewars.verifyToken,
  shop.selectProduct,
  function (req, res, next) {
    console.log(req.edit);
    res.render("shop/index", { title: "Shop", data: req.data, edit: req.edit });
  }
);

/* GET login langing. */
router.get("/admin", database.selectAllUser ,middlewars.verifyToken ,function (req, res, next) {
  res.render("admin/index", { title: "Shop", data:req.data_all_user });
});

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

/* POST add cart  */
router.post("/cart-product", middlewars.verifyToken, database.insertOrder);

// remove-cart
/* POST remove-cart */
router.post("/remove-cart", middlewars.verifyToken, database.removeCart);

module.exports = router;
