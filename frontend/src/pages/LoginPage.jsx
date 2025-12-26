import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900 transition-colors">
                <MessageSquare className="size-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700 dark:text-gray-300">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn btn-primary py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin inline mr-2" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              Don't have an account?{" "}
              <button onClick={() => window.location.href='/signup'} className="link link-primary text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>

       {/* Right Side - Image/Pattern */}
       <div className="hidden lg:flex items-center justify-center bg-primary-50 dark:bg-gray-800 p-12">
        <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome Back!</h2>
            <p className="text-gray-600 dark:text-gray-300">Sign in to continue your conversations and catch up with your friends.</p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
