import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from "react-google-maps";
import * as parkData from "./data/pearllady-location.json";
import * as gongchaData from "./data/gongcha-location.json";
import mapStyles from "./mapStyles";
import axios from "axios";

function Map() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [closestGongcha,setClosestGongcha] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 35.689487, lng: 139.691711 }}
      defaultOptions={{ styles: mapStyles }}
    >
      {parkData.features.map(park => (
        
        <Marker
          key={park.properties.PARK_ID}
          position={{
            lat: park.geometry.coordinates[0],
            lng: park.geometry.coordinates[1]
          }}
          onClick={(e) => {
            setSelectedPark(park);

            setClosestPark(park.geometry.coordinates[0],park.geometry.coordinates[1]);
            let index = sessionStorage.getItem("closest-index");
            setClosestGongcha(gongchaData.features[index]);
            // drawLineToGongcha();
          }}
          icon={{
            url: `/bubbletea.svg`,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
        />
      ))}
      

      {selectedPark && closestGongcha && (
        
        <Polyline 
        path={[ 
          {lat:selectedPark.geometry.coordinates[0], lng:selectedPark.geometry.coordinates[1]},
          {lat:closestGongcha.geometry.coordinates[0], lng:closestGongcha.geometry.coordinates[1]},
        ] } 
        options={{ 
        strokeColor: '#F34F2C',
        strokeOpacity: 1,
        strokeWeight: 2,
        
      }}
      />
      )}
      {closestGongcha && (
        <Marker
          // key={park.properties.PARK_ID}
          position={{
            lat: closestGongcha.geometry.coordinates[0],
            lng: closestGongcha.geometry.coordinates[1]
          }}
          onClick={() => {
            setShowInfo(true);
          }}
          icon={{
            url: `/gongchalogo.png`,
            scaledSize: new window.google.maps.Size(50, 50)
          }}
        />
        
      )}
      {showInfo && (
       <InfoWindow
          onCloseClick={() => {
            // setClosestGongcha(null);
            setShowInfo(false);
          }}
          position={{
            lat: closestGongcha.geometry.coordinates[0],
            lng: closestGongcha.geometry.coordinates[1]
          }}
        >
          <div>
            <h2>{closestGongcha.properties.NAME}</h2>
            <p>density :{closestGongcha.properties.DENSITY}</p>
            <p>popularity :{closestGongcha.properties.POPULARITY}</p>
            <p>demographic :{closestGongcha.properties.DEMOGRAPHIC}</p>
          </div>
        </InfoWindow>
      )}
       
        
      )
      
    </GoogleMap>

  );
  function setClosestPark(lat, lng){
    // get the closest gongcha location then set it into the state.
      var coords =  { lat:lat, lng:lng};
      // findNearestMarker(coords);
      var origin1 = new window.google.maps.LatLng(lat, lng);
      const destinationArray = gongchaData.features.map(gongchaInfo => (
        new window.google.maps.LatLng(gongchaInfo.geometry.coordinates[0], gongchaInfo.geometry.coordinates[1]) 
      ));
      console.log(destinationArray);
      var service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin1],
          destinations: destinationArray,
          travelMode: 'WALKING',
          // transitOptions: TransitOptions,
          // drivingOptions: DrivingOptions,
          // unitSystem: UnitSystem,
          avoidHighways: true,
          avoidTolls: false,
        }, callback);
    // let coords = event.target.getgeometry().getcoordinates();
    console.log(coords);
    //set it into usestates
    // setCoordinates();
  }
  function callback(response, status) {
    if (status == 'OK') {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      var nearestDis = "20000";
      var neareastDes = "";
      var index = null;
      var geocoder = new window.google.maps.Geocoder();
      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.value;
          if(nearestDis >=  distance){
            nearestDis = distance;
            neareastDes = destinations[j];   
            index = j;   
          }
          
          console.log(distance);
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];
        }
      }
      console.log("nearestDis is " + nearestDis);
      geocoder.geocode({
        "address": neareastDes
    }, function(results) {
        sessionStorage.setItem("closest-index", index);
    }); 
    }
    
  }
 
}

const MapWrapped = withScriptjs(withGoogleMap(Map));


export default function App() {

  return (
    <>
    <div style={{ fontSize: "20px", fontWeight: "700",  margin:"10px auto", width:"500px", textAlign:"center"}}>
      Sunny's personal bubbleTea googleMap
    </div>
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=
        AIzaSyB3P3RbY7UksatT5DcJgFvYlciUsUtM1zw`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
    </>
  );

}
