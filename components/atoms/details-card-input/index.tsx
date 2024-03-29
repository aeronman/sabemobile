import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledTouchableRow,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText20} from '../../../styles/text';

// @ts-ignore
import Check from '../../../assets/icons/check.svg';
// @ts-ignore
import Cancel from '../../../assets/icons/cross.svg';
// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';

import InputPax from '../input-pax';
import InputTime from '../input-time';
import ListingTwo from '../listing-two';
import ListingOne from '../listing-one';
import DropdownListing from '../dropdown-listing';

import * as Progress from 'react-native-progress';

import firestore from '@react-native-firebase/firestore';

// @ts-ignore
function DetailsCardInput({
  isLoading,
  profile,
  onCancel,
  onApprove,
  pax,
  timeStart,
  timeEnd,
  dateJourney,
  routes,
  prices,
  setPax,
  setTimeStart,
  setTimeEnd,
  setDateJourney,
  setRoutes,
  setPrices,
}: any) {
  const sans = styledText();

  const [numDropdowns, setNumDropdowns] = useState(1);

  const removeDropdown = () => {
    setNumDropdowns(numDropdowns - 1);
    if (routes.length > 1) {
      const newArray = [...routes];
      newArray.pop();
      setRoutes(newArray);
    }
  };

  const addDropdown = () => {
    setNumDropdowns(numDropdowns + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (routes.length > 0) {
        const pricesArray = [];

        for (const route of routes) {
          try {
            // Assuming "Routes" is the collection name and "tLujWHvJK6s8ywQ1lY8I" is the document ID
            const docRef = firestore()
              .collection('Routes')
              .doc('tLujWHvJK6s8ywQ1lY8I');
            const docSnapshot = await docRef.get();

            if (docSnapshot.exists) {
              const locationsArray = docSnapshot.data();

              // @ts-ignore
              if (locationsArray.hasOwnProperty(route)) {
                // @ts-ignore
                pricesArray.push(locationsArray[route][2]);
              }
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

        // @ts-ignore
        setPrices(pricesArray);
      }
    };

    fetchData();
  }, [routes]);

  return (
    <StyledCol
      style={{
        justifyContent: isLoading ? 'center' : 'flex-start',
        width: Dimensions.get('window').width * 0.85,
        minHeight: 375,
        height: 'auto',
        marginTop: 25,
        padding: 15,
        marginBottom: 105,
        backgroundColor: '#fff',
        borderRadius: 10,
      }}>
      {isLoading ? (
        <>
          <Progress.Circle
            size={40}
            indeterminate={true}
            borderWidth={5}
            borderColor={'#042F40'}
          />
          <StyledText20 style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
            Creating Listing
          </StyledText20>
        </>
      ) : (
        <>
          <StyledRow
            style={{
              justifyContent: 'space-between',
              width: Dimensions.get('window').width * 0.75,
            }}>
            <StyledRow>
              <SabeLogo width={25} height={25} />
            </StyledRow>
            <StyledRow>
              <StyledTouchableRow style={{marginRight: 5}} onPress={onCancel}>
                <Cancel width={25} height={25} />
              </StyledTouchableRow>
              <StyledTouchableRow style={{marginLeft: 5}} onPress={onApprove}>
                <Check width={25} height={25} />
              </StyledTouchableRow>
            </StyledRow>
          </StyledRow>

          <StyledRow
            style={{
              justifyContent: 'space-between',
              width: Dimensions.get('window').width * 0.77,
              marginTop: 10,
            }}>
            <InputPax pax={pax} setPax={setPax} />
          </StyledRow>

          <StyledRow
            style={{
              justifyContent: 'space-between',
              width: Dimensions.get('window').width * 0.77,
              marginTop: 10,
            }}>
            <InputTime
              mode={'Journey Date'}
              time={dateJourney}
              setTime={setDateJourney}
            />
          </StyledRow>

          <StyledRow
            style={{
              justifyContent: 'space-between',
              width: Dimensions.get('window').width * 0.77,
              marginTop: 10,
            }}>
            <InputTime
              mode={'Journey Start'}
              time={timeStart}
              setTime={setTimeStart}
            />
            <InputTime
              mode={'Est. Journey End'}
              time={timeEnd}
              setTime={setTimeEnd}
            />
          </StyledRow>

          <ListingOne label={'Email'} data={profile.email} />

          <ListingTwo
            labelOne={'Name'}
            dataOne={profile.name}
            labelTwo={'Phone'}
            dataTwo={profile.contact}
          />

          <ListingTwo
            labelOne={'Car Brand'}
            dataOne={profile.carMake}
            labelTwo={'Car Model'}
            dataTwo={profile.carSeries}
          />

          <ListingTwo
            labelOne={'Car Color'}
            dataOne={profile.carColor}
            labelTwo={'Plate Number'}
            dataTwo={profile.carPlate}
          />

          <StyledRow
            style={{
              justifyContent: 'space-evenly',
              width: '100%',
              marginTop: 10,
              marginBottom: 10,
            }}>
            {numDropdowns >= 2 && (
              <StyledTouchableRow onPress={removeDropdown}>
                <StyledText14 style={[sans.bold, {color: '#E70000'}]}>
                  Remove Route
                </StyledText14>
              </StyledTouchableRow>
            )}
            <StyledTouchableRow onPress={addDropdown}>
              <StyledText14 style={[sans.bold, {color: '#448511'}]}>
                Add Route
              </StyledText14>
            </StyledTouchableRow>
          </StyledRow>

          <StyledCol
            style={{
              width: Dimensions.get('window').width * 0.75,
            }}>
            <StyledText14
              style={[
                sans.regular,
                {color: '#1FBF83', alignSelf: 'flex-start'},
              ]}>
              Routes
            </StyledText14>
            {[...Array(numDropdowns)].map((_, index) => (
              <DropdownListing
                key={index}
                index={index}
                routes={routes}
                setRoutes={setRoutes}
                prices={prices}
              />
            ))}
          </StyledCol>
        </>
      )}
    </StyledCol>
  );
}

export default DetailsCardInput;
