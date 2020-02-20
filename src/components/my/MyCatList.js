import React from 'react';
import { inject, observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, Text } from 'native-base';
import MyCat from './MyCat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f5',
  },
  radiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
  },
  listView: {
    paddingTop: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  txt: {
    color: '#767577',
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    textAlign: 'center',
  },
  noCatView: {
    flex: 1,
    backgroundColor: '#edf1f5',
  },
  noCatRadiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    paddingTop: 50,
    alignItems: 'center',
  },
  noCatTxt: {
    color: '#7f8296',
    fontSize: 18,
    paddingBottom: 15,
  },
});

class MyCatList extends React.Component {
  componentDidMount() {
    console.log('MyCatList mount');
    this.props.getMyCatList();
  }

  render() {
    const { userInfo, myCatList } = this.props;
    if (myCatList && myCatList[0].cats.length > 0) {
      return (
        <View style={styles.container}>
          <View style={styles.radiusView}>
            <View style={styles.listView}>
              <Text style={styles.txt}>
                {`${userInfo.nickname}의 돌봄이 필요한 고양이 ${myCatList[0].cats.length} 마리`}
              </Text>
              {myCatList[0].cats.map((cat, idx) => (
                <MyCat
                  key={`${cat.id}_${cat.nickname}`}
                  idx={idx}
                  catNickname={cat.nickname}
                  catPhoto={cat.photos.path}
                  address={cat.address}
                />
              ))}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.noCatView}>
        <View style={styles.noCatRadiusView}>
          <Text style={styles.noCatTxt}>You don't follow any cat.</Text>
          <Text note>Follow the cats!</Text>
        </View>
      </View>
    );
  }
}
export default inject(({ auth, user }) => ({
  userInfo: auth.userInfo,
  myCatList: user.myCatList,
  getMyCatList: user.getMyCatList,
}))(observer(MyCatList));
