/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Left } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoadingIndicator from '../../components/LoadingIndicator';

import colours from '../../providers/constants/colours';

dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  divider: {
    marginVertical: 10,
    marginHorizontal: 16,
    height: 0.5,
    width: '100%',
    backgroundColor: colours.borderGrey,
    alignSelf: 'center',
  },
});

const JOURNAL_STATUS = [
  {
    text: 'PENDING',
    textColour: 'black',
    color: colours.pendingGrey,
  },
  {
    text: 'SAVED',
    textColour: 'white',
    color: colours.savedViolet,
  },
  {
    text: 'PUBLISHED',
    textColour: 'white',
    color: colours.publishedPurple,
  },
  {
    text: 'REVERTED',
    textColour: 'white',
    color: colours.revertedOrange,
  },
  {
    text: 'AMENDED',
    textColour: 'white',
    color: colours.amendedBlue,
  },
  {
    text: 'VERIFIED',
    textColour: 'white',
    color: colours.lightBlue,
  },
  {
    text: 'APPROVED',
    textColour: 'white',
    color: colours.lightGreen,
  },
];

function CalendarScreen({ route }) {
  const dispatch = useDispatch();
  const { shopItem } = route.params;
  const navigation = useNavigation();

  const CalendarArrow = ({ direction }) => {
    return direction === 'left' ? (
      <Ionicons name="ios-arrow-back" size={20} />
    ) : (
      <Ionicons name="ios-arrow-forward" size={20} />
    );
  };

  CalendarArrow.propTypes = {
    direction: PropTypes.string.isRequired,
  };

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 40 }}>
      <TouchableOpacity
        style={{ alignSelf: 'flex-end', padding: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Feather name="x" size={18} color="black" />
      </TouchableOpacity>

      <View style={{ padding: 10 }}>
        <Calendar
          markingType="custom"
          current={dayjs().format('YYYY-MM-DD')}
          minDate={dayjs().format('YYYY-MM-DD')}
          // maxDate={}
          onDayPress={(day) => {
            navigation.navigate('TimeSlots', { shopItem, day });
            // dispatch(saveDate(day));
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat="MMMM yyyy"
          renderArrow={(direction) => <CalendarArrow direction={direction} />}
          hideExtraDays
          firstDay={0}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          disableAllTouchEventsForDisabledDays
          renderHeader={(date) => (
            <Text style={{ fontSize: 15, color: 'black' }}>
              {dayjs(date).format('MMMM YYYY')}
            </Text>
          )}
          enableSwipeMonths
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 15,
          }}
        ></View>
        <View />
      </View>
    </View>
  );
}

export default CalendarScreen;
