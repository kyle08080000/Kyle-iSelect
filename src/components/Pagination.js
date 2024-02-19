function Pagination({ pagination, changePage }) {
  if (pagination.total_pages <= 1) {
    return null; // 如果只有一页，则不显示分页导航
  }

  const handleClick = (e, page) => {
    e.preventDefault(); // 阻止<a>标签的默认跳转行为
    changePage(page); // 调用传入的 changePage 函数来改变页码
    window.scrollTo(0, 0); // 添加这行代码来滚动到页面顶部
  };

  // 渲染页码按钮的函数
  const renderPageNumbers = (totalPages, currentPage) => {
    return [...Array(totalPages)].map((_, i) => (
      <li className={`page-item ${i + 1 === currentPage ? 'active' : ''}`} key={i}>
        <a
          className="page-link"
          href="/"
          onClick={(e) => handleClick(e, i + 1)}
        >
          {i + 1}
        </a>
      </li>
    ));
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${pagination.current_page > 1 ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Previous"
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {renderPageNumbers(pagination.total_pages, pagination.current_page)}
        <li className={`page-item ${pagination.current_page < pagination.total_pages ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Next"
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
