import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-white dark:bg-gray-950">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-white dark:bg-gray-950">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"}`}
            >
              <div className="flex flex-col max-w-[80%] sm:max-w-[70%]">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full rounded-lg mb-2 shadow-sm"
                  />
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm sm:text-base break-words ${
                    isSentByMe
                      ? "bg-primary-600 text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
                <time className="text-[10px] opacity-50 mt-1 mx-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;