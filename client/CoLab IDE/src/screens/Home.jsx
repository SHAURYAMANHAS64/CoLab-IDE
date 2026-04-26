import React from "react";
import { useContext } from "react";
import { Plus, User, Code2 } from "lucide-react";
import { userContext } from "../context/user.context";
import axios from "../config/axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";

const Home = () => {
  const { user } = useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]); 
  const navigate = useNavigate();
  function createProject(e){
    e.preventDefault();
    console.log(projectName);
    axios.post("/projects/create", {name: projectName}).then((res) => {
      console.log(res.data);
      setProjectName("");
      setIsModalOpen(false);
      // Refresh projects list
      axios.get("/projects/all").then((res) => {
        setProjects(res.data.projects);
      });
    }).catch((err) => {
      console.error(err);
    });

  }
  useEffect(() => {
    axios.get("/projects/all").then((res) => {
      setProjects(res.data.projects);
    }).catch((err) => {
      console.error(err);
    });
  }, []);





  return (
    <div className="min-h-screen bg-black">
      <HomeNavbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Your <span className="text-[#ffaf01]">Projects</span>
            </h1>
            <p className="text-gray-400 text-lg">Collaborate and build amazing things together</p>
          </div>

          {/* Add Project Button */}
          <div className="mb-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#ffaf01] text-black font-semibold rounded-lg hover:bg-[#ffaf01]/90 transition-all duration-300 shadow-lg hover:shadow-[#ffaf01]/50 hover:shadow-2xl group"
            >
              <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
              Create New Project
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <Code2 className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No projects yet. Create one to get started!</p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => {
                    navigate(`/project`, {
                      state: { project }
                    });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-full rounded-xl border border-[#ffaf01]/30 bg-gradient-to-br from-[#1a1a1a] to-black p-6 hover:border-[#ffaf01]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffaf01]/20">
                    {/* Accent line */}
                    <div className="absolute top-0 left-0 h-1 w-12 bg-gradient-to-r from-[#ffaf01] to-[#d49204] rounded-tr-lg group-hover:w-24 transition-all duration-300"></div>

                    <div className="mt-2">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#ffaf01] transition-colors duration-300">
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User size={16} className="text-[#ffaf01]" />
                        <span>
                          <span className="text-gray-300 font-medium">{project.users.length}</span> collaborator{project.users.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#ffaf01]/20">
                        <p className="text-xs text-gray-500">Click to open project</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#1a1a1a] border border-[#ffaf01]/30 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-[#ffaf01]/20 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="space-y-5" onSubmit={createProject}>
              <div>
                <label className="block text-sm font-semibold text-white mb-2" htmlFor="project-name">
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-lg border border-[#ffaf01]/30 bg-black px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-[#ffaf01]/60 focus:ring-2 focus:ring-[#ffaf01]/20 transition-all duration-300"
                  placeholder="e.g. Team Dashboard"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 font-medium hover:border-gray-400 hover:text-white transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="px-5 py-2 rounded-lg bg-[#ffaf01] text-black font-semibold hover:bg-[#ffaf01]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-[#ffaf01]/50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;