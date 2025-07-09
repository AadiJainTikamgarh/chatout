"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

function page() {
  const [creadentials, setcredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      if (!creadentials.username || !creadentials.password) {
        toast("Username and Password are required", { icon: "❗" });
        setisLoading(false);
        return;
      }

      await axios.post("api/login", creadentials);

      toast.success("User Login Successfully");
      router.push("/chats");
      setisLoading(false);
    } catch (error) {
      if (error.response.status) {
        toast.error(error.response.data.message);
        return;
      }
      console.log("Something went wrong : ", error.message);
      toast.error(error.message);
      return;
    }
  };

  const SignupForm = () => {
    router.push("/signup");
    setcredentials({ username: "", password: "" });
  };

  return (
    <>
      <Toaster />
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-slate-900 text-neutral-100">
        <h1 className="text-center font-bold text-2xl">Welcome Back</h1>
        <input
          type="text"
          placeholder="username"
          className="outline-none p-2 rounded-lg px-4 w-100 bg-slate-300/20 placeholder:text-slate-300"
          value={creadentials.username}
          onChange={(e) =>
            setcredentials((data) => ({ ...data, username: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="password"
          className="outline-none p-2 rounded-lg px-4 w-100 bg-slate-300/20 placeholder:text-slate-300"
          value={creadentials.password}
          onChange={(e) =>
            setcredentials((data) => ({ ...data, password: e.target.value }))
          }
        />
        <button
          className="text-white font-bold w-100 p-2 bg-blue-600 rounded-lg"
          onClick={handleSubmit}
        >
          Login
        </button>
        <p className="text-[12px] text-neutral-300">
          Don't Have an Account ?{" "}
          <button onClick={SignupForm} className="underline">
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}

export default page;
