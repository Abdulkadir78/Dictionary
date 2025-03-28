export type SearchAPIResponse = {
  word: string;
  phonetics: {
    audio: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
    text?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}[];

export interface SearchAPIError {
  title: string;
  message: string;
  resolution: string;
}

interface SearchWordParams {
  word: string;
}

export interface SearchWordResponse {
  data: SearchAPIResponse | SearchAPIError | undefined;
  success: boolean;
}

export const searchWord: (
  params: SearchWordParams
) => Promise<SearchWordResponse> = async (params) => {
  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" +
        encodeURIComponent(params.word)
    );
    const data = await response.json();

    if (response.ok) {
      return { data, success: true };
    }

    return { data, success: false };
  } catch (error) {
    throw error;
  }
};
