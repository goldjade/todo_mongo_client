/** @format */

import React from 'react';
import SignUpDiv from '../styles/signUpCss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//firebase 기본코드를 포함
import firebase from '../firebase';
import axios from 'axios';
const SignUp = () => {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  //연속버튼을 막는 변수
  const [btFlag, setBtFlag] = useState(false);

  const navigate = useNavigate();
  //firebase 회원가입 기능
  const registFunc = (e) => {
    e.preventDefault();

    // 각 항목을 입력했는지 체크
    // 빈 분자열 체크를 정규표현식 형식으로 추후 업데이트
    // nickName 빈 문자열인지 체크
    if (!nickName) {
      return alert('닉네임을 입력해주세요');
    }
    if (!email) {
      return alert('이메일을 입력해주세요');
    }
    if (!pw) {
      return alert('비밀번호를 입력해주세요');
    }
    if (!pwCheck) {
      return alert('비밀번호 확인을 입력해주세요');
    }
    //비밀 번호가 같은지 비교처리
    if (pw !== pwCheck) {
      return alert('비밀번호가 일치하지 않습니다.');
    }
    // 3.닉네임 검사 요청
    if (!nameCheck) {
      return alert('닉네임 중복검사를 해주세요');
    }

    //연속 클릭 막기
    setBtFlag(true);
    // firebase로 이메일과 비밀번호를 전송
    //https://firebase.google.com/docs/auth/web/start?hl=ko&authuser=3#web-version-9_1
    const createUser = firebase.auth();
    createUser
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // 회원가입이 된경우
        const user = userCredential.user;
        // console.log(user);
        //사용자 프로필의 displayName 업데이트
        //https://firebase.google.com/docs/auth/web/manage-users
        user
          .updateProfile({ displayName: nickName })
          .then(() => {
            //데이터베이스로 정보를 저장한다
            //사용자 정보를 저장한다.(이메일,닉네임,사용자 UID
            // console.log(user);

            let body = {
              email: user.email,
              displayName: user.displayName,
              uid: user.uid,
            };
            axios
              .post('/api/user/register', body)
              .then((response) => {
                // console.log(response.data);
                if (response.data.success) {
                  // 회원정보 저장 성공
                  navigate('/login');
                } else {
                  //회원정보 저장 실패
                  console.log('회원정보 저장 실패시 다시 저장 시도');
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch(() => {
            //프로필
          });
      })
      .catch((error) => {
        setBtFlag(false);
        // 회원가입이 실패한 경우
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  //2이름 중복 검사
  const [nameCheck, setNameCheck] = useState(false);
  const nameCheckFn = (e) => {
    e.preventDefault();
    //닉네임이 입력되어있는지 체크
    if (!nickName) {
      alert('닉네임을 입력해 주세요.');
    }
    //데이터베이스 서버 UserModel 에서 닉네임 존재 여부 파악
    const body = {
      displayName: nickName,
    };
    axios
      .post('/api/user/namecheck', body)
      // 서버에서 정상적 처리
      .then((res) => {
        if (res.data.success) {
          if (res.data.check) {
            //등록가능
            // 사용자 중복체크 완료
            setNameCheck(true);
            alert('사용 가능합니다.');
          } else {
            // 등록불가능
            setNameCheck(false);
            alert('이미 등록된 닉네임입니다.');
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="p-6 m-4 shadow ">
      <h2>SignUp</h2>
      <SignUpDiv>
        <form>
          <label>닉네임</label>
          <input
            type="text"
            required
            value={nickName}
            minLength={3}
            maxLength={20}
            onChange={(e) => setNickName(e.target.value)}
          />
          <button onClick={(e) => nameCheckFn(e)}>닉네임 중복검사</button>

          <label>이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            required
            value={pw}
            maxLength={16}
            minLength={6}
            onChange={(e) => setPw(e.target.value)}
          />
          <label>비밀번호 확인</label>
          <input
            type="password"
            required
            value={pwCheck}
            maxLength={16}
            minLength={6}
            onChange={(e) => setPwCheck(e.target.value)}
          />
          <button
            disabled={btFlag}
            onClick={(e) => {
              registFunc(e);
            }}
          >
            회원가입
          </button>
        </form>
      </SignUpDiv>
    </div>
  );
};

export default SignUp;
