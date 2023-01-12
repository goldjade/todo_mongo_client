/** @format */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearUser } from './reducer/userSlice';
//fire 라이브러리 모듈 활용
import firebase from './firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import UserInfo from './pages/UserInfo';
import SignUp from './pages/SignUp';
import Todo from './pages/Todo';
export default function App() {
  //action 보내서 store.user.state를 업데이트
  const dispatch = useDispatch();
  //내용 출력하기
  // const user = useSelector((state) => state.user);
  //로그인 상태 테스트
  useEffect(() => {
    // fire의 사용자 로그인 변경이벤트
    firebase.auth().onAuthStateChanged((userInfo) => {
      //로그인시 출력정보 확인
      // console.log('로그인 정보 : ', userInfo);
      if (userInfo) {
        //로그인 했음
        //strer.user.state에 저장 뭘? info를
        //여기에서의 userinfo는 firebace 사이트에서 준것
        // payload로 넘어감
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        //로그아웃 했음
        //store.user.state를 초기화
        dispatch(clearUser());
      }
    });
  });
  // useEffect(() => {
  //   //{uid", nickName:"", accessToken:""}
  //   console.log(user);
  // }, [user]);
  //임시로 로그아웃을 컴포넌트가 마운트 될때 실행
  // useEffect(() => {
  //   //로그아웃
  //   // firebase.auth().signOut();
  // }, []);

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
