/** @format */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpDiv from '../styles/signUpCss';

// firebase 기본 코드를 포함
import firebase from '../firebase';
import axios from 'axios';
// user 정보 가져오기
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { loginUser, clearUser } from '../reducer/userSlice';

const UserInfo = () => {
  // 사용자 정보 수정을 위해서 정보를 가지고 옮
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // firebae 사용자 인증 정보
  const fireUser = firebase.auth();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  useEffect(() => {
    setNickName(user.nickName);
    setEmail(user.email);
    setPw('');
    setPwCheck('');
  }, []);

  const navigate = useNavigate();

  // 닉네임 중복 검사
  const [nickName, setNickName] = useState('');
  const [nameCheck, setNameCheck] = useState(false);
  const nameCheckFn = (e) => {
    e.preventDefault();
    // 닉네임이 입력되었는지 체크
    if (!nickName) {
      return alert('닉네임을 입력해주세요.');
    }
    // 데이터베이스 서버 UserModel 에서 닉네임 존재 여부 파악
    const body = {
      displayName: nickName,
    };
    axios
      .post('/api/user/namecheck', body)
      .then((response) => {
        // 서버에서 정상적 처리 완료
        if (response.data.success) {
          if (response.data.check) {
            // 등록가능
            // 사용자 중복 체크 완료
            setNameCheck(true);
            alert('등록이 가능합니다.');
          } else {
            // 등록 불가능
            setNameCheck(false);
            alert('이미 등록된 닉네임입니다.');
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

// 닉네임 변경요청
const nameUpdateFn = (e) => {
  e.preventDefault();
  if (!nickName) {
    return alert("닉네임을 입력하세요.");
  }
  // 닉네임 검사 요청
  if (!nameCheck) {
    return alert("닉네임 중복검사를 해주세요.");
  }
  // firebase 에 사용자 프로필 업데이트 실행
  fireUser.currentUser
    .updateProfile({
      displayName: nickName,
    })
    .then(() => {
      alert("닉네임을 변경하였습니다.");
      let body = {
        email: email,
        displayName: nickName,
        uid: user.uid,
      };
      axios
        .post("/api/user/update", body)
        .then((response) => {
          // 서버에 사용자 이메일을 변경한다.
          // 변경하고 나서 dipatch 보내주는 것으로 수정
          // 실제 사용자 화면 및 userSlice state 정보 업데이트
          if (response.data.success) {
            alert("정보가 업데이트 되었습니다.");
            const userInfo = {
              displayName: nickName,
              uid: user.uid,
              accessToken: user.accessToken,
              email: email,
            };
            dispatch(loginUser(userInfo));
            setNickName(nickName);
          } else {
            alert("정보 업데이트가 실패하였습니다.");
          }
        })
        .catch((error) => {
          // alert("서버가 불안정하게 연결하였습니다.");
          console.log(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert("서버가 불안정하게 연결하였습니다.\n다시 로그인 해주세요.");
      firebase.auth().signOut();
      dispatch(clearUser());
      navigate("/login");
    });
};
// 이메일 변경요청
const emailUpdateFn = (e) => {
  e.preventDefault();
  // 닉네임 검사 요청
  if (!email) {
    return alert("이메일을 입력하세요.");
  }

  // firebase 이메일 변경 요청
  fireUser.currentUser
    .updateEmail(email)
    .then(() => {
      let body = {
        email: email,
        displayName: nickName,
        uid: user.uid,
      };
      axios
        .post("/api/user/update", body)
        .then((response) => {
          // 서버에 사용자 이메일을 변경한다.
          // 변경하고 나서 dipatch 보내주는 것으로 수정
          // 실제 사용자 화면 및 userSlice state 정보 업데이트
          if (response.data.success) {
            alert("정보가 업데이트 되었습니다.");
            const userInfo = {
              displayName: nickName,
              uid: user.uid,
              accessToken: user.accessToken,
              email: email,
            };
            dispatch(loginUser(userInfo));
            setEmail(email);
          } else {
            alert("정보 업데이트가 실패하였습니다.");
          }
        })
        .catch((error) => {
          // alert("서버가 불안정하게 연결하였습니다.");
          console.log(error);
        });
    })
    .catch((error) => {
      // 로그인 실패
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert("서버가 불안정하게 연결하였습니다.\n다시 로그인 해주세요.");
      firebase.auth().signOut();
      dispatch(clearUser());
      navigate("/login");
    });
};

  // 비밀번호 변경요청
  const passUpdateFn = (e) => {
    e.preventDefault();
    if (!pw) {
      return alert('비밀번호를 입력하세요.');
    }
    if (!pwCheck) {
      return alert('비밀번호 확인을 입력하세요.');
    }
    // 비밀번호가 같은지 비교처리
    if (pw !== pwCheck) {
      return alert('비밀번호는 같아야 합니다.');
    }
    // firebase 비밀번호 변경 요청
    fireUser.currentUser
      .updatePassword(pw)
      .then(() => {
        alert('비밀번호를 변경하였습니다.');
        setPw(pw);
        setPwCheck('');
      })
      .catch((error) => {
        // 로그인 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert('서버가 불안정하게 연결하였습니다.\n다시 로그인 해주세요.');
        firebase.auth().signOut();
        dispatch(clearUser());
        navigate('/login');
      });
  };
  // 회원 탈퇴
  const registOutFunc = (e) => {
    e.preventDefault();
    // firebase 회원 삭제
    fireUser.currentUser
      .delete()
      .then(() => {
        // 사용자 기록 한 할일 전부 삭제
        // 사용자 정보도 삭제
        let body = {
          uid: user.uid,
        };
        axios
          .post('/api/post/userout', body)
          .then((response) => {
            if (response.data.success) {
              alert('회원 탈퇴하였습니다.');
              // 회원정보 삭제 성공
              dispatch(clearUser());
              navigate('/login');
            } else {
              // 회원정보 삭제 실패
              console.log('회원정보 삭제 실패시에는 다시 저장을 도전한다.');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>User Info</h2>
      <SignUpDiv>
        <form>
          <div className="flex justify-start mb-3">
            <label className="mr-5 text-xl ">닉네임</label>
            <input
              type="text"
              className="mr-5"
              required
              maxLength={20}
              minLength={3}
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
            <button className="mr-5" onClick={(e) => nameCheckFn(e)}>
              닉네임 중복검사
            </button>
            <button onClick={(e) => nameUpdateFn(e)}>닉네임 변경</button>
          </div>
        </form>

        <form>
          <div className="flex justify-start mb-3">
            <label className="mr-5 text-xl">이메일</label>
            <input
              type="email"
              className="mr-5"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={(e) => emailUpdateFn(e)}>이메일 변경</button>
          </div>
        </form>
        <form>
          <div className="mb-3">
            <div className=" text-xl font-bold mb-3">비밀번호 변경</div>
            <div className="flex justify-start mb-3">
              <label className="mr-5 text-sm items-center ">비밀번호</label>
              <input
                type="password"
                className="mr-5"
                required
                maxLength={16}
                minLength={6}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <label className="mr-5 text-sm items-center ">
                비밀번호 확인
              </label>
              <input
                type="password"
                className="mr-5"
                required
                maxLength={16}
                minLength={6}
                value={pwCheck}
                onChange={(e) => setPwCheck(e.target.value)}
              />

              <button onClick={(e) => passUpdateFn(e)}>비밀번호 변경</button>
            </div>
          </div>
        </form>

        <div className="flex justify-start">
          <button onClick={(e) => registOutFunc(e)}>회원탈퇴</button>
        </div>
      </SignUpDiv>
    </div>
  );
};

export default UserInfo;
