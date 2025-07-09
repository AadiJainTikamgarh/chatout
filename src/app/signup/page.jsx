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
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    if (creadentials.password !== confirmPassword) {
      toast.error("Passwords do not match");
      setisLoading(false);
      return;
    }

    try {
      if (!creadentials.username || !creadentials.password) {
        toast("Username and Password are required", { icon: "❗" });
        setisLoading(false);
        return;
      }

      await axios.post("api/signup", creadentials);

      toast.success("User Registered Successfully");
      router.push("/login");
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

  const LoginForm = () => {
    router.push("/login");
    setcredentials({ username: "", password: "" });
  };

  return (
    <>
      <Toaster />
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-slate-900 text-neutral-100">
        <h1 className="text-center font-bold text-2xl">Create your account</h1>
        <div className="flex flex-col items-start justify-start w-100">
          <label
            htmlFor="username"
            className=" text-slate-200 text-sm px-1"
          >
            Username{" "}
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="outline-none p-2 rounded-lg px-4 w-full bg-slate-300/20 placeholder:text-slate-300 placeholder:text-sm"
            value={creadentials.username}
            onChange={(e) =>
              setcredentials((data) => ({ ...data, username: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col items-start justify-start w-100">
          <label htmlFor="username" className=" text-slate-200 text-sm px-1">
            Password{" "}
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="outline-none p-2 rounded-lg px-4 w-full bg-slate-300/20 placeholder:text-slate-300 placeholder:text-sm"
            value={creadentials.password}
            onChange={(e) =>
              setcredentials((data) => ({ ...data, password: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col items-start justify-start w-100">
          <label htmlFor="username" className="text-slate-200 text-sm px-1">
            Confirm password{" "}
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="outline-none p-2 rounded-lg px-4 w-full bg-slate-300/20 placeholder:text-slate-300 placeholder:text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="text-white font-bold w-100 p-2 bg-blue-600 rounded-lg"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <p className="text-[12px] text-neutral-300">
          Already have an Account ?{" "}
          <button onClick={LoginForm} className="underline">
            Login
          </button>
        </p>
      </div>
    </>
  );
}

export default page;
