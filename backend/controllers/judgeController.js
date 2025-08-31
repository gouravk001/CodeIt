const axios = require("axios");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User")


const b64Encode = (str) => Buffer.from(str, "utf-8").toString("base64");



const getLanguages = async (req, res) => {
  try {
    const response = await axios.get("https://ce.judge0.com/languages/", {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": process.env.APIKEY,
      },
    });

    res.status(200).send({ languages: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Could not fetch language list.");
  }
};

const submitProblem = async (req, res) => {
  try {
    const { problemId, sourceCode, languageId } = req.body;
     const userId = req.user.id; 
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    let finalVerdict = "Accepted";
    const allTestCases = [
      ...problem.visibleTestCases,
      ...problem.hiddenTestCases,
    ];

    const cpuTimeLimit = problem.timeLimit ? problem.timeLimit / 1000 : 2;
    const memoryLimit = problem.memoryLimit
      ? problem.memoryLimit * 1024 * 1024
      : 256 * 1024 * 1024;

    for (const testCase of allTestCases) {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        {
          source_code: b64Encode(sourceCode),
          language_id: Number(languageId),
          stdin: b64Encode(testCase.input),
          time: cpuTimeLimit,
          memory: memoryLimit,
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.APIKEY,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status.description !== "Accepted") {
        finalVerdict = response.data.status.description;
        break;
      }

      const output = Buffer.from(response.data.stdout || "", "base64").toString(
        "utf-8"
      );

      if (
        (output || "").trim() !== (testCase.output || "").trim()
      ) {
        finalVerdict = "Wrong Answer";
        break;
      }
    }

    const submission = new Submission({
      problemId,
      sourceCode,
      languageId,
      finalVerdict,
    });

    await submission.save();

     if (finalVerdict === "Accepted") {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { solvedProblems: problemId } },
        { new: true }
      );
    }

    res.status(200).send({ verdict: submission.finalVerdict });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error running problem");
  }
};


const runCode = async (req, res) => {
  try {
    const { problemId, sourceCode, languageId } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    let finalVerdict = "Accepted";
    const allTestCases = [...problem.visibleTestCases];

    const cpuTimeLimit = problem.timeLimit ? problem.timeLimit / 1000 : 2;
    const memoryLimit = problem.memoryLimit
      ? problem.memoryLimit * 1024 * 1024
      : 256 * 1024 * 1024;

    let finalOutput = "";

    for (const testCase of allTestCases) {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        {
          source_code: b64Encode(sourceCode),
          language_id: Number(languageId),
          stdin: b64Encode(testCase.input),
          time: cpuTimeLimit,
          memory: memoryLimit,
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": process.env.APIKEY,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status.description !== "Accepted") {
        finalVerdict = response.data.status.description;
        break;
      }

      const output = Buffer.from(response.data.stdout || "", "base64").toString(
        "utf-8"
      );
      finalOutput += output + "\n";
    }

    if (finalVerdict === "Accepted") {
      res.status(200).send({ output: finalOutput });
    } else {
      res.status(200).send({ output: finalVerdict });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error running problem");
  }
};

module.exports = { getLanguages, submitProblem, runCode };
