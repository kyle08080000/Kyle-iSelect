import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'bootstrap';

function ChoiceModal({ show, onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null); // 使用 useRef 來保留 Modal 實例

  useEffect(() => {
    const modalElement = document.getElementById('choiceModal');
    modalRef.current = new Modal(modalElement, {
      backdrop: 'static'
    });

    return () => {
      if (modalRef.current) {
        modalRef.current.dispose(); // 清理 Modal 實例
      }
    };
  }, []);

  useEffect(() => {
    // 根據 `show` 的值來顯示或隱藏模態窗口
    if (show) {
      modalRef.current.show();
    } else {
      modalRef.current.hide();
    }
  }, [show]);

  const handleClose = () => {
    onClose();
  }

  return (
    <div id="choiceModal" className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">登入成功！歡迎回來。</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <p>請選擇您想要進行的操作。</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/myorders')}>查看「我的訂單」</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/admin/products')}>進入後台</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoiceModal;
