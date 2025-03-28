import { render, screen } from "@testing-library/react";

import { Results } from "./Results";

test("renders nothing if no data is passed", () => {
  const { container } = render(<Results />);
  expect(container).toBeEmptyDOMElement();
});

test("renders all data correctly if provided", () => {
  const data = {
    word: "hello",
    phonetics: [
      {
        audio:
          "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3",
        sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=75797336",
      },
    ],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: '"Hello!" or an equivalent greeting.',
            synonyms: [],
            antonyms: [],
            example: "",
          },
        ],
        synonyms: ["greeting"],
        antonyms: [],
      },
      {
        partOfSpeech: "interjection",
        definitions: [
          {
            definition:
              "A greeting (salutation) said when meeting someone or acknowledging someone's arrival or presence.",
            synonyms: [],
            antonyms: [],
            example: "Hello, everyone.",
          },
          {
            definition: "A greeting used when answering the telephone.",
            synonyms: [],
            antonyms: [],
            example: "Hello? How may I help you?",
          },
        ],
        synonyms: [],
        antonyms: ["bye", "goodbye"],
      },
    ],
  };

  render(<Results data={data} />);

  const word = screen.getByText(data.word);
  const audioBtn = screen.queryByRole("button", {
    name: /listen/i,
  });
  const synonymsHeaders = screen.getAllByText(/synonyms/i);
  const antonymsHeaders = screen.getAllByText(/antonyms/i);

  expect(word).toBeInTheDocument();
  expect(audioBtn).toBeInTheDocument();
  expect(synonymsHeaders).toHaveLength(1);
  expect(antonymsHeaders).toHaveLength(1);

  for (const m of data.meanings) {
    const partOfSpeech = screen.getByText(m.partOfSpeech);
    expect(partOfSpeech).toBeInTheDocument();

    for (const d of m.definitions) {
      const definition = screen.getByText(d.definition);
      expect(definition).toBeInTheDocument();

      if (d.example) {
        const example = screen.queryByText(d.example);
        expect(example).toBeInTheDocument();
      }
    }
  }
});

test("does not render audio button if no audio is present", () => {
  const data = {
    word: "hello",
    phonetics: [{ audio: "" }],
    meanings: [],
  };

  render(<Results data={data} />);

  const audioBtn = screen.queryByRole("button", { name: /listen/i });
  expect(audioBtn).not.toBeInTheDocument();
  // OR
  //   expect(() => screen.getByRole("button", { name: /listen/i })).toThrow();
});

test("does not render synonyms and antonyms headers is corresponding data is missing", () => {
  const data = {
    word: "hello",
    phonetics: [],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: '"Hello!" or an equivalent greeting.',
            synonyms: [],
            antonyms: [],
          },
        ],
        synonyms: [],
        antonyms: [],
      },
    ],
  };

  render(<Results data={data} />);

  const synonymsHeader = screen.queryByText(/synonym/i);
  const antonymsHeader = screen.queryByText(/antonym/i);
  expect(synonymsHeader).not.toBeInTheDocument();
  expect(antonymsHeader).not.toBeInTheDocument();
});
