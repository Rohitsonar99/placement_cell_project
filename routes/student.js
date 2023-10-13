const router = require('express').Router();
// const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const studentController = require('../controller/student_controller');    // student controller

// view add student for,
router.get('/add',ensureAuthenticated, studentController.addStudent);

// get the data and store it in the database
router.post('/add',studentController.createStudent); 

// view update student  form
router.get('/edit/:id', ensureAuthenticated, studentController.editStudent);

// update student and store it in the database
router.post('/update/:id', ensureAuthenticated, studentController.updateStudent);

// delete student
router.get('/delete/:studentId', ensureAuthenticated, studentController.delete);
module.exports = router;