import { Song, SongsStatus } from "../../types";
import Image from "next/image";
import styles from "../SongsList/SongsList.module.scss";
import { LoadingView } from "../LoadingView/LoadingView";

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

  songsStatus;
  //songStatus is loaded

  return (
    <ul className={styles.songsList}>
      {songs
        ? songs.map((song: Song, index) => {
            return (
              <li className={styles.song} key={index + "-" + song.id}>
                <div className={styles.songContent}>
                  <p className={styles.songTitle}>{song.title}</p>
                  <p className={styles.songArtist}>{song.artist.name}</p>
                </div>
                <div className={styles.songImageWrapper}>
                  <Image
                    className={styles.songImage}
                    src={song.album.cover}
                    alt=""
                    layout="fill"
                    objectFit="fill"
                  />
                </div>
              </li>
            );
          })
        : null}
      {songsStatus === "loaded" ? (
        <li className={styles.song}>
          <button className={styles.loadMoreButton} onClick={loadMoreSongs}>
            load more
          </button>
        </li>
      ) : null}
    </ul>
  );
};
