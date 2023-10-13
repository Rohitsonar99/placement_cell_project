const Student = require("../models/student");
const Interview = require("../models/interview");


// show interview page
module.exports.addInterview = (req, res) => {
    return res.render("add_interview", {
        title: "Schedule An Interview",
    });

}

// create interview
module.exports.create = async (req, res) => {
    try {
        const { company, date } = req.body;

        const interview = await Interview.create({
            company,
            date,
        });

        return res.redirect("/dashboard");


    } catch (err) {
        console.log(`Error in creating Interview ${err}`);
    }
};

// add students in for interview

module.exports.enrollInInterview = async (req, res) => {
    try {
        let interview = await Interview.findById(req.params.id);
        const { email, result } = req.body;

        if (interview) {
            let student = await Student.findOne({ email: email });
            if (student) {
                // check if already enrolled

                let alreadyEnrolled = await Interview.findOne({
                    "students.student": student.id,

                });

                // if yes then preventing from enrolling in same company more than once
                if (alreadyEnrolled) {
                    if (alreadyEnrolled.company === interview.company) {
                        console.log('Already Enrolled');
                        return res.redirect("back");
                    }
                }

                let studentObj = {
                    student: student.id,
                    result: result,
                };

                // updating students field of interview by putting reference of newly enrolled student
                await interview.updateOne({
                    $push: { students: studentObj },
                });

                // updating interview of student
                let assignedInterview = {
                    company: interview.company,
                    date: interview.date,
                    result: result,
                };
                await student.updateOne({
                    $push: { interviews: assignedInterview },
                });

                return res.redirect("back");
            }
            return res.redirect("back");
        }
        return res.redirect("back");
    } catch (err) {
        console.log("error", "Error in enrolling interview!", err);
    }
};

// remove student from the interview

module.exports.deallocate = async (req, res) => {
    try {
        const { studentId, interviewId } = req.params;

        // find the interview
        const interview = await Interview.findById(interviewId);

        if (interview) {
            // remove reference of student from interview schema
            await Interview.findOneAndUpdate(
                { _id: interviewId },
                { $pull: { students: { student: studentId } } }
            );

            // remove interview from student's schema using interview's company
            await Student.findOneAndUpdate(
                { _id: studentId },
                { $pull: { interviews: { company: interview.company } } }
            );
            return res.redirect("back");
        }
        return res.redirect("back");
    } catch (err) {
        console.log("error", "Couldn't deallocate from interview");
    }
};

//
module.exports.delete = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            console.log('Interview not found');
            return res.status(404).send('Interview not found');
        }

        const studentsOfInterview = interview.students;

        if (studentsOfInterview.length > 0) {
            for (let student of studentsOfInterview) {
                await Student.findOneAndUpdate(
                    { _id: student.student },
                    { $pull: { interviews: { interview: interviewId } } }
                );
            }
        }

        await interview.deleteOne();
        return res.redirect("back");
    } catch (err) {
        console.log("Error in deleting Interview", err);
        return res.status(500).send("Error deleting interview");
    }
};