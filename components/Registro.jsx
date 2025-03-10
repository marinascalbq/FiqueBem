import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/Registro.css";

const Registro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validação de e-mail
  const validarEmail = (email) => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
  };

  // Validação de senha
  const validarSenha = (senha) => {
    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumerosSequenciais = /(12345|6789)/;

    return (
      senha.length >= 6 &&
      regexMaiuscula.test(senha) &&
      regexMinuscula.test(senha) &&
      !regexNumerosSequenciais.test(senha)
    );
  };

  // Verificar se o e-mail já existe no Firebase
  const verificarEmailExistente = async (email) => {
    const q = query(collection(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna `true` se o e-mail já existe
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErroEmail("");
    setErroSenha("");

    let erro = false;

    // Validação do e-mail
    if (!validarEmail(email)) {
      setErroEmail("⚠️ E-mail inválido. Verifique o formato.");
      erro = true;
    }

    // Validação da senha
    if (!validarSenha(senha)) {
      setErroSenha(
        "⚠️ A senha deve ter pelo menos 6 caracteres, conter letras maiúsculas e minúsculas e não pode ter sequências numéricas."
      );
      erro = true;
    }

    // Se houver erro, não prosseguir
    if (erro) return;

    setLoading(true);

    try {
      // Verifica se o e-mail já está cadastrado
      const emailJaCadastrado = await verificarEmailExistente(email);
      if (emailJaCadastrado) {
        setErroEmail("Este e-mail já está cadastrado");
        setLoading(false);
        return;
      }

      // Cadastra o usuário no Firestore
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
          <h1>Menu de cadastro</h1>
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
              onBlur={async () => {
                if (!validarEmail(email)) {
                  setErroEmail("E-mail inválido.");
                } else if (await verificarEmailExistente(email)) {
                  setErroEmail("Este e-mail já está cadastrado.");
                } else {
                  setErroEmail("");
                }
              }}
              required
            />
            {erroEmail && <p className="erro">{erroEmail}</p>}
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={() => setErroSenha(validarSenha(senha) ? "" : "Senha inválida.")}
              required
            />
            {erroSenha && <p className="erro">{erroSenha}</p>}
            <input type="submit" value={loading ? "Carregando..." : "Cadastrar"} disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
