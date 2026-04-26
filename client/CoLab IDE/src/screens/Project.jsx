import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UsersRound, Send, UserRoundPlus, UserRound } from "lucide-react";
import axios from "../config/axios";
import { initializeSocket , recieveMessage ,sendMessage} from "../config/socket";
// import { set } from "mongoose";
import {UserContext} from "../context/user.context";
const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [isSidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  function addCollaborators(){

    axios.put("/projects/add-user",{
      projectId: location.state.project._id,
      users: selectedUsers.map(user => user.id || user._id)
    }).then(res =>{
      console.log(res.data);
      setIsUserModalOpen(false);
    }).catch(err =>{
      console.log(err);
    })
  }

  const send = ()=>{
    if (!user || !user._id) {
      return;
    }
    console.log("Sending message:", message);
    sendMessage("project-message", {
        message,
        sender: user._id,
  })
  setMessage("");
  }
  useEffect(() => {

    initializeSocket(project._id);

    recieveMessage("project-message", data =>{
      console.log("Received message:", data);
    })


    
    axios.get(`/projects/get-project/${location.state.project._id}`).then(res =>{

      console.log(res.data.project);

      setProject(res.data.project);

    })


    axios.get("/users/all").then(res =>{

      console.log(res.data.users);

      setUsers(res.data.users);

    }).catch(err =>{

      console.log(err);

    })

  },[])

  useEffect(() => {
    console.log("Selected users:", selectedUsers);
  }, [selectedUsers]);
  

  return (
    <main className="h-screen w-screen flex">
      
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
         
        
        <header className="flex justify-between items-center p-4 w-full bg-slate-100">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex gap-2 items-center p-2"
          >
              <UserRoundPlus size={16} />
              <p className="">Add collaborator</p> 
            </button>
          <button
          onClick={() => setIsSlidePanelOpen(!isSidePanelOpen)} 
          className="p-2  text-black rounded">
            <UsersRound size={20} strokeWidth={2.5} />
          </button>
        </header>

        
        <div className="conversation-area flex flex-col flex-grow">
          
          
          <div className="message-box p-2 flex-grow flex flex-col gap-1">
            <div className="message max-w-56 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small 
              className='opacity-65 text-xsl'
              >example@gmail.com</small>
              <p className='text-sm'>hello </p>
            </div>
            <div className="ml-auto max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small 
              className='opacity-65 text-xsl'
              >example@gmail.com</small>
              <p className='text-sm'>how are you</p>
            </div>
          </div>

         
          <div className="inputField w-full flex p-2 bg-slate-100">
            <input
              className="flex-grow p-2 px-4 border rounded outline-none"
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button 
            onClick={send}
            className="ml-2 px-4 bg-black text-white rounded">
              <Send />
            </button>
          </div>

        </div>

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${ isSidePanelOpen ?'translate-x-0':'-translate-x-full'} top-0`}>
          <header
          className='flex justify-between items-center p-2 px-3 bg-slate-200'>
            <h1
            className="font-semibold text-lg"
            >Collaborators</h1>
            <button
            onClick={() => setIsSlidePanelOpen(!isSidePanelOpen)}
            className='p-2'
            >
              close
            </button>
          </header>

          <div className="users flex flex-col gap-2 p-2">

                {project.users && project.users.map((user, index) =>{
                  return (<div key={user._id || user.id || index} className="user cursor-pointer hover:bg-slate-200 rounded transition flex gap-2 p-2 w-full">
                <div
                className="aspect-square rounded-full w-fit h-fit flex items-center p-2 text-white bg-slate-600">
                  <UserRound/>
                </div>
                <h1 className="font-semibold text-lg">{user.email}</h1>
              </div>)
                })}
          </div>
        </div>

        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsUserModalOpen(false)}
            />
            <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold">Select users</h2>
                  <p className="text-sm text-slate-500">
                    Click a user tile to toggle selection.
                  </p>
                </div>
                <button
                  className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {users.map((user) => {
                    const userId = user.id || user._id;
                    const displayName =
                      user.name || user.username || user.email || "Unknown";
                    const initials = displayName
                      .trim()
                      .split(" ")
                      .filter(Boolean)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase();

                    const isSelected = selectedUsers.some(
                      (selected) => (selected.id || selected._id) === userId
                    );

                    return (
                      <button
                        key={userId}
                        type="button"
                        onClick={() =>
                          setSelectedUsers((prev) =>
                            prev.some(
                              (selected) =>
                                (selected.id || selected._id) === userId
                            )
                              ? prev.filter(
                                  (selected) =>
                                    (selected.id || selected._id) !== userId
                                )
                              : [...prev, user]
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition hover:bg-slate-50 ${
                          isSelected
                            ? "border-slate-900 bg-slate-100"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                          {initials || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {user.email || "No email"}
                          </p>
                          <p className="mt-1 text-[10px] uppercase text-slate-400">
                            ID: {userId || "n/a"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
                <p className="text-xs text-slate-500">
                  Selected IDs:{" "}
                  {selectedUsers.length
                    ? selectedUsers
                        .map((user) => user.id || user._id)
                        .filter(Boolean)
                        .join(", ")
                    : "none"}
                </p>
                <button
                onClick={addCollaborators}
                  className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </section>
      
    </main>
  );
};

export default Project;