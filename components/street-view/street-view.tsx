import React from 'react';
import { GoogleMap, LoadScript, StreetViewPanorama } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const details = {
    position: {
        lat: 35.65797020000001,
        lng: 139.7276486
    },
    visible: true,
    pov: { heading: 450, pitch: 0 },
    fullscreenControl: false,
    addressControl: false,
    enableCloseButton: false
}

function MyComponent(props: any) {
    const API_KEY: string = props.API_KEY;


    return (
        <LoadScript googleMapsApiKey={"AIzaSyA4bN_JLbgMsrsaspEm1ebHDiTNNvE7DTA" || ""}>
            <GoogleMap mapContainerStyle={containerStyle}>
                <StreetViewPanorama options={details} />
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(MyComponent)
