import React from 'react';
import {Image} from 'react-native';

import {StyledCol, StyledRow} from '../../../styles/container';
import {styledText, StyledText18} from '../../../styles/text';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';

import ButtonNeutral from '../button-neutral';
import ButtonNegative from '../button-negative';
import ButtonPositive from '../button-positive';
import BookingCardLower from '../booking-card-lower';
import BookingCardRider from '../booking-card-rider';

// @ts-ignore
import AnimatedEllipsis from 'react-native-animated-ellipsis';
// @ts-ignore
import StarRating from 'react-native-star-rating-widget';

function MainRideCommuter({
  navigation,
  driverData,
  routeData,
  priceData,
  hasRequest,
  hasRide,
  hasDrop,
  hasApproved,
  handleCancel,
  handleDropoff,
  handleEnd,
  rating,
  setRating,
}: any) {
  const sans = styledText();

  const handleChat = () => {
    navigation.navigate('RideChat');
  };

  return (
    <StyledCol
      style={{
        justifyContent: hasRequest ? 'space-between' : 'center',
        width: '85%',
        height: 'auto',
        minHeight: hasRequest ? 200 : 150,
        marginTop: 25,
        marginBottom: 110,
        paddingTop: 12.5,
        paddingBottom: 12.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}>
      <StyledCol style={{width: '100%', marginTop: hasRequest ? 15 : 0}}>
        {!hasRequest && !hasRide && (
          <>
            <SabeLogo width={75} height={75} />
            <StyledRow>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                You have no ongoing ride
              </StyledText18>
            </StyledRow>
          </>
        )}
        {!hasRequest && hasRide && (
          <StyledCol style={{width: '100%'}}>
            {!hasDrop && !hasApproved && (
              <StyledCol style={{width: '100%'}}>
                <SabeLogo width={75} height={75} />
                <StyledText18
                  style={[
                    sans.bold,
                    {color: '#042F40', marginTop: 5, marginBottom: 10},
                  ]}>
                  Ride Ongoing
                </StyledText18>
                <ButtonPositive onClick={handleChat} text={'Ride Chat'} />
                {driverData && (
                  <StyledCol style={{width: '100%', marginTop: 10}}>
                    <BookingCardRider profile={driverData} />
                  </StyledCol>
                )}
                {routeData && priceData && (
                  <StyledCol style={{width: '100%', marginTop: 10}}>
                    <BookingCardLower routes={routeData} prices={priceData} />
                  </StyledCol>
                )}
                <StyledRow style={{marginTop: 10}}>
                  <ButtonNegative
                    onClick={handleDropoff}
                    text={'Request Dropoff'}
                  />
                </StyledRow>
              </StyledCol>
            )}
            {hasDrop && (
              <>
                <SabeLogo width={75} height={75} />
                <StyledRow style={{marginTop: 10}}>
                  <ButtonNeutral text={'Reviewing Request'} />
                </StyledRow>
              </>
            )}
            {hasApproved && (
              <>
                <StyledText18
                  style={[
                    sans.bold,
                    {color: '#042F40', marginTop: 5, marginBottom: 10},
                  ]}>
                  Rate your driver!
                </StyledText18>
                <StarRating
                  onRatingEnd={handleEnd}
                  enableSwiping={true}
                  enableHalfStar={false}
                  rating={rating}
                  onChange={setRating}
                  color={'#FFB800'}
                />
              </>
            )}
          </StyledCol>
        )}
        {!hasRide && hasRequest && (
          <StyledCol>
            {driverData.profPic ? (
              <Image
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: '#042f40',
                }}
                source={{uri: driverData.profPic}}
              />
            ) : (
              <SabeLogo width={75} height={75} />
            )}
            <StyledRow>
              <StyledText18
                style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
                Booking has been requested!

                Current status: Requested
              </StyledText18>
              {/* <AnimatedEllipsis
                style={{
                  color: '#042F40',
                  fontSize: 26,
                  letterSpacing: -2.5,
                }}
              /> */}
            </StyledRow>
            {/* <StyledRow style={{marginTop: 20}}>
              <ButtonNegative onClick={handleCancel} text={'Cancel'} />
            </StyledRow> */}
          </StyledCol>
        )}
      </StyledCol>
    </StyledCol>
  );
}

export default MainRideCommuter;
