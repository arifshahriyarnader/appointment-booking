import PropTypes from "prop-types";

export const Header = ({ title, showLogoutConfirmation }) => {
  return (
    <div>
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={showLogoutConfirmation}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer"
        >
          Logout
        </button>
      </header>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.array,
  showLogoutConfirmation: PropTypes.array,
};
