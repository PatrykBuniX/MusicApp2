import { Song, SongsState } from "../../types";
import Image from "next/image";
import styles from "../SongsList/SongsList.module.scss";

type Props = {
  error: string | null;
  songs: Song[] | null;
  songsState: SongsState;
  loadMoreSongs: () => Promise<void>;
};

export const SongsList = ({ songsState, error, songs, loadMoreSongs }: Props) => {
  if (songsState === "empty") {
    return <p>Search for your favourite song!</p>;
  }
  if (songsState === "loading") {
    return <p>Loading...</p>;
  }
  if (songsState === "error") {
    return <p>{error}</p>;
  }

  //songState is loaded

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
      <li className={styles.song}>
        <button className={styles.loadMoreButton} onClick={loadMoreSongs}>
          load more
        </button>
      </li>
    </ul>
  );
};
