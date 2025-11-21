import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 入力フォーム用
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ダミー認証（フロントだけで判定）
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ★ ここがダミー認証
    if (username === "test" && password === "password") {
      login();
      navigate("/");
    } else {
      alert("ユーザー名またはパスワードが違います");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "80px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

