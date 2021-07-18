import { Song, SongsStatus } from "../../types";
import styles from "../SongsList/SongsList.module.scss";
import { SongTile } from "../SongTile/SongTile";

type Props = {
  error: string | null;
  songs: Song[] | null;
  songsStatus: SongsStatus;
  loadMoreSongs: () => Promise<void>;
};

export const SongsList = ({ songsStatus, error, songs, loadMoreSongs }: Props) => {
  if (songsStatus === "idle") {
    return <p className={styles.idleStateText}>Search for your favourite songs!</p>;
  }
  if (songsStatus === "error") {
    return <p>{error}</p>;
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
