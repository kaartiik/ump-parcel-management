import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { Input, Item, Label } from 'native-base';
import colours from '../providers/constants/colours';

const RegularTextBox = ({
  label,
  mandatory,
  placeholderTxt,
  isFormik,
  value,
  handleChange,
  errorTxt,
  isError,
  secureTextEntry,
  handleBlur,
  multiline,
  height,
  maxLength,
}) => {
  return (
    <>
      <Label style={{ fontSize: 14 }}>
        {label}
        {mandatory && <Text style={{ color: 'red' }}>*</Text>}
      </Label>

      <Item
        error={isError}
        regular
        style={{
          marginTop: 10,
          marginBottom: 5,
          backgroundColor: 'white',
          height,
        }}
      >
        <Input
          multiline={multiline}
          style={{ fontSize: 15 }}
          label={label}
          placeholder={placeholderTxt}
          value={value}
          onChangeText={isFormik ? handleChange : (text) => handleChange(text)}
          secureTextEntry={secureTextEntry}
          onBlur={handleBlur && handleBlur}
          maxLength={maxLength}
        />
      </Item>
      {isError && (
        <Text style={{ color: colours.errorText, fontSize: 12 }}>
          {errorTxt}
        </Text>
      )}
    </>
  );
};

RegularTextBox.defaultProps = {
  mandatory: false,
  isFormik: false,
  errorTxt: '',
  isError: false,
  secureTextEntry: false,
  handleBlur: null,
  multiline: false,
  height: 38,
  maxLength: 500,
};

RegularTextBox.propTypes = {
  mandatory: PropTypes.bool,
  label: PropTypes.string.isRequired,
  placeholderTxt: PropTypes.string.isRequired,
  isFormik: PropTypes.bool,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  errorTxt: PropTypes.string,
  isError: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  handleBlur: PropTypes.func,
  multiline: PropTypes.bool,
  height: PropTypes.number,
  maxLength: PropTypes.number,
};

export default RegularTextBox;
