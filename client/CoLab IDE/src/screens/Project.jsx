import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  UsersRound,
  Send,
  UserRoundPlus,
  UserRound,
  X,
  File,
  Folder,
  Container,
} from "lucide-react";
import axios from "../config/axios";
import {
  initializeSocket,
  recieveMessage,
  sendMessage,
  removeMessageListener,
} from "../config/socket";
import { UserContext } from "../context/user.context";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Markdown from "markdown-to-jsx";

import { getWebContainer } from "../config/webContainers";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-")) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [isSidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openedFiles, setOpenedFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const messageBoxRef = useRef(null);

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: selectedUsers.map((user) => user.id || user._id),
      })
      .then((res) => {
        console.log(res.data);
        setIsUserModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getSenderLabel = (messageObject) =>
    messageObject.senderEmail ||
    messageObject.sender?.email ||
    messageObject.sender?.name ||
    "Unknown";

  const writeAiMessage = (messageObject) => {
    const rawMessage = messageObject?.message ?? messageObject;

    if (rawMessage === null || rawMessage === undefined) {
      return "";
    }

    const toDisplayString = (value) => {
      if (typeof value === "string") {
        return value;
      }

      if (value && typeof value === "object") {
        if (typeof value.text === "string") {
          return value.text;
        }
        if (typeof value.message === "string") {
          return value.message;
        }

        try {
          return JSON.stringify(value, null, 2);
        } catch (error) {
          console.warn("Failed to stringify AI message.", error);
          return String(value);
        }
      }

      return String(value);
    };

    if (typeof rawMessage === "string") {
      try {
        const parsed = JSON.parse(rawMessage);
        return toDisplayString(parsed);
      } catch (error) {
        return rawMessage;
      }
    }

    return toDisplayString(rawMessage);
  };

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  function saveFileTree(ft){
    axios.put('/projects/update-file-tree',{
      projectId: project._id,
      fileTree:ft
    }).then(res => {
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      })
  }

  const send = () => {
    if (!user || !user._id) {
      return;
    }
    console.log("Sending message:", message);
    sendMessage("project-message", {
      message,
      sender: user._id,
      senderEmail: user.email,
    });

    setMessages((prev) => [
      ...prev,
      {
        message,
        sender: user._id,
        senderEmail: user.email,
      },
    ]);

    setMessage("");
  };

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }

    recieveMessage("project-message", (data) => {
      const message = JSON.parse(data.message);
      console.log("Received message:", message);
      webContainer?.mount(message.fileTree);
      if (message.fileTree) {
        setFileTree(message.fileTree);
      }
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      removeMessageListener("project-message");
    };
  }, [project._id]);

  useEffect(() => {
    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
      });

    axios
      .get("/users/all")
      .then((res) => {
        console.log(res.data.users);
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log("Selected users:", selectedUsers);
  }, [selectedUsers]);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-4 w-full bg-blue-200 border-b border-gray-400 absolute top-0">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="flex gap-2 items-center p-2"
          >
            <UserRoundPlus size={16} />
            <p className="">Add collaborator</p>
          </button>
          <button
            onClick={() => setIsSlidePanelOpen(!isSidePanelOpen)}
            className="p-2  text-black rounded"
          >
            <UsersRound size={20} strokeWidth={2.5} />
          </button>
        </header>

        <div className="conversation-area flex flex-col flex-grow w-full pt-20 h-full">
          <div className="flex flex-col flex-grow w-full min-h-0">
            <div
              ref={messageBoxRef}
              className="message-box p-2 flex-grow flex flex-col gap-1 overflow-y-auto scrollbar-hide"
            >
              {messages.map((messageObject, index) => {
                const senderLabel = getSenderLabel(messageObject);
                const isAi = messageObject.sender?._id === "ai";
                const isOwn = messageObject.sender === user?._id;

                return (
                  <div
                    key={`${messageObject.sender || "msg"}-${index}`}
                    className={`message max-w-96 flex flex-col p-2 bg-slate-50 w-fit rounded-md ${
                      isOwn ? "ml-auto" : ""
                    }`}
                    gre
                  >
                    <small className="opacity-65 text-xsl">{senderLabel}</small>
                    {isAi ? (
                      <div className="text-sm overflow-auto bg-slate-900 text-white  p-2 rounded">
                        <Markdown
                          options={{
                            overrides: {
                              code: SyntaxHighlightedCode,
                            },
                          }}
                        >
                          {writeAiMessage(messageObject)}
                        </Markdown>
                      </div>
                    ) : (
                      <p className="text-sm">{messageObject.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="inputField w-full flex p-2 bg-slate-100">
            <input
              className="flex-grow p-2 px-4 border rounded outline-none"
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={send}
              className="ml-2 px-4 bg-black text-white rounded"
            >
              <Send />
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"} top-0`}
        >
          <header className="flex justify-between items-center p-2 px-3 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button
              onClick={() => setIsSlidePanelOpen(!isSidePanelOpen)}
              className="p-2"
            >
              close
            </button>
          </header>

          <div className="users flex flex-col gap-2 p-2">
            {project.users &&
              project.users.map((user, index) => {
                return (
                  <div
                    key={user._id || user.id || index}
                    className="user cursor-pointer hover:bg-slate-200 rounded transition flex gap-2 p-2 w-full"
                  >
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center p-2 text-white bg-slate-600">
                      <UserRound />
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                );
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
                      (selected) => (selected.id || selected._id) === userId,
                    );

                    return (
                      <button
                        key={userId}
                        type="button"
                        onClick={() =>
                          setSelectedUsers((prev) =>
                            prev.some(
                              (selected) =>
                                (selected.id || selected._id) === userId,
                            )
                              ? prev.filter(
                                  (selected) =>
                                    (selected.id || selected._id) !== userId,
                                )
                              : [...prev, user],
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

      <section className="right  bg-red-50 flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52 bg-slate-500">
          <div className="file-tree w-full">
            <p className="flex items-center gap-2 border-b border-slate-400 bg-slate-600 px-3 py-2 text-sm font-semibold tracking-wide text-slate-100 shadow-sm">
              <Folder className="size-4 text-slate-200" />
              File Explorer
            </p>
            {Object.keys(fileTree || {}).map((file, index) => (
              <button
                key={file}
                className="tree-element cursor-pointer p-2 px-2 flex items-center gap-2 bg-slate-300 w-full border-b border-slate-500 hover:bg-slate-400"
                onClick={() => {
                  setCurrentFile(file);
                  setOpenedFiles((prev) =>
                    prev.includes(file) ? prev : [...prev, file],
                  );
                }}
              >
                <File className="size-4 " />
                <p className="font-semibold text-md ">{file}</p>
              </button>
            ))}
          </div>
        </div>
        
          <div className="code-editor flex flex-col flex-grow h-full">
            <div className="top flex justify-between w-full">

              <div className="files flex">

              {openedFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`file-tab px-4 py-2  border-b ${currentFile === file ? "border-slate-900 bg-slate-200" : "border-transparent"}`}
                >
                  {file}
                </button>
              ))}
              </div>

              <div className="actions flex gap-2">
                <button
                  onClick={async () => {
                    const installProcess = await webContainer.spawn("npm",[ "install" ])

                    await webContainer.mount(fileTree)
                      installProcess.output.pipeTo(new WritableStream({

                        
                        write(chunk) {
                          console.log(chunk)
                        }
                      })) 

                      if(runProcess) {
                        runProcess.kill()
                      }

                    let tempRunProcess = await webContainer.spawn("npm",[ "start" ])

                    tempRunProcess.output.pipeTo(new WritableStream({
                      write(chunk) {
                        console.log(chunk)
                      }
                    }))

                    setRunProcess(tempRunProcess)

                    webContainer.on('server-ready', (port,url) => {
                      console.log(port,url)
                      setIframeUrl(url)

                    })
                }}
                  className="px-2 bg-slate-300 text-white"
                >
                  run 
                </button>
              </div>


            </div>
            <div className="bottom flex flex-grow">
              {currentFile && fileTree[currentFile]?.file?.contents ? (
                <pre className="hljs w-full h-full overflow-auto bg-slate-900">
                  <code
                    contentEditable
                    suppressContentEditableWarning
                    className="hljs block min-h-full p-4 outline-none text-sm"
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;

                      setFileTree((prev) => ({
                        ...prev,
                        [currentFile]: {
                          ...prev[currentFile],
                          file: {
                            ...(prev[currentFile]?.file || {}),
                            contents: updatedContent,
                          },
                        },
                      }));

                      saveFileTree(ft)

                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        fileTree[currentFile]?.file?.contents || "",
                        { language: "javascript" },
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  />
                </pre>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                  <p>Select a file to edit</p>
                </div>
              )}
            </div>
          </div>

          {iframeUrl && webContainer && 
          (<div className="flex min-w-96 flex-col h-full">
            <div className="adress-bar">
              <input type="text" 
              onChange={(e) => setIframeUrl(e.target.value)}
              value={iframeUrl} className="w-full p-2 bg-slate-200 text-sm" />
            </div>
          <iframe src={iframeUrl} className="w-full h-full" ></iframe>
          </div>)
          }

      </section>
    </main>
  );
};

export default Project;
