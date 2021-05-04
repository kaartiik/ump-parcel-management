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
  Image,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Item, Picker } from 'native-base';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { deleteProduct } from '../../providers/actions/Product';
import colours from '../../providers/constants/colours';
import AppBar from '../../components/AppBar';

dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  mainTextContainer: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bigBtn: {
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: colours.themePrimary,
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const productCategories = {
  c1: {
    label: 'Books & Stationeries',
  },
  c2: {
    label: 'Clothes & Accessories',
  },
  c3: {
    label: 'Food',
  },
  c4: {
    label: 'Furniture',
  },
  c5: {
    label: 'Home & Living',
  },
  c6: {
    label: 'Kitchenware',
  },
  c7: {
    label: 'Toiletries',
  },
  c8: {
    label: 'Vehicles & Accessories',
  },
  c9: {
    label: 'Others',
  },
};

export default function ViewProduct({ route, navigation }) {
  const dispatch = useDispatch();

  const { uuid, sellerInfo, currentProduct, isLoading } = useSelector(
    (state) => ({
      uuid: state.userReducer.uuid,
      sellerInfo: state.productReducer.sellerInfo,
      currentProduct: state.productReducer.currentProduct,
      isLoading: state.productReducer.isLoading,
    })
  );

  const renderImages = ({ index, item }) => (
    <Image
      source={{ uri: item.imageUri }}
      style={{
        height: 350,
        width: 250,
        resizeMode: 'cover',
        borderRadius: 4,
        margin: 8,
      }}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <AppBar />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                horizontal
                data={currentProduct.productImages}
                renderItem={renderImages}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.mainTextContainer}>
                  {currentProduct.productName}
                </Text>
                <Text style={styles.mainTextContainer}>
                  {currentProduct.sellType}
                </Text>
              </View>

              <View
                style={{
                  height: 0.5,
                  width: '100%',
                  backgroundColor: colours.gray,
                  marginVertical: 5,
                }}
              />

              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}
                >
                  Item Information
                </Text>
                <Text>Description: {currentProduct.description}</Text>
                <Text>Price: {currentProduct.price}</Text>
                <Text>Meet Up Location: {currentProduct.meetUpLocation}</Text>
                <Text>
                  Category: {productCategories[currentProduct.category].label}
                </Text>
              </View>

              {sellerInfo.sellerUuid === uuid ? (
                <View>
                  <TouchableOpacity
                    style={styles.bigBtn}
                    onPress={() =>
                      dispatch(
                        deleteProduct(currentProduct.productUid, () =>
                          navigation.goBack()
                        )
                      )
                    }
                  >
                    <Text style={{ color: 'white' }}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bigBtn}
                    onPress={() => navigation.navigate('EditProduct')}
                  >
                    <Text style={{ color: 'white' }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: colours.themePrimaryLight,
                    borderRadius: 4,
                    padding: 5,
                    marginVertical: 10,
                    flexDirection: 'row',
                  }}
                >
                  <Image
                    source={{ uri: sellerInfo.sellerPicture }}
                    style={{ height: 50, width: 50, borderRadius: 25 }}
                  />

                  <View
                    style={{
                      marginLeft: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '80%',
                      justifyContent: 'space-between',
                      paddingRight: 5,
                    }}
                  >
                    <View>
                      <Text style={{ flexShrink: 1 }}>
                        {sellerInfo.sellerName}
                      </Text>
                      <Text style={{ flexShrink: 1 }}>
                        {sellerInfo.sellerLocation}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ChatsTab', {
                          screen: 'ChatScreen',
                          params: {
                            nameClicked: sellerInfo.sellerName,
                            uidClicked: sellerInfo.sellerUuid,
                            tokenClicked: sellerInfo.sellerToken,
                            productClicked: currentProduct,
                          },
                        })
                      }
                    >
                      <Ionicons
                        name="ios-chatbubble-ellipses"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

ViewProduct.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
