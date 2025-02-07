import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>FiqueBem</h1>
        <p>Cuidado com sua saúde mental</p>
      </header>
      <main className="home-main">
        <h2>Bem-vindo ao FiqueBem</h2>
        <div className="card-container">
          <div className="card">
            <img 
              src="https://via.placeholder.com/100" 
              alt="Planos de cuidados" 
            />
            <h3>Planos de cuidado personalizados</h3>
            <p>Receba o apoio profissional e a jornada que mais combinam com você.</p>
          </div>
          <div className="card">
            <img 
              src="https://via.placeholder.com/100" 
              alt="Recursos práticos" 
            />
            <h3>Recursos práticos para o seu bem-estar</h3>
            <p>
              Acesse conteúdos, registre seu humor, faça terapia online e muito mais.
            </p>
          </div>
          <div className="card">
            <img 
              src="https://via.placeholder.com/100" 
              alt="Saúde integrada" 
            />
            <h3>Saúde integrada: Corpo e Mente</h3>
            <p>
              Aprenda a construir novos hábitos de autocuidado com orientação profissional.
            </p>
          </div>
        </div>
        <div className="button-container">
          <button 
            onClick={() => navigate("/registro")} 
            className="home-button"
          >
            Cadastro
          </button>
          <button 
            onClick={() => navigate("/login")} 
            className="home-button"
          >
            Login
          </button>
        </div>
      </main>
      <footer className="home-footer">
        <p>
          <a href="#" className="footer-link"> Central de ajuda</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
