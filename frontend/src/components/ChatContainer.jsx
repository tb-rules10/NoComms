import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import FileTransfer from "./FileTransfer";
import { MdFileDownload } from "react-icons/md";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import {ToastContainer, toast} from 'react-toastify';
import { sendMessageRoute, recieveMessageRoute, uploadFileRoute, downloadLinkRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    // theme: "dark",
  };

  useEffect(() => {
    async function setData() {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
    setData();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const handleSendMsg = async (msg , isFile=false, title=null ) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, isFile: isFile, title: title, message: msg });
    setMessages(msgs);
  };

  // const handleFileTransfer = (showSharePanel) => {
  //   setShowSharePanel(showSharePanel);
  // };

  const handleSendFile = async (files) => {
    for(let file of files) {
      const formData = new FormData();
      var title = file.name;
      formData.append('file', file);
      formData.append('title', title);
      try{
        const response = await axios.post(uploadFileRoute, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        });
        // console.log(response.data);
        console.log(`${downloadLinkRoute}/${response.data.id}`)
        const downloadLink =`${downloadLinkRoute}/${response.data.id}`;
        // var template = `Send your a file :- ${title.link(downloadLink)}`;
        handleSendMsg(downloadLink, true, title);

        // console.log(downloadLink);
      }
      catch(err){
        toast.error(
          "File size cannot exceed 10 MB",
          toastOptions
        );
      }
    };
  }

  return (
    <>
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <div className="actions">
          {/* <Video />
          .actions{
            display: flex;
            justify-content: space-between;
            width: 6rem;
          } */}
          <Logout />
        </div>
      </div>
      {showSharePanel ? (
                <FileTransfer />
            ) : (
              <div className="chat-messages">
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div className={`message ${message.fromSelf ? "sended" : "recieved"}`} >
                      <div className="content ">
                        {message.isFile ? (
                          <p>
                            Sent you a file :-
                              <a href= {message.message} >
                                <div className="download">
                                  <p>{message.title}</p>
                                  <p>&nbsp;</p>
                                  <MdFileDownload/>
                                </div>
                              </a>
                          </p>
                          ) : (
                          <p>
                            {message.message}
                          </p> )
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
      <ChatInput handleSendMsg={handleSendMsg} handleSendFile={handleSendFile} />
    </Container>
    <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 12% 76% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: solid;
    background-color: #ffffff39;                        /* change needed  */
    .user-details {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.3rem;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 48%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        a{
          text-decoration: none;

          .download{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background-color: #3B374E;
            padding: 0.3rem;
            border-radius: 30;
            p{
              color: white;
            }
            svg {
              font-size: 1.5rem;
              color: white;
            }
          }
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;