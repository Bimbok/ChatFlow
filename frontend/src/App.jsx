import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Send, Users, Circle, X } from "lucide-react";
import "./App.css";

const socket = io("https://one-to-one-chat-app-w59n.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  }, []);

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

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.type === "sent" && msg.to === recipientId) ||
      (msg.type === "received" && msg.from === recipientId),
  );

  const selectedUser = users.find((user) => user.id === recipientId);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="lg:w-full max-w-sm sm:max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Welcome to ChatFlow
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Enter your name to start chatting
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                  placeholder="Your name..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Join Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 lg:w-50 sm:w-80 bg-white border-r border-gray-200 flex flex-col transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="p-4 sm:p-6 bg-gradient-to-r from-violet-500 to-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              ChatFlow
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-white text-sm font-medium truncate">
              {username}
            </p>
            <p className="text-violet-100 text-xs mt-1">
              ID: {myId.substring(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Online Users
              </h3>
              <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                {users.length}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No users online</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setRecipientId(user.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                      user.id === recipientId
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.id === recipientId
                          ? "bg-white/20"
                          : "bg-gradient-to-br from-violet-400 to-purple-500 text-white"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium truncate">{user.name}</p>
                      <div className="flex items-center space-x-1">
                        <Circle
                          className={`w-2 h-2 fill-current ${user.id === recipientId ? "text-green-300" : "text-green-500"}`}
                        />
                        <span
                          className={`text-xs ${user.id === recipientId ? "text-violet-100" : "text-gray-500"}`}
                        >
                          Online
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:ml-80">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-3 text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
          </button>

          {selectedUser ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {selectedUser.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 fill-current text-green-500" />
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-500 text-sm sm:text-base">
                  Select a user to chat
                </h3>
                <p className="text-xs text-gray-400">Choose from the sidebar</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {!recipientId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full mb-4">
                  <Send className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Start a Conversation
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Select a user from the sidebar to begin chatting
                </p>
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full mb-4">
                  <Send className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Send a message to start the conversation
                </p>
              </div>
            </div>
          ) : (
            filteredMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                    msg.type === "sent"
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="break-words text-sm sm:text-base">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-2 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPressMessage}
              placeholder={
                recipientId ? "Type a message..." : "Select a user first..."
              }
              disabled={!recipientId}
              className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={!recipientId || !currentMessage.trim()}
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
