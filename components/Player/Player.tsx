import { useEffect, useRef, useState, MouseEvent } from "react";
import { ProgressBar } from "../Header/ProgressBar/ProgressBar";
import styles from "./Player.module.scss";

type Props = {
  currentSong: string;
  isPlaying: boolean;
  onEnded: () => void;
};

export const Player = ({ currentSong, isPlaying, onEnded }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  });

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickedX = e.pageX;
    const newValue = (clickedX - left) / width;
    audioRef.current.currentTime = newValue * audioRef.current.duration;
  };

  return (
    <div className={styles.playerWrapper}>
      <audio ref={audioRef} crossOrigin="anonymous" src={currentSong} onEnded={onEnded}></audio>;
      <ProgressBar
        handleClick={handleProgressBarClick}
        currentTime={currentTime || 0}
        duration={audioRef.current?.duration || 0}
      />
    </div>
  );
};
