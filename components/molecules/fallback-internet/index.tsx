import React from 'react';

import {StyledCol, StyledSafeAreaView} from '../../../styles/container';
import {styledText, StyledText16, StyledText60} from '../../../styles/text';

// @ts-ignore
import HomeLogoDark from '../../../assets/icons/home-dark.svg';

// @ts-ignore
function FallbackUnverified() {
  const sans = styledText();

  return (
    <StyledSafeAreaView style={{backgroundColor: '#f3f3f3'}}>
      <StyledCol>
        <HomeLogoDark width={75} height={75} />
      </StyledCol>
      <StyledCol style={{paddingBottom: 50}}>
        <StyledText60 style={[sans.bold, {color: '#03314B'}]}>
          Sabe
        </StyledText60>
      </StyledCol>
      <StyledCol>
        <StyledText16 style={[sans.regular, {color: '#03314B'}]}>
          🚧 Weak or No Internet Connection. 🚧
        </StyledText16>
      </StyledCol>
    </StyledSafeAreaView>
  );
}

export default FallbackUnverified;
