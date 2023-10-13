const { log } = require('console');
const router = require('express').Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const usersController = require('../controller/users_controller');

// sign up page
router.get('/sign-up' , usersController.signUp);

//sign in page
router.get('/sign-in', usersController.signIn);

//sign-out
// router.get('/sign-out', usersController.signOut);

// Register Handle
router.post('/sign-up', usersController.register);

// sign in Handle
router.post('/sign-in', usersController.signInSession);

// log -out 
router.get('/sign-out', ensureAuthenticated, usersController.logOut);


// reset 
router.get('/reset', ensureAuthenticated, usersController.reset);

//get email 
router.post('/reset', ensureAuthenticated, usersController.getEmail);
// reset password
// router.get('/reset-password', ensureAuthenticated, usersController.resetPassword);
router.post('/reset-password', usersController.updatePassword);
router.get("/download", ensureAuthenticated, usersController.downloadCSVReport);

// downloading CSV Reports
module.exports = router;