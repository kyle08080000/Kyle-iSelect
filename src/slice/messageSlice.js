// 前台管理全局状态
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name : 'message',
  initialState: [

  ],
  reducers: {

    createMessage(state, action) {
      // 检查是否已存在相同内容的通知
      const isExisting = state.some(msg =>
        msg.title === action.payload.title &&
        msg.text === action.payload.text &&
        msg.type === action.payload.type
      );

      // 如果不存在相同内容的通知，则添加新通知
      if (!isExisting) {
        state.push({
          id: action.payload.id || new Date().getTime().toString(), // 确保 ID 唯一
          type: action.payload.success ? 'secondary' : 'danger',
          title: action.payload.success ? '成功' : '錯誤',
          text: action.payload.success ? action.payload.message : Array.isArray(action.payload?.message) ? action.payload?.message.join('、') : action.payload?.message,
          removing: false, // 新通知默认不处于正在移除状态
        });
      }
    },
    
    removeMessage(state, action) {
      // 移除指定ID的通知
      const index = state.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },

    // 移除時淡出
    setMessageRemoving(state, action) {
      const index = state.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state[index].removing = true; // 添加一个 removing 标记
      }
    },
  }
});

// 需傳入兩個。1. 自定義名稱、2. async function（非同步函式裡面會得到一個 Promise 裡面會給你而外的dispatch，讓你可以串接其他的 reducers 方法！）
// 创建异步通知的Thunk
export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async function(payload, { dispatch }) {
    const requestId = new Date().getTime().toString(); // 生成唯一ID
    // 创建通知
    dispatch(messageSlice.actions.createMessage({
      ...payload,
      id: requestId,
      removing: false,
    }));

    // 延时后标记通知为即将移除
    setTimeout(() => {
      dispatch(messageSlice.actions.setMessageRemoving(requestId));
      // 再延时后移除通知
      setTimeout(() => {
        dispatch(messageSlice.actions.removeMessage(requestId));
      }, 500); // 确保与CSS动画时长一致
    }, 3000); // 通知显示时长
  }
);

export const { createMessage, removeMessage, setMessageRemoving } = messageSlice.actions;
export default messageSlice.reducer;