import React, { useState, useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
} from 'react-native';
import { Picker } from 'native-base';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { confirmBooking } from '../../providers/actions/Client';
import colours from '../../providers/constants/colours';
import AppBar from '../../components/AppBar';

dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
  nonEditableContainer: {
    flexDirection: 'row',
    backgroundColor: colours.themePrimaryLight,
    height: 38,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 5,
  },
  componentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  regBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themeSecondary,
    borderRadius: 20,
    padding: 10,
  },
  postBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themePrimary,
    borderRadius: 20,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
  },
});

export default function ConfirmBooking({ route, navigation }) {
  const { shopItem, timestamp } = route.params;
  const dispatch = useDispatch();

  const [servicesList] = useState(shopItem.services.split(','));
  const [service, setService] = useState('');

  // const [bookingTime, setBookingTime] = useState('');
  // const [bookingTimeUnix, setBookingTimeUnix] = useState(0);

  const [submitCount, setSubmitCount] = useState(0);
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const { uuid, name, email, mobile, isLoading } = useSelector((state) => ({
    uuid: state.userReducer.uuid,
    name: state.userReducer.name,
    email: state.userReducer.email,
    mobile: state.userReducer.mobile,
    isLoading: state.clientReducer.isLoading,
  }));

  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userMobile, setUserMobile] = useState(mobile);

  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };

  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  // const handleConfirm = (time) => {
  //   alert(time);
  //   const convertedTime = dayjs(time).valueOf();
  //   const actualTime = dayjs(time).format('DD MMM YYYY hh:mm A');

  //   setBookingTime(actualTime);
  //   setBookingTimeUnix(convertedTime);

  //   setDatePickerVisibility(false);
  // };

  const validatePost = () => {
    setSubmitCount(submitCount + 1);
    if (
      service !== '' &&
      userName !== '' &&
      userMobile !== '' &&
      userEmail !== ''
    ) {
      dispatch(
        confirmBooking(
          shopItem.shop_uid,
          service,
          timestamp,
          uuid,
          userName,
          userMobile,
          userEmail
        )
      );
    } else {
      alert(`All fields are required.`);
    }
  };

  const validateEditPost = () => {
    setSubmitCount(submitCount + 1);
    if (service) {
      dispatch(addBarberShop(shopOpenTimeUnix));
    } else {
      alert(`All fields are required.`);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={{ margin: 20 }}>
                <Text>Service</Text>

                <Picker
                  style={{ width: '95%', alignSelf: 'center' }}
                  selectedValue={service}
                  onValueChange={(value) => setService(value)}
                >
                  <Picker.Item label="Select" value="" />
                  {servicesList.map((item, idx) => (
                    <Picker.Item key={idx} label={item} value={item} />
                  ))}
                </Picker>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && service === '' && 'Required'}
                </Text>

                <Text>Name</Text>
                <View style={styles.textboxContainer}>
                  <TextInput
                    placeholder="Enter name..."
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && userName === '' && 'Required'}
                </Text>

                <Text>Mobile</Text>
                <View style={styles.textboxContainer}>
                  <TextInput
                    placeholder="Enter mobile..."
                    value={userMobile}
                    onChangeText={(text) => setUserMobile(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && userMobile === '' && 'Required'}
                </Text>

                <Text>Email</Text>
                <View style={styles.textboxContainer}>
                  <TextInput
                    placeholder="Enter email..."
                    value={userEmail}
                    onChangeText={(text) => setUserEmail(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && userEmail === '' && 'Required'}
                </Text>

                <Text>Booking Time</Text>

                <View style={styles.nonEditableContainer}>
                  <Text>{dayjs(timestamp).format('hh:mm A')}</Text>
                </View>

                <Text style={{ marginTop: 12 }}>Date</Text>

                <View style={styles.nonEditableContainer}>
                  <Text>{dayjs(timestamp).format('DD-MM-YYYY')}</Text>
                </View>
                {/* <Text style={{ color: 'red' }}>
                      {submitCount > 0 && bookingTime === '' && 'Required'}
                    </Text> */}

                {/* <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={(time) => handleConfirm(time)}
                  onCancel={hideDatePicker}
                /> */}
              </View>

              <View>
                <View style={styles.componentContainer}>
                  <TouchableOpacity
                    onPress={() => validatePost()}
                    style={styles.postBtn}
                  >
                    <Text style={styles.btnText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

ConfirmBooking.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
