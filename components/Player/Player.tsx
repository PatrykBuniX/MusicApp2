import { useEffect, useRef } from "react";
import { ProgressBar } from "../Header/ProgressBar/ProgressBar";
import styles from "./Player.module.scss";

type Props = {
  currentSong: string;
  isPlaying: boolean;
  onEnded: () => void;
};

export const Player = ({ currentSong, isPlaying, onEnded }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  });

  useEffect(() => {});

  return (
    <div className={styles.playerWrapper}>
      <audio ref={audioRef} crossOrigin="anonymous" src={currentSong} onEnded={onEnded}></audio>;
      {audioRef.current ? <ProgressBar audioElement={audioRef.current} /> : null}
    </div>
  );
};
