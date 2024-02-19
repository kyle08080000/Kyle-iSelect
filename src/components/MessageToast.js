// 前台管理全局状态
import { useSelector } from "react-redux";

function Message() {
  const messages = useSelector((state) => state.message);

  return (
    <>
      <div className='toast-container position-fixed' style={{ top: '64px', right: '15px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`toast show ${msg.removing ? 'fade-out' : 'fade-in'}`}
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            <div className={`toast-header text-white bg-${msg.type}`}>
              <strong className='me-auto'>{msg.title}</strong>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='toast'
                aria-label='Close'
              />
            </div>
            <div className='toast-body fw-bold'>{msg.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Message;