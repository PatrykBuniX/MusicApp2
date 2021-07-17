import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";
import { SongsList } from "../components/SongsList/SongsList";
import { FormEvent, useState } from "react";
import { Song } from "../types";
import { useSongsState } from "../hooks/useSongsState";
import { fetchSongs } from "../utils/apiCalls";

export default function Home() {
  const [search, setSearch] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [songsState, updateSongsState] = useSongsState();

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
