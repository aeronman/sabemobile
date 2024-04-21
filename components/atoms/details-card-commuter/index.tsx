import React, {useState} from 'react';
import {Dimensions, Image, Modal, Text, TouchableOpacity, View} from 'react-native';

import {styledText, StyledText14, StyledText16} from '../../../styles/text';
import {
  StyledCol,
  StyledRow,
  StyledTouchableCol,
  StyledTouchableRow,
} from '../../../styles/container';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import ArrowRight from '../../../assets/icons/arrow-right.svg';
// @ts-ignore
import Check from '../../../assets/icons/check.svg';

function DetailsCardCommuter({id, data, onApprove}: any) {
  const sans = styledText();

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleApprove = () => {
    onApprove(id);
  };

  return (
    <>
      {/* {showID && (
        // <StyledTouchableCol
        //   style={{
        //     position: 'absolute',
        //     justifyContent: 'flex-start',
        //     width: '100%',
        //     height: '100%',
        //     zIndex: 2,
        //   }}
        //   onPress={handleShowID}>
        //   <StyledCol
        //     style={{
        //       position: 'absolute',
        //       justifyContent: 'flex-start',
        //       width: '100%',
        //       height: '100%',
        //       backgroundColor: 'gray',
        //       opacity: 0.5,
        //     }}
        //   />
        //   <Image
        //     source={{uri: data.schoolIDUrl}}
        //     style={{
        //       width: Dimensions.get('window').width * 0.85,
        //       height: '100%',
        //       marginTop: 50,
        //       borderRadius: 10,
        //     }}
        //   />
        // </StyledTouchableCol>
      )} */}

      {/* Modal for larger image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleModal} style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
            <Text style={{ color: 'white', fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: data.schoolIDUrl }} style={{ width: '80%', height: '80%' }} />
        </View>
      </Modal>

      <StyledCol
        style={{
          justifyContent: 'space-between',
          width: '85%',
          height: 175,
          marginTop: 25,
          marginBottom: 5,
          paddingTop: 12.5,
          paddingBottom: 12.5,
          backgroundColor: '#fff',
          borderRadius: 10,
        }}>
        <StyledRow
          style={{
            width: '87.5%',
            justifyContent: 'space-between',
          }}>
          <SabeLogo width={25} height={25} />
          <StyledTouchableRow onPress={toggleModal}>
            <StyledText14 style={[sans.bold, {color: '#042F40'}]}>
              View ID/s
            </StyledText14>
            <ArrowRight width={25} height={25} />
          </StyledTouchableRow>
        </StyledRow>

        <StyledCol style={{width: '90%'}}>
          <StyledText14
            style={[
              sans.regular,
              {
                color: '#1FBF83',
                alignSelf: 'flex-start',
              },
            ]}>
            Email
          </StyledText14>
          <StyledText16
            style={[
              sans.bold,
              {
                color: '#042F40',
                alignSelf: 'flex-start',
              },
            ]}>
            {data.email}
          </StyledText16>
        </StyledCol>

        <StyledRow style={{width: '90%', justifyContent: 'space-between'}}>
          <StyledCol>
            <StyledText14
              style={[
                sans.regular,
                {
                  color: '#1FBF83',
                  alignSelf: 'flex-start',
                },
              ]}>
              Name
            </StyledText14>
            <StyledText16
              style={[
                sans.bold,
                {
                  color: '#042F40',
                  alignSelf: 'flex-start',
                },
              ]}>
              {data.name}
            </StyledText16>
          </StyledCol>
          <StyledCol>
            <StyledText14
              style={[
                sans.regular,
                {
                  color: '#1FBF83',
                  alignSelf: 'flex-start',
                },
              ]}>
              Phone
            </StyledText14>
            <StyledText16
              style={[
                sans.bold,
                {
                  color: '#042F40',
                  alignSelf: 'flex-start',
                },
              ]}>
              {data.contact}
            </StyledText16>
          </StyledCol>
        </StyledRow>

        <StyledRow
          style={{
            width: '90%',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <StyledCol>
            <StyledText14
              style={[
                sans.regular,
                {
                  color: '#1FBF83',
                  alignSelf: 'flex-start',
                },
              ]}>
              Type
            </StyledText14>
            <StyledText16
              style={[
                sans.bold,
                {
                  color: '#042F40',
                  alignSelf: 'flex-start',
                },
              ]}>
              {data.type.toUpperCase()}
            </StyledText16>
          </StyledCol>
          <StyledRow>
            <StyledTouchableRow style={{marginLeft: 5}} onPress={handleApprove}>
              <Check width={25} height={25} />
            </StyledTouchableRow>
          </StyledRow>
        </StyledRow>
      </StyledCol>
    </>
  );
}

export default DetailsCardCommuter;
