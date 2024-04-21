import React, { useRef, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StyledCol } from '../../../styles/container';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, enableLatestRenderer, PROVIDER_DEFAULT } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import Pin from '../../../assets/icons/pin.svg';

import Geolocation from '@react-native-community/geolocation'; 

function MainMapDriver({ userUID , hasRide, routeData }: any) {
  enableLatestRenderer();
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    const updateLocation = () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });

            // Update user's location in Firestore
            await firestore().collection('Users').doc(userUID).update({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            console.log("saved!");
          } catch (error) {
            console.error('Error updating user location:', error);
          }
        },
        error => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    updateLocation(); // Fetch initial location

    // Set interval to update location periodically
    const intervalId = setInterval(updateLocation, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [userUID]);
  const mapRef = useRef<MapView>(null);
  const [enableRef, setEnableRef] = useState(true);
  const [onDrag, setDrag] = useState(false);
  const [locationsData, setLocationsData] = useState<any[]>([]);

  const handleDragStart = () => {
    setDrag(true);
  };

  const handleDragEnd = () => {
    setDrag(false);
  };

  const handleRef = (ref: MapView | null) => {
    mapRef.current = ref;

    if (!mapRef.current || !enableRef) {
      return;
    }

    requestAnimationFrame(() => {
      if (!mapRef.current || !enableRef) {
        return;
      }

      mapRef.current.animateToRegion(
        {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000, // Animation duration in milliseconds
      );
    });
  };

  const enableHandleRef = () => {
    if (mapRef.current) {
      mapRef.current.setNativeProps({
        scrollEnabled: true,
        zoomEnabled: true,
        pitchEnabled: true,
        rotateEnabled: true,
      });
    }
  };

  useEffect(() => {
    if (!onDrag) {
      const timeoutId = setTimeout(() => {
        enableHandleRef();
        setEnableRef(true);
      }, 4000);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setEnableRef(false);
    }
  }, [onDrag]);

  useEffect(() => {
    const fetchData = async () => {
      if (hasRide && routeData) {
        const locationsArray = [];

        for (const route of routeData) {
          try {
            const docRef = firestore().collection('Routes').doc('tLujWHvJK6s8ywQ1lY8I');
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists) {
              const locations = docSnapshot.data();

              if (locations && locations.hasOwnProperty(route)) {
                locationsArray.push({
                  lat: locations[route][0],
                  long: locations[route][1],
                });
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        setLocationsData(locationsArray);
      } else {
        setLocationsData([]);
      }
    };

    fetchData();
  }, [hasRide, routeData]);

  // Update map region and polyline when position prop changes
  useEffect(() => {
    animateToDriverLocation();
  }, [position]);

  const animateToDriverLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000, // Animation duration in milliseconds
      );
    }
  };

  return (
    <StyledCol
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.74,
      }}>
      <MapView
        ref={handleRef}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        onRegionChangeComplete={handleDragEnd}
        onPanDrag={handleDragStart}
        userInterfaceStyle={'light'}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height * 0.74,
        }}
        initialRegion={position}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {hasRide && locationsData.length > 0 && (
          <>
            <Polyline
              coordinates={[
                { latitude: position.latitude, longitude: position.longitude },
                ...locationsData.map((location) => ({
                  latitude: location.lat,
                  longitude: location.long,
                })),
              ]}
              key="polyline"
              strokeColor="#00f"
              strokeWidth={3}
            />
            {locationsData.map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location.lat,
                  longitude: location.long,
                }}
                title={`Location ${index + 1}`}
                tappable={false}>
                <Pin width={30} height={30} />
              </Marker>
            ))}
          </>
        )}
      </MapView>
    </StyledCol>
  );
}

export default MainMapDriver;