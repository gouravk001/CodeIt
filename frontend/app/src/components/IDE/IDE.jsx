import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

export const IDE = ({ id }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState([]);
  const [output, setOutput] = useState(null);
  const [result, setResult] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(0);
  const navigate = useNavigate();
  const onMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  async function handleSubmit() {
    if (Date.now() - lastSubmission < 10 * 1000) {
      toast.info("Please wait 10 seconds before submitting again.");
      return;
    }
    setLastSubmission(Date.now());
    let sourceCode = editorRef.current.getValue();
    const reqBody = {
      problemId: id,
      sourceCode: sourceCode,
      languageId: language,
    };

    try {
      const response = await api.post("/judge/submitCode",
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const verdict = response.data.verdict;

      setResult(verdict);

      if (verdict === "Accepted") {
        toast.success("Solution Accepted!");
      } else {
        toast.error(`${verdict}!`);
      }
    } catch (err) {
        toast.error("Error running the code, please check your code and try again.");
        console.error(err);
      
    }
  }

  async function handleRun() {
    if (Date.now() - lastSubmission < 10 * 1000) {
      toast.info("Please wait 10 seconds before submitting again.");
      return;
    }
    setLastSubmission(Date.now());
    let sourceCode = editorRef.current.getValue();
    const reqBody = {
      problemId: id,
      sourceCode: sourceCode,
      languageId: language,
    };

    try {
      const response = await api.post("/judge/runCode",
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const output = response.data.output;
      setOutput(output);

      toast.info("Output has been fetched.");
    } catch (err) {
      
        console.error(err);
      
    }
  }

  async function getLanguages() {
    try {
      const response = await api.get("/judge/getLanguages"
      );
      const languages = response.data.languages;
      setLanguages(languages);
      if (languages.length > 0) {
        setLanguage(languages[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("Could not fetch the languages for editor.");
    }
  }

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full h-2/3 bg-stone-950 flex-col overflow-hidden">
        <div className="w-full bg-zinc-900 flex flex-row">
          <select
            id="language-select"
            className="bg-white border-4 border-black rounded-2xl"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((l, idx) => {
              return (
                <option value={l.id} key={idx}>
                  {l.name}
                </option>
              );
            })}
          </select>
            
          

          <div className="ml-auto flex gap-5">
             <button
              onClick={()=>{
                navigate("/");
              }}
              className="text-black bg-white p-2 rounded-2xl cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={handleRun}
              className="text-green-700 bg-white p-2 rounded-2xl cursor-pointer"
            >
              Run
            </button>

            <button
              onClick={handleSubmit}
              className="text-blue-700 bg-white p-2 rounded-2xl cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
        <Editor
          height="100%"
          width="100%"
          language={language}
          defaultValue="// some comment"
          theme="vs-dark"
          value={value}
          onChange={(value) => setValue(value)}
          onMount={onMount}
        />
      </div>
      <div className="flex flex-1 flex-col min-h-1/3 border-1 border-white rounded-sm mt-1 p-2 overflow-x-hidden overflow-y-scroll scrollbar-thin">
        <p className="text-2xl text-white mt-2 mb-2">Output :</p>
        <div className="w-full  bg-neutral-700 rounded-2xl text-white text-sm p-4">
          {output ? (
            <pre className="break-words text-sm">{output}</pre>
          ) : (
            "Your code's output will be visible here..."
          )}
        </div>
        {result ? (
          <div className="flex flex-col w-full">
            <p className="text-2xl text-white mt-5 ">Verdict :</p>
            {result === "Accepted" ? (
              <div className="flex h-1/2 w-full flex-row justify-center bg-green-400 p-4 mt-2 rounded-2xl">
                <p className="break-words text-white text-2xl">{result}</p>
              </div>
            ) : (
              <div className="flex flex-row justify-center h-1/2 w-full bg-red-400 p-4 mt-2 rounded-2xl">
                <p className="break-words text-white text-2xl">{result}</p>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};
