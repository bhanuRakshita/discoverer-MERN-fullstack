import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const userId = useParams().userId;

  useEffect(() => {
    const sendHttpRequest = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8080/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    sendHttpRequest();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(prev => prev.filter(place => place.id !== deletedPlaceId));
  };

  return (
    <>
    <ErrorModal error={error} onClear={errorHandler} />
    {isLoading && <LoadingSpinner asOverlay />}
    {!isLoading && loadedPlaces &&  <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
    </>
  )
  
};

export default UserPlaces;
