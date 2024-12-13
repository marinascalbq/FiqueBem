import React, { useState } from "react";
import { useDatabase } from "../DatabaseContext";
import '../styles/Registro.css';

const Registro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailExistente, setEmailExistente] = useState(false);
  const [senhaValida, setSenhaValida] = useState(true);
  const [emailValido, setEmailValido] = useState(true);

  const { addUser, database } = useDatabase();

  // Função para validar se o email já existe no banco de dados
  const validarEmailExistente = (email) => {
    return database.some((user) => user.email === email);
  };

  // Função para validar o formato do email
  const validarEmail = (email) => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexEmail.test(email);
  };

  // Função para validar a senha (mínimo de 6 caracteres)
  const validarSenha = (senha) => {
    return senha.length >= 6;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validação de e-mail
    if (!validarEmail(email)) {
      setEmailValido(false);
      return;
    } else {
      setEmailValido(true);
    }

    // Verificar se o email já existe
    if (validarEmailExistente(email)) {
      setEmailExistente(true);
      return;
    } else {
      setEmailExistente(false);
    }

    // Validação de senha
    if (!validarSenha(senha)) {
      setSenhaValida(false);
      return;
    } else {
      setSenhaValida(true);
    }

    // Adicionar usuário ao banco de dados
    addUser({ nome, email, senha });

    alert("Usuário registrado com sucesso!");
  };

  return (
    <div className="cadastro-container">
      <header className="cadastro-header">
        <h1>Cadastro - FiqueBem</h1>
      </header>

      <div className="cadastro-box">
        <form onSubmit={handleRegister} className="cadastro-form">
          <div className="formGroup">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="cadastro-input"
              required
            />
          </div>

          <div className="formGroup">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cadastro-input"
              required
            />
            {!emailValido && <div className="error">Email inválido</div>}
            {emailExistente && <div className="error">Este e-mail já está registrado</div>}
          </div>

          <div className="formGroup">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="cadastro-input"
              required
            />
            {!senhaValida && <div className="error">A senha deve ter pelo menos 6 caracteres</div>}
          </div>

          <div className="formGroup">
            <input type="submit" value="Cadastrar" className="cadastro-button" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
