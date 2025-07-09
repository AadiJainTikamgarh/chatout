"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import useSocket from "@/hooks/useSocket";

function page() {
  const [userId, setUserId] = useState("");
  const [OpenChat, setOpenChat] = useState({ id: "", username: "" });
  const [lastMessage, setLastMessage] = useState([]);
  const [ChatList, setChatList] = useState([]);
  const [IsModelOpen, setIsModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [UserList, setUserList] = useState([]);
  const [Messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const socket = useSocket();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("api/me");
        // userId = response.data.userId;
        // console.log("User ID: ", userId);
        return response.data.userId;
      } catch (error) {
        console.log("Failed to fetch user ID: ", error.message);
      }
    };

    fetchUserId().then((id) => (id ? setUserId(id) : setUserId("")));
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get("api/users");
        return response.data?.userList || [];
      } catch (error) {
        console.log("Failed in fetching users : ", error.message);
        return [];
      }
    };

    fetchUserList().then((users) => setUserList(users));
  }, []);

  useEffect(() => {
    if (!socket.current || !OpenChat.id) return;

    socket.current.emit("join-room", OpenChat.id);

    socket.current.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data }]);
    });

    return () => {
      socket.current?.off("receive-message");
    };
  }, [socket, OpenChat.id]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("api/chats");
        setChatList(response.data.chats);
        console.log(ChatList);

        // console.log(response);
      } catch (error) {
        console.log("Failed in fetching chats : ", error.message);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (OpenChat) {
        try {
          const response = await axios.post("api/chat", {
            chatId: OpenChat.id,
          });
          setLastMessage(response.data.PastMessages);
        } catch (error) {
          console.log("Failed in fetching messages : ", error?.message);
        }
      }

      fetchMessages();
    };
  }, [OpenChat]);

  const createChatHandler = async () => {
    if (!selectedUser) {
      alert("Please select a user to chat with");
      return;
    }

    setIsModelOpen(false);

    try {
      const response = await axios.post("api/createChat", {
        chatWith: selectedUser,
      });

      const chat = await axios.get("api/chats?id=" + response.data.chatId);
      setChatList((prevChats) => [...prevChats, chat.data.chats[0]]);
      setOpenChat({
        id: response.data?.chatId,
        username: chat.data?.chats[0]?.otherParticipants[0]?.username,
      });
    } catch (error) {
      console.log(error);
      console.log("Failed to create chat: ", error.message);
      alert("Failed to create chat, please try again later");
    }
  };

  const sendMessage = () => {
    console.log(msg);
    console.log();
    if (msg.trim()) {
      socket.current.emit("send-message", {
        roomId: OpenChat.id,
        message: msg,
        sender: userId,
      });
      setMessages((prev) => [...prev, { message: msg, sender: userId }]);
    }
  };

  const chatComponent = () => {
    return (
      <div className="flex flex-col bg-neutral-900 flex-1">
        {OpenChat.id ? (
          <div className="w-full flex flex-col bg-neutral-900 items-start justify-between relative h-full">
            <div className="flex px-4 py-2 items-center bg-neutral-700 w-full">
              <h1 className="text-2xl font-mono text-neutral-200">
                {OpenChat.username}
              </h1>
            </div>
            <div className="flex-1 flex-col flex justify-end item-end w-full ">
              {Messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className="bg-neutral-700 text-neutral-200 p-2 rounded-lg m-1"
                  >
                    <h1 className="text-2xl px-4 rounded-lg">{msg.message}</h1>
                  </div>
                );
              })}
            </div>
            <div className="flex w-full px-3 py-1 mb-3">
              <input
                type="text"
                className="flex-1 outline-none border-b-2 px-3 text-xl"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />{" "}
              <button
                className="flex items-center justify-center p-2 bg-neutral-700 text-neutral-200 ml-3 rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
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
    <>
      <Modal
        open={IsModelOpen}
        onClose={() => setIsModelOpen(false)}
        className="w-1/4 m-auto h-fit rounded-xl overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center gap-3 bg-neutral-300 p-4">
          <h1 className="text-center text-2xl text-neutral-900">Chat with </h1>
          <select
            className="w-full p-2 rounded-lg bg-neutral-200 text-neutral-900"
            onChange={(e) => setSelectedUser(e.target?.value)}
          >
            <option value="">Select a user</option>
            {UserList.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            className="bg-neutral-500 px-4 py-2 rounded-lg hover:bg-neutral-600"
            onClick={createChatHandler}
          >
            Create Chat
          </button>
        </div>
      </Modal>
      <div className="flex flex-row item-center justify-center flex-1 bg-neutral-900 divide-x-2  m-3 rounded-lg overflow-hidden">
        <div className="flex flex-col w-[25%] outline-none outline-r-2 outline-neutral-500">
          <div className="flex justify-between items-center p-4 bg-neutral-700 text-neutral-200 outline-none outline-b-[1px] outline-neutral-600 mb-2">
            <h1 className="text-2xl font-mono">Chats</h1>
            <button
              className="bg-neutral-500 px-4 py-2 rounded-lg hover:bg-neutral-600"
              onClick={() => setIsModelOpen(true)}
            >
              New Chat
            </button>
          </div>
          {ChatList.map((chat, index) => (
            <div className="flex flex-col gap-3 cursor-pointer" key={chat?._id}>
              <div
                className="flex flex-row items-center justify-between p-3 hover:bg-neutral-700"
                onClick={() =>
                  setOpenChat({
                    id: chat?._id,
                    username: chat?.otherParticipants[0]?.username,
                  })
                }
              >
                <h1 className="text-lg font-mono text-neutral-200">
                  {chat.otherParticipants[0]?.username}
                </h1>
                <p className="text-sm text-neutral-400">
                  {chat?.lastMessage || " "}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex">{chatComponent()}</div>
      </div>
    </>
  );
}

export default page;
