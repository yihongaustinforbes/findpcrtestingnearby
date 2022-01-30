import React, { useState, useEffect } from "react";
import mapStyles from "./mapStyles";
import ClinicMap from "./components/ClinicMap/ClinicMap.js";
import AddressArea from "./components/AddressArea/AddressArea";
function App (){
  const [marker, setMarker] = useState(null);
  const [markerInfo, setMarkerInfo] = useState({});
  const [clinicData, setClinicData] = useState(null);
  return (
  <div>
    <AddressArea setMarker={setMarker} setMarkerInfo={setMarkerInfo} setClinicData={setClinicData}/>
    <ClinicMap name='map' marker={marker} markerInfo={markerInfo} clinicData={clinicData}/>
  </div>
  );


}
export default App;
