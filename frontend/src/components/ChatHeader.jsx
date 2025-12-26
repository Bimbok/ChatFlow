import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <Avatar user={selectedUser} size="size-10" />
            <span 
              className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white dark:border-gray-900 
              ${onlineUsers.includes(selectedUser._id) ? "bg-green-500" : "bg-gray-400"}`}
            />
          </div>

          {/* User info */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
              {selectedUser.fullName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
