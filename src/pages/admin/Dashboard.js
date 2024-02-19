import axios from "axios";
import { useEffect, useReducer } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import { MessageContext, messageReducer, initState } from "../../store/messageStore";

function Dashboard() {
  const navigate = useNavigate();
  const reducer = useReducer(messageReducer, initState);

  // 登出功能
  const logout = () => {
    document.cookie = 'hexToken=;' // 用於清除 Cookie。在等於後面加上「;」這樣就能清除
    navigate('/login');
  };

  // 從 Cookie 取出 token
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const token = getCookie('hexToken'); // hexToken是 Cookie的名稱
  axios.defaults.headers.common['Authorization'] = token;
  // console.log(token);

  // 路由保護：判斷是否有 token。（防止使用網址或者上一頁進入頁面）
  useEffect(() => {
    // 如過用戶沒有 token 則直接登出
    if (!token) {
      return navigate('/login');
    }
    // 有 token 則去驗證正不正確
    (async () => {
      try {
        await axios.post('/v2/api/user/check');
      } catch (error) {
        console.log(error);
        if(!error.response.data.success) {
          navigate('/login');
        }
      }
    })();
  }, [navigate, token]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    // 組件卸載時重置滾動條
    return () => {
      document.body.style.overflow = '';
      document.body.style.overflow = 'auto';
    };
  }, []);
  

  return (
    <MessageContext.Provider value={reducer}>{/* 讓狀態可以在元件中傳遞 */}
      <Message />
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">
            Kyle's iSelect 後台管理系統
          </p>
          <div className="ms-3 text-light">
            <i className="bi bi-arrow-return-right me-2"></i>
            <Link to="/" className="text-light">回首頁</Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button type="button" className="btn btn-sm btn-light"
                  onClick={logout}>
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="Dashboard-container">
        {/** 產品選單、優惠卷列表、訂單列表 */}
        <div className="sticky-top bg-light">
          <ul className="Dashboard-list list-group list-group-horizontal list-group-horizontal-sm text-nowrap">
            <Link className="list-group-item list-group-item-action py-3" to="/admin/products">
              <i className="bi bi-cup-fill me-2" />
              <span className="d-inline-block">
                產品列表
              </span>
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/coupons">
              <i className="bi bi-ticket-perforated-fill me-2" />
              <span className="d-inline-block">
                優惠卷列表
              </span>
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/orders">
              <i className="bi bi-receipt me-2" />
              <span className="d-inline-block">
                訂單列表
              </span>
            </Link>
          </ul>
        </div>
        <div className="Dashboard-table-width">
          {/* Products */}
          { token && <Outlet />}
        </div>
      </div>
    </MessageContext.Provider>
  )
}

export default Dashboard;