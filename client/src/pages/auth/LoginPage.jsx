import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import XSvg from "../../components/svgs/X";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const {
    mutate: handleLogin,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw error.message;
      }
    },
    onSuccess: () => {
      setFormData({
        username: "",
        password: "",
      });
      toast.success("Login Successful");
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-5">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white whitespace-nowrap">
            Welcome Back!
          </h1>

          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 w-full">
              <MdPassword />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>
          </div>

          <button
            disabled={isPending}
            className="btn rounded-full btn-primary text-white disabled:bg-primary disabled:text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && (
              <TbLoader2 className="text-xl text-white animate-spin mt-1" />
            )}
            {isPending ? "Loading..." : "Sign In"}
          </button>
          {isError && <p className="text-red-500">{error}</p>}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Don&apos;t have an account?</p>
          <Link to="/auth/register">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
