import React, { createContext, useState, useContext } from "react";

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  const [database, setDatabase] = useState([]);

  // Função para adicionar um usuário ao banco de dados
  const addUser = (user) => {
    setDatabase((prevDatabase) => [...prevDatabase, user]);
  };

  // Função para buscar um usuário pelo e-mail e senha
  const findUser = (email, senha) => {
    return database.find((user) => user.email === email && user.senha === senha);
  };

  // Função para obter o nome do usuário com base no e-mail
  const getUserName = (email) => {
    const user = database.find((user) => user.email === email);
    return user ? user.nome : "Usuário não encontrado";
  };

  return (
    <DatabaseContext.Provider value={{ database, addUser, findUser, getUserName }}>
      {children}
    </DatabaseContext.Provider>
  );
};
