"use clent";

import { ReactNode } from "react";

interface LoginProps {
  userName: string;
  googleLogin: () => void;
  logout: () => void;

  children: ReactNode;
}
const Login = ({ children, userName, googleLogin, logout }: LoginProps) => {
  return (
    <button
      onClick={userName ? logout : googleLogin}
      className="border-solid border-2 rounded p-2 border-sky-500  text-sky-400/100"
    >
      {children}
    </button>
  );
};

export default Login;
