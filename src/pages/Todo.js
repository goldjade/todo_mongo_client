/** @format */

import React, { useCallback, useEffect, useState } from 'react';
//1 login 여부 파악
import { useSelector } from 'react-redux';

import axios from 'axios';
import Form from '../components/Form';
import List from '../components/List';
import { useNavigate } from 'react-router';
//React-Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import Spinner from 'react-bootstrap/Spinner';
import Loading from '../components/Loading';
import LoadingSpinner from '../components/LoadingSpinner';
// import{Dropdown, DropdownButton }from 'react-bootstrap\';

//로컬 스토리지의 내용을 읽어온다
//mongoDB에서 목록을 읽어온다

// let initTodo = localStorage.getItem('todoData');
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // console.log("APP Rendering...");
  //mongoDB 에서 초기값을 읽어서 셋팅
  //axios 및 useEffect를 이용한다
  // const [todoData, setTodoData] = useState([initTodo]);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState('');
  //로딩창 관련
  const [loading, setLoading] = useState(false);

  //2 로그인 상태 파악
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  // console.log('user', user);

  useEffect(() => {
    if (user.accessToken === '') {
      //로그인이 안된 경우
      alert('로그인을 해주세요');
      navigate('/login');
    } else {
      //로그인이 된 경우
    }
  }, [user]);

  //목록 정렬 기능
  const [sort, setSort] = useState('최신글');
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);

  //검색 기능
  const [search, setSerch] = useState('');
  const searchHandler = () => {
    setSkip(0);
    getList(search, 0);
  };

  //axios를 이용해서 서버에 API 호출

  //전체 목록 호출 메서드
  const getList = (_word = '', _stIndex = 0) => {
    setSkip(0);
    setSkipToggle(true);
    // 로딩창 보여주기
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post('/api/post/list', body)
      .then((response) => {
        // console.log(response.data);
        // 초기 할일데이터 셋팅
        if (response.data.success) {
          setTodoData(response.data.initTodo);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(response.data.initTodo.length);
          if (response.data.initTodo.length < 5) {
            setSkipToggle(false);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getListGo = (_word = '', _stIndex = 0) => {
    // 로딩창 보여주기
    setLoading(true);

    const body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post('/api/post/list', body)
      .then((response) => {
        // console.log(response.data);
        // 초기 할일데이터 셋팅
        if (response.data.success) {
          const newArr = response.data.initTodo;
          setTodoData([...todoData, ...newArr]);
          // 시작하는 skip 번호를 갱신한다.
          setSkip(skip + newArr.length);
          if (newArr.length < 5) {
            setSkipToggle(false);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 목록 개수 출력
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);

  const getListMore = () => {
    getListGo(search, skip);
  };
  useEffect(() => {
    getList('', skip);
    //초기데이터를 컴퍼넌트가 마운트 될때 한번 실행한다.
  }, []);

  const deleteClick = useCallback(
    (id) => {
      if (window.confirm('삭제하시겠습니까?')) {
        let body = {
          id: id,
        };
        setLoading(true);
        axios
          .post('/api/post/delete', body)
          .then((res) => {
            console.log(res);
            // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
            const nowTodo = todoData.filter((item) => item.id !== id);
            // 목록을 갱신 한다
            setTodoData(nowTodo);
            setLoading(false);
          })

          .catch();
      }

      // console.log("클릭", nowTodo);

      //axios를 이용해서 mongoDB 삭제 진행

      //로컬에 저장(DB)예정
      // localStorage.setItem('todoData', JSON.stringify(nowTodo));
    },
    [todoData]
  );
  const addTodoSubmit = (event) => {
    event.preventDefault();
    // 이벤트 갱신 막기! a 태그 할때 많이 쓴거
    // { id: 4, title: "할일 4", completed: false },

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, '');
    if (str.length === 0) {
      alert('내용을 입력하세요.');
      setTodoValue('');
      return;
    }

    const addTodo = {
      id: Date.now(), //id 값은 배열.map의 key로 활용 예정 unique 값을 만들려고 시간을 넣음
      title: todoValue, //할일 입력창의 내용을 추가
      completed: false, //할 일이 추가 될때는 완료하지 않았으므로 false로 초기화
      // 1. DB저장 : server/model/TodoModel schema 업에이트 (objectID 찾아 전송)
      uid: user.uid, // 여러명의 사용자 구분 용도
    };
    // 새로운 할 일을 일단복사하고 복사된 배열에 추가해서 업데이트
    // todoData 는 원래 [배열 이였는데] addTodosms 객체로 들어가서 에러가남
    // 그래서 [addTodo] 배열로 감싸 줌
    // 기존 할 일을 destructyring ( ...다 뜯어버리고) 복사본 만들고 새로운 addTodo 추가
    //axios를 이용해서 MongDb에 항목 추가

    axios
      .post('/api/post/submit', { ...addTodo })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          // setTodoData([...todoData, addTodo]);
          // 새로운 todo를 추가 했으므로 내용입력창의 글자를 초기화
          setTodoValue('');
          //로컬에 저장(DB)예정
          // localStorage.setItem('todoData', JSON.stringify([...todoData, addTodo]));
          //목록 재 호출
          setSkip(0);
          getList('', 0);
          alert('할일이 등록되었습니다');
        } else {
          alert('할일 등록이 실패했습니다');
        }
      })
      .catch((에러) => {
        console.log(에러);
      });
  };

  const deleteAllClick = () => {
    if (window.confirm('전체 목록을 삭제합니다.')) {
      //axios를 이용해서 MongDB 목록 비워줌
      axios
        .post('/api/post/deleteall')
        .then(() => {
          setSkip(0);
        })
        .catch((err) => console.log(err));

      // 자료를 지운다(DB 초기화) 지금은 그냥 날리지만 원래 DB날리면 큰일스
      // localStorage.clear();
    }
  };

  return (
    <div className="flex  justify-center w-full h-screen">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className=" flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>
        <div className="flex justify-between mb-3">
          <DropdownButton title={sort} variant="outline-secondary">
            <Dropdown.Item onClick={() => setSort('최신글')}>
              최신글
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort('과거순')}>
              과거순
            </Dropdown.Item>
          </DropdownButton>
          <div>
            <label className="mr-2">검색어</label>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="border-2"
              value={search}
              onChange={(e) => setSerch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchHandler();
                }
              }}
            />
          </div>
        </div>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        {skipToggle && (
          <div className="flex justify-end ">
            <button
              className="w-full p-2 text-gray-400 border-2 border-gray-400 rounded hover:text-white hover:bg-gray-400"
              onClick={() => getListMore()}
            >
              더보기
            </button>
          </div>
        )}

        <Form
          addTodoSubmit={addTodoSubmit}
          todoValue={todoValue}
          setTodoValue={setTodoValue}
        />
      </div>
      {/* 로딩창 샘플 */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Todo;
