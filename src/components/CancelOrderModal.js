import { useForm } from 'react-hook-form';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slice/messageSlice';

const CancelOrderModal = ({ show, handleClose, orderInfo, onConfirmCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    // 模擬一個 API 請求
    new Promise((resolve, reject) => {
      // 假設這是向後端發送取消訂單請求的模擬
      setTimeout(() => {
        const isCancelSuccess = true; // 根据实际情况模拟成功或失败
        if (isCancelSuccess) {
          resolve("取消訂單申請已接收");
          onConfirmCancel(orderInfo.id);
        } else {
          reject(new Error("取消訂單功能暫時不可用"));
        }
      }, 1000); // 模擬網絡延遲
    })
    .then((message) => {
      // 模擬成功響應
      dispatch(createAsyncMessage({
        success: true,
        id: new Date().getTime(), // 临时生成一个唯一ID
        message: message,
      }));
      handleClose(); // 关闭模态框
      reset(); // 重置表单
    })
    .catch((error) => {
      // 如果需要處理錯誤消息，也可以用 createAsyncMessage
      dispatch(createAsyncMessage({
        success: false,
        message: error.message,
      }));
      alert(error.message); // 或者保持 alert，如果您想讓用戶立即看到錯誤
    });
  };
  

  return (
    <Modal show={show} onHide={handleClose} backdrop='static'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>取消訂單</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>訂單編號</Form.Label>
            <Form.Control type="text" {...register("orderId")} defaultValue={orderInfo?.id} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>取消原因</Form.Label>
            <Form.Select {...register("reason", { required: "取消原因是必填的" })}
              onChange={(event) => {
                event.stopPropagation(); // 阻止事件冒泡
                // 其他处理逻辑（如果有）
              }}
            >
              <option value="更改心意">更改心意</option>
              <option value="訂單錯誤">修改訂單</option>
              <option value="配送時間太長">配送時間太長</option>
              <option value="其他">其他</option>
            </Form.Select>
            {errors.reason && <p className="text-danger">{errors.reason.message}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>附加消息或說明（可選）</Form.Label>
            <Form.Control as="textarea" rows={3} {...register("message")} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>關閉</Button>
          <Button variant="primary" className="bg-danger" type="submit">確認取消</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CancelOrderModal;
