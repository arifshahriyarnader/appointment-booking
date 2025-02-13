import { useNavigate } from "react-router-dom";
import { authServices } from "../auth";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function SecureRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authServices.isUserLoggedIn()) {
      return navigate("/login");
    }
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: "45%" }} // Use JSX object syntax for inline styles
        ></div>
      </div>
    );
  }

  return children;
}

SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
