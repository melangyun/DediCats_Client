import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Content, Item, Label, Input, Textarea } from 'native-base';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    height: '85%',
    flexDirection: 'row',
  },
  photoView: {
    width: '50%',
  },
  photo: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  defaultPhoto: {
    width: 180,
    height: 180,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
  },
  catPhoto: {
    width: 180,
    height: 180,
    resizeMode: 'stretch',
    overflow: 'hidden',
    borderRadius: 30,
    borderColor: '#edf1f5',
    borderWidth: 1,
  },
  uploading: { flex: 1, alignItems: 'center', marginTop: 10 },
  uploadBtn: { color: '#767577' },
  bioView: {
    width: '100%',
    paddingTop: 10,
    fontSize: 14,
  },
  intro: { borderRadius: 10, marginVertical: 10 },
  peanuts: { flex: 1, flexDirection: 'row', paddingVertical: 15 },
  peanutF: {
    width: 50,
    height: 40,
    marginRight: 10,
    backgroundColor: '#edf1f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peanutT: {
    width: 50,
    height: 40,
    marginRight: 10,
    backgroundColor: '#f38847',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutTxtT: { color: 'white', fontWeight: 'bold' },
  cutTxtF: { color: '#767577', fontWeight: 'bold' },
  submit: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#677ef1',
    borderRadius: 14,
    marginHorizontal: 10,
  },
  submitTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
const DEFAULT_CAT =
  'https://www.pngitem.com/pimgs/m/85-850345_dog-puppy-silhouette-svg-png-icon-free-download.png';

const AddCatBio = ({
  addCatUri,
  addCatNickname,
  addCatSpecies,
  addCatDescription,
  addCatCutClicked,
  getPermissionAsync,
  pickImage,
  getMapInfo,
  updateInput,
  selectCut,
  validateAddCat,
  getAddress,
  addCat,
  navigation,
}) => (
  <View style={styles.container}>
    <View style={styles.flex1}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior="padding"
        enabled
      >
        <View style={styles.row}>
          <View style={styles.photoView}>
            <View style={styles.photo}>
              {addCatUri ? (
                <Image style={styles.catPhoto} source={{ uri: addCatUri }} />
              ) : (
                <Image
                  style={styles.defaultPhoto}
                  source={{
                    uri: DEFAULT_CAT,
                  }}
                />
              )}
            </View>
            <View style={styles.uploading}>
              <TouchableOpacity
                onPress={async () => {
                  await getPermissionAsync();
                  pickImage('cat', 'addCat');
                }}
              >
                <Text style={styles.uploadBtn}>Upload photo</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Content style={styles.bioView}>
            <Item stackedLabel last>
              <Label>별명</Label>
              <Input
                value={addCatNickname}
                maxLength={10}
                onChangeText={text => {
                  updateInput('cat', 'addCatNickname', text);
                }}
              />
            </Item>
            <Item stackedLabel last>
              <Label>추정 종(예: 코숏)</Label>
              <Input
                value={addCatSpecies}
                maxLength={12}
                onChangeText={text => {
                  updateInput('cat', 'addCatSpecies', text);
                }}
              />
            </Item>
            <Textarea
              rowSpan={3}
              maxLength={30}
              bordered
              placeholder="간략한 고양이 소개(30자 이내)"
              style={styles.intro}
              value={addCatDescription}
              onChangeText={text => {
                updateInput('cat', 'addCatDescription', text);
              }}
            />
            <Item stackedLabel last>
              <Label>중성화</Label>
              <View style={styles.peanuts}>
                <TouchableOpacity
                  style={addCatCutClicked.Y ? styles.peanutT : styles.peanutF}
                  onPress={() => selectCut('addCat', 'Y')}
                >
                  <Text
                    style={addCatCutClicked.Y ? styles.cutTxtT : styles.cutTxtF}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={addCatCutClicked.N ? styles.peanutT : styles.peanutF}
                  onPress={() => selectCut('addCat', 'N')}
                >
                  <Text
                    style={addCatCutClicked.N ? styles.cutTxtT : styles.cutTxtF}
                  >
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    addCatCutClicked.unknown ? styles.peanutT : styles.peanutF
                  }
                  onPress={() => selectCut('addCat', 'unknown')}
                >
                  <Text
                    style={
                      addCatCutClicked.unknown ? styles.cutTxtT : styles.cutTxtF
                    }
                  >
                    몰라요
                  </Text>
                </TouchableOpacity>
              </View>
            </Item>
          </Content>
        </View>
        <View style={styles.submit}>
          <TouchableOpacity
            onPress={async () => {
              const validation = await validateAddCat();
              if (validation) {
                const addressResult = await getAddress();
                if (addressResult) {
                  const addCatResult = await addCat();
                  if (addCatResult) {
                    navigation.goBack();
                    await getMapInfo();
                  } else {
                    console.log('등록 실패');
                    Alert.alert('고양이를 등록할 수 없습니다');
                    navigation.goBack();
                  }
                } else {
                  console.log('주소검증 실패');
                  Alert.alert('고양이를 등록할 수 없습니다');
                  navigation.goBack();
                }
              } else {
                console.log('검증 실패');
              }
            }}
          >
            <Text style={styles.submitTxt}>Finish</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  </View>
);

export default inject(({ cat, map, auth, helper }) => ({
  addCatUri: cat.addCatUri,
  addCatNickname: cat.addCatNickname,
  addCatSpecies: cat.addCatSpecies,
  addCatDescription: cat.addCatDescription,
  addCatCutClicked: cat.addCatCutClicked,
  getMapInfo: map.getMapInfo,
  getPermissionAsync: auth.getPermissionAsync,
  pickImage: helper.pickImage,
  updateInput: helper.updateInput,
  selectCut: cat.selectCut,
  validateAddCat: cat.validateAddCat,
  getAddress: cat.getAddress,
  addCat: cat.addCat,
}))(observer(withNavigation(AddCatBio)));
