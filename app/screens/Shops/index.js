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

import colours from '../../providers/constants/colours';

import { getBarberShops } from '../../providers/actions/Client';

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
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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

const RenderItem = ({ item, navigation }) => {
  const dispatch = useDispatch();

  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <TouchableOpacity
        style={styles.recipeItem}
        onPress={() =>
          navigation.navigate('CalendarScreen', { shopItem: item })
        }
      >
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              color: colours.lightBlue,
              marginVertical: 3,
            }}
          >
            {item.shop_name.toUpperCase()}
          </Text>
          <Text style={styles.recipeDescription}>
            {`${dayjs(item.shop_open_time).format('hh:mm A')} - ${dayjs(
              item.shop_close_time
            ).format('hh:mm A')}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

RenderItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function Shops({ navigation }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const { isAdmin, barberShops, isLoading } = useSelector((state) => ({
    isAdmin: state.userReducer.isAdmin,
    barberShops: state.clientReducer.barberShops,
    isLoading: state.clientReducer.isLoading,
  }));

  useEffect(() => {
    dispatch(getBarberShops());
  }, []);

  useEffect(() => {
    setData([...barberShops]);
  }, [barberShops]);

  const searchData = (searchText) => {
    let newData = [];
    if (searchText) {
      newData = barberShops.filter((item) => {
        const uSearchText = searchText.toUpperCase();
        const uTitle = item.shop_name.toUpperCase();

        return uTitle.indexOf(uSearchText) > -1;
      });
      setData([...newData]);
    } else {
      setData([...barberShops]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>Barber Shops</Text>

        <View style={styles.divider} />
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            searchData(text);
          }}
        />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={data}
          renderItem={({ item, index }) => (
            <RenderItem key={index} item={item} navigation={navigation} />
          )}
          ListEmptyComponent={
            <View style={styles.flatlistEmptyContainer}>
              <Text>No barber shops available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default Shops;
