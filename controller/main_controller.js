const Student = require('../models/student');
const Interview = require('../models/interview');

module.exports.home = (req,res) => {
    return res.render('index', {
     title: 'home'
    })
 }
 
 module.exports.dashboard = async (req,res) => {
   // populating all students with interviews
      let students = await Student.find({}).populate("interviews");

      // populating all interviews with students
      let interviews = await Interview.find({}).populate("students.student");
    return res.render('dashboard', {
     title: 'Dashboard',
     user: req.user,
     all_students: students,
        all_interviews: interviews,
    })
 }
 module.exports.createSession = (req, res) => {
    // req.flash('success_msg', 'Logged in Successfully');
    return res.redirect('/dashboard');
 };