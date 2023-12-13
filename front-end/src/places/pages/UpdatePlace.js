import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Input from "../../shared/components/UIElements/Input";
import Button from "../../shared/components/UIElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../utils/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../store/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const [identifiedPlace, setIdentifiedPlace] = useState(null);
  const { error, isLoading, sendRequest, errorHandler } = useHttpClient();
  const pid = useParams().pid;
  const history = useHistory();

  const inputValues = {
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
  };
  const [formState, formHandler, setFormData] = useForm(inputValues, false);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {

      const requestBody = JSON.stringify({
        title: formState.inputValues.title.value,
        description: formState.inputValues.description.value,
      });
      const responseData = await sendRequest(
        `http://localhost:8080/api/places/${pid}`,
        "PATCH",
        requestBody,
        { "Content-Type": "application/json", 'Authorization': 'Bearer ' + auth.token }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    (async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/places/${pid}`
        );
        setIdentifiedPlace(responseData.place);

        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: false,
            },
            description: {
              value: responseData.place.description,
              isValid: false,
            },
          },
          true
        );
      } catch (err) {}
    })();
  }, [sendRequest, pid, setFormData]);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find any place</h2>
      </div>
    );
  }

  return (
    <>
    <ErrorModal error={error} onClear={errorHandler} />
    <form className="place-form" onSubmit={formSubmitHandler}>
      {isLoading && <LoadingSpinner /> }
      {!isLoading && identifiedPlace && (
        <>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={formHandler}
            value={identifiedPlace.title}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description of atleast 5 characters"
            onInput={formHandler}
            value={identifiedPlace.description}
            valid={true}
          />
        </>
      )}

      <Button type="submit" disabled={!formState.formIsValid}>
        UPDATE PLACE
      </Button>
    </form>
    </>
  );
};

export default UpdatePlace;
