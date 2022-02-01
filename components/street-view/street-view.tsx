import React from 'react';
import { GoogleMap, LoadScript, StreetViewPanorama } from '@react-google-maps/api';
//const ScriptLoaded = require("../../docs/ScriptLoaded").default;


const containerStyle = {
    width: '400px',
    height: '400px'
};

const center: { lat: number, lng: number } = {
    lat: 35.65797020000001,
    lng: 139.7276486,
};

const details = {
    position: {
        lat: 35.65797020000001,
        lng: 139.7276486
    },
    visible: true,
    pov: { heading: 450, pitch: 0 }
}

function MyComponent(props: any) {
    const API_KEY: string = props.API_KEY;


    return (
        <LoadScript
            googleMapsApiKey={ || ""}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                <StreetViewPanorama
                    options={details}
                />
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(MyComponent)
