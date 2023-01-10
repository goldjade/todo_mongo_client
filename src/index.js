// /** @format */

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import App from './App';
// //redux-toilkit 적용
// import store from './reducer/store';
// //store 를 Provider 를 이용해서 울타리 친다.
// //store를 사용할 childe 들을 설정한다.
// import { Provider } from 'react-redux';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   //Provider는 필수 props
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
// redux-toolkit 적용
import store from "./reducer/store";

import { PersistGate } from "redux-persist/integration/react";//
import { persistStore } from "redux-persist";//

// store를 Provider 를 이용해서 울타리친다.
// store를 사용할 childe 들을 설정한다.
import { Provider } from "react-redux";

export let persistor = persistStore(store);//

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Provider 필수 store={store}
  <Provider store={store}>
    {/* 다 불러올때까지 기다리고  */}
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);