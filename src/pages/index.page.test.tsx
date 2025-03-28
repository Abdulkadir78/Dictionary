import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./index.page";
import {
  SearchAPIError,
  SearchAPIResponse,
  searchWord,
  SearchWordResponse,
} from "@/queries";

jest.mock("../queries", () => {
  return {
    searchWord: jest.fn(),
  };
});

test("renders an input and supporting text", () => {
  render(<App />);

  const input = screen.getByRole("textbox");
  const supportText = screen.getByText(/Start search/i);

  expect(input).toBeInTheDocument();
  expect(supportText).toBeInTheDocument();
});

test("shows a spinner on form submission", async () => {
  render(<App />);

  const input = screen.getByRole("textbox");
  await userEvent.type(input, "Hello");
  fireEvent.submit(input);

  const spinner = screen.getByRole("img");
  expect(spinner).toBeInTheDocument();

  // to suppress the act warning
  await screen.findByRole("textbox");
});

test("shows an error alert if api returns error", async () => {
  const errorTitle = "Not found";

  (searchWord as jest.Mock<Promise<SearchWordResponse>>).mockResolvedValue({
    data: { title: errorTitle } as SearchAPIError,
    success: false,
  });

  render(<App />);

  const input = screen.getByRole("textbox");
  await userEvent.type(input, "Hello");
  fireEvent.submit(input);

  const errorText = await screen.findByText(errorTitle);
  expect(errorText).toBeInTheDocument();
});

test("shows the data on success", async () => {
  const word = "hello";

  (searchWord as jest.Mock<Promise<SearchWordResponse>>).mockResolvedValue({
    data: [{ word }] as SearchAPIResponse,
    success: true,
  });

  render(<App />);

  const input = screen.getByRole("textbox");
  await userEvent.type(input, word);
  fireEvent.submit(input);

  const meaning = await screen.findByText(word);
  expect(meaning).toBeInTheDocument();
});
