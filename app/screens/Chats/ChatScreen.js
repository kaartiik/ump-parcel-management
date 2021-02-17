import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { sendMessage } from '../../providers/actions/User';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import colours from '../../providers/constants/colours';
dayjs.extend(customParseFormat);

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    height: 70,
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 30,
    height: 30,
    borderRadius: 50 / 2,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chatAvatarName: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgText: {
    color: '#fff',
    padding: 7,
    fontSize: 16,
  },
  msgTime: {
    color: '#eee',
    padding: 3,
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  chatTxtInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '85%',
    borderRadius: 5,
    marginBottom: 3,
    padding: 5,
    backgroundColor: 'white',
  },
  chtTxtBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  chtBtn: {
    backgroundColor: colours.themePrimary,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
});

export default function ChatScreen({ route, navigation }) {
  const { nameClicked, uidClicked, tokenClicked } = route.params;
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState('');
  const [existingMsgs, setExistingMsgs] = useState([]);

  const { allChats, uuid, isLoading } = useSelector((state) => ({
    allChats: state.userReducer.allChats,
    uuid: state.userReducer.uuid,
    isLoading: state.userReducer.isLoading,
  }));

  useEffect(() => {
    const msgArr =
      allChats !== null &&
      uidClicked !== null &&
      uidClicked !== undefined &&
      uidClicked !== ''
        ? Object.values(allChats[uidClicked])
        : [];
    setExistingMsgs(msgArr);
  }, [allChats]);

  const handleSendMessage = async () => {
    if (textMessage.length > 0) {
      dispatch(sendMessage(uidClicked, tokenClicked, textMessage));
      setTextMessage('');
    }
  };

  const renderRow = ({ item }) => {
    return (
      <View
        style={{
          width: '60%',
          alignSelf: item.from === uuid ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === uuid ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
          padding: 5,
        }}
      >
        <Text style={styles.msgText}>{item.message}</Text>

        <Text style={styles.msgTime}>
          {dayjs(item.time).format('hh:mm A DD-MM-YYYY')}
        </Text>
      </View>
    );
  };

  let { height, width } = Dimensions.get('window');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.screenHeader}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
            <Ionicons
              style={{ padding: 10 }}
              name="ios-arrow-back"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.chatAvatarName}>
          <Image
            source={require('../../../assets/avatar.png')}
            style={styles.chatAvatar}
          />

          <Text style={styles.screenTitle}>{nameClicked}</Text>
        </View>

        <View style={{ flex: 1 }}></View>
      </View>

      <FlatList
        style={{ padding: 10, height: height * 0.8 }}
        data={existingMsgs}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        keyboardDismissMode="on-drag"
      />
      <View style={styles.chtTxtBtnContainer}>
        <TextInput
          style={styles.chatTxtInput}
          value={textMessage}
          placeholder="Type message..."
          multiline={true}
          textAlignVertical="top"
          onChangeText={(val) => setTextMessage(val)}
        />

        <TouchableOpacity
          onPress={() => handleSendMessage()}
          style={styles.chtBtn}
        >
          <Ionicons name="ios-send" size={28} color={'white'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
