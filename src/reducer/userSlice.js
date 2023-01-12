/** @format */

//작은 store 역할의 slice
//사용자 정보 저장 내용이라서  userSlice 라고 지음
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    //기본적인 형태 스키마 라고 생각 초기값
    nickName: '', //사용자 닉네임
    uid: '', //pb 연동을 위한 고유 식별자
    accessToken: '', //임시로 만들어진 인증키 fir에서 임시생성
    email: '', //사용자 이메일
  },
  //위 스테이트를 변경하는거
  reducers: {
    //로그인 되면 user 스토어 state 업데이트
    loginUser: (state, action) => {
      //action.payload로 담겨옴
      state.nickName = action.payload.displayName;
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
    },
    //로그아웃 하면 user 스토어 state 비우기(초기화)
    clearUser: (state, action) => {
      state.nickName = '';
      state.uid = '';
      state.accessToken = '';
      state.email = '';
    },
  },
});
//비구조화
export const { loginUser, clearUser } = userSlice.actions;
export default userSlice;
