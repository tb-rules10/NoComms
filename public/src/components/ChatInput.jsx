import React, { useState, useRef} from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { FiShare } from "react-icons/fi";
import { BsChatLeftDots } from "react-icons/bs";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg, handleSendFile }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const [showSharePanel, setShowSharePanel] = useState(true);
  const fileInputField = useRef(null);
  const fileInputSubmit = useRef(null);
  const [files, setFile] = useState();

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  // const handleSharePanelhideShow = () => {
  //   setShowSharePanel(!showSharePanel);
  //   handleFileTransfer(showSharePanel);
  // };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (files.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const handleFileSelect = (event) => {
    fileInputField.current.click();
  };

  const handleFileChange = async (event) => {
    await setFile(Array.from(event.target.files));
    fileInputSubmit.current.click();
  };

  const sendFile = (event) => {
    event.preventDefault();
    if (files.length > 0) {
      handleSendFile(files);
      setFile([]);
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <div className="share">
        {/* { showSharePanel ?
          (< FiShare onClick={handleSharePanelhideShow} />) :
          (< BsChatLeftDots className="chatIcon" onClick={handleSharePanelhideShow} />) 
        } */}
        <FiShare onClick={handleFileSelect}/>
        <form onSubmit={sendFile}>
          <input type="file" id="inputfile" multiple="multiple" onChange={handleFileChange} ref={fileInputField} />
          <button type="submit"  ref={fileInputSubmit}>Submit</button>
        </form>
      </div>

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => {setMsg(e.target.value)}}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}


const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 6% 6% 88%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .share {
    form #inputfile, button{
      display: none;
    }
    .chatIcon{
      font-size: 1.2rem;
      margin-top: 0.3rem;
    }
    svg {
      font-size: 1.5rem;
      color: grey;
      cursor: pointer;
    }
    svg:hover { 
      color: #ffff00c8; 
    }
    svg:active { 
      color: #ffff00c8; 
    }
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;