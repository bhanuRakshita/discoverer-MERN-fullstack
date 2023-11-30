import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/UIElements/Input";
import Button from "../../shared/components/UIElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../utils/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous sky scrapers in the world!",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
  const pid = useParams().pid;

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

  const formSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputValues);
  };

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === pid);

  useEffect(() => {
    if (identifiedPlace) {
    setFormData(
      {
        title: {
          value: identifiedPlace.title,
          isValid: false,
        },
        description: {
          value: identifiedPlace.description,
          isValid: false,
        },
      },
      true
    );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find any place</h2>
      </div>
    );
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <form className="place-form" onSubmit={formSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={formHandler}
        value={formState.inputValues.title.value}
        valid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description of atleast 5 characters"
        onInput={formHandler}
        value={formState.inputValues.description.value}
        valid={true}
      />
      <Button type="submit" disabled={!formState.formIsValid}>
        UPDATE PLACE
      </Button>
    </form>
    
  );
};

export default UpdatePlace;
