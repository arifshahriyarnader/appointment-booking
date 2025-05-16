import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";
import { appConfig } from "../../common/config";

export const Header = ({ title, showLogoutConfirmation }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const userInitial = userName?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const storedUser = localStorage.getItem(appConfig.CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const user = parsed.user;
        console.log("User from localStorage:", parsed);
        setUserName(user?.name || "");
        setUserAvatar(user?.avatar || undefined);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  return (
    <div>
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">{title}</h2>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center cursor-pointer gap-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-semibold">{userInitial}</span>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
              <div className="px-4 py-2 border-b">{userName}</div>
              <button
                onClick={showLogoutConfirmation}
                className="flex items-center w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <LogOut className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.array,
  showProfileMenu: PropTypes.string,
  showLogoutConfirmation: PropTypes.array,
};
