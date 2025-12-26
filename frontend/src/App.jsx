import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
// import SettingsPage from "./pages/SettingsPage"; // Future
// import ProfilePage from "./pages/ProfilePage"; // Future

import "./App.css";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ onlineUsers });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      {/* Navbar could go here */}

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
        {/* <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} /> */}
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
