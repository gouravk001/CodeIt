import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import api from "../../utils/axiosInstance";

export const Home = () => {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", solvedProblems: [] });
  const navigate = useNavigate();
  async function getAllProblems() {
    try {
      const res = await api.get("/problems/getAll");
      setProblems(res.data.problems);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllProblems();
    if (isLoggedIn()) {
      fetchUserDetails();
    }
  }, []);

  function handleProblemClick(problem) {
    navigate(`/problem/${problem._id}`);
  }

  function createProblemCard(problem, idx) {
    return (
      <div
        key={idx}
        className="flex flex-row w-full bg-zinc-900 text-white p-4 rounded-2xl border-white border-2 pr-7 cursor-pointer"
        onClick={() => {
          handleProblemClick(problem);
        }}
      >
        <pre className="font-sans">{idx + 1 + ". "}</pre>
        <p>{problem.title}</p>
        {problem.difficulty === "Easy" ? (
          <div className="ml-auto border-2 border-green-300 pl-2 pr-2 rounded-2xl">
            <p className="text-green-300">Easy</p>
          </div>
        ) : (
          <></>
        )}
        {problem.difficulty === "Medium" ? (
          <div className="ml-auto border-2 border-orange-400 pl-2 pr-2 rounded-2xl">
            <p className="text-orange-400">Medium</p>
          </div>
        ) : (
          <></>
        )}
        {problem.difficulty === "Hard" ? (
          <div className="ml-auto border-2 border-red-500 pl-2 pr-2 rounded-2xl">
            <p className="text-red-500">Hard</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  async function fetchUserDetails() {
    try {
      const res = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const u = res.data;
      setUser(u);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogOut() {
    localStorage.removeItem("token");
    navigate("/signIn");
  }

  return (
    <div className="h-screen w-screen flex flex-row bg-zinc-800">
      <div className="h-full w-1/3 bg-zinc-900 justify-center">
        {isLoggedIn() ? (
          <>
            <div className="w-full h-full p-5 flex flex-col  items-centre text-white gap-10 text-center">
              <div className="flex flex-col gap-5 mt-3">
                <p>Username - {user.name}</p>
                <p>Email Id - {user.email}</p>
              </div>
              <button
                className="border-2 w-fit m-auto p-1 pl-3 pr-3 rounded-2xl cursor-pointer"
                onClick={handleLogOut}
              >
                Logout
              </button>
              
              <p>Total Problems Solved - {user.solvedProblems.length}</p>
              <div className="h-4/6 flex flex-col gap-6 p-5 mt-auto rounded-2xl border-2 overflow-x-hidden overflow-y-scroll scrollbar-thin">
                {user.solvedProblems.map((problem, idx) => (
                  <div
                    key={problem._id || idx}
                    className="bg-zinc-900 p-3 rounded-lg border-2 border-white cursor-pointer overflow-ellipsis"
                    onClick={() => navigate(`/problem/${problem._id}`)}
                  >
                    {idx + 1}. {problem.title}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col w-full h-full gap-5 text-white items-center justify-center ">
              <p>It seems you haven't signed in yet...</p>
              <button
                onClick={() => {
                  navigate("/signIn");
                }}
                className="border-2 max-w-1/2 p-2 rounded-2xl cursor-pointer "
              >
                SignIn
              </button>
              <p>Don't have an account?</p>
              <button
                className="border-2 max-w-1/2 p-2 rounded-2xl cursor-pointer"
                onClick={() => {
                  navigate("/signUp");
                }}
              >
                SignUp
              </button>
            </div>
          </>
        )}
      </div>
      <div className="h-full w-full bg-zinc-800 p-6 pt-2">

        <div className="flex flex-col gap-5 h-full w-full border-2 border-white rounded-2xl p-5 overflow-x-hidden overflow-y-scroll scrollbar-thin">
          {problems.map((problem, idx) => {
            return createProblemCard(problem, idx);
          })}
        </div>
      </div>
    </div>
  );
};
