import React from "react";
import { IDE } from "../IDE/IDE";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

export const Prob = () => {
  const { id } = useParams();

  const [sampleProblem, setSampleProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  async function getProblem(id) {
    try {
      setLoading(true);
      const res = await api.get(`/problems/getProblem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const p = res.data.problem;

      setSampleProblem(p);
    } catch (err) {
     console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProblem(id);
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-white">
        <p className="text-2xl animate-pulse">Loading Problem...</p>
      </div>
    );
  }

  if (!sampleProblem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-red-400">
        <p className="text-xl">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="flex row justify-center gap-3 overflow-hidden h-screen w-screen bg-zinc-900 m-0 p-0">
      <div className="h-full flex flex-col flex-1 max-w-1/2 overflow-x-hidden overflow-y-scroll scrollbar-thin">
        <div className="flex flex-col gap-5 text-white text-wrap p-6 pb-10 bg-zinc-800 m-5 mb-0 border-2 border-b-0 rounded-t-2xl">
          <div className="flex flex-col mb-2">
            <pre className="font-sans text-3xl">
              {sampleProblem.title + " :"}
            </pre>
          </div>
          <p className="text-2xl">Description :</p>
          <p className="break-w">{sampleProblem.description}</p>
        </div>

        <div className="flex flex-col gap-5 text-white text-wrap p-5 pb-10 bg-zinc-800 m-5 mt-0 mb-0 border-b-0 border-2">
          <p className="text-2xl">Constraints :</p>
          <pre className="font-sans text-1xl">{sampleProblem.constraints}</pre>
        </div>

        <div className="flex flex-col gap-5 text-white text-wrap p-5 pb-10 bg-zinc-800 m-5 mt-0 border-2 rounded-b-2xl">
          <p className="text-2xl">Sample Test Cases :</p>
          <div>
            {sampleProblem.visibleTestCases?.length > 0 ? (
              sampleProblem.visibleTestCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col border-2 w-full p-5 gap-5 font-sans"
                >
                  <div>
                    <p>Input :</p>
                    <pre className="overflow-y-auto scrollbar-thin">
                      {tc.input}
                    </pre>
                  </div>
                  <div>
                    <p>Output:</p>
                    <pre className="overflow-y-auto scrollbar-thin">
                      {tc.output}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No sample test cases available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-1/2 m-5 p-2 border-2 border-white rounded-2xl">
        <IDE id={id}></IDE>
      </div>
    </div>
  );
};
