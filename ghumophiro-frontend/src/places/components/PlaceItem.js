import React, { useState, useContext } from "react";
import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, error, sendRequest, clearError] = useHttpClient();

  const openMap = () => {
    setShowMap(true);
  };
  const closeMap = () => {
    setShowMap(false);
  };
  // console.log(props.coordinates);

  const showDeleteWarning = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteWarning = () => {
    setShowConfirmModal(false);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMap}
        header={props.address}
        contentClass="place-item-modal-content"
        footerClass="place-item-modal-actions"
        footer={<Button onClick={closeMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map position={props.coordinates}></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarning}
        header="Are you sure"
        footerClass="place-item-modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteWarning}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDelete}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do You really want to delete this place ? Please note this can't be
          undone
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item-content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item-image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            ></img>
          </div>
          <div className="place-item-info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item-actions">
            <Button inverse onClick={openMap}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarning}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
