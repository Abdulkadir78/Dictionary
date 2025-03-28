import { SearchAPIResponse } from "@/queries";

interface ResultsProps {
  data?: Partial<SearchAPIResponse[number]>;
}

export const Results: React.FC<ResultsProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const audio = data.phonetics?.findLast((p) => p.audio)?.audio;

  const handleAudioClick = () => {
    const player = new Audio(audio);
    player.play();
  };

  return (
    <div>
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-4xl">{data.word}</p>
        {audio && (
          <button
            onClick={handleAudioClick}
            aria-label="listen to pronunciation"
            className="rounded-full w-9 h-9 cursor-pointer grid place-items-center transition-colors duration-300 bg-white/10 hover:bg-white/15"
          >
            <img src="/speaker.svg" alt="speaker" className="w-6 h-6" />
          </button>
        )}
      </div>

      {data.meanings
        ?.map((m, i) => {
          return (
            <div key={i} className="py-6 border-b border-white/5">
              <p className="italic opacity-70 capitalize">{m.partOfSpeech}</p>

              <ul
                className={`mt-1 space-y-2 opacity-95 ${
                  m.definitions.length > 1 ? "list-decimal ml-5" : "list-none"
                }`}
              >
                {m.definitions.map((def, j) => {
                  return (
                    <li
                      key={def.definition}
                      className={j === 0 ? "mt-1" : "mt-4"}
                    >
                      <p className="lg:text-lg ml-1">{def.definition}</p>
                      {def.example && (
                        <p className="mt-2 ml-6 opacity-70">{def.example}</p>
                      )}
                    </li>
                  );
                })}
              </ul>

              {!!m.synonyms.length && (
                <div className="mt-4">
                  <p className="text-green-600">
                    Synonyms &mdash;{" "}
                    <span className="text-white">{m.synonyms.join(", ")} </span>
                  </p>
                </div>
              )}

              {!!m.antonyms.length && (
                <div className="mt-4">
                  <p className="text-yellow-500">
                    Antonyms &mdash;{" "}
                    <span className="text-white">{m.antonyms.join(", ")} </span>
                  </p>
                </div>
              )}
            </div>
          );
        })
        .flat()}
    </div>
  );
};
