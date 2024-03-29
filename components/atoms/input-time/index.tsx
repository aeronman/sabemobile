import React, {useState} from 'react';

import {
  StyledCol,
  StyledRow,
  StyledTouchableRow,
} from '../../../styles/container';
import {styledText, StyledText14, StyledText26} from '../../../styles/text';

import DatePicker from 'react-native-date-picker';

// @ts-ignore
import DateLogo from '../../../assets/icons/date.svg';
// @ts-ignore
import TimeLogo from '../../../assets/icons/time.svg';

function InputTime({mode, time, setTime}: any) {
  const sans = styledText();

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <StyledCol
      style={{
        justifyContent: 'flex-start',
        width: mode === 'Journey Date' ? '100%' : '50%',
      }}>
      <StyledRow style={{alignSelf: 'flex-start'}}>
        <StyledText14
          style={[sans.regular, {color: '#1FBF83', alignSelf: 'flex-start'}]}>
          {mode}
        </StyledText14>
        <StyledText14
          style={[
            sans.regular,
            {color: '#e70000', alignSelf: 'flex-start', marginLeft: 5},
          ]}>
          *
        </StyledText14>
      </StyledRow>
      <StyledRow style={{alignSelf: 'flex-start'}}>
        <StyledText26
          style={[sans.bold, {color: '#042F40', alignSelf: 'flex-start'}]}>
          {time}
        </StyledText26>
        <StyledTouchableRow
          style={{
            alignSelf: 'flex-start',
            width: 22,
            height: 22,
            marginLeft: 5,
            marginTop: 5,
            borderColor: '042F40',
            borderWidth: 2,
            borderRadius: 7.5,
          }}
          onPress={() => setOpen(true)}>
          {mode === 'Journey Date' ? (
            <DateLogo width={12.5} height={12.5} />
          ) : (
            <TimeLogo width={12.5} height={12.5} />
          )}
        </StyledTouchableRow>
      </StyledRow>
      <DatePicker
        modal
        mode={mode === 'Journey Date' ? 'date' : 'time'}
        minuteInterval={15}
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);

          let formattedString;
          if (mode === 'Journey Date') {
            formattedString = date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          } else {
            formattedString = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
          }

          setTime(formattedString);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </StyledCol>
  );
}

export default InputTime;
