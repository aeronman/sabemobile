import React from 'react';

import {StyledCol} from '../../../styles/container';
import {
  styledText,
  StyledText14,
  StyledText18,
  StyledText26,
} from '../../../styles/text';

import BookingCardLower from '../booking-card-lower';
import BookingCardUpper from '../booking-card-upper';

function BookingCard({riderProfile}: any) {
  const sans = styledText();

  return (
    <>
      <StyledCol style={{width: '100%', marginTop: 10}}>
        <StyledText26 style={[sans.bold, {color: '#042F40'}]}>
          PHP {riderProfile.fare}
        </StyledText26>
        <StyledText14 style={[sans.regular, {color: '#1FBF83'}]}>
          {riderProfile.passengerCount} / {riderProfile.passengerLimit}{' '}
          Passengers • {riderProfile.route.length} Stops
        </StyledText14>
        <StyledText18 style={[sans.regular, {color: '#042F40', marginTop: 10}]}>
          {riderProfile.route[0]} to{' '}
          {riderProfile.route[riderProfile.route.length - 1]}
        </StyledText18>
      </StyledCol>
      <StyledCol
        style={{
          width: '85%',
          height: 'auto',
          minHeight: 400,
          borderWidth: 1.5,
          borderColor: '#9d9d9d',
          borderRadius: 10,
        }}>
        <BookingCardUpper riderProfile={riderProfile} />
        <BookingCardLower
          routes={riderProfile.route}
          prices={riderProfile.price}
        />
      </StyledCol>
    </>
  );
}

export default BookingCard;
