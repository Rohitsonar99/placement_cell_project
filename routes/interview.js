const router = require("express").Router();
const interviewController = require('../controller/interview_controller');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// show add interview page
router.get('/add-interview', ensureAuthenticated, interviewController.addInterview);

// create a interview 
router.post('/create', ensureAuthenticated, interviewController.create);

// assign interview 
router.post('/enroll-in-interview/:id', ensureAuthenticated, interviewController.enrollInInterview);

router.get('/deallocate/:studentId/:interviewId', ensureAuthenticated, interviewController.deallocate);

router.get('/delete/:interviewId', interviewController.delete);
// exporting the router
module.exports = router;