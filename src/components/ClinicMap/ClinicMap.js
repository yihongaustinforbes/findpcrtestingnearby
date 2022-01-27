import React, {useState, useEffect} from 'react';
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow,
    Polyline
  } from "react-google-maps";
import { compose, withProps } from "recompose";
import mapStyles from "../../mapStyles";



function ClinicMap(props) {
  const [showInfo , setShowInfo] = useState(false);
  const centerCoords =props.marker?{lat: props.marker.lat, lng: props.marker.lng}: {lat: 35.68183047265577, lng:139.76724937831762};
  const MyMapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB3P3RbY7UksatT5DcJgFvYlciUsUtM1zw",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `100%` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) =>
    
    <GoogleMap
      defaultZoom={15}
      center={centerCoords}
      defaultOptions={{ styles: mapStyles }}
      
    >
           {props.marker && <Marker 
          position={{lat: props.marker.lat, lng: props.marker.lng}}
          onClick={()=>{ setShowInfo(props.marker);}}
          icon={{
            url: `/health-clinic.png`,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
          />}

     {showInfo && (
     <InfoWindow
        onCloseClick={() => {
          setShowInfo(false);
        }}
        position={{lat: props.marker.lat, lng: props.marker.lng}}
      >
        <div>
      <h2>NAME: {props.markerInfo.NAME}</h2>
      <p>ADDRESS :{props.markerInfo.ADDRESS}</p>
      <p>HOURS :{props.markerInfo.HOURS}</p>
      <p>PCR TEST :{props.markerInfo.PCR}</p>
      <p>ANTI-BODY TEST :{props.markerInfo.ANTIBODY}</p>
        </div>
      </InfoWindow>
   )} 
    </GoogleMap>
  )

  return(
  <>
    

    
     

  
<div style={{ width: "100vw", height: "100vh" }}>
<MyMapComponent marker={props.marker} markerInfo={props.markerInfo}
     
      />
      
</div>

    {/* <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=
        AIzaSyB3P3RbY7UksatT5DcJgFvYlciUsUtM1zw`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div> */}
    </>
  );
}
export default ClinicMap

