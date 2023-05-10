import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw Error("AuthContext is null!");
  }
  return context;
};