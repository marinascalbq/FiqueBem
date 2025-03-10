import { render, fireEvent, screen } from "@testing-library/react";
import AvaliacaoMensal from "../components/AvaliacaoMensal";
import { addDoc } from 'firebase/firestore'

jest.mock('firebase/firestore', () => ({
  db: {
    collection: jest.fn(() => ({
      getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
      addDoc: jest.fn(() => Promise.resolve({ id: "mocked-id" })),
    })),
  },
}));


test("Salva avaliação no banco de dados", async () => {
  addDoc.mockResolvedValueOnce({ id: "123" });

  render(<AvaliacaoMensal />);

  fireEvent.change(screen.getByPlaceholderText("Descreva seu nível de ansiedade"), {
    target: { value: "Alta ansiedade" },
  });

  fireEvent.change(screen.getByPlaceholderText("Descreva seu nível de depressão"), {
    target: { value: "Moderada" },
  });

  fireEvent.change(screen.getByPlaceholderText("Descreva seu bem-estar"), {
    target: { value: "Me sinto bem hoje" },
  });

  fireEvent.click(screen.getByText("Salvar Avaliação"));


  expect(await screen.findByText(/Avaliação salva com sucesso/i)).toBeInTheDocument();
});
