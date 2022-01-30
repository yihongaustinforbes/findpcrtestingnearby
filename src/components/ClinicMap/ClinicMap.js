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
  const [selectedPark, setSelectedPark] = useState(null);
  const [position, setPosition] = useState(null);
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

      {/* map markers from specific group */}
      {props.clinicData &&(props.clinicData.features.map(clinic => (
        //  latlng = new window.google.maps.LatLng(Number(clinic.LOCATION.split(',')[0]),  Number(clinic.LOCATION.split(',')[1]));
        <Marker
          key={clinic.NAME}
          position={{
            lat: Number(clinic.LOCATION.split(',')[0]), lng: Number(clinic.LOCATION.split(',')[1])
          }}
          onClick={()=>{ setPosition(clinic)}}
          icon={{
            url: `/health-clinic.png`,
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      )))}
           {props.marker && <Marker 
          position={{lat: props.marker.lat, lng: props.marker.lng}}
          onClick={()=>{ setSelectedPark(props.marker);}}
          icon={{
            url: `/health-clinic.png`,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
          />}

     {selectedPark && (
     <InfoWindow
        onCloseClick={() => {
          setSelectedPark(null);
        }}
        position={{lat: selectedPark.lat, lng: selectedPark.lng}}
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
   {position && (
     <InfoWindow
        onCloseClick={() => {
          setPosition(null);
        }}
        position={{lat: Number(position.LOCATION.split(',')[0]), lng: Number(position.LOCATION.split(',')[1])}}
      >
        <div>
      <h2>NAME: {position.NAME}</h2>
      <p>ADDRESS :{position.ADDRESS}</p>
      <p>HOURS :{position.HOURS}</p>
      <p>PCR TEST :{position.PCR}</p>
      <p>ANTI-BODY TEST :{position.ANTIBODY}</p>
        </div>
      </InfoWindow>
   )} 
    </GoogleMap>
  )

  return(
  <>
    

    
     

  
<div style={{ width: "100vw", height: "100vh" }} id='map'>
<MyMapComponent marker={props.marker} markerInfo={props.markerInfo} clinicData={props.clinicData} />
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

