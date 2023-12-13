import React, { useContext } from "react";

import "../pages/Auth.css";

import Input from "../../shared/components/UIElements/Input";
import Button from "../../shared/components/UIElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from "../../utils/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../store/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const LoginInForm = ({ switchModeHandler }) => {
  const auth = useContext(AuthContext);

  const inputValues = {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  };
  const [loginState, loginHandler] = useForm(inputValues, false);
  const { sendRequest, errorHandler, isLoading, error } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:8080/api/users/login",
        "POST",
        JSON.stringify({
          email: loginState.inputValues.email.value,
          password: loginState.inputValues.password.value,
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>

        <form onSubmit={authSubmitHandler}>
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={loginHandler}
            value={loginState.inputValues.email.value}
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid passwod of atleast 8 characters"
            onInput={loginHandler}
            value={loginState.inputValues.password.value}
          />
          <Button type="submit" disabled={!loginState.formIsValid}>
            LOGIN
          </Button>
          <Button type="button" inverse onClick={switchModeHandler}>
            SWITCH TO SIGN UP
          </Button>
        </form>
      </Card>
    </>
  );
};

export default LoginInForm;
