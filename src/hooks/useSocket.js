// hooks/useSocket.js
"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const socket = useRef();

  useEffect(() => {
    socket.current = io();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
