import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = (props) => {
  const mapStyles = {
    height: "33vh",
    width: "100%",
    display: "flex",
  };

  const defaultCenter = {
    lat: 26.92207,
    lng: 75.778885,
  };

  return (
    <div className="map">
      <LoadScript googleMapsApiKey="https://maps.googleapis.com/maps/api/staticmap?center=40.714%2c%20-73.998&zoom=12&size=400x400&key=AIzaSyCKYJSZCOi4FsCoD074hUbVnU0_8A9zP0U">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
          <Marker position={props.position}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
