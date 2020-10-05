import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {GoogleMap,LoadScript,Marker,InfoWindow} from "@react-google-maps/api";

const API_KEY= process.env.REACT_APP_SPECTRUM_HEAT_MAP_KEY;

const mapContainerStyle={
  width: "100vw",
  height: "100vh",
};

const center ={
lat: 4.570868,
lng: -74.297333,
};

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

export default App;
