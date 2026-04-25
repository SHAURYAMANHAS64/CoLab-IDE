import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { UsersRound, Send, UserRoundPlus } from "lucide-react";

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSlidePanelOpen] = useState(false);

  console.log(location.state);

  return (
    <main className="h-screen w-screen flex">
      
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        
        
        <header className="flex justify-end p-4 w-full bg-slate-100">
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
            />
            <button className="ml-2 px-4 bg-black text-white rounded">
              <Send size={16} />
            </button>
          </div>

        </div>

        <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${ isSidePanelOpen ?'translate-x-0':'-translate-x-full'} top-0`}>
          <header
          className='flex justify-end p-2 px-3 bg-slate-200'>

            <button>
              <UserRoundPlus size={16} mr-1 />
              <p>Add collaborator</p>
            </button>
            <button
            onClick={() => setIsSlidePanelOpen(!isSidePanelOpen)}
            className='p-2'
            >
              close
            </button>
          </header>

          <div className="users cursor-pointer hover:bg-slate-200 flex flex-col gap-2 p-2">

              <div className="user flex gap-2">

                <div
                className="aspect-square rounded-full w-fit h-fit flex items-center p-5 text-white bg-slate-600">
                  <i className="fa-solid fa-user text-white absolute"></i>
                </div>
                
                <h1 className="font-semibold text-lg">username</h1>

              </div>

          </div>


        </div>

      </section>
    </main>
  );
};

export default Project;