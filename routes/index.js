const router = require('express').Router();
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const mainController = require('../controller/main_controller');

router.get('/' , mainController.home);
// dashbaord
router.get('/dashboard', ensureAuthenticated , mainController.dashboard);


// users routes
router.use('/users', require('./users'));

// students routes
router.use('/student', require('./student'));

// interview routes
router.use("/interview", require("./interview"));




module.exports = router;