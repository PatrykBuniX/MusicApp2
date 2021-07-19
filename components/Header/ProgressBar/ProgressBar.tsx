import { MouseEvent, useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";

type Props = {
  audioElement: HTMLAudioElement;
};

export const ProgressBar = ({ audioElement }: Props) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(audioElement.currentTime || 0);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [audioElement]);

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickedX = e.pageX;
    const newValue = (clickedX - left) / width;
    audioElement.currentTime = newValue * audioElement.duration;
  };

  return (
    <div onClick={handleProgressBarClick} className={styles.progressBar}>
      <div
        style={{ width: `${(100 * currentTime) / audioElement.duration}%` }}
        className={styles.progress}
      ></div>
    </div>
  );
};
