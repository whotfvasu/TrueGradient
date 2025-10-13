import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    try {
      await signup(username, password, email.trim() || undefined);
      navigate("/chat");
    } catch (err) {
      console.log("Signin failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Sign Up</h1>
            <p className="text-slate-500 mt-1">
              Create an account to get started
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-slate-700 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                value={username}
                required
                placeholder="Choose a username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 placeholder-slate-500 rounded-xl focus:outline-none shadow-inner border border-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 placeholder-slate-500 rounded-xl focus:outline-none shadow-inner border border-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={password}
                  required
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 placeholder-slate-500 pr-12 rounded-xl focus:outline-none shadow-inner border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={passwordConfirm}
                  placeholder="Confirm your password"
                  required
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  type={showPasswordConfirm ? "text" : "password"}
                  className="w-full px-4 py-2 placeholder-slate-500 pr-12 rounded-xl focus:outline-none shadow-inner border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPasswordConfirm ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                password !== passwordConfirm ||
                !password ||
                !username ||
                password.length < 6 ||
                username.length < 3
              }
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-2xl transition-colors duration-200"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
