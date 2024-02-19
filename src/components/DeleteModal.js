function DeleteModal({ closeDeleteModal, text, handleDelete, id, itemType }) {
  // 根據不同的 itemType 顯示不同的消息
  const modalBodyContent = () => {
    switch (itemType) {
      case 'product':
        return `確定刪除「${text}」這項商品嗎？`;
      case 'coupon':
        return `確定刪除「${text}」優惠卷嗎？`;
      case 'order':
        return `確定刪除「${text}」的訂單嗎？`;
      default:
        return `確定刪除「${text}」嗎？`;
    }
  };

  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id="deleteModal"
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header bg-danger'>
            <h1 className='modal-title text-white fs-5' id='exampleModalLabel'>
              刪除確認
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeDeleteModal}
            />
          </div>
          <div className='modal-body'>{modalBodyContent()}</div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary'
              onClick={closeDeleteModal}
            >
              取消
            </button>
            <button type='button' className='btn btn-danger'
              onClick={() => handleDelete(id)}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default DeleteModal;