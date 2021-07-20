import { MouseEvent } from "react";
import { createTimeStamp } from "../../utils/createTimeStamp";
import styles from "./ProgressBar.module.scss";

type Props = {
  currentTime: number;
  duration: number;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
  disabled: boolean;
};

export const ProgressBar = ({ currentTime, duration, handleClick, disabled }: Props) => {
  return (
    <div
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "default" : "pointer" }}
      onClick={handleClick}
      className={styles.progressBar}
    >
      <span className={styles.currentTime}>{createTimeStamp(currentTime)}</span>
      <div
        style={{ width: `${(100 * currentTime) / duration}%` }}
        className={styles.progress}
      ></div>
      <span className={styles.duration}>{createTimeStamp(duration)}</span>
    </div>
  );
};
