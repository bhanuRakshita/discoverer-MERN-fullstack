import React, { useState } from "react";

import LoginInForm from "../components/LoginInForm";
import SignUpForm from "../components/SignUpForm";
import "./Auth.css";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchModeHandler = () => {
    setIsLoginMode((prev)=>!prev);
  };

  if (isLoginMode) {
    return <LoginInForm switchModeHandler={switchModeHandler} />;
  }

  return (
    <SignUpForm switchModeHandler={switchModeHandler}/>
  );
};

export default Auth;
