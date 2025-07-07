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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 w-full">
      <Toaster />
      <div className="flex flex-col item-center justify-center gap-3 p-4 rounded-2xl shadow-lg shadow-neutral-500 bg-neutral-200 min-w-[30%]">
        <h1 className="text-neutral-900 font-mono text-2xl text-center">
          Register
        </h1>
        <h1 className="text-neutral-900 font-mono text-lg text-center">
          Username :
          <span>
            <input
              type="text"
              className="ml-2 outline-0 border-b-2 pl-2"
              value={creadentials.username}
              onChange={(e) =>
                setcredentials((data) => ({
                  ...data,
                  username: e.target.value,
                }))
              }
            />
          </span>
        </h1>
        <h1 className="text-neutral-900 font-mono text-lg text-center">
          Password :
          <span>
            <input
              type="text"
              className="ml-2 outline-0 border-b-2 pl-2"
              value={creadentials.password}
              onChange={(e) =>
                setcredentials((data) => ({
                  ...data,
                  password: e.target.value,
                }))
              }
            />
          </span>
        </h1>

        <button
          className="bg-green-400 rounded-lg text-black font-mono px-3 py-2 w-fit self-center"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <h1 className="text-center font-mono  text-black">
          Already have account ?{" "}
          <button
            className="text-blue-500 underline outline-none"
            onClick={LoginForm}
          >
            Login
          </button>
        </h1>
      </div>
    </div>
  );
}

export default page;
