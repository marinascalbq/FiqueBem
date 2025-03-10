import { render, fireEvent, screen, act } from "@testing-library/react";
import SessaoTerapia from "../components/SessaoTerapia";
import { getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore')


test("Não permite agendamento fora do horário do terapeuta", async () => {
  getDocs.mockResolvedValueOnce({
    docs: [{ id: "1", data: () => ({ horarioInicio: "08:00", horarioFim: "18:00" }) }],
  });

  await act(async () => {
    render(<SessaoTerapia />);
  });

  fireEvent.change(screen.getByLabelText(/data da sessão/i), {
    target: { value: "2025-06-10" },
  });

  fireEvent.change(screen.getByLabelText(/horário/i), {
    target: { value: "19:00" },
  });

  fireEvent.click(screen.getByText("Agendar Sessão"));

  expect(await screen.findByText(/O terapeuta não atende neste horário/i)).toBeInTheDocument();
});
