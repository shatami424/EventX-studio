import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "../store/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const login = (user, token) => {
    dispatch(setCredentials({ user, token }));
    localStorage.setItem("eventx_user", JSON.stringify(user));
    localStorage.setItem("eventx_token", token);
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("eventx_user");
    localStorage.removeItem("eventx_token");
  };

  return {
    user,
    token,
    login,
    logout: logoutUser,
  };
}
