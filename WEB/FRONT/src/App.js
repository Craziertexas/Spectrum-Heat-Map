import React, { Component } from 'react';
import {GoogleMap,LoadScript} from "@react-google-maps/api";
import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';

const API_KEY_MAPS=process.env.REACT_APP_MAPS_API;
const API_KEY_PLACES=process.env.REACT_APP_PLACES;

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
    this.state={
      address:'zz'
    }
  }

  //INICIAL
  componentDidMount(){
    console.log("XXXXXXXXX");
    console.log(this.state.address);
    console.log("XXXXXXXXX")
  }

  //LOGICA

  // HTML GUI
  render() {return(

  <div>

  <div style={{zIndex:'10',position:'absolute',top:'5%',left:'35%',width:'30%'}}>
  <PlacesAutocomplete
        value={this.state.address}
        onChange={address => {this.setState({ address:address });}}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
  </div>

  <div style={{zIndex:'5',position:'absolute'}}>
    <LoadScript
      googleMapsApiKey={API_KEY_MAPS}>

      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
      >

      </GoogleMap>

    </LoadScript>
  </div>

  </div>
    );
  }
  
}

export default App;
