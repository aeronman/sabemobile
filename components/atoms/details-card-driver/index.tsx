import React, {useState} from 'react';
import {Dimensions, Image} from 'react-native';

import {
  StyledCol,
  StyledRow,
  StyledTouchableCol,
  StyledTouchableRow,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText16} from '../../../styles/text';

// @ts-ignore
import SabeLogo from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import ArrowRight from '../../../assets/icons/arrow-right.svg';
// @ts-ignore
import CircleArrowLeft from '../../../assets/icons/arrow-left-circle.svg';
// @ts-ignore
import CircleArrowLeftDisabled from '../../../assets/icons/arrow-left-circle-disabled.svg';
// @ts-ignore
import CircleArrowRight from '../../../assets/icons/arrow-right-circle.svg';
// @ts-ignore
import CircleArrowRightDisabled from '../../../assets/icons/arrow-right-circle-disabled.svg';
// @ts-ignore
import Check from '../../../assets/icons/check.svg';

function DetailsCardDriver({id, data, onApprove}: any) {
  const sans = styledText();

  const [showID, setShowID] = useState(false);
  const [step, setStep] = useState(2);

  const handleShowID = () => {
    setShowID(prevState => !prevState);
  };

  const handleApprove = () => {
    onApprove(id);
  };

  const handleStepAdd = () => {
    setStep(2);
  };

  const handleStepMinus = () => {
    setStep(1);
  };

  return (
    <>
      {showID && (
        <StyledTouchableCol
          style={{
            justifyContent: 'flex-start',
            width: '100%',
            height: Dimensions.get('window').height,
            zIndex: 2,
          }}
          onPress={handleShowID}>
          <StyledCol
            style={{
              position: 'absolute',
              justifyContent: 'flex-start',
              width: '100%',
              height: Dimensions.get('window').height * 1,
              backgroundColor: 'gray',
              opacity: 0.5,
            }}
          />
          <Image
            source={{uri: step === 1 ? data.regIDUrl : data.licenseIDUrl}}
            style={{
              width: Dimensions.get('window').width * 0.85,
              height: Dimensions.get('window').height * 0.6,
              marginTop: 50,
              marginBottom: 15,
              borderRadius: 10,
            }}
          />
          {step === 1 && (
            <StyledRow>
              <StyledRow style={{marginRight: 5}}>
                <CircleArrowLeftDisabled width={25} height={25} />
              </StyledRow>
              <StyledTouchableRow
                style={{marginLeft: 5}}
                onPress={handleStepAdd}>
                <CircleArrowRight width={25} height={25} />
              </StyledTouchableRow>
            </StyledRow>
          )}
          {step === 2 && (
            <StyledRow>
              <StyledTouchableRow
                style={{marginRight: 5}}
                onPress={handleStepMinus}>
                <CircleArrowLeft width={25} height={25} />
              </StyledTouchableRow>
              <StyledRow style={{marginLeft: 5}}>
                <CircleArrowRightDisabled width={25} height={25} />
              </StyledRow>
            </StyledRow>
          )}
        </StyledTouchableCol>
      )}

      {!showID && (
        <StyledCol
          style={{
            justifyContent: 'space-between',
            width: '85%',
            height: 275,
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
            <StyledTouchableRow onPress={handleShowID}>
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

          <StyledRow style={{width: '90%'}}>
            <StyledCol style={{width: '60%'}}>
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
            <StyledCol style={{width: '40%'}}>
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

          <StyledRow style={{width: '90%'}}>
            <StyledCol style={{width: '60%'}}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#1FBF83',
                    alignSelf: 'flex-start',
                  },
                ]}>
                Car Make
              </StyledText14>
              <StyledText16
                style={[
                  sans.bold,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {data.carMake}
              </StyledText16>
            </StyledCol>
            <StyledCol style={{width: '40%'}}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#1FBF83',
                    alignSelf: 'flex-start',
                  },
                ]}>
                Car Series
              </StyledText14>
              <StyledText16
                style={[
                  sans.bold,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {data.carSeries}
              </StyledText16>
            </StyledCol>
          </StyledRow>

          <StyledRow style={{width: '90%'}}>
            <StyledCol style={{width: '60%'}}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#1FBF83',
                    alignSelf: 'flex-start',
                  },
                ]}>
                Car Color
              </StyledText14>
              <StyledText16
                style={[
                  sans.bold,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {data.carColor}
              </StyledText16>
            </StyledCol>
            <StyledCol style={{width: '40%'}}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#1FBF83',
                    alignSelf: 'flex-start',
                  },
                ]}>
                Plate Number
              </StyledText14>
              <StyledText16
                style={[
                  sans.bold,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {data.carPlate}
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
      )}
    </>
  );
}

export default DetailsCardDriver;
