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

  const playPrev = () => {
    if (!songs) return;
    setCurrentSongIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return songs.length - 1;
      }
      return prevIndex;
    });
  };

  const playNext = () => {
    if (!songs) return;
    setCurrentSongIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex > songs.length - 1) {
        return 0;
      }
      return nextIndex;
    });
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
      const songs = await fetchSongs(search, 0);
      setQueryIndex(0);
      setSongs(songs);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      setPrevSearch(search);
      updateSongsStatus("FETCH_SONGS_SUCCESS");
    } catch (error) {
      setError(error.message);
      setPrevSearch("");
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
      setPrevSearch("");
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
        <Player
          currentSong={songs && songs[currentSongIndex]}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playNext={playNext}
          playPrev={playPrev}
        />
      </div>
    </div>
  );
};

export default Home;
