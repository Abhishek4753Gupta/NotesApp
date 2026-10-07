import  { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../Components/NavBar.jsx";
import api from '../lib/axios'
import toast from 'react-hot-toast';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { setToken } = useContext(AuthContext);

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("notesToken", response.data.token);
      //console.log(data);
      setToken(response.data.token);
      nav("/", { replace: true });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <>
    <Navbar/>
    {/* <div className="flex min-h-[calc(100vh-64px)] items-center justify-center"> */}
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Login
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-md bg-slate-900 text-slate-50 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-slate-900 dark:text-slate-100 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
    {/* </div> */}
    </>
  );
}
