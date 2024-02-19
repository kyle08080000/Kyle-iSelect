// 後臺管理介面用
import { createContext } from "react";

export const MessageContext = createContext({});

export const initState = { // 初始化狀態
  type: '', 
  title: '',
  text: '',
}

export const messageReducer = (state, action) => {
  switch (action.type) {
    case "POST_MESSAGE":
      return {
        ...action.payload
      };
    case "CLEAR_MESSAGE":
      return {
        ...initState, // 因為很常用到，所以在上面先建立起來，透過展開帶入
      };
    default: // 預設回傳狀態
      return state; 
  }
}


export function handleSuccessMessage(dispatch, res) {
  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'success',
      title: '更新成功',
      text: res.data.message
    }
  });
  setTimeout(() => {
    dispatch({
      type: 'CLEAR_MESSAGE',
    });
  }, 3000);
}


export function handleErrorMessage(dispatch, error) {
  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'danger',
      title: '失敗',
      text: Array.isArray(error?.response?.data?.message) ? error?.response?.data?.message.join('、') : error?.response?.data?.message,
    }
  });
  setTimeout(() => {
    dispatch({
      type: 'CLEAR_MESSAGE',
    });
  }, 3000);
}
