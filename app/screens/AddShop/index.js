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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { addBarberShop, editBarberShop } from '../../providers/actions/Barber';
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

export default function AddShop({ route, navigation }) {
  const dispatch = useDispatch();
  const { barberShop } = route.params;

  const [shopUid] = useState(barberShop ? barberShop.shop_uid : '');
  const [shopName, setShopName] = useState(
    barberShop ? barberShop.shop_name : ''
  );
  const [shopAddress, setShopAddress] = useState(
    barberShop ? barberShop.shop_address : ''
  );
  const [shopContact, setShopContact] = useState(
    barberShop ? barberShop.shop_contact : ''
  );
  const [shopOpenTime, setShopOpenTime] = useState(
    barberShop ? dayjs(barberShop.shop_open_time).format('hh:mm A') : ''
  );
  const [shopOpenTimeUnix, setShopOpenTimeUnix] = useState(
    barberShop ? barberShop.shop_open_time : 0
  );
  const [shopCloseTime, setShopCloseTime] = useState(
    barberShop ? dayjs(barberShop.shop_close_time).format('hh:mm A') : ''
  );
  const [shopCloseTimeUnix, setShopCloseTimeUnix] = useState(
    barberShop ? barberShop.shop_close_time : 0
  );
  const [submitCount, setSubmitCount] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeType, setTimeType] = useState('');

  const fieldRefName = useRef();
  const fieldRefAdd = useRef();
  const fieldRefContact = useRef();
  const fieldRefOpen = useRef();
  const fieldRefClose = useRef();

  const { isLoading } = useSelector((state) => ({
    isLoading: state.barberReducer.isLoading,
  }));

  const showDatePicker = (type) => {
    setTimeType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    const convertedTime = dayjs(time).valueOf();
    const actualTime = dayjs(time).format('hh:mm A');

    if (timeType === 'start') {
      setShopOpenTime(actualTime);
      setShopOpenTimeUnix(convertedTime);
    } else if (timeType === 'end') {
      setShopCloseTime(actualTime);
      setShopCloseTimeUnix(convertedTime);
    }
    setDatePickerVisibility(false);
  };

  const validatePost = () => {
    setSubmitCount(submitCount + 1);
    if (
      shopName !== '' &&
      shopAddress !== '' &&
      shopContact !== '' &&
      shopOpenTime !== '' &&
      shopCloseTime !== ''
    ) {
      dispatch(
        addBarberShop(
          shopName,
          shopAddress,
          shopContact,
          shopOpenTimeUnix,
          shopCloseTimeUnix,
          () => navigation.navigate('BarberShopInfo')
        )
      );
    } else {
      alert(`All fields are required.`);
    }
  };

  const validateEditPost = () => {
    setSubmitCount(submitCount + 1);
    if (
      shopName !== '' &&
      shopAddress !== '' &&
      shopContact !== '' &&
      shopOpenTime !== '' &&
      shopCloseTime !== ''
    ) {
      dispatch(
        addBarberShop(
          shopName,
          shopAddress,
          shopContact,
          shopOpenTimeUnix,
          shopCloseTimeUnix,
          () => navigation.navigate('BarberShopInfo')
        )
      );
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
                <View style={styles.textboxContainer}>
                  <TextInput
                    ref={fieldRefName}
                    placeholder="Enter shop name..."
                    value={shopName}
                    onChangeText={(text) => setShopName(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && shopName === '' && 'Required'}
                </Text>

                <View style={styles.textboxContainer}>
                  <TextInput
                    ref={fieldRefContact}
                    placeholder="Enter contact..."
                    value={shopContact}
                    onChangeText={(text) => setShopContact(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && shopContact === '' && 'Required'}
                </Text>

                <View style={styles.textboxContainer}>
                  <TextInput
                    ref={fieldRefAdd}
                    placeholder="Enter address..."
                    value={shopAddress}
                    onChangeText={(text) => setShopAddress(text)}
                  />
                </View>
                <Text style={{ color: 'red' }}>
                  {submitCount > 0 && shopAddress === '' && 'Required'}
                </Text>

                <Text>Opening Time</Text>

                <TouchableOpacity onPress={() => showDatePicker('start')}>
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        height: 38,
                        borderWidth: 1,
                        borderColor: colours.borderGrey,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text>{shopOpenTime}</Text>
                    </View>
                    <Text style={{ color: 'red' }}>
                      {submitCount > 0 && shopOpenTime === '' && 'Required'}
                    </Text>
                  </>
                </TouchableOpacity>

                <Text>Closing Time</Text>

                <TouchableOpacity onPress={() => showDatePicker('end')}>
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        height: 38,
                        borderWidth: 1,
                        borderColor: colours.borderGrey,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text>{shopCloseTime}</Text>
                    </View>
                    <Text style={{ color: 'red' }}>
                      {submitCount > 0 && shopCloseTime === '' && 'Required'}
                    </Text>
                  </>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="time"
                  onConfirm={(time) => handleConfirm(time)}
                  onCancel={hideDatePicker}
                />
              </View>

              <View>
                <View style={styles.componentContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      shopUid === '' ? validatePost() : validateEditPost()
                    }
                    style={styles.postBtn}
                  >
                    <Text style={styles.btnText}>
                      {shopUid === '' ? 'Add' : 'Update'}
                    </Text>
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

AddShop.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
