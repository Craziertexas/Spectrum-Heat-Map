/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import React, {Component} from 'react';
import MapGL, {Source, Layer} from 'react-map-gl';
import SlidingPanel from 'react-sliding-side-panel';
import {Button} from 'rebass';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import axios from 'axios';
import NumericInput from 'react-numeric-input';

const API_KEY_MAPS=process.env.REACT_APP_MAPS_API;
const API_URL_1=process.env.REACT_APP_API_URL_1;

const mapContainerStyle={
  width: '100vw',
  height: '100vh',
};

const MAX_ZOOM_LEVEL = 20;

const heatmapLayer = {
  maxzoom: MAX_ZOOM_LEVEL,
  type: 'heatmap',
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'power'], 0, 0, 1, 1],
  },
};

const makeGeoJSON = (data) => {
  return {
    type: 'FeatureCollection',
    features: data.map((feature) => {
      return {
        'type': 'Feature',
        'properties': {
          'id': feature.freq,
          'value': feature.power,
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [feature.lng, feature.lat],
        },
      };
    }),
  };
};

function makeNormal(data) {
  let max = 0;
  data.map( (feature) => {
    if (Math.abs(feature.power) > Math.abs(max)) {
      max = feature.power;
    }
  });
  const normal = data.map( (feature) => {
    feature.power = feature.power/max;
    return feature;
  },
  );
  return normal;
}

class App extends Component {
  // CONSTRUCTOR
  constructor() {
    super();
    this.state={
      viewport: {
        latitude: 4.57,
        longitude: -74.29,
        zoom: 3,
        bearing: 0,
        pitch: 0,
        data: [],
      },
      PanelState: false,
      FreqRange: {min: 300, max: 1000},
      DbRange: -100,
    };
  }

  // INICIAL
  componentDidMount() {
    console.log('All components mounted');
    console.log(API_URL_1);
  }

  // LOGICA
  onPanelButton() {
    this.setState({
      PanelState: !this.state.PanelState,
    });
  }

  onRangeInput(value) {
    console.log(value);
    this.setState({
      FreqRange: value,
    });
  }

  onFilterButton() {
    console.log('Enviar');
    axios.post(API_URL_1, ({
      range: this.state.FreqRange,
      dbrange: this.state.DbRange,
    }))
        .then((response) => {
          this.setState({
            data: makeGeoJSON(makeNormal(response.data)),
          });
        })
        .catch((error)=> {
          alert(error);
        });
  }

  onDbInput(value) {
    this.setState({
      DbRange: value,
    });
  }

  // HTML GUI
  render() {
    return (

      <div>

        <div
          style={
            {
              zIndex: '5',
              position: 'absolute',
              width: '100%',
              height: '100%',
            }
          }
        >
          <MapGL
            {...this.state.viewport}
            width='100%'
            height='100%'
            mapStyle='mapbox://styles/mapbox/dark-v9'
            onViewportChange={(newviewport) => this.setState({viewport: newviewport})}
            mapboxApiAccessToken={API_KEY_MAPS}
          >
            {this.state.data && (
              <Source type="geojson" data={this.state.data}>
                <Layer {...heatmapLayer} />
              </Source>
            )}
          </MapGL>
          <div
            style={
              {
                position: 'absolute',
                top: '50%',
                left: '0%',
                zIndex: '10',
              }
            }
          >
            <Button
              onClick={() => {
                this.onPanelButton();
              }}
              style={{backgroundColor: 'black', cursor: 'pointer'}}
            >⋙</Button>
          </div>
        </div>

        <SlidingPanel
          type={'left'}
          isOpen={this.state.PanelState}
        >
          <div
            style={
              {
                zIndex: '10',
                top: '0%',
                left: '0%',
                position: 'absolute',
                backgroundColor: '#e23a07',
                width: '30%',
                height: '100%',
              }
            }
          >
            <div
              style={
                {
                  top: '50%',
                  left: '85%',
                  position: 'relative',
                  zIndex: '10',
                }
              }
            >
              <Button
                onClick={() => {
                  this.onPanelButton();
                }}
                style={{backgroundColor: 'black', cursor: 'pointer'}}
              >⋘</Button>
            </div>

            <div
              style={
                {
                  top: '30%',
                  left: '10%',
                  position: 'absolute',
                  zIndex: '10',
                  width: '80%',
                  height: '10%',
                }
              }
            >
              <InputRange
                maxValue={1700}
                minValue={100}
                step={100}
                value={this.state.FreqRange}
                onChange={(value) => {
                  this.onRangeInput(value);
                }}
                formatLabel={(value) => `${value} MHz`}
              />
            </div>

            <div
              style={
                {
                  top: '40%',
                  left: '50%',
                  position: 'absolute',
                  zIndex: '10',
                }
              }
            >
              <Button
                onClick={() => {
                  this.onFilterButton();
                }}
                style={{backgroundColor: 'black', cursor: 'pointer'}}
              >
                Enviar
              </Button>
            </div>
            <div
              style={
                {
                  top: '50%',
                  left: '10%',
                  position: 'absolute',
                  zIndex: '10',
                }
              }
            >
              <NumericInput
                step={10}
                min={-150}
                max={0}
                value={this.state.DbRange}
                onChange={(value) => this.onDbInput(value)}
              />
            </div>
          </div>

        </SlidingPanel>

      </div>
    );
  }
}

export default App;
