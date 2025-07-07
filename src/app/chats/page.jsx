"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

function page() {
  const [OpenChat, setOpenChat] = useState("");
  const [lastMessage, setLastMessage] = useState([]);
  const [ChatList, setChatList] = useState([]);



  useEffect(() => {
    const fetchChats = async () => {
        try {
            const response = await axios.get("api/chats");
            setChatList(response.data.chats);

            console.log(response);

        } catch (error) {
            console.log("Failed in fetching chats : ", error.message);
        }
    }

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (OpenChat) {
        try {
          const response = await axios.post("api/chat", {chatId: OpenChat})
          setLastMessage(response.data.PastMessages);

        } catch (error) {
          console.log("Failed in fetching messages : ", error?.message);
        }
      }
    }


  }, [OpenChat]);

  const chatComponent = () => { 
    return (
      <div className="flex flex-col bg-neutral-900 flex-1">
        {OpenChat ? (
          <div className="w-full flex flex-col bg-neutral-900 items-start justify-between relative h-full">
            <div className="flex px-4 py-2 items-center bg-neutral-7    00 w-full">
              <h1 className="text-2xl font-mono text-neutral-200">
                {OpenChat}
              </h1>
            </div>
            <div className="flex-1 flex justify-end items-center w-full ">
              {lastMessage.map((msg) => {
                return (
                  <div
                    key={msg._id}
                    className="bg-neutral-700 text-neutral-200 p-2 rounded-lg m-1"
                  >
                    <p>{msg.content}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex w-full px-3 py-1 mb-3">
                <input type="text"  className="flex-1 outline-none border-b-2 px-3 text-xl"/> <button className="flex items-center justify-center p-2 bg-neutral-700 text-neutral-200 ml-3 rounded-lg">Send</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-2xl text-neutral-600">
              Open any chat to start messaging
            </h1>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-row item-center justify-center flex-1 bg-neutral-900 divide-x-2  m-3 rounded-lg overflow-hidden">
      <div className="flex flex-col w-[25%] outline-none outline-r-2 outline-neutral-500">
        <div className="flex justify-between items-center p-4 bg-neutral-700 text-neutral-200 outline-none outline-b-[1px] outline-neutral-600 mb-2">
          <h1 className="text-2xl font-mono">Chats</h1>
          <button className="bg-neutral-500 px-4 py-2 rounded-lg hover:bg-neutral-600">
            New Chat
          </button>
        </div>
        {ChatList.map((chat, index) => (
          <div className="flex flex-col gap-3 cursor-pointer" key={chat?._id}>
            <div
              className="flex flex-row items-center justify-between p-3 hover:bg-neutral-700"
              onClick={() => setOpenChat(chat?._id)}
            >
              <h1 className="text-lg font-mono text-neutral-200">
                {chat.otherParticipants[0]?.username}
              </h1>
              <p className="text-sm text-neutral-400">{chat?.lastMessage || " "}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex">{chatComponent()}</div>
    </div>
  );
    }

export default page;
