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
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import RegularTextBox from '../../components/RegularTextBox';
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

export default function Login() {
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
                    <RegularTextBox
                      label="Email"
                      placeholderTxt="Enter email..."
                      value={values.email}
                      handleChange={handleChange('email')}
                      errorTxt={errors.email}
                      isError={
                        touched.email || submitCount > 0 ? errors.email : null
                      }
                      handleBlur={handleBlur('email')}
                    />

                    <RegularTextBox
                      label="Password"
                      placeholderTxt="Enter password..."
                      value={values.password}
                      handleChange={handleChange('password')}
                      errorTxt={errors.password}
                      isError={
                        touched.password || submitCount > 0
                          ? errors.password
                          : null
                      }
                      handleBlur={handleBlur('password')}
                      secureTextEntry
                    />

                    <TouchableOpacity
                      style={styles.bigBtn}
                      onPress={handleSubmit}
                      title="SUBMIT"
                    >
                      <Text>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>

            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => handleAnonLogin()}
            >
              <Text style={{ color: 'blue' }}>Login as guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigate('ForgotPassword')}
            >
              <Text style={{ color: 'blue' }}>Forgot password</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
