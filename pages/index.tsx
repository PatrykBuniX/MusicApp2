import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";
import { SongsList } from "../components/SongsList/SongsList";
import { FormEvent, useState } from "react";
import { Song } from "../types";

const url = process.env.NEXT_PUBLIC_API_BASE_URL!;
const xRapidapiKey = process.env.NEXT_PUBLIC_API_KEY!;
const xRapidapiHost = process.env.NEXT_PUBLIC_API_HOST!;

async function fetchSongs(query: string, index: number = 0) {
  const endpoint = url + `/search?q=${query}&index=${index}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-rapidapi-key": xRapidapiKey,
      "x-rapidapi-host": xRapidapiHost,
    },
  });
  if (!res.ok) {
    const errorObj = await res.json();
    throw new Error(errorObj.message);
  }
  const data = await res.json();
  const { data: songs, error } = data;

  //api response with 200 and Exception
  if (error) {
    throw new Error(error.message);
  }
  return songs;
}

const songsStates = {
  empty: "empty",
  isLoading: "loading",
  hasLoaded: "loaded",
  hasError: "error",
} as const;

export type SongsState = typeof songsStates[keyof typeof songsStates];

type Action = "FETCH_SONGS" | "FETCH_SONGS_SUCCESS" | "FETCH_SONGS_ERROR";

type Transitions = {
  [key in SongsState]: { [key in Action]?: SongsState };
};

const transitions: Transitions = {
  [songsStates.empty]: {
    FETCH_SONGS: songsStates.isLoading,
  },
  [songsStates.isLoading]: {
    FETCH_SONGS_SUCCESS: songsStates.hasLoaded,
    FETCH_SONGS_ERROR: songsStates.hasError,
  },
  [songsStates.hasLoaded]: {
    FETCH_SONGS: songsStates.isLoading,
  },
  [songsStates.hasError]: {
    FETCH_SONGS: songsStates.isLoading,
  },
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [songsState, setSongsState] = useState<SongsState>(songsStates.empty);

  function transition(currentState: SongsState, action: Action): SongsState {
    const nextState = transitions[currentState][action];
    return nextState || currentState;
  }

  function updateSongsState(action: Action) {
    setSongsState((currentState) => transition(currentState, action));
  }

  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSongsState("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs(songs);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      updateSongsState("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      updateSongsState("FETCH_SONGS_ERROR");
    }
  };

  const loadMoreSongs = async () => {
    updateSongsState("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs((prevSongs) => [...prevSongs!, ...songs]);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      updateSongsState("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      updateSongsState("FETCH_SONGS_ERROR");
    }
  };

  console.log(songsState);

  return (
    <div>
      <div className={styles.appWrapper}>
        <Header
          search={search}
          handleSearchInput={handleSearchInput}
          handleSearchSubmit={handleSearchSubmit}
        />
        <div className={styles.listWrapper}>
          <SongsList
            songsState={songsState}
            songs={songs}
            error={error}
            loadMoreSongs={loadMoreSongs}
          />
        </div>
      </div>
    </div>
  );
}
