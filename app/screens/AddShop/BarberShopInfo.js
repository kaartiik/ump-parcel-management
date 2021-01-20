import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import colours from '../../providers/constants/colours';
import AppBar from '../../components/AppBar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: colours.borderGrey,
    borderRadius: 3,
    padding: 10,
  },
  editButton: {
    height: 35,
    width: '45%',
    alignSelf: 'flex-end',
    margin: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: colours.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldSet: {
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: colours.borderGrey,
  },
  legend: {
    position: 'absolute',
    top: -10,
    left: 10,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    marginVertical: 10,
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
  info: { fontWeight: 'bold', marginRight: 30, width: '40%' },
});

const FormInfo = ({ fieldName, fieldInfo }) => (
  <View
    style={{
      flexDirection: 'column',
    }}
  >
    <Text style={styles.info}>{fieldName}</Text>
    <Text>{fieldInfo}</Text>
  </View>
);

export default function BarberShopInfo() {
  const navigation = useNavigation();

  LayoutAnimation.easeInEaseOut();

  const { barberShop } = useSelector((state) => ({
    barberShop: state.barberReducer.barberShop,
  }));

  return (
    <View style={{ flex: 1 }}>
      <AppBar />

      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('AddShop', {
                  barberShop,
                })
              }
            >
              <Ionicons
                name="ios-create"
                size={18}
                color={colours.themePrimary}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: colours.lightBlue }}>Edit Info</Text>
            </TouchableOpacity>

            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Info</Text>
              <FormInfo
                fieldName="Shop Name"
                fieldInfo={barberShop.shop_name}
              />
              <View style={styles.divider} />
              <FormInfo
                fieldName="Contact"
                fieldInfo={`+${barberShop.shop_contact}`}
              />

              <View style={styles.divider} />
              <FormInfo
                fieldName="Address"
                fieldInfo={`${barberShop.shop_address}`}
              />

              <View style={styles.divider} />
              <FormInfo
                fieldName="Opening Time"
                fieldInfo={`${dayjs(barberShop.shop_open_time).format(
                  'hh:mm A'
                )}`}
              />

              <View style={styles.divider} />
              <FormInfo
                fieldName="Closing Time"
                fieldInfo={`${dayjs(barberShop.shop_close_time).format(
                  'hh:mm A'
                )}`}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
