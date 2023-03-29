import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import FileTransfer from "./FileTransfer";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showSharePanel, setShowSharePanel] = useState(false);

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

  
  const handleSendMsg = async (msg) => {
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
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // const handleFileTransfer = (showSharePanel) => {
  //   setShowSharePanel(showSharePanel);
  // };

  const handleSendFile = async (files) => {
    console.log(files);
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    
  };

  return (
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
                        <p>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
      <ChatInput handleSendMsg={handleSendMsg} handleSendFile={handleSendFile} />
    </Container>
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
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
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