import React from 'react';
import {Dimensions} from 'react-native';

import {
  styledText,
  StyledText14,
  StyledText20,
  StyledText26,
} from '../../../styles/text';
import {
  StyledCol,
  StyledRow,
  StyledTouchableCol,
} from '../../../styles/container';

// @ts-ignore
import Trash from '../../../assets/icons/trash.svg';

import BookingCardLower from '../booking-card-lower';
import ListingTwo from '../listing-two';
import ListingOne from '../listing-one';

import * as Progress from 'react-native-progress';

function DetailsCardListing({isLoading, booking, onClick}: any) {
  const sans = styledText();

  return (
    <>
      <StyledRow
        style={{
          justifyContent: 'space-between',
          width: Dimensions.get('window').width * 0.85,
          height: 40,
          marginTop: 15,
        }}>
        <StyledCol style={{width: 25, height: 25}} />
        <StyledText26 style={[sans.bold, {color: '#1FBF83'}]}>
          Active Listing
        </StyledText26>
        <StyledTouchableCol style={{height: '100%'}} onPress={onClick}>
          <Trash width={20} height={20} />
        </StyledTouchableCol>
      </StyledRow>
      <StyledCol
        style={{
          justifyContent: isLoading ? 'center' : 'flex-start',
          width: Dimensions.get('window').width * 0.85,
          minHeight: 375,
          height: 'auto',
          marginTop: 10,
          padding: 15,
          marginBottom: 105,
          backgroundColor: '#fff',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
        {isLoading ? (
          <>
            <Progress.Circle
              size={40}
              indeterminate={true}
              borderWidth={5}
              borderColor={'#042F40'}
            />
            <StyledText20
              style={[sans.bold, {color: '#042F40', marginTop: 10}]}>
              Deleting Listing
            </StyledText20>
          </>
        ) : (
          <>
            <ListingOne label={'Email'} data={booking.email} />

            <ListingOne label={'Journey Date'} data={booking.date} />

            <ListingTwo
              labelOne={'Journey Start Time'}
              dataOne={booking.timeStart}
              labelTwo={'Est. Journey End Time'}
              dataTwo={booking.timeEnd}
            />

            <ListingTwo
              labelOne={'Name'}
              dataOne={booking.name}
              labelTwo={'Phone'}
              dataTwo={booking.contact}
            />

            <ListingTwo
              labelOne={'Car Brand'}
              dataOne={booking.carMake}
              labelTwo={'Car Model'}
              dataTwo={booking.carSeries}
            />

            <ListingTwo
              labelOne={'Car Color'}
              dataOne={booking.carColor}
              labelTwo={'Plate Number'}
              dataTwo={booking.carPlate}
            />

            <StyledCol
              style={{
                justifyContent: 'flex-start',
                width: Dimensions.get('window').width * 0.75,
                marginTop: 10,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {color: '#1FBF83', alignSelf: 'flex-start'},
                ]}>
                Route
              </StyledText14>
              <BookingCardLower routes={booking.route} prices={booking.price} />
            </StyledCol>
          </>
        )}
      </StyledCol>
    </>
  );
}

export default DetailsCardListing;
