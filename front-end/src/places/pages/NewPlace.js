import React, { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Input from "../../shared/components/UIElements/Input";
import Button from "../../shared/components/UIElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/UIElements/ImageUpload";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../store/AuthContext";

import "./NewPlace.css";

const NewPlace = () => {
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const auth = useContext(AuthContext);

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
    image: {
      value: null,
      isValid: false
    }
  };

  const history = useHistory();

  const formIsValid = false;

  const [formState, formHandler] = useForm(inputValues, formIsValid);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', formState.inputValues.title.value);
    formData.append('description', formState.inputValues.description.value);
    formData.append('address', formState.inputValues.address.value);
    formData.append('image', formState.inputValues.image.value);

    try {
      const responseData = await sendRequest(
        "http://localhost:8080/api/places",
        "POST",
        formData,
        {'Authorization': 'Bearer '+auth.token }
      );
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner />}
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
        <ImageUpload
          id="image"
          onInput={formHandler}
          errorText="Please upload an image"
        />
        <Button type="submit" disabled={!formState.formIsValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
