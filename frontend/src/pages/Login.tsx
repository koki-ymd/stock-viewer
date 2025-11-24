import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 入力フォーム用
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // 未来の機能用

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username.trim()) {
      alert("ユーザー名を入力してください");
      setLoading(false);
      return;
    }

    try {
      // API 層で擬似ログイン
      const result = await loginApi(username);

      // グローバル状態更新
      login(result.access_token, result.expires_in_seconds);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
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
            placeholder="Password (任意)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "8px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* --- 操作ヒント --- */}
      <p style={{ marginTop: "20px", color: "#ccc", fontSize: "0.85rem", lineHeight: 1.4 }}>
        本アプリはポートフォリオ用デモです。<br />
        <b>任意のユーザー名とパスワード</b>でログインできます。
      </p>
    </div>
  );
};

export default Login;

