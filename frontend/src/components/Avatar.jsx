import { getInitials } from "../lib/utils";

const Avatar = ({ user, size = "size-12" }) => {
  const hasImage = user.profilePic && user.profilePic.trim() !== "";

  return (
    <div className={`${size} rounded-full flex-shrink-0 overflow-hidden relative border border-base-content/10`}>
      {hasImage ? (
        <img
          src={user.profilePic}
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold select-none">
          {getInitials(user.fullName)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
