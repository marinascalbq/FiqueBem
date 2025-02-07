import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/Registro.css";

const Registro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "usuarios"), { nome, email, senha });
      alert("Usuário registrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <header className="cadastro-header">
          <h1>Menu de cadastro </h1>
        </header>
      </div>

      <div className="cadastro-container">
  <div className="terapeuta-box">
    <header className="cadastro-header">
      <h1>Cadastro de Terapeuta</h1>
    </header>
    <p>Cadastre-se como terapeuta e ajude pacientes a melhorarem seu bem-estar.</p>
    <button onClick={() => navigate("/cadastrar-terapeuta")} className="cadastrar-terapeuta-btn">
      Cadastrar Terapeuta
    </button>
  </div>

  <div className="paciente-box">
    <header className="cadastro-header">
      <h1>Cadastro de Paciente</h1>
    </header>
    <p>Cadastre-se e melhore de forma saudável sua saúde mental</p>
    <form onSubmit={handleRegister} className="cadastro-form">
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
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
      <input type="submit" value={loading ? "Carregando..." : "Cadastrar"} disabled={loading} />
    </form>
  </div>
</div>



    </div>
  );
};

export default Registro;
