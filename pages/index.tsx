import { FormEvent, useState } from "react";
import { Song } from "../types";
import { fetchSongs } from "../utils/apiCalls";
import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";
import { Player } from "../components/Player/Player";
import { SongsList } from "../components/SongsList/SongsList";
import { LoadingView } from "../components/LoadingView/LoadingView";
import { useSongsStatus } from "../hooks/useSongsStatus";

const Home = () => {
  // header's search
  const [search, setSearch] = useState("");
  const [prevSearch, setPrevSearch] = useState("");

  // songs fetching
  const [queryIndex, setQueryIndex] = useState(0);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [songsStatus, updateSongsStatus] = useSongsStatus();

  // Player state
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const playNext = () => {
    setCurrentSongIndex((prev) => prev + 1);
  };

  const handleTileClick = (clickedIndex: number) => {
    setCurrentSongIndex(clickedIndex);
    setIsPlaying(true);
  };

  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search || search === prevSearch) return;
    updateSongsStatus("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs(songs);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      setPrevSearch(search);
      updateSongsStatus("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      updateSongsStatus("FETCH_SONGS_ERROR");
    }
  };

  const loadMoreSongs = async () => {
    updateSongsStatus("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs((prevSongs) => [...prevSongs!, ...songs]);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      updateSongsStatus("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      updateSongsStatus("FETCH_SONGS_ERROR");
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
            handleTileClick={handleTileClick}
            songsStatus={songsStatus}
            songs={songs}
            error={error}
            loadMoreSongs={loadMoreSongs}
            currentSongIndex={currentSongIndex}
          />
          {songsStatus === "loading" ? <LoadingView /> : null}
        </div>
      </div>
      {songs ? (
        <Player
          currentSong={songs[currentSongIndex] ? songs[currentSongIndex].preview : ""}
          isPlaying={isPlaying}
          onEnded={playNext}
        />
      ) : null}
    </div>
  );
};

export default Home;
