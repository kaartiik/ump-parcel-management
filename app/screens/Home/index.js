import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colours from '../../providers/constants/colours';
import {
  getAllProducts,
  getProductUserInfo,
} from '../../providers/actions/Product';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  recipeDescription: {
    marginVertical: 3,
    width: 220,
  },
  bookingItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  previewImg: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  flatlistEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
  },
});

const RenderItem = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={{ marginTop: 10, padding: 10 }}
      onPress={() => dispatch(getProductUserInfo(item))}
    >
      <Image
        source={{ uri: Object.values(item.productImages)[0].image_url }}
        style={{ height: 150, width: 150, borderRadius: 4 }}
      />
      <View
        style={{
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          height: 50,
          width: 150,
          position: 'absolute',
          left: 10,
          bottom: 0,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.price}</Text>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {item.sellType}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Home({ route, navigation }) {
  const dispatch = useDispatch();

  const { allProducts, isLoading } = useSelector((state) => ({
    allProducts: state.productReducer.allProducts,
    isLoading: state.productReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllProducts());
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Products</Text>

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={allProducts}
          numColumns={2}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No products</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default Home;
