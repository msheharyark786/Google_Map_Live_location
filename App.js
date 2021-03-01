// import React,{Component,useState} from 'react';
// import MapView from 'react-native-maps'; 

// import { View, Text, StyleSheet,TouchableOpacity,Image ,Platform, Dimensions, ToastAndroid } from 'react-native';
// //import Geolocation from "react-native-geolocation-service";
// // remove PROVIDER_GOOGLE import if not using Google Maps

// const latitudeDelta=0.025;
// const longitudeDelta=0.025;
import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  SafeAreaView
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import PubNubReact from "pubnub-react";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 31.582045;
const LONGITUDE = 74.329376;
const LATITUDE_DELTA = 1.6143120924003576;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      })
    };

    this.pubnub = new PubNubReact({
      publishKey: "X",
      subscribeKey: "X"
    });
    this.pubnub.init(this);
  }

  componentDidMount() {
    this.watchLocation();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.latitude !== prevState.latitude) {
      this.pubnub.publish({
        message: {
          latitude: this.state.latitude,
          longitude: this.state.longitude
        },
        channel: "location"
      });
    }
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  handleUserLocation=()=>{
      // navigator.geolocation.getCurrentPosition(pos => Geolocation.getCurrentPosition
      Geolocation.getCurrentPosition(pos=>{
        map.animateToRegion({
          ...this.state,
          latitude:pos.coords.latitude,
          longitude:pos.coords.longitude,
        })
        this.setState({
          ...this.state,
          latitude:pos.coords.latitude, 
          longitude:pos.coords.longitude
        }) 
      },
      err=>{
        console.log(err);  
        alert("Some thing went Wrong! Please select location manually.")
      }
      )
    }

  watchLocation = () => {
    const { coordinate } = this.state;

    this.watchID = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500 // 500 is the duration to animate the marker
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            showUserLocation={this.handleUserLocation}
            followUserLocation
            loadingEnabled
            region={this.getMapRegion()}
          >
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}
            />
          </MapView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});






// export default class App extends Component {
//   constructor(props){
//     super(props);
//     this.state={
//       region:{
//         // latitude:0,
//         // longitude:0,
//         // latitudeDelta:0,
//         // longitudeDelta:0,
//       latitude:31.582045,
//       longitude:74.329376,
//       latitudeDelta:1.6143120924003576,
//       longitudeDelta:1.1749530583620071,
//       // longitudeDelta:Dimensions.get('window').width/Dimensions.get('window')

//       },
//       marginBottom:1
//     }
// }
// componentDidMount()
// {
//   this.handleUserLocation(); 
//   setTimeout(()=>this.setState({marginBottom:0}),100)  
// }

//  onchangeValue=region=>{
//   ToastAndroid.show(JSON.stringify(region),ToastAndroid.SHORT)
//   this.setState({
//     region
//   })

// }

// handleUserLocation=()=>{
//   // navigator.geolocation.getCurrentPosition(pos => Geolocation.getCurrentPosition
//   Geolocation.getCurrentPosition(pos=>{
//     map.animateToRegion({
//       ...this.state.region,
//       latitude:pos.coords.latitude,
//       longitude:pos.coords.longitude,
//     })
//     this.setState({
//       ...this.state.region,
//       latitude:pos.coords.latitude, 
//       longitude:pos.coords.longitude
//     }) 
//   },
//   err=>{
//     console.log(err);  
//     alert("Some thing went Wrong! Please select location manually.")
//   }
//   )
// }
//   render(){


//   return(
//    <View style={{flex:1}}>
//      <View style={{flex:1}}>
     
//     {/* { setTimeout(() => setState({marginBottom:0}),100)} */}
//     {/* {handleUserLocation()}; */}
//      <MapView
//      style={{flex:1, marginBottom:this.state.marginBottom}}
//      showsUserLocation={true}
//      showsMyLocationButton={true}
//      initialRegion={this.state.region}
//      onRegionChangeComplete={this.onchangeValue}
//      ref={ref => map=ref}
//       //  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//       // //  style={styles.map}
//       //  region={{
//       //    latitude: 37.78825,
//       //    longitude: -122.4324,
//       //    latitudeDelta: 0.015,
//       //    longitudeDelta: 0.0121,
//       //  }}
//      />
//      <View style={{top:'50%',left:'50%',marginLeft:-24,marginTop:-48,position:'absolute'}}>
//       <Image style={{height:48,width:48}} source={require('./src/assets/marker.png')} />
//      </View>
//      </View>
//      {/* </MapView> */}
//    </View>
//   );

// };
// }


// const styles = StyleSheet.create({
//   container: {
//     // ...StyleSheet.absoluteFillObject,
//     height: 400,
//     width: 400,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     // ...StyleSheet.absoluteFillObject,
//     flex:1
//   },
//  });