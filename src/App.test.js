import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/MainFrame/Particle", () => () => null);
jest.mock("./components/MainFrame/AnimatedRoutes", () => () => <div data-testid="mock-routes" />);

test("renders the primary site navigation", () => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  render(<App />);

  expect(screen.getAllByText("YUTING ZHOU").length).toBeGreaterThan(0);
  expect(screen.getAllByRole("button", { name: /toggle theme/i }).length).toBeGreaterThan(0);
  expect(screen.getByTestId("mock-routes")).toBeInTheDocument();
});
