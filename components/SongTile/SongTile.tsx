import styles from "./SongTile.module.scss";
import Image from "next/image";
import { MouseEvent } from "react";

type Props = {
  title: string;
  artistName: string;
  albumCoverSrc: string;
  songSrc: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const SongTile = ({ title, artistName, albumCoverSrc, onClick, songSrc }: Props) => {
  return (
    <li className={styles.song}>
      <button data-song-src={songSrc} onClick={onClick}>
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
      </button>
    </li>
  );
};
