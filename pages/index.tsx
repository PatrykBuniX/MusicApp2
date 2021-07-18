import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";
import { SongsList } from "../components/SongsList/SongsList";
import { LoadingView } from "../components/LoadingView/LoadingView";
import { FormEvent, useState, MouseEvent, useRef } from "react";
import { Song } from "../types";
import { useSongsStatus } from "../hooks/useSongsStatus";
import { fetchSongs } from "../utils/apiCalls";
import { usePlayer } from "../hooks/usePlayer";

const Home = () => {
  const [search, setSearch] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [songsStatus, updateSongsStatus] = useSongsStatus();

  //I have to pass audio element ref which is rendered into the DOM.
  //Creating audio object (using new Audio()) which is not rendered on the page
  //won't allow to play music on iPhone for whatever reason.
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = usePlayer(audioRef);

  const handleTileClick = (e: MouseEvent<HTMLButtonElement>) => {
    const { songSrc } = e.currentTarget.dataset;
    if (!songSrc) return;
    setPlayerState((prevState) => {
      const nextState = { ...prevState, currentSong: songSrc };
      return nextState;
    });
  };

  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search || search === lastQuery) return;
    updateSongsStatus("FETCH_SONGS");
    try {
      const songs = await fetchSongs(search, queryIndex);
      setSongs(songs);
      setError(null);
      setQueryIndex((prev) => prev + 25);
      setLastQuery(search);
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
          />
          {songsStatus === "loading" ? <LoadingView /> : null}
        </div>
      </div>
      <audio ref={audioRef} src={playerState.currentSong} crossOrigin="anonymous"></audio>
    </div>
  );
};

export default Home;
