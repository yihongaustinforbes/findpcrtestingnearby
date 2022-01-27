import React from 'react';
import './addressarea.css';
import * as clinicData from "../../data/gongcha-location.json";
import $ from 'jquery'; 


export default class AddressArea extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          postcode: '',
          prefecture: '',
          city: '',
          area: '',
          street: '',
          lineTwo: '',
          latitude: '',
          longtitude: '',
          setMarker: props.setMarker,
          setMarkerInfo: props.setMarkerInfo
        }
        this.setPostcode = this.setPostcode.bind(this);
        this.searchByPostcode = this.searchByPostcode.bind(this);
      }
      componentDidMount() {
    
      }
      setPostcode(event){
          this.setState({postcode: event.target.value})
      }
      searchByPostcode(postcode){
        //clear the previous value
        let a= '';
        let b='';
        let c='';
        this.setState({
            prefecture:a,
            city: b,
            area: c,
            street: '',
            lineTwo: ''
      })
        var postal_code = require('japan-postal-code');
         postal_code.get(postcode, function(address) {
            console.log(address.prefecture); // => "東京都"
            a=address.prefecture;
            console.log(address.city); // => "千代田区"
            b=address.city;
            console.log(address.area); // => "千代田"
            c=address.area;
            console.log(address.street); // => ""
         
          });
          setTimeout(()=>{this.setState({
              prefecture:a,
              city: b,
              area: c
        })}
          ,500);
      }
      async handleSearch() {
          //validation
          const address = this.state.prefecture.concat(this.state.city).concat(this.state.area).concat(this.state.street).concat(this.state.lineTwo)
          var nearstClinic = await this.validation(address);
          var latlngArray = nearstClinic.coordinates.split(',');
          //setMarker here
          this.state.setMarker({lat: Number(latlngArray[0]), lng: Number(latlngArray[1]) });
          console.log("name of the store is" +nearstClinic.stores.NAME)
          this.state.setMarkerInfo(nearstClinic.stores);
 
      }
      async validation(address) {
        
        // var address = '〒104-8560 東京都中央区明石町９−１';
        var location =　await this.getCordinates(address);
        console.log('the location returned by function'+location)
          let result =  await this.findNearstSpot(location.lat(),location.lng());
          //if the address is not correct then print error
        //   console.log("the first item in this array is " + JSON.stringify(result))
          console.log("the first item in this array is " + result[0].coordinates + result[0].name + result[0].distanceText);
        return result[0];
      }
     async getCordinates(address) {
        var location = '';
        var geocoder = new window.google.maps.Geocoder();
        await geocoder.geocode( { 'address': address}, function(results, status) {
            
            if (status == 'OK') {
            //   map.setCenter(results[0].geometry.location);
            //   var marker = new window.google.maps.Marker({
            //       map: map,
            //       position: results[0].geometry.location
            //   });
              console.log("location" + results[0].geometry.location);
              console.log("address" + address);
              location = results[0].geometry.location;
              
            } else {
            //   alert('Geocode was not successful for the following reason: ' + address);
            alert('the address entered is not avialuble.' + address);
              console.log("the address above is not avialuble.")
            }
          });
          return location;

      }


      async findNearstSpot(lat,lng){
          var coords =  { lat:lat, lng:lng};
        //   console.log("coords:"+(JSON.parse(clinicData)).NAME);
           var origin = new window.google.maps.LatLng(lat, lng);
           const destinations = [];
           const stores = [];
           const coordinates = [];
           const destinations_p = [];
           const names = [];
           // Build parallel arrays for the store IDs and destinations
           await Promise.all(clinicData.features.map(async (store) => {
               const storeLoc = store.LOCATION;
               // console.log('storeCor is'+ [storeCor.lat(),storeCor.lng()]);
               destinations_p.push(storeLoc);
               stores.push(store);
            //    coordinates.push(coordinate);
               console.log('destinations_p is ' + destinations_p);
           }));
          destinations.push(destinations_p, stores);
            console.log("destinations:" + destinations);
            
           
           
           // Retrieve the distances of each store from the origin
       // The returned list will be in the same order as the destinations list
       const service = new window.google.maps.DistanceMatrixService();
       // console.log(service);
       const getDistanceMatrix =
           (service, parameters) => new Promise((resolve, reject) => {
               service.getDistanceMatrix(parameters, (response, status) => {
                   if (status != window.google.maps.DistanceMatrixStatus.OK) {
                       reject(response);
                   } else {
                       const distances = [];
                       const results = response.rows[0].elements;
                       //console.log(response);
                       for (let j = 0; j < results.length; j++) {
                           const element = results[j];
                           //console.log(element);
                           const distanceText = (element.status != 'ZERO_RESULTS') ? element.distance.text : '9999999999 km';
                           const distanceVal = (element.status != 'ZERO_RESULTS') ? element.distance.value : '9999999999 km';
                           const distanceObject = {
                               coordinates: destinations_p[j],
                               stores: stores[j],
                               distanceText: distanceText,
                               distanceVal: distanceVal,
                           };
                           distances.push(distanceObject);
                       }
   
                       resolve(distances);
                   }
               });
           });
   
   
       /***********************************************************************************
       This method was build to pass only 25 destinations in array to distance matrix 
       service , that's the max it was take at a time , if there is change to this 
       settings in google then only chnage max_records value below and it should work
       ************************************************************************************/
       let p_results = [];
       let p_process = [];
       let nextSet = [];
       var lastIndex = 0
       var max_records = 25;
       var p_stores = [];
       var flatArray = [];
       var total_records = Math.ceil(destinations[0].length / max_records);
   
   
       // later i figured out that foreach does not work with async function however FOR loop works
   
       /*  data.forEach((store) => {
         let p_val = store.getGeometry().get().lat()+","+store.getGeometry().get().lng();
         p_results.push("["+p_val+"]");
           });
       */
   
   
       for (var g = 1; g <= total_records; g++) {
   
           let nextSet = [];
   
           /*************************************************************
           These debugging could be use to match what we are sending 
           matching with destination and storeid'd in parallel array
           console.log(destinations[0].slice(lastIndex, max_records));
           console.log(destinations[1].slice(lastIndex, max_records));
           *************************************************************/
         const newDes = destinations[0].slice(lastIndex, max_records)
          
          console.log(destinations[0].slice(lastIndex, max_records));
          console.log(destinations[1].slice(lastIndex, max_records));
           nextSet.push(destinations[0].slice(lastIndex, max_records));
           console.log("nextset:"+newDes);
           lastIndex = max_records;
           max_records = lastIndex + 25;
   
           /*********************************************************************************************
           There is some issue going on with hawaii lats and lng - This is Test for that these are hawaii
           lat,lng , I have opened Ticket with google : https://issuetracker.google.com/u/2/issues/189164319
              
              p_process.push(await getDistanceMatrix(service, {
                 origins: ['21.304247103770592,-157.8504303328067'],
                 destinations: ['19.638878300603324,-155.9901696156307','19.666046167473695,-155.99401485525755','19.517828633585925,-155.92144357145344','19.927879613527526,-155.78726601617393','21.304247103770592,-157.8504303328067'],
                 travelMode: 'DRIVING',
                 unitSystem: google.maps.UnitSystem.METRIC,
               }));
           
           *********************************************************************************************/
   
        //    p_process.push(await getDistanceMatrix(service, {
        //        origins: ['21.304247103770592,-157.8504303328067'],
        //        destinations: nextSet[0],
        //        travelMode: 'DRIVING',
        //        unitSystem: window.google.maps.UnitSystem.METRIC,
        //    }));
        p_process.push(await getDistanceMatrix(service, {
            origins: [origin],
            destinations: newDes,
            travelMode: 'WALKING',
            unitSystem: window.google.maps.UnitSystem.METRIC,
          }));
   
       }; // end for loop
       /**********************************************************
    So i get back array results from getDistance matrix and now
    they are nice stacked in 3,4,5 etc # of array depends on how
    many set of 25's where passed , now to process further more
    we need to merge all these array togather and stamp back 
    storeID - if you get 'undefined' error that means somehow 
    there is mismatch between array and loop count .
    **********************************************************/



   flatArray = Array.prototype.concat(...p_process);
   console.log("flatArray"+flatArray.length)
   for (var h = 0; h < flatArray.length; h++) {
       
       flatArray[h].storeid = h; // reassigning storeid

   };


   // finally sorting array's
   flatArray.sort((first, second) => {
       return first.distanceVal - second.distanceVal;
   });


   return flatArray;

}; // end function
   




        

 


    callback(response, status) {
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
      render(){
        return (
            <>
            <div style={{ fontSize: "20px", fontWeight: "700",  margin:"10px auto", width:"500px", textAlign:"center"}}>
              <h1>Find Your Nearest PCR Testing Center!!!</h1>
            
              <div id="lookup_field">
        <div id="context">
          
          <input
            type="text"
            className="idpc-input"
            placeholder="Search your postcode"
            aria-label="Search a postcode to retrieve your address"
            onChange={this.setPostcode}
          />
        
          <button type="button" className="idpc-button" onClick={ () => this.searchByPostcode(this.state.postcode) }>Find my Address</button>
          <div
            className="idpc-select-container"
            aria-live="polite"
            style={{display: `none`}}
          ></div>
          {/* Any messages displayed here */}
          <p className="idpc-error" role="alert" style={{display: `none`}}></p>
        </div></div>
        <div className='addressContainer'>
            <div className='row'>
              <label>Prefecture</label>
              <input id="first_line" type="text" value={this.state.prefecture} onChange={(event) => this.setState({prefecture: event.target.value})} placeholder='e.g.東京都'/>
            </div>
            <div className='row'>
         <label>City</label>
         <input id="second_line" type="text" value={this.state.city}　onChange={(event) => this.setState({city: event.target.value})} placeholder='e.g.千代区'/>
         </div>
         <div className='row'>
         <label>Area</label>
        <input id="third_line" type="text" value={this.state.area}　onChange={(event) => this.setState({area: event.target.value})} placeholder='e.g.千代'/>
        </div>
        <div className='row'>
        <label>Address Line One</label>
        <input id="post_town" type="text" autocomplete="off" value={this.state.street}　onChange={(event) => this.setState({street: event.target.value})} placeholder='e.g.１番目ー２ー３'/>
        </div>
        <div className='row'>
        <label>Address Line Two</label>
        <input id="postcode" type="text"　autocomplete="off" value={this.state.lineTwo} onChange={(event) => this.setState({lineTwo: event.target.value})} placeholder='e.g.ライオンマンション'/>
        </div>
        </div>
        <div className='buttonWrapper'>
        
        <button className="search" value='' onClick={() => this.handleSearch()}>Find the nearest spot</button>
        </div>
        </div>
  </>
        )

  }  
}