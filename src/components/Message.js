// 後臺管理介面用
import { useContext } from "react";
import { MessageContext } from "../store/messageStore";

function Message() {
  const [message, dispatch] = useContext(MessageContext);

  return (
    <>
      <div
        className='toast-container position-fixed'
        style={{ top: '64px', right: '15px' }}
      >
        {/** 當 message.title 不存在的時候，吐司整段都會被移除，當在點擊的時候 message.title 又會被加回去。 */}
        { message.title && (
          <div
            className='toast show'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
            data-delay='3000'
          >
            <div className={`toast-header text-white bg-${message.type}`}>
              <strong className='me-auto'>{message.title}</strong>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='toast'
                aria-label='Close'
              />
            </div>
            <div className='toast-body'>{message.text}</div>
          </div>
        ) }
      </div>
    </>
  );
}

export default Message;