import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Simple icon components
const SendIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const XIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

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
        timestamp: new Date().toLocaleTimeString(),
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
      timestamp: new Date().toLocaleTimeString(),
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
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                <UsersIcon />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to the Chat
              </h1>
              <p className="text-secondary">
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
                  className="w-full px-4 py-3 bg-base-200 border-2 border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } md:w-80 bg-white border-r border-base-200 flex flex-col transition-all duration-300 absolute md:relative z-20 h-full overflow-hidden`}
      >
        <div className="p-6 bg-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Chat</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <XIcon />
            </button>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-white text-sm font-medium truncate">
              {username}
            </p>
            <p className="text-blue-100 text-xs mt-1">
              ID: {myId.substring(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">
                Online Users
              </h3>
              <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                {users.length}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 text-gray-300 mx-auto mb-2">
                  <UsersIcon />
                </div>
                <p className="text-secondary text-sm">No users online</p>
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
                        ? "bg-primary text-white shadow-lg"
                        : "bg-base-200 hover:bg-base-300 text-gray-800"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        user.id === recipientId
                          ? "bg-white/20"
                          : "bg-primary text-white"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium truncate">{user.name}</p>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.id === recipientId
                              ? "bg-green-300"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <span
                          className={`text-xs ${
                            user.id === recipientId
                              ? "text-blue-100"
                              : "text-secondary"
                          }`}
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-base-200 px-4 md:px-6 py-4 flex items-center shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-3 text-secondary hover:bg-base-200 p-2 rounded-lg transition-colors"
          >
            <MenuIcon />
          </button>

          {selectedUser ? (
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {selectedUser.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-secondary">Online</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center flex-shrink-0">
                <UsersIcon />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-secondary truncate">
                  Select a user to chat
                </h3>
                <p className="text-xs text-gray-400">Choose from the sidebar</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-base-100">
          {!recipientId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                  <SendIcon />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Start a Conversation
                </h3>
                <p className="text-secondary">
                  Select a user from the sidebar to begin chatting
                </p>
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                  <SendIcon />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No messages yet
                </h3>
                <p className="text-secondary">
                  Send a message to start the conversation
                </p>
              </div>
            </div>
          ) : (
            filteredMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "sent" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                    msg.type === "sent"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-base-200"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                  <p className="text-xs text-right mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-base-200 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPressMessage}
              placeholder={
                recipientId ? "Type a message..." : "Select a user first..."
              }
              disabled={!recipientId}
              className="flex-1 px-4 py-3 bg-base-200 border-2 border-base-300 rounded-xl focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!recipientId || !currentMessage.trim()}
              className="bg-primary text-white p-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      <style>{`
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
