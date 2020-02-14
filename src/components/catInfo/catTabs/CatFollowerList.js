import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import CatFollower from './CatFollower';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6772f1',
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
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
  },
  noFollowerView: {
    flex: 1,
    backgroundColor: '#6772f1',
  },
  noFollowerRadiusView: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'white',
    paddingTop: 50,
    alignItems: 'center',
  },
  noFollowerTxt: { color: '#7f8296', fontSize: 18, paddingBottom: 15 },
});

class CatFollowerList extends React.Component {
  componentDidMount() {
    console.log('CatFollowerList mount');
    this.props.getFollowerList(this.props.catId);
  }

  render() {
    const { myInfo, followerList, nickname } = this.props;
    console.log(followerList || followerList.length);
    if (myInfo && followerList && followerList[0].users.length) {
      return (
        <View style={styles.container}>
          <Container style={styles.radiusView}>
            <Content>
              <Header style={{ display: 'none' }} />
              <List style={styles.listView}>
                <Text style={styles.txt}>
                  {followerList[0].users.length === 1
                    ? `${followerList[0].users.length} follower`
                    : `${followerList[0].users.length} followers`}
                </Text>
                {followerList[0].users.map((follower, idx) => (
                  <CatFollower
                    key={`${follower.id}_${follower.nickname}`}
                    idx={idx}
                    myPhoto={follower.photoPath}
                    userNickName={follower.nickname}
                    catName={nickname}
                  />
                ))}
                <CatFollower />
              </List>
            </Content>
          </Container>
        </View>
      );
    }
    if (myInfo) {
      return (
        <View style={styles.noFollowerView}>
          <View style={styles.noFollowerRadiusView}>
            <Text style={styles.noFollowerTxt}>
              {`There's no follower for ${nickname} now.`}
            </Text>
            <Text>Be the FIRST Follower!</Text>
          </View>
        </View>
      );
    }
    return <View />;
  }
}

export default inject(({ cat, user }) => ({
  myInfo: user.info.myInfo,
  followerList: cat.info.followerList,
  catId: cat.info.selectedCat[0].id,
  nickname: cat.info.selectedCat[0].nickname,
  getFollowerList: cat.getFollowerList,
}))(observer(CatFollowerList));
