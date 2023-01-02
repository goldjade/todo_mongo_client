/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import List from '../components/List';

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
  //axios를 이용해서 서버에 API 호출
  useEffect(() => {
    axios
      .post('/api/post/list')
      .then((response) => {
        // console.log(response.data);
        //초기 할일세팅
        if (response.data.success) {
          setTodoData(response.data.initTodo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //초기데이터를 컴퍼넌트가 마운트 될때 한번 실행한다.
  }, []);

  const deleteClick = useCallback(
    (id) => {
      // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
      const nowTodo = todoData.filter((item) => item.id !== id);
      // console.log("클릭", nowTodo);
      // 목록을 갱신 한다
      //axios를 이용해서 mongoDB 삭제 진행
      setTodoData(nowTodo);
      //로컬에 저장(DB)예정
      localStorage.setItem('todoData', JSON.stringify(nowTodo));
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
          setTodoData([...todoData, addTodo]);
          // 새로운 todo를 추가 했으므로 내용입력창의 글자를 초기화
          setTodoValue('');
          //로컬에 저장(DB)예정
          // localStorage.setItem('todoData', JSON.stringify([...todoData, addTodo]));
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
    //axios를 이용해서 MongDB 목록 비워줌
    setTodoData([]);
    // 자료를 지운다(DB 초기화) 지금은 그냥 날리지만 원래 DB날리면 큰일스
    localStorage.clear();
  };
  return (
    <div className="flex  justify-center w-full h-screen">
      <div className="w-full p-6 m-4 bg-white shadow">
        <div className=" flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>
        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        <Form
          addTodoSubmit={addTodoSubmit}
          todoValue={todoValue}
          setTodoValue={setTodoValue}
        />
      </div>
    </div>
  );
};

export default Todo;
