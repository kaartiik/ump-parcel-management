import React, { useContext } from 'react';
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
import { useDispatch } from 'react-redux';
import { login, loginAnon } from '../../providers/actions/User';
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
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
});

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is a required field')
    .email("Welp, that's not an email"),
  password: yup
    .string()
    .required('Password is a required field')
    .min(6, "That can't be very secure"),
});

export default function Login({ navigation }) {
  // const { login } = useContext(AuthContext);
  const dispatch = useDispatch();

  const handleLogin = ({ email, password }) => {
    dispatch(login({ email, password }));
  };

  const handleAnonLogin = () => {
    dispatch(loginAnon());
  };

  LayoutAnimation.easeInEaseOut();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="default" />

      <Text style={styles.greeting}>{'Hello again.\nWelcome back.'}</Text>

      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={(values) => handleLogin(values)}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                touched,
                values,
                submitCount,
                errors,
              }) => {
                return (
                  <View style={{ padding: 10 }}>
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
                      <Text style={{ color: 'white' }}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>

            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={{ color: 'blue' }}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
