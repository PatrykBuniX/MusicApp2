import { MouseEvent } from "react";
import { createTimeStamp } from "../../utils/createTimeStamp";
import styles from "./ProgressBar.module.scss";

type Props = {
  currentTime: number;
  duration: number;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export const ProgressBar = ({ currentTime, duration, handleClick }: Props) => {
  return (
    <div onClick={handleClick} className={styles.progressBar}>
      <span className={styles.currentTime}>{createTimeStamp(currentTime)}</span>
      <div
        style={{ width: `${(100 * currentTime) / duration}%` }}
        className={styles.progress}
      ></div>
      <span className={styles.duration}>{createTimeStamp(duration)}</span>
    </div>
  );
};
