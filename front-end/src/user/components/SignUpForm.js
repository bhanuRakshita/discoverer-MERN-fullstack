import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import Input from "../../shared/components/UIElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/UIElements/ImageUpload";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../store/AuthContext";
import "../pages/Auth.css";

const SignUpForm = ({ switchModeHandler }) => {
  const auth = useContext(AuthContext);
  const { sendRequest, errorHandler, isLoading, error } = useHttpClient();

  const inputValues = {
    name: {
      value: "",
      isValid: false,
    },
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
  };
  const [signUpState, signUpHandle] = useForm(inputValues, false);

  const sighupSubmitHandler = async (event) => {
    event.preventDefault();
    //form data automatically sets headers

    try {
      const formData = new FormData();
      formData.append("email", signUpState.inputValues.email.value);
      formData.append("name", signUpState.inputValues.name.value);
      formData.append("password", signUpState.inputValues.password.value);
      formData.append("image", signUpState.inputValues.image.value);

      const responseData = await sendRequest(
        "http://localhost:8080/api/users/signup",
        "POST",
        formData
      );
      console.log(responseData);
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
        <h2>SIGN UP</h2>
        <form onSubmit={sighupSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name"
            onInput={signUpHandle}
            value={signUpState.inputValues.email.value}
          />
          <ImageUpload
            id="image"
            center
            onInput={signUpHandle}
            errorText="Please upload an image"
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={signUpHandle}
            value={signUpState.inputValues.email.value}
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid passwod of atleast 8 characters"
            onInput={signUpHandle}
            value={signUpState.inputValues.password.value}
          />
          <Button type="submit" disabled={!signUpState.formIsValid}>
            SIGN UP
          </Button>
          <Button type="button" inverse onClick={switchModeHandler}>
            SWITCH TO LOGIN
          </Button>
        </form>
      </Card>
    </>
  );
};

export default SignUpForm;
