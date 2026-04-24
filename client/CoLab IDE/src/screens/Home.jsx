import React from "react";
import { useContext } from "react";
import { Plus } from "lucide-react";
import { userContext } from "../context/user.context";
import axios from "../config/axios";
import { useState } from "react";

const Home = () => {
  const { user } = useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  function createProject(e){
    e.preventDefault();
    console.log(projectName);
    axios.post("/projects/create", {name: projectName}).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.error(err);
    });

  }
  function handleSubmit(event){
    event.preventDefault();
    if (!projectName.trim()) return;
    createProject(projectName.trim());
    setProjectName("");
    setIsModalOpen(false);
  }
  return (
    <main
    className="p-4">
<div className="projects">
  <div className="project">
    <button
      className="add-project-btn flex items-center gap-2 px-4 py-2 rounded-sm bg-black text-white"
      onClick={() => setIsModalOpen(true)}
    >
      <Plus size={20} />
      Add Project
    </button>
  </div>
</div>

{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Create Project</h2>
        <button
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <form className="mt-4 space-y-4" onSubmit={createProject}>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="project-name">
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
            placeholder="e.g. Team Dashboard"
            required
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    
    </main>
  )
};
export default Home;