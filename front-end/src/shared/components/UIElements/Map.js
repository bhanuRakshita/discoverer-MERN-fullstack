import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    (async () => {
      const { Map } = await window.google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      // The map, centered at Uluru
      const map = new Map(mapRef.current, {
        zoom: zoom,
        center: center,
        mapId: 'njn'
      });

      // The marker, positioned at Uluru
      new AdvancedMarkerElement({
        map: map,
        position: center,
      });
    })();
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
