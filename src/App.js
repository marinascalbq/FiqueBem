import React from "react";
import { Routes, Route } from "react-router-dom"; // Não precisa do Router aqui
import Home from "./components/Home";
import Registro from "./components/Registro";
import Login from "./components/Login";
import MinhaPagina from "./components/MinhaPagina";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/minhapagina" element={<MinhaPagina />} />
      </Routes>
    </div>
  );
};

export default App;
