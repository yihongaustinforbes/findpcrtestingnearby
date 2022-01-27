import React, { useState, useEffect } from "react";
import mapStyles from "./mapStyles";
import ClinicMap from "./components/ClinicMap/ClinicMap.js";
import AddressArea from "./components/AddressArea/AddressArea";
function App (){
  const [marker, setMarker] = useState(null);
  const [markerInfo, setMarkerInfo] = useState({});
  return (
  <div>
    <AddressArea setMarker={setMarker} setMarkerInfo={setMarkerInfo}/>
    <ClinicMap marker={marker} markerInfo={markerInfo}/>
  </div>
  );


}
export default App;
