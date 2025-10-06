const StudentAnalysis = require("../model/Studentanalysis");




class StudentService {
    async getstudent(req, res) {
      try {
        const stddata = await StudentAnalysis.find();
        res.status(200).json({
          message: "Student Listed Successfully",
          data: stddata,
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  }

module.exports = new StudentService;