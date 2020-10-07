import React, { Component } from 'react';
import {GoogleMap,LoadScript} from "@react-google-maps/api";
import usePlacesAutocomplete,{getGeocode, getLatLng} from "use-places-autocomplete";
import{Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from "@reach/combobox";

const API_KEY=process.env.REACT_APP_MAPS_API;
const mapContainerStyle={
  width: "100vw",
  height: "100vh",
};

const center ={
lat: 4.570868,
lng: -74.297333,
};
const ir = React.useCallback(({lat, lng})=>{mapRef.current.ir({lat, lng}); mapRef.current.setZoom(14);}, []);
<Search ir={ir}/>

class App extends Component {

  //CONSTRUCTOR
  constructor(){
    super();
  }

  //INICIAL
  componentDidMount(){
  
  }

  //LOGICA

  // HTML GUI
  render() {return(

  <div>
    <LoadScript
      googleMapsApiKey={API_KEY}>

      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
      >

      </GoogleMap>

    </LoadScript>
  </div>
    
    );
  }
  
}


function Search({ir}){
const {ready, value, suggestions: {status,data}, setvalue, clearSuggestions} = usePlacesAutocomplete({
 requestOptions:{
   location: {lat:()=> 4.570868, lng: ()=> -74.297333}
   radius:200*1000;
 }

});

return (
<Combobox> onSelect={ async (address) =>{
  onSelect={(address) =>{
      setvalue(address,false);
      clearSuggestions();
      console.log(address);
  
  try {
      const results = await getGeocode({address});
      const {lat, lng} = await getLatLng(results[0]);
      console.log(lat,lng);
      ir({lat, lng});
  }
  catch(error){console.log("error!")};
  //console.log(address);
  }}
<ComboboxInput value={value} onChange={(e)=>{
  setvalue(e.target.value)
}}
  disabled={!ready}
  placeholder="Ingrese una Localidad"
/>

<ComboboxPopover>
  {status==="OK" && data.map(({id, description})=>( <ComboboxOption key={id} value= {description}/> ))}
</ComboboxPopover>
</Combobox>
)}
export default App;
