const Problem = require("../models/Problem");

const createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.send({ status: 200, message: "Problem created successfully." });
  } catch (err) {
    console.error(err);
    res.send({ status: 500, message: "Error creating problem." });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const allProblems = await Problem.find({}, "title difficulty");
    res.send({ status: 200, problems: allProblems });
  } catch (err) {
    console.error(err);
    res.send({ status: 500, message: "Error fetching the problems." });
  }
};

const getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.send({ status: 404, message: "Problem not found." });
    }

    const {
      _id,
      title,
      description,
      difficulty,
      constraints,
      visibleTestCases,
    } = problem;

    res.send({
      status: 200,
      problem: {
        _id,
        title,
        description,
        difficulty,
        constraints,
        visibleTestCases,
      },
    });
  } catch (error) {
    console.error(error);
    res.send({ status: 500, message: "Error fetching the problem." });
  }
};

module.exports = { createProblem, getAllProblems, getProblem};
