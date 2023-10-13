const Student = require("../models/student");
const Interview = require('../models/interview');

// add student
module.exports.addStudent = (req, res) => {
    return res.render("add_student", {
        title: "Add Student",
    });
};

// create a student
module.exports.createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            batch,
            college,
            placementStatus,
            dsa_score,
            react_score,
            webdev_score,
        } = req.body;


        // if student is already there
        const student = await Student.findOne({ email });

        //   if not 
        if (!student) {
            const savedStudent = await Student.create({
                name,
                email,
                college,
                batch,
                dsa_score,
                react_score,
                webdev_score,
                placementStatus
            });
            return res.redirect('/dashboard');
        }
    } catch (err) {
        console.log('Error in Adding Student data');
    }
}


// update form 
module.exports.editStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);
    return res.render("edit_student", {
        title: "Edit Student",
        student_details: student,
    });
}

// update student
module.exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const {
            name,
            college,
            batch,
            dsa_score,
            react_score,
            webdev_score,
            placementStatus,
        } = req.body;

        if (!student) {
            return res.redirect("back");
        }
        student.name = name;
        student.college = college;
        student.batch = batch;
        student.dsa_score = dsa_score;
        student.react_score = react_score;
        student.webdev_score = webdev_score;
        student.placementStatus = placementStatus;

        student.save();
        return res.redirect("/dashboard");
    } catch (err) {
        console.log('error in updating Student');
        return res.redirect('back');
    }
}


// delete student
module.exports.delete = async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log(studentId)
        const student = await Student.findById(studentId);

        // if there is no student
        if (!student) {
            console.log('Student not found');
            return;
        }
        const interviewsOfStudent = student.interviews;

        // delete reference of student from companies 
        if (interviewsOfStudent.length > 0) {
            for (let interview of interviewsOfStudent) {
                await Interview.findOneAndUpdate(
                    { company: interview.company },
                    { $pull: { students: { student: studentId } } }
                );
            }
        }
        await student.deleteOne();   // delete student 
        return res.redirect("back");
    } catch (err) {
        console.log("Error in deleting Student", err);
        return;
    }
}