import React from 'react';
import {Dimensions, Modal} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledTouchableCol,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText18} from '../../../styles/text';

// @ts-ignore
import Cross from '../../../assets/icons/cross.svg';

function ModalInfo({visible, setVisible, section}: any) {
  const sans = styledText();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}>
      <StyledCol
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          height: section === 'About Us' ? 325 : 400,
          backgroundColor: '#ffffffff',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 12,
        }}>
        <StyledRow
          style={{
            justifyContent: 'space-between',
            width: '85%',
          }}>
          <StyledCol style={{width: 20, height: 20}} />
          <StyledText18 style={[sans.bold, {color: '#042F40'}]}>
            {section}
          </StyledText18>
          <StyledTouchableCol onPress={setVisible}>
            <Cross width={20} height={20} />
          </StyledTouchableCol>
        </StyledRow>
        {section === 'Frequently Asked Questions' ? (
          <>
            <StyledCol
              style={{
                width: '90%',
                marginTop: 12.5,
                backgroundColor: '#e6e6e6',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'left',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                SABE is a mobile application designed specifically to address
                transportation challenges for students at Don Honorio Ventura
                State University in Bacolor, Pampanga.
              </StyledText14>
            </StyledCol>
            <StyledCol
              style={{
                width: '90%',
                marginTop: 10,
                backgroundColor: '#e6e6e6',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'left',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                This platform aims to reduce wait times and provide additional
                transportation options, especially during late hours, by
                connecting student drivers with student commuters through a
                convenient ridesharing system.
              </StyledText14>
            </StyledCol>
            <StyledCol
              style={{
                width: '90%',
                marginTop: 10,
                backgroundColor: '#e6e6e6',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'left',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                SABE allows drivers to pre-announce their routes and departure
                times, enabling commuters to book rides in advance and providing
                communication, real-time information, and navigation features
                for a seamless transportation experience.
              </StyledText14>
            </StyledCol>
            <StyledCol
              style={{
                width: '90%',
                marginTop: 10,
                backgroundColor: '#e6e6e6',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'left',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                Finally, our system analyzes the ratio of private vehicle owners
                to commuters, identifying any imbalances and offering
                recommendations for optimization.
              </StyledText14>
            </StyledCol>
          </>
        ) : (
          <>
            <StyledCol
              style={{
                width: '90%',
                marginTop: 10,
                backgroundColor: '#e6e6e6',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'center',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                We are a team of motivated 4th-year students pursuing
                Electronics Engineering at Don Honorio Ventura State University.
                Comprising of seven dedicated members from section 4B, we share
                a common goal: to address the transportation challenges faced by
                our fellow students at DHVSU in Bacolor, Pampanga.
              </StyledText14>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    textAlign: 'center',
                    paddingBottom: 5,
                    paddingTop: 5,
                    paddingLeft: 5,
                  },
                ]}>
                With a passion for innovation and a drive to make a positive
                impact on campus life. As students ourselves, we understand the
                importance of reliable and additional transportation. Join us in
                our mission to enhance the way students travel from DHVSU Main
                Campus. Together let's pave the way for a brighter and more
                connected future for the betterment of our transportation
                system.
              </StyledText14>
            </StyledCol>
          </>
        )}
      </StyledCol>
    </Modal>
  );
}

export default ModalInfo;
