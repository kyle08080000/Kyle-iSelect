import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChoiceModal from "../components/ChoiceModal";

function Login() {
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [loginState, setLoginState] = useState({});
  const [showModal, setShowModal] = useState(false); // 控制 Modal 顯示的狀態

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  const submit = async (e) => {
    e.preventDefault(); // 阻止表單默認提交行為
    try {
      const res = await axios.post('/v2/admin/signin', data);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      // console.log(token);
      if (res.data.success) {
        console.log(res);

        setShowModal(true); // 顯示選擇框
        setLoginState(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoginState(error.response.data);
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem('loginData');
    if (storedData) {
      const { username, password, rememberMe } = JSON.parse(storedData);
      setData({ username, password });
      document.getElementById('rememberMe').checked = rememberMe;
    }
  }, []);
  

  return (
    <div className="LoginContainer">
      <div className="LoginCard">
      {/* 使用 ChoiceModal 元件 */}
        <ChoiceModal show={showModal} onClose={() => setShowModal(false)} />
        <div className="WelcomeBack">
          <h1 className="text-nowrap">
            Welcome Back!
            <i className="ms-3 bi bi-cup-hot-fill"></i>
          </h1>
        </div>
        <div className="LoginForm position-relative">
          {/* 登入失敗的提示 */}
          {loginState.message && !loginState.success && (
            <div className="alert alert-danger login-error" role="alert">
              {loginState.message}
            </div>
          )}
          
          <h2>後台登入</h2>
          <p className="mb-4 LoginForm-p">歡迎回來! 請先登入再繼續。</p>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">帳號</label>
              <input 
                type="text" 
                id="username"
                className="form-control" 
                placeholder="User Name"
                name="username" 
                value={data.username} 
                onChange={handleChange} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">密碼</label>
              <input 
                type="password" 
                id="password"
                className="form-control" 
                placeholder="Password" 
                name="password" 
                value={data.password} 
                onChange={handleChange} 
              />
            </div>
            <div className="my-4 form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">記住我</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">登入</button>
          </form>
          <div className="mt-3">
            <i className="bi bi-arrow-return-right me-2"></i>
            <Link to="/">回首頁</Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Login;
