import React, {useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import Input from "../../shared/components/UIElements/Input";

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../store/AuthContext";
import "../pages/Auth.css";
import Auth from "../pages/Auth";


const SignUpForm = ({ switchModeHandler }) => {

  const auth = useContext(AuthContext);

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
  };
  const [signUpState, signUpHandle] = useForm(inputValues, false);

  const sighupSubmitHandler = (event) => {
    event.preventDefault();
    auth.login();
    console.log("Signed Up!");
    console.log(signUpState);
  };

  return (
    <Card className="authentication">
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
        <Button type="submit" disabled={!signUpState.formIsValid}>SIGN UP</Button>
        <Button type="button" inverse onClick={switchModeHandler}>
          SWITCH TO LOGIN
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm;
