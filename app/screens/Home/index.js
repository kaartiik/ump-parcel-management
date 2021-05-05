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
import { Item, Picker } from 'native-base';
import AppBar from '../../components/AppBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colours from '../../providers/constants/colours';
import {
  getAllProducts,
  getCategoryProducts,
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
  textboxContainer: {
    backgroundColor: colours.themePrimaryLight,
    borderRadius: 3,
    padding: 5,
    marginVertical: 5,
  },
  pickerOuterContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: colours.themePrimary,
  },
  pickerContainer: { width: '95%', alignSelf: 'center' },
});

const productCategories = [
  { label: 'All', value: 'all' },
  { label: 'Books & Stationeries', value: 'c1' },
  { label: 'Clothes & Accessories', value: 'c2' },
  { label: 'Food', value: 'c3' },
  { label: 'Furniture', value: 'c4' },
  { label: 'Home & Living', value: 'c5' },
  { label: 'Kitchenware', value: 'c6' },
  { label: 'Toiletries', value: 'c7' },
  { label: 'Vehicles & Accessories ', value: 'c8' },
  { label: 'Others', value: 'c9' },
];

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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [data, setData] = useState([]);

  const { allProducts, isLoading } = useSelector((state) => ({
    allProducts: state.productReducer.allProducts,
    isLoading: state.productReducer.isLoading,
  }));

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllProducts());
    }, [])
  );

  useEffect(() => {
    setData(allProducts);
  }, [allProducts]);

  const searchData = (searchText) => {
    let newData = [];
    if (searchText) {
      newData = allProducts.filter((item) => {
        return item.productName.indexOf(searchText) > -1;
      });
      setData([...newData]);
    } else {
      setData([...allProducts]);
    }
  };

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
          data={data}
          numColumns={2}
          ListHeaderComponent={
            <View style={{ padding: 5 }}>
              <View style={styles.textboxContainer}>
                <TextInput
                  placeholder="Search..."
                  value={search}
                  onChangeText={(text) => {
                    setSearch(text);
                    searchData(text);
                  }}
                />
              </View>

              <Text style={{ marginVertical: 5 }}>Sort by Category</Text>

              <View style={styles.pickerOuterContainer}>
                <Picker
                  style={styles.pickerContainer}
                  selectedValue={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    dispatch(getCategoryProducts(value));
                  }}
                >
                  {productCategories.map((item, idx) => (
                    <Picker.Item
                      key={idx}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          }
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
