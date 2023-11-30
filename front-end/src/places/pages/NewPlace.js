import React from "react";

import Input from "../../shared/components/UIElements/Input";
import Button from "../../shared/components/UIElements/Button"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../utils/validators";
import {useForm} from "../../shared/hooks/form-hook";

import "./NewPlace.css";

const NewPlace = () => {

  const inputValues = {
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
  };

  const formIsValid = false;

  const [formState, formHandler] = useForm(inputValues, formIsValid);
  
  
  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputValues)
  }

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
      id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={formHandler}
      />
      <Input
      id="description"
        element="textarea"
    
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description of atleast 5 characters"
        onInput={formHandler}
      />
      <Input
      id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address"
        onInput={formHandler}
      />
      <Button type="submit" disabled={!formState.formIsValid}>
        ADD PLACE
        </Button>
    </form>
  );
};

export default NewPlace;
