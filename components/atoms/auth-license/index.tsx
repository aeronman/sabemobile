import React, {useState} from 'react';
import {Image} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledTouchableCol,
} from '../../../styles/container';
import {styledText, StyledText16} from '../../../styles/text';

// @ts-ignore
import PlusLogo from '../../../assets/icons/plus.svg';
// @ts-ignore
import CameraLogo from '../../../assets/icons/camera.svg';
// @ts-ignore
import UploadLogo from '../../../assets/icons/upload.svg';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

function AuthLicense({licenseImage, setLicenseImage}: any) {
  const sans = styledText();

  const [clicked, setClicked] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleClick = () => {
    setClicked(prevState => !prevState);
  };

  const openCameraCapture = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    // @ts-ignore
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        // @ts-ignore
      } else if (response.error) {
        // @ts-ignore
        console.log('Camera Error: ', response.error);
      } else {
        // @ts-ignore
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setLicenseImage(imageUri);
        // console.log(imageUri);
        setUploaded(prevState => !prevState);
      }
    });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    // @ts-ignore
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        // @ts-ignore
      } else if (response.error) {
        // @ts-ignore
        console.log('Image picker error: ', response.error);
      } else {
        // @ts-ignore
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setLicenseImage(imageUri);
        // console.log('License: ', response);
        setUploaded(prevState => !prevState);
      }
    });
  };

  return (
    <>
      <StyledCol style={{width: '100%'}}>
        <StyledText16
          style={[
            sans.bold,
            {alignSelf: 'flex-start', textAlign: 'left', color: '#042F40'},
          ]}>
          License
        </StyledText16>
        {!uploaded ? (
          !clicked ? (
            <StyledTouchableCol
              style={{
                width: '100%',
                height: 130,
                marginTop: 5,
                marginBottom: 5,
                borderWidth: 2,
                borderRadius: 15,
                borderColor: '#042f40',
              }}
              onPress={handleClick}>
              <PlusLogo width={50} height={50} />
            </StyledTouchableCol>
          ) : (
            <StyledRow
              style={{
                width: '100%',
                marginTop: 5,
                marginBottom: 5,
                height: 130,
              }}>
              <StyledTouchableCol
                style={{
                  width: '47.5%',
                  height: 130,
                  marginRight: 10,
                  borderWidth: 2,
                  borderRadius: 15,
                  borderColor: '#042f40',
                }}
                onPress={openCameraCapture}>
                <CameraLogo width={25} height={25} />
                <StyledText16
                  style={[sans.regular, {color: '#042F40', marginTop: 5}]}>
                  Take Photo
                </StyledText16>
              </StyledTouchableCol>
              <StyledTouchableCol
                style={{
                  width: '47.5%',
                  height: 130,
                  marginLeft: 10,
                  borderWidth: 2,
                  borderRadius: 15,
                  borderColor: '#042f40',
                }}
                onPress={openImagePicker}>
                <UploadLogo width={25} height={25} />
                <StyledText16
                  style={[sans.regular, {color: '#042F40', marginTop: 5}]}>
                  Upload Photo
                </StyledText16>
              </StyledTouchableCol>
            </StyledRow>
          )
        ) : (
          <Image
            style={{
              width: '100%',
              height: 130,
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 2,
              borderRadius: 15,
              borderColor: '#042f40',
            }}
            source={{uri: licenseImage}}
          />
        )}
      </StyledCol>
    </>
  );
}

export default AuthLicense;
