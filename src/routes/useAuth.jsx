import { useSelector } from "react-redux";

export const useAuth = () => {
    const { isAuthenticated, flag } = useSelector((state) => state.UserPanel);
    return { isAuthenticated, flag };
};
