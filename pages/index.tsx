import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";
import { SongsList } from "../components/SongsList/SongsList";
import { LoadingView } from "../components/LoadingView/LoadingView";
import { FormEvent, useState, useRef, useEffect } from "react";
import { Song } from "../types";
import { useSongsStatus } from "../hooks/useSongsStatus";
import { fetchSongs } from "../utils/apiCalls";

const Home = () => {
  const [search, setSearch] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [songsStatus, updateSongsStatus] = useSongsStatus();
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  });

  const playNext = () => {
    console.log("set index");
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
    if (!search || search === lastSearch) return;
    updateSongsStatus("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs(songs);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      setLastSearch(search);
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
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          src={songs[currentSongIndex] ? songs[currentSongIndex].preview : ""}
          onEnded={playNext}
        ></audio>
      ) : null}
    </div>
  );
};

export default Home;
