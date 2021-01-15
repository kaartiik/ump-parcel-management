import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
} from 'react-native';
import { Picker } from 'native-base';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import RegularTextBox from '../../components/RegularTextBox';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../components/LoadingIndicator';
import { uploadRecipeWithImages } from '../../providers/actions/Recipes';
import colours from '../../providers/constants/colours';

const styles = StyleSheet.create({
  imagePreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 180,
    width: 240,
    margin: 5,
    backgroundColor: 'lightgrey',
    borderWidth: 1.5,
    borderTopColor: 'black',
  },
  imagePreview: {
    margin: 5,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  componentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    margin: 10,
    width: 170,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 10,
  },
  regBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themeSecondary,
    borderRadius: 20,
    padding: 10,
  },
  postBtn: {
    margin: 10,
    width: 170,
    backgroundColor: colours.themePrimary,
    borderRadius: 20,
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
  },
});

export default function UploadRecipe({ route, navigation }) {
  // const { isAdmin } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [imageSelected, setImageSelected] = useState(false);
  const [recipeType, setRecipeType] = useState('breakfast_recipes');
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [camera, setCamera] = useState('');
  const [cameraRoll, setCameraRoll] = useState('');
  const [imgUriArr, setImgUriArr] = useState(null);

  const fieldRefTitle = useRef();
  const fieldRefIngr = useRef();
  const fieldRefDescr = useRef();

  const { isLoading } = useSelector((state) => ({
    isLoading: state.recipeReducer.isLoading,
  }));

  const clearText = () => {
    fieldRefTitle.current.clear();
    fieldRefIngr.current.clear();
    fieldRefDescr.current.clear();
    setTitle('');
    setIngredients('');
    setDescription('');
    setImgUriArr(null);
    setImageSelected(false);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearText();
      };
    }, [])
  );

  const checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCamera(status);

    const { status: statusRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    setCameraRoll(statusRoll);
  };

  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  const uniqueId = () => {
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;
  };

  const findNewImage = async () => {
    checkPermissions().then(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImgUriArr({
          imgUri: result.uri,
          imgId: uniqueId(),
        });
        setImageSelected(true);
      }
    });
  };

  const validatePost = async () => {
    if (title === '') {
      alert('Recipe Title must not be empty!');
    }
    if (ingredients === '') {
      alert('Recipe Ingredients must not be empty!');
    }
    if (description === '') {
      alert('Recipe Description must not be empty!');
    }
    if (title !== '' && ingredients !== '' && description !== '') {
      dispatch(
        uploadRecipeWithImages(title, ingredients, description, imgUriArr)
      );
    }
  };

  const clearAllImages = () => {
    setImgUriArr(null);

    setImageSelected(false);
  };

  const RenderImg = () => {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: imgUriArr.imgUri }} style={styles.imagePreview} />
        <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Ionicons
            style={{ padding: 10 }}
            name="ios-trash"
            size={22}
            color="red"
            onPress={() => {
              setImageSelected(false);
              setImgUriArr(null);
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {imageSelected && <RenderImg />}

            <Picker
              style={{ width: 120 }}
              selectedValue={recipeType}
              onValueChange={(value) => setRecipeType(value)}
            >
              <Picker.Item label="Breakfast" value="breakfast_recipes" />
              <Picker.Item label="Lunch" value="lunch_recipes" />
              <Picker.Item label="Dinner" value="dinner_recipes" />
            </Picker>

            <View style={{ margin: 20 }}>
              <RegularTextBox
                label="Recipe Title"
                value={title}
                handleChange={setTitle}
                errorTxt="Required"
                isError={title === ''}
              />

              <RegularTextBox
                label="Recipe Ingredients"
                multiline
                value={ingredients}
                handleChange={setIngredients}
                errorTxt="Required"
                isError={ingredients === ''}
              />

              <RegularTextBox
                label="Recipe Description"
                multiline
                value={description}
                handleChange={setDescription}
                errorTxt="Required"
                isError={description === ''}
              />
            </View>

            <View>
              <View style={styles.componentContainer}>
                {imageSelected ? (
                  <TouchableOpacity
                    onPress={() => clearAllImages()}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.btnText}>Remove Photo</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => findNewImage()}
                    style={styles.regBtn}
                  >
                    <Text style={styles.btnText}>Add Images</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => validatePost()}
                  style={styles.postBtn}
                >
                  <Text style={styles.btnText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </ScrollView>

      {isLoading && <LoadingIndicator progress={progress} />}
    </KeyboardAvoidingView>
  );
}

UploadRecipe.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
