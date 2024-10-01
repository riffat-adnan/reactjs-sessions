import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const { token, manageProfile } = useSelector((state: any) => state?.auth);
  // return token ? <Navigate to="/my-space" /> : children;
  if (token) {
    if (manageProfile) {
      // If manageProfile is true, navigate to family-profile
      return <Navigate to="/settings/parent/family-profile" />;
    } else {
      // If manageProfile is false, navigate to my-space
      return <Navigate to="/my-space" />;
    }
  } else {
    // If token doesn't exist, render children (i.e., allow access)
    return children;
  }
};

export default ProtectedRoute;
