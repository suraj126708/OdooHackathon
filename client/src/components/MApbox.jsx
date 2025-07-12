/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { handleError } from "../utils";

const MapboxMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 18.463951730609065,
    longitude: 73.86813972419182,
    zoom: 15,
  });
  const [userLocation, setUserLocation] = useState([]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch(
          "https://coal-mines-backend.onrender.com/workers/location",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserLocation(data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchUserLocation();
  }, []);

  const markers = userLocation
    .map((user) => user.location)
    .filter((location) => location && Object.keys(location).length > 0);

  console.log(markers);

  if (!userLocation.length)
    return (
      <div className="ml-[50%] mt-[50%] font-serif font-semibold text-2xl">
        Loading...
      </div>
    );

  return (
    <Map
      initialViewState={viewport}
      style={{
        width: "90%",
        height: "100vh",
        border: "1px solid black",
        borderRadius: "10px",
        margin: "5%",
        marginTop: "2%",
      }}
      mapStyle="mapbox://styles/mapbox/satellite-v9"
      mapboxAccessToken={
        "pk.eyJ1IjoiYXZpc2hrYXIzMiIsImEiOiJjbTBldnZodjEwcmp5MmxzMTk3NzNzN3BsIn0._c8Gq1mXBlJv_XxGBFd6Rg"
      }
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          latitude={marker.lat}
          longitude={marker.lng}
          color="red"
        />
      ))}
    </Map>
  );
};

export default MapboxMap;

// import { useState, useEffect } from "react";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// const MapboxMap = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           setError(error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );

//       return () => {
//         navigator.geolocation.clearWatch(watchId);
//       };
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const initialViewport = {
//     latitude: userLocation ? userLocation.latitude : 37.7749,
//     longitude: userLocation ? userLocation.longitude : -122.4194,
//     zoom: 14,
//   };

//   return (
//     <div>
//       {error && <p>Error: {error}</p>}
//       {!userLocation && !error && <p>Loading your location...</p>}
//       {userLocation && (
//         <Map
//           initialViewState={initialViewport}
//           style={{ width: "100%", height: "100vh" }}
//           mapStyle="mapbox://styles/mapbox/satellite-v9"
//           mapboxAccessToken={
//             "pk.eyJ1IjoiYXZpc2hrYXIzMiIsImEiOiJjbTBldnZodjEwcmp5MmxzMTk3NzNzN3BsIn0._c8Gq1mXBlJv_XxGBFd6Rg"
//           }
//         >
//           <Marker
//             latitude={userLocation.latitude}
//             longitude={userLocation.longitude}
//             color="blue"
//           />
//         </Map>
//       )}
//     </div>
//   );
// };

// export default MapboxMap;
