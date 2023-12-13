import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import "./PlaceItem.css";
import { AuthContext } from "../../store/AuthContext";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowDeleteModal(true);
  const cancelDeleteHandler = () => setShowDeleteModal(false);

  const confirmDeletHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(
        `http://localhost:8080/api/places/${props.id}`,
        "DELETE",
        null,
        {'Authorization': 'Bearer '+auth.token}
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showDeleteModal}
        header="Delete Place"
        onCancel={cancelDeleteHandler}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button onClick={cancelDeleteHandler}>Cancel</Button>
            <Button onClick={confirmDeletHandler}>Delete</Button>
          </>
        }
      >
        <p>Are you sure? Once deleted, it cannot be undone!!!</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner />}
          <div className="place-item__image">
            <img src={`http://localhost:8080/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.userId === props.creatorId && (
              <>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
