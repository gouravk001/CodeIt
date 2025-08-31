import { useState } from "react";
import axios from "axios";
import api from "../../utils/axiosInstance";

export const CreateProblem = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    constraints: "",
    timeLimit: "",
    memoryLimit: "",
    visibleTestCases: [{ input: "", output: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (type, i, field, value) => {
    const updated = [...form[type]];
    updated[i][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const addTestCase = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { input: "", output: "" }],
    });
  };

  const deleteTestCase = (type, index) => {
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/problems/create", form,
         {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Problem created!");
    } catch (err) {
      alert("Error creating problem");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 border rounded bg-gray-100"
    >
      <input
        name="title"
        placeholder="Problem Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
        className="border p-2"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <textarea
        name="constraints"
        placeholder="Constraints"
        value={form.constraints}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <div>
        <h3 className="font-bold">Visible Test Cases (shown in editor)</h3>
        {form.visibleTestCases.map((tc, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                handleTestCaseChange(
                  "visibleTestCases",
                  i,
                  "input",
                  e.target.value
                )
              }
              className="border p-2 flex-1"
            />
            <textarea
              placeholder="Expected Output"
              value={tc.output}
              onChange={(e) =>
                handleTestCaseChange(
                  "visibleTestCases",
                  i,
                  "output",
                  e.target.value
                )
              }
              className="border p-2 flex-1"
            />
            <button
              type="button"
              onClick={() => deleteTestCase("visibleTestCases", i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTestCase("visibleTestCases")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Visible Test Case
        </button>
      </div>

      <div>
        <h3 className="font-bold">Hidden Test Cases(not shown in editor)</h3>
        {form.hiddenTestCases.map((tc, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                handleTestCaseChange(
                  "hiddenTestCases",
                  i,
                  "input",
                  e.target.value
                )
              }
              className="border p-2 flex-1"
            />
            <textarea
              placeholder="Expected Output"
              value={tc.output}
              onChange={(e) =>
                handleTestCaseChange(
                  "hiddenTestCases",
                  i,
                  "output",
                  e.target.value
                )
              }
              className="border p-2 flex-1"
            />
            <button
              type="button"
              onClick={() => deleteTestCase("hiddenTestCases", i)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTestCase("hiddenTestCases")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Hidden Test Case
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-bold">Time Limit (ms)</label>
          <input
            type="number"
            name="timeLimit"
            placeholder="2000"
            value={form.timeLimit}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block font-bold">Memory Limit (MB)</label>
          <input
            type="number"
            name="memoryLimit"
            placeholder="256"
            value={form.memoryLimit}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Problem
      </button>
    </form>
  );
};
