import React from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    padding: 50,
  },
  displayNone: {
    display: 'none',
  },
  title: {
    paddingTop: 20,
    fontSize: 25,
    fontWeight: '600',
  },
  btn: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#677ef1',
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  white: {
    color: 'white',
  },
  font16: {
    fontSize: 16,
  },
});

const ChangePW = ({
  email, findPW, updateInput, navigation
}) => (
  <Container>
    <Header style={styles.displayNone} />
    <View style={styles.logo}>
      <Text style={styles.title}>비밀번호 재발급</Text>
    </View>
    <Content>
      <Form>
        <Item floatingLabel>
          <Label>
            <MaterialCommunityIcons
              name="email-check-outline"
              style={styles.font16}
            />{' '}
            가입된 이메일
          </Label>
          <Input
            onChangeText={(text) => updateInput('auth', 'email', text)}
            value={email}
          />
        </Item>
      </Form>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          const reuslt = await findPW();
          if (reuslt) navigation.goBack();
        }}
      >
        <Text style={styles.white}>send Mail!</Text>
      </TouchableOpacity>
    </Content>

  </Container>
);

export default inject(({ helper, auth, user }) => ({
  findPW: user.findPW,
  email: auth.email,
  updateInput: helper.updateInput,
}))(observer(ChangePW));
