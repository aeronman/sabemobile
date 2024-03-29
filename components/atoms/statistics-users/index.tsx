import React from 'react';

import {styledText, StyledText14, StyledText18} from '../../../styles/text';
import {StyledCol, StyledRow} from '../../../styles/container';

// @ts-ignore
import Sabe from '../../../assets/icons/home-dark.svg';
// @ts-ignore
import Green from '../../../assets/icons/status-green.svg';
// @ts-ignore
import Red from '../../../assets/icons/status-red.svg';

function StatisticsUsers({type, total, verified, unverified}: any) {
  const sans = styledText();

  return (
    <StyledCol style={{width: '50%', marginTop: 5}}>
      <StyledText18 style={[sans.bold, {color: '#042F40', marginBottom: 10}]}>
        {type}
      </StyledText18>
      <StyledRow>
        <Sabe width={20} height={20} style={{marginTop: 5, marginRight: 2.5}} />
        <StyledText14 style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
          Total: {total}
        </StyledText14>
      </StyledRow>
      <StyledRow>
        <Green
          width={20}
          height={20}
          style={{marginTop: 5, marginRight: 2.5}}
        />
        <StyledText14 style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
          Verified: {verified}
        </StyledText14>
      </StyledRow>
      <StyledRow>
        <Red width={20} height={20} style={{marginTop: 5, marginRight: 2.5}} />
        <StyledText14 style={[sans.bold, {color: '#042F40', marginTop: 5}]}>
          Unverified: {unverified}
        </StyledText14>
      </StyledRow>
    </StyledCol>
  );
}

export default StatisticsUsers;
