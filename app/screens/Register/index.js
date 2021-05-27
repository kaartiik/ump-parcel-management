import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { Item, Picker } from 'native-base';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../providers/actions/User';
import LoadingIndicator from '../../components/LoadingIndicator';
import colours from '../../providers/constants/colours';

// import { AuthContext } from '../navigation/AuthProvider';\

const IMAGE_DIMENSION = 50;

const styles = StyleSheet.create({
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  bigBtn: {
    marginVertical: 5,
    marginHorizontal: 30,
    backgroundColor: colours.themePrimary,
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  pickerOuterContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: colours.themePrimary,
    marginTop: 10,
  },
  pickerContainer: { width: '95%', alignSelf: 'center' },
});

const validationSchema = yup.object().shape({
  usertype: yup.string().required('Required'),
  username: yup.string().required('Required'),
  idnumber: yup.string().required('Required'),
  email: yup.string().required('Required').email('Please enter a valid email'),
  password: yup.string().required('Required').min(6, 'Minimum 6 characters'),
});

const USER_TYPES = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Staff', value: 'Staff' },
  { label: 'Student', value: 'Student' },
];

export default function Register({ navigation }) {
  LayoutAnimation.easeInEaseOut();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => ({
    isLoading: state.userReducer.isLoading,
  }));

  const handleLogin = ({ usertype, username, idnumber, email, password }) => {
    dispatch(register(usertype, username, idnumber, email, password));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.form}>
              <Formik
                initialValues={{
                  usertype: '',
                  username: '',
                  idnumber: '',
                  email: '',
                  password: '',
                }}
                onSubmit={(values) => handleLogin(values)}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  touched,
                  values,
                  submitCount,
                  errors,
                }) => {
                  return (
                    <View style={{ padding: 10 }}>
                      <Text style={styles.greeting}>
                        {'Hello there.\nRegister an account.'}
                      </Text>

                      <View style={styles.pickerOuterContainer}>
                        <Picker
                          style={styles.pickerContainer}
                          selectedValue={values.usertype}
                          onValueChange={(value) =>
                            setFieldValue('usertype', value)
                          }
                        >
                          <Picker.Item
                            key="default"
                            label="Select user type"
                            value=""
                          />
                          {USER_TYPES.map((item, idx) => (
                            <Picker.Item
                              key={idx}
                              label={item.label}
                              value={item.value}
                            />
                          ))}
                        </Picker>
                      </View>
                      <Text style={{ color: 'red' }}>
                        {(touched.usertype || submitCount > 0) &&
                          errors.usertype}
                      </Text>

                      <View style={styles.textboxContainer}>
                        <TextInput
                          placeholder="Enter name..."
                          value={values.username}
                          onChangeText={handleChange('username')}
                          onBlur={handleBlur('username')}
                        />
                      </View>
                      <Text style={{ color: 'red' }}>
                        {(touched.username || submitCount > 0) &&
                          errors.username}
                      </Text>

                      <View style={styles.textboxContainer}>
                        <TextInput
                          placeholder="Enter ID number..."
                          value={values.idnumber}
                          onChangeText={handleChange('idnumber')}
                          onBlur={handleBlur('idnumber')}
                        />
                      </View>
                      <Text style={{ color: 'red' }}>
                        {(touched.idnumber || submitCount > 0) &&
                          errors.idnumber}
                      </Text>

                      <View style={styles.textboxContainer}>
                        <TextInput
                          placeholder="Enter email..."
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                        />
                      </View>
                      <Text style={{ color: 'red' }}>
                        {(touched.email || submitCount > 0) && errors.email}
                      </Text>

                      <View style={styles.textboxContainer}>
                        <TextInput
                          secureTextEntry
                          placeholder="Enter password..."
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                        />
                      </View>
                      <Text style={{ color: 'red' }}>
                        {(touched.password || submitCount > 0) &&
                          errors.password}
                      </Text>

                      <TouchableOpacity
                        style={styles.bigBtn}
                        onPress={handleSubmit}
                        title="SUBMIT"
                      >
                        <Text style={{ color: 'white' }}>Register</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => navigation.goBack()}
                      >
                        <Text style={{ color: 'blue' }}>
                          Aready have an account? Sign in here.
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              </Formik>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
