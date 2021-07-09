const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('index');
});
router.get('/register', (req,res) => {
    res.render('logsin');
});



router.get('/dash', authController.loggedin, (req,res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('dash'); 
  } else {
    res.redirect('/register');
  }


  
 
});
router.get('/user', authController.loggedin, (req,res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('usertable'); 
  } else {
    res.redirect('/register');
  }

});


module.exports = router;