import styles from "./SongTile.module.scss";
import Image from "next/image";

type Props = {
  title: string;
  artistName: string;
  albumCoverSrc: string;
};

export const SongTile = ({ title, artistName, albumCoverSrc }: Props) => {
  return (
    <li className={styles.song}>
      <div className={styles.songContent}>
        <p className={styles.songTitle}>{title}</p>
        <p className={styles.songArtist}>{artistName}</p>
      </div>
      <div className={styles.songImageWrapper}>
        <Image
          className={styles.songImage}
          src={albumCoverSrc}
          alt=""
          layout="fill"
          objectFit="fill"
        />
      </div>
    </li>
  );
};
