import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "FORM_INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputValues) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.formIsValid;
        } else {
          formIsValid = formIsValid && state.inputValues[inputId].isValid;
        }
      }
      return {
        ...state,
        inputValues: {
          ...state.inputValues,
          [action.inputId]: {
            value: action.value,
            isValid: action.formIsValid,
          },
        },
        formIsValid: formIsValid,
      };

    case "SET_DATA":
      return {
        inputValues: action.inputs,
        formIsValid: action.formIsValid,
      };

    default:
      return state;
  }
};

export const useForm = (inputs, isValid) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputValues: inputs,
    formIsValid: isValid,
  });

  const formHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "FORM_INPUT_CHANGE",
      value: value,
      formIsValid: isValid,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
        type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, formHandler, setFormData];
};
