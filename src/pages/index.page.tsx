import { SearchAPIError, SearchAPIResponse, searchWord } from "@/queries";
import { useRef, useState } from "react";
import { Spinner } from "./components/Spinner";
import { Results } from "./components/Results";

const App = () => {
  const wordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchAPIResponse[number] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const word = wordRef.current?.value?.trim() || "";

    if (word) {
      setIsLoading(true);
      setData(null);
      setError("");

      try {
        const data = await searchWord({ word });
        if (data.success) {
          setData((data.data as SearchAPIResponse)[0]);
        } else {
          setError((data.data as SearchAPIError).title || "");
        }
      } catch (error) {
        setError((error as { message: string }).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center mt-10">
      <div className="w-full max-w-2xl">
        <form role="form" onSubmit={handleSubmit}>
          <input
            ref={wordRef}
            type="text"
            placeholder="Enter your word..."
            className="border-b-2 text-2xl lg:text-4xl lg:placeholder:text-3xl placeholder:text-white/60 outline-none px-2 py-3 w-full"
          />
        </form>

        {isLoading && (
          <div
            aria-label="Loading..."
            role="status"
            className="flex items-center space-x-2 mt-10"
          >
            <Spinner />
            <span className="font-medium text-white/75">Searching...</span>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-700/30 border border-red-700/60 px-3 py-2">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="my-10">
            <Results data={data} />
          </div>
        )}

        {!isLoading && !data && !error && (
          <div className="mt-12">
            <p className="opacity-80">Start searching to see results 🕵🏻‍♂️</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
