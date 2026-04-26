import React, { useState ,useContext } from "react";
import { Link ,useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { UserContext } from "../context/user.context";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axiosInstance.post('/users/register', { email, password })
      .then(res => {
        console.log("Registration successful:", res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate('/home');
      })
      .catch(err => {
        const data = err.response?.data;
        if (data?.errors?.length) {
          setError(data.errors.map(e => e.msg).join(", "));
        } else {
          setError(data?.error || "Registration failed. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] relative">

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#120c05] via-black to-[#0b0b0b]"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-3">
            CoLab<span className="text-amber-400">IDE</span>
          </h1>
          <p className="text-gray-400 text-lg">Join the community</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] text-black text-lg font-semibold rounded-2xl transition shadow-lg shadow-amber-500/30"
            >
              Create Account
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-amber-400 hover:text-orange-400 font-medium transition"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
