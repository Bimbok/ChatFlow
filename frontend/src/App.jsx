import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Users, Circle, X, Moon, Sun, Menu, ArrowLeft, MessageSquare } from "lucide-react";
import "./App.css";

// Keep the existing socket connection URL
const socket = io("https://one-to-one-chat-app-w59n.onrender.com");

function App() {
  // --- Logic State ---
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // --- UI State ---
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    console.log("Dark mode state:", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    socket.on("your id", (id) => {
      setMyId(id);
    });

    socket.on("update users", (allUsers) => {
      const otherUsers = allUsers.filter((user) => user.id !== socket.id);
      setUsers(otherUsers);
    });

    socket.on("private message", ({ message, from }) => {
      const newMessage = {
        text: message,
        type: "received",
        from: from,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    
    // Cleanup listeners
    return () => {
      socket.off("your id");
      socket.off("update users");
      socket.off("private message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, recipientId]);

  // --- Handlers ---
  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("join server", username);
      setIsLoggedIn(true);
    }
  };

  const handleKeyPressLogin = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !recipientId) {
      return;
    }

    socket.emit("private message", {
      message: currentMessage,
      to: recipientId,
    });

    const newMessage = {
      text: currentMessage,
      type: "sent",
      to: recipientId,
      from: myId,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setCurrentMessage("");
  };

  const handleKeyPressMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.type === "sent" && msg.to === recipientId) ||
      (msg.type === "received" && msg.from === recipientId),
  );

  const selectedUser = users.find((user) => user.id === recipientId);

  // --- Render: Login Screen ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-transform"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to ChatFlow</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Join the conversation with a simple username.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                  placeholder="Enter your username"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transform active:scale-[0.98] transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Main App ---
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      
      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (User List) */}
      <aside 
        className={`fixed md:relative z-30 w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ChatFlow</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Snippet */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{username}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Active Users ({users.length})
            </h3>
            
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Users size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No one else is here.</p>
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setRecipientId(user.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    recipientId === user.id
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      recipientId === user.id 
                        ? "bg-primary-100 dark:bg-primary-800" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs opacity-70 truncate">Click to chat</p>
                  </div>
                </button>
              ))
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
             <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        {recipientId ? (
          <>
            {/* Chat Header */}
            <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setRecipientId("")}
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                
                {selectedUser && (
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white leading-tight">
                        {selectedUser.name}
                      </h2>
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <Users size={20} />
                </button>
              </div>
            </header>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
                  <p className="text-sm text-gray-400">Say hello to start the conversation!</p>
                </div>
              ) : (
                filteredMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex w-full ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base break-words ${
                        msg.type === "sent"
                          ? "bg-primary-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="max-w-4xl mx-auto flex items-end space-x-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-transparent focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPressMessage}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32 resize-none"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl shadow-md transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State (No user selected) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-950">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="w-32 h-32 bg-gradient-to-tr from-primary-100 to-purple-100 dark:from-gray-800 dark:to-gray-800 rounded-full flex items-center justify-center mb-8 animate-pulse-slow">
              <MessageSquare size={48} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome, {username}!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              Select a user from the sidebar to start a private conversation.
            </p>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              View Users
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
