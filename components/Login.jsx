import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // Importação correta do Firestore
import { db } from "../firebaseConfig"; // Importação correta da configuração do Firebase
import "../styles/Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [users, setUsers] = useState([]); // Estado para armazenar usuários do Firebase
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigate = useNavigate();

  // Função para buscar usuários do Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setLoading(false);
    }
  };

  // Carrega os usuários quando o componente for montado
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função de login
  const handleLogin = (e) => {
    e.preventDefault();

    if (loading) {
      alert("Aguarde enquanto carregamos os dados...");
      return;
    }

    // Verifica se o usuário existe no banco de dados
    const user = users.find((u) => u.email === email && u.senha === senha);

    if (user) {
      localStorage.setItem("userEmail", email);
      alert(`Bem-vindo, ${user.nome}!`);
      navigate("/minhapagina");
    } else {
      alert("Credenciais inválidas. Verifique e tente novamente.");
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
        <button type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
