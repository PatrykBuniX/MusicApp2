import { Song, SongsStatus } from "../../types";
import styles from "../SongsList/SongsList.module.scss";
import { SongTile } from "../SongTile/SongTile";

type Props = {
  error: string | null;
  songs: Song[] | null;
  songsStatus: SongsStatus;
  loadMoreSongs: () => Promise<void>;
  handleTileClick: (clickedIndex: number) => void;
  currentSongIndex: number;
};

export const SongsList = ({
  songsStatus,
  error,
  songs,
  loadMoreSongs,
  handleTileClick,
  currentSongIndex,
}: Props) => {
  if (songsStatus === "idle") {
    return <p className={styles.idleStateText}>Search for your favourite songs!</p>;
  }
  if (songsStatus === "error") {
    return (
      <p className={styles.errorStateText}>
        {error}
        <br />
        Try again later
      </p>
    );
  }

  //songStatus is loaded / loading
  return (
    <ul className={styles.songsList}>
      {songs
        ? songs.map((song: Song, index) => {
            return (
              <SongTile
                key={index + "-" + song.id}
                title={song.title}
                artistName={song.artist.name}
                albumCoverSrc={song.album.cover}
                songSrc={song.preview}
                onClick={() => handleTileClick(index)}
                active={index === currentSongIndex}
              />
            );
          })
        : null}
      {songsStatus === "loaded" ? (
        <li className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreButton} onClick={loadMoreSongs}>
            load more
          </button>
        </li>
      ) : null}
    </ul>
  );
};
