import { observable, action, computed, decorate, runInAction } from 'mobx';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import { Alert } from 'react-native';

/**
 * 1. spot 관련
 *  - 팔로우하는 고양이 수
 *  - spotList = [ {bounds 안 고양이 위치정보} ]
 * 2. addCatBio = {
 *   img: fileName,
 *   name: string,
 *   desc: string,
 *   species: string,
 *   tagInput: string,
 *   tags: array,
 *   cut: {Y: number, N: number, unknown: number}
 * }
 * 3. cat 관련
 *  - selectedCat = [{선택한 고양이에 대한 bio}] <- 1마리면 배열에 요소 1개, 2마리 이상이면 배열에 요소 2개 이상
 *  - newTag = ""
 *  - postList = [{각 포스트에 관한 정보}]
 *  - selectedPost = 5번의 객체 하나 -> {}
 *  - inputContent = string (post의 내용)
 *  - inputPhoto = data (post의 사진)
 *  - commentList = [{6번 기준 달린 댓글들}]
 *  - inputComment = string (댓글 내용)
 *  - album = [{해당 postId에 따른 사진 정보들}]
 *  - followerList = [{해당 catId에 따른 follower들}]
 *  - reportInfo = {신고할 (postId || commentId || catId) && criminalId (userId?)}
 */

const defaultCredential = { withCredentials: true };
class CatStore {
  constructor(root) {
    this.root = root;
  }

  // observable
  spot = {
    followCatNum: 0, // 어디다 쓰지?
    list: null,
    selectedSpot: null,
  };

  addCatBio = {
    location: null,
    photoPath: null,
    catNickname: '',
    catDescription: '',
    catSpecies: '',
    catTag: '',
    catTags: null,
    catCut: { Y: 0, N: 0, unknown: 0 },
  };

  catInfo = {
    selectedCat: null,
    newTag: '',
    postList: null,
    selectedPost: null,
    inputContent: '',
    inputPhoto: null,
    commentList: null,
    inputComment: '',
    album: null,
    followerList: null,
    reportInfo: null,
  };

  // actions
  getMapInfo = (lat, long) => {
    // axios로 map 정보 get
    // res => this.spot.list에 추가
    // err => err.response.status = 404이면 this.spot.list를 빈 배열로 추가
  };

  getSelectedSpotInfo = (lat, long) => {
    const selectedSpotCats = this.spot.list.filter(
      cat => cat.location[0] === lat && cat.location[1] === long,
    );
    this.spot.selectedSpot = selectedSpotCats;
  };

  getSelectedCatInfo = catId => {
    // axios로 해당 cat 정보 get
    // res => this.catInfo.selectedCat = res.data
    // err => console
  };

  followCat = catId => {
    const {
      user: {
        userInfo: {
          myInfo: { userId },
        },
      },
    } = this.root;
    const followingInfo = { catId, userId };
    // axios로 follow cat post, followingInfo 담아서 req.body로 보내기
    // res => this.catInfo.selectedCat.isFollowing을 true로
  };

  createTagBeforeAddCat = () => {
    this.addCatBio.catTags = [...this.addCatBio.catTags, this.addCatBio.catTag];
    this.addCatBio.catTag = '';
  };

  addCat = () => {
    const {
      location,
      photoPath,
      catNickname,
      catDescription,
      catSpecies,
      catTags,
      catCut,
    } = this.addCatBio;
    axios
      .post(
        `${process.env.SERVER_URL}/cat/addcat`,
        {
          location,
          photoPath,
          catNickname,
          catDescription,
          catSpecies,
          catTags,
          catCut,
        },
        defaultCredential,
      )
      .then(res => {
        // 페이지 main으로 이동시키기
      })
      .catch(err => {
        if (err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else console.log(err);
      });
  };

  reportRainbow = type => {
    const {
      selectedCat: { rainbow },
    } = this.catInfo;
    const willChangeRainbow = rainbow;
    willChangeRainbow[type] += willChangeRainbow[type];
    willChangeRainbow[`${type}_Date`] = this.makeDateTime();
    // axios로 report Rainbow post하기, req.body는 willChangeRainbow
    // res => rainbow: res.data
    // err => console
  };

  updateCut = type => {
    const {
      selectedCat: { catCut },
    } = this.catInfo;
    const willChangeCut = catCut;
    willChangeCut[type] += willChangeCut[type];
    // axios로 cut post하기, req.body는 willChangeCut
    // res => catCut : res.data
    // err => console
  };

  createTag = () => {
    // axios로 this.catInfo.newTag와 this.catInfo.selectedCat.catId를 post 보냄
    // res => clearInput({group: "cat", key: "newTag"}) 실행
    // err => alert 처리
    // 근데 지금 api에서 안 찾아짐 -> 확인 필요
  };

  getPostList = catId => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.catInfo.postList 업데이트
  };

  addPost = () => {
    // 인풋메시지와 포토를 등록하는 함수
  };

  getCommentList = postId => {
    // 선택한 포스트 기준으로 댓글 리스트를 받아오는 함수
  };

  addComment = () => {
    // 댓글 인풋 메시지를 등록하는 함수
  };

  getAlbums = catId => {
    // 탭 렌더 시 앨범 리스트를 받아오는 함수
  };

  selectPhoto = photoId => {
    // 앨범에서 선택한 포토를 기준으로 모달에 띄우는 함수
  };

  getFollowerList = catId => {
    // 탭 렌더 시 팔로워 리스트를 받아오는 함수
  };

  makeDateTime = () => {
    const YYYY = new Date().getFullYear();
    const MM =
      new Date().getMonth() > 9
        ? new Date().getMonth()
        : `0${new Date().getMonth()}`;
    const DD =
      new Date().getDate() > 9
        ? new Date().getDate()
        : `0${new Date().getDate()}`;
    return `${YYYY}-${MM}-${DD}`;
  };

  updateInput = (group, key, text) => {
    this[group][key] = text;
  };

  clearInput = (...pairs) => {
    pairs.forEach(function(pair) {
      const { group, key } = pair;
      this[group][key] = '';
    });
  };
}

decorate(CatStore, {
  spot: observable,
  addCatBio: observable,
  catInfo: observable,
  getMapInfo: action,
  getSelectedSpotInfo: action,
  getSelectedCatInfo: action,
  followCat: action,
  createTagBeforeAddCat: action,
  addCat: action,
  reportRainbow: action,
  updateCut: action,
  createTag: action,
  getPostList: action,
  addPost: action,
  getCommentList: action,
  addComment: action,
  getAlbums: action,
  selectPhoto: action,
  getFollowerList: action,
  makeDateTime: action,
  updateInput: action,
  clearInput: action,
});

export default CatStore;