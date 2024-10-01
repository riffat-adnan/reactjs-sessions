import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const { token } = useSelector((state: any) => state.auth);
  return token ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
