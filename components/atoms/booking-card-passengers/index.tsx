import React from 'react';
import {Image} from 'react-native';

import {StyledCol} from '../../../styles/container';

import ListingOne from '../listing-one';
import ListingTwo from '../listing-two';

function BookingCardPassengers({profiles}: any) {
  // @ts-ignore
  return profiles.map((profile, index) => (
    <StyledCol key={index} style={{width: '100%'}}>
      <StyledCol>
        {profile?.profPic && (
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: '#042f40',
            }}
            source={{uri: profile.profPic}}
          />
        )}
      </StyledCol>
      <StyledCol style={{marginLeft: 40}}>
        <ListingOne label={'Email'} data={profile?.email} />
        <ListingTwo
          labelOne={'Commuter'}
          dataOne={profile?.name}
          labelTwo={'Contact'}
          dataTwo={profile?.contact}
        />
        <ListingTwo
          labelOne={'Total Rides'}
          dataOne={profile?.totalRides}
          labelTwo={'Rating'}
          dataTwo={profile?.rating.toFixed(2)}
        />
      </StyledCol>
    </StyledCol>
  ));
}

export default BookingCardPassengers;
