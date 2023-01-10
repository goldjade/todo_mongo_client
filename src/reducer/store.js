

// slice 들을 모아서 store에 저장
import { configureStore } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session"; //
// localStorage 저장 라이브러리
// import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import userSlice from "./userSlice";

const reducers = combineReducers({
  user: userSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession, //
  whitelist: ["user"],
};
const presistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  // reducer: {
  //   user: userSlice.reducer,
  // },
  reducer: presistedReducer,
  // 임시로 middleware 체크 기능 제거
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
  devTools: process.env.NODE_ENV !== "production",
});
export default store;

// /** @format */

// //slice 들을 모아서 store에 저장
// import { configureStore } from '@reduxjs/toolkit';
// // 로컬 스토리지 저장 라이브러리
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import userSlice from './userSlice';

// const reducers = combineReducers({
//   user: userSlice.reducer,
// });

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['user'],
//   //유저에 관련된 정보를 저장할거야 유저모델이 유저로 저장돼있음
// };
// const presistedReducer = persistReducer(persistConfig, reducers);

// const store = configureStore({
//   // reducer: {
//   //   user: userSlice.reducer,
//   // },
//   reducer: presistedReducer,
//   middleware: (getDefultMiddleware) => {
//     // 임시로 middleware 체크 기능 제거
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware({
//       serializableCheck: false,
//     });
//   },
//   devTools: process.env.NODE_ENV !== "production",
// });

// export default store;