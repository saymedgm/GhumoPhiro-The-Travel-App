import React, { useContext } from "react";
import { useHistory } from "react-router";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./NewPlace.css";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
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
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form">
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter valid title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          errorText="Please enter valid title"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          errorText="Please enter valid address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
          onClick={placeSubmitHandler}
        >
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
