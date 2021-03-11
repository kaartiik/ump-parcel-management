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
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from 'native-base';
import { useDispatch } from 'react-redux';
import { register } from '../../providers/actions/User';
import { navigate } from '../../providers/services/NavigatorService';
import colours from '../../providers/constants/colours';

// import { AuthContext } from '../navigation/AuthProvider';\

const styles = StyleSheet.create({
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  bigBtn: {
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
});

const validationSchema = yup.object().shape({
  role: yup.string().required('Required'),
  name: yup.string().required('Required'),
  mobile: yup.string().required('Required'),
  email: yup.string().required('Required').email('Please enter a valid email'),
  password: yup.string().required('Required').min(6, 'Minimum 6 characters'),
});

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const handleLogin = ({ role, name, mobile, email, password }) => {
    dispatch(register(role, name, mobile, email, password));
  };

  LayoutAnimation.easeInEaseOut();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="default" />

      <Text style={styles.greeting}>
        {'Hello there.\nRegister an account.'}
      </Text>

      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Formik
              initialValues={{
                role: '',
                name: '',
                mobile: '',
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
                    <Picker
                      style={{ width: '95%', alignSelf: 'center' }}
                      selectedValue={values.role}
                      onValueChange={(value) => setFieldValue('role', value)}
                    >
                      <Picker.Item label="Select" value="" />
                      <Picker.Item label="Barber" value="barber" />
                      <Picker.Item label="Client" value="user" />
                    </Picker>
                    <Text style={{ color: 'red' }}>
                      {(touched.role || submitCount > 0) && errors.role}
                    </Text>

                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter name..."
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.name || submitCount > 0) && errors.name}
                    </Text>

                    <View style={styles.textboxContainer}>
                      <TextInput
                        placeholder="Enter mobile number..."
                        value={values.mobile}
                        onChangeText={handleChange('mobile')}
                        onBlur={handleBlur('mobile')}
                      />
                    </View>
                    <Text style={{ color: 'red' }}>
                      {(touched.mobile || submitCount > 0) && errors.mobile}
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
                      {(touched.password || submitCount > 0) && errors.password}
                    </Text>

                    <TouchableOpacity
                      style={styles.bigBtn}
                      onPress={handleSubmit}
                      title="SUBMIT"
                    >
                      <Text style={{ color: 'white' }}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ justifyContent: 'center', alignItems: 'center' }}
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
    </KeyboardAvoidingView>
  );
}
