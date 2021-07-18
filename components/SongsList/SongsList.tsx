import { usePlayer } from "../../hooks/usePlayer";
import { Song, SongsStatus } from "../../types";
import styles from "../SongsList/SongsList.module.scss";
import { SongTile } from "../SongTile/SongTile";
import { MouseEvent } from "react";

type Props = {
  error: string | null;
  songs: Song[] | null;
  songsStatus: SongsStatus;
  loadMoreSongs: () => Promise<void>;
  handleTileClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const SongsList = ({ songsStatus, error, songs, loadMoreSongs, handleTileClick }: Props) => {
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
                onClick={handleTileClick}
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
