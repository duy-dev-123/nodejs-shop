var express = require('express');
var router = express.Router();
var database = require('../modules/insertUser.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/home', { title: 'Home' });
});
/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login/index', { title: 'Login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register/index', { title: 'Register' });
});

/* GET login page. */
router.get('/admin', function(req, res, next) {
  res.render('admin/index', { title: 'Admin' });
});

/* POST login  */
router.post('/login', database.loginUser);

/* POST register  */
router.post('/register', database.insertUser);
module.exports = router;
