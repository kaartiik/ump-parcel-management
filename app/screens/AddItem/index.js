import React from 'react';
import {
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import colours from '../../providers/constants/colours';
import AppBar from '../../components/AppBar';

dayjs.extend(customParseFormat);

const styles = StyleSheet.create({});

export default function AddItem({ route, navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 25,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 6,
          backgroundColor: colours.white,
          elevation: 5,
        }}
        onPress={() => navigation.navigate('BarCodeScannerScreen')}
      >
        <Text>Scan QR</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
