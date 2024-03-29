import React from 'react';

import {StyledCol} from '../../../styles/container';

import ListingTwo from '../listing-two';
import {styledText, StyledText16} from '../../../styles/text';

// @ts-ignore
function BookingCardUpper({riderProfile}) {
  const sans = styledText();

  const maskEmail = (email: string) => {
    const atIndex = email.indexOf('@');
    const maskedPart = email.slice(1, atIndex).replace(/./g, '*');
    return email[0] + maskedPart + '@gmail.com';
  };

  const maskPhoneNumber = (phoneNumber: string) => {
    const visibleDigits = phoneNumber.slice(0, 2);
    const maskedPart = phoneNumber.slice(2).replace(/./g, '*');
    return visibleDigits + maskedPart;
  };

  const maskPlate = (plateNumber: string) => {
    const visiblePart = plateNumber.replace(/[^-]/g, '*');
    return visiblePart;
  };

  return (
    <StyledCol
      style={{
        justifyContent: 'space-evenly',
        width: '100%',
        height: 'auto',
        minHeight: 200,
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomWidth: 1.5,
        borderColor: '#9d9d9d',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}>
      <StyledText16 style={[sans.bold, {color: '#042F40'}]}>
        {riderProfile.date}
      </StyledText16>

      <ListingTwo
        labelOne={'Journey Start Time'}
        dataOne={riderProfile.timeStart}
        labelTwo={'Est. Journey End Time'}
        dataTwo={riderProfile.timeEnd}
      />

      <ListingTwo
        labelOne={'Driver'}
        dataOne={riderProfile.name}
        labelTwo={'Phone'}
        dataTwo={maskPhoneNumber(riderProfile.contact)}
      />

      <ListingTwo
        labelOne={'Car Brand'}
        dataOne={riderProfile.carMake}
        labelTwo={'Car Model'}
        dataTwo={riderProfile.carSeries}
      />

      <ListingTwo
        labelOne={'Car Color'}
        dataOne={riderProfile.carColor}
        labelTwo={'Plate Number'}
        dataTwo={maskPlate(riderProfile.carPlate)}
      />
    </StyledCol>
  );
}

export default BookingCardUpper;
