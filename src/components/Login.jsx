import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../DatabaseContext";
import '../styles/Login.css'; // Importação do CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { findUser } = useDatabase();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = findUser(email, senha);

    if (user) {
      // Salva o e-mail do usuário logado no localStorage
      localStorage.setItem("userEmail", email);
      alert(`Bem-vindo, ${user.nome}!`);
      navigate("/minhapagina");
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Login - FiqueBem</h1>
      </div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
