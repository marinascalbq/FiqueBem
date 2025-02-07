import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "./firebaseConfig"; // Firebase configurado corretamente
import { collection, addDoc, getDocs } from "firebase/firestore"; 

// Criando o contexto
const DatabaseContext = createContext();

// Hook customizado para acessar o contexto
export const useDatabase = () => useContext(DatabaseContext);

// Provedor do contexto do banco de dados
export const DatabaseProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento

  // Função para adicionar um novo usuário ao Firestore
  const addUser = async (user) => {
    try {
      const userRef = collection(db, "usuarios");
      const docRef = await addDoc(userRef, user);
      console.log("Usuário adicionado com ID:", docRef.id);
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  // Função para buscar todos os usuários do Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Inclui os dados do documento com o ID
      }));
      setUsers(usersList);
      setLoading(false); // Finaliza carregamento
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setLoading(false);
    }
  };

  // Carrega os usuários do Firestore ao montar o contexto
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DatabaseContext.Provider value={{ users, addUser, fetchUsers, loading }}>
      {!loading ? children : <p>Carregando dados...</p>} 
    </DatabaseContext.Provider>
  );
};
