import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";
import Avatar from "./Avatar";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 transition-all duration-200">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-lg hidden lg:block text-gray-900 dark:text-white">Messages</span>
        </div>
        
        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm rounded"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Online Only
            </span>
          </label>
          <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto w-full py-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {showOnlineOnly ? "No online users found" : "No users found"}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-4 flex items-center gap-4
                hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200
                ${selectedUser?._id === user._id ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600" : "border-r-4 border-transparent"}
              `}
            >
              {/* Avatar section */}
              <div className="relative mx-auto lg:mx-0">
                <Avatar user={user} size="size-12" />

                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm"
                  />
                )}
                {user.unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] 
                    rounded-full size-4 flex items-center justify-center lg:hidden"
                  >
                    {user.unreadCount}
                  </span>
                )}
              </div>

              {/* User info (Desktop) - min-w-0 ensures truncation works */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.fullName}
                  </h4>
                  {user.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <p className={`text-xs truncate ${onlineUsers.includes(user._id) ? "text-green-500 font-medium" : "text-gray-500"}`}>
                    {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
