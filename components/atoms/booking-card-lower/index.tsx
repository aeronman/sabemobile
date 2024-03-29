import React from 'react';

import {StyledCol, StyledRow} from '../../../styles/container';
import {styledText, StyledText14, StyledText16} from '../../../styles/text';

function BookingCardLower({routes, prices}: any) {
  const sans = styledText();

  return (
    <StyledRow
      style={{
        justifyContent: 'space-evenly',
        width: '100%',
        height: 'auto',
        minHeight: 200,
        maxHeight: 200,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}>
      <StyledCol style={{justifyContent: 'space-around', height: '90%'}}>
        {
          // @ts-ignore
          routes.map((route, index) => (
            <StyledCol key={index} style={{width: '100%'}}>
              <StyledText14
                style={[
                  sans.regular,
                  {
                    color: '#1FBF83',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {index + 1}
                {index === 0
                  ? 'st'
                  : index === 1
                  ? 'nd'
                  : index === 2
                  ? 'rd'
                  : 'th'}{' '}
                stop
              </StyledText14>
              <StyledText16
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                {route}
              </StyledText16>
              <StyledText16
                style={[
                  sans.regular,
                  {
                    color: '#042F40',
                    alignSelf: 'flex-start',
                  },
                ]}>
                PHP {prices[index]}
              </StyledText16>
            </StyledCol>
          ))
        }
      </StyledCol>
      <StyledCol>
        <StyledCol
          style={{
            justifyContent: 'space-around',
            width: 15,
            height: '90%',
            backgroundColor: '#1FBF83',
            borderRadius: 20,
          }}>
          {
            // @ts-ignore
            routes.map((key, index) => (
              <StyledCol
                key={index}
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                }}
              />
            ))
          }
        </StyledCol>
      </StyledCol>
    </StyledRow>
  );
}

export default BookingCardLower;
