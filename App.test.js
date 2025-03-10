import { render, screen, waitFor } from "@testing-library/react";
import { getFirestore } from 'firebase/firestore';
import App from "./App";

test("Verifica se a aplicação renderiza corretamente", async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/Cadastro/i)).toBeInTheDocument();
  }, { timeout: 10000 }); 
});