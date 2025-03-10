import { render, fireEvent, screen } from "@testing-library/react";
import Registro from "../components/Registro";
import { getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  db: {
    collection: jest.fn(() => ({
      getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
      addDoc: jest.fn(() => Promise.resolve({ id: "mocked-id" })),
    })),
  },
}));


test("Não permite cadastrar o mesmo e-mail duas vezes", async () => {
  getDocs.mockResolvedValueOnce({
    docs: [{ id: "1", data: () => ({ email: "teste@email.com" }) }],
  });

  render(<Registro />);

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "teste@email.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Senha"), {
    target: { value: "SenhaSegura123" },
  });

  fireEvent.click(screen.getByText("Cadastrar"));

  expect(await screen.findByText(/Este e-mail já está cadastrado./i)).toBeInTheDocument();
});
""