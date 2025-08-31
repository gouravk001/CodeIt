const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    timeLimit: { type: Number, default: 2000 },
    memoryLimit: { type: Number, default: 256 },
    constraints: { type: String },
    visibleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
