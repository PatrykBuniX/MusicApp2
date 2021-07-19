import { MouseEvent, useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";

type Props = {
  currentTime: number;
  duration: number;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
};

export const ProgressBar = ({ currentTime, duration, handleClick }: Props) => {
  return (
    <div onClick={handleClick} className={styles.progressBar}>
      <div
        style={{ width: `${(100 * currentTime) / duration}%` }}
        className={styles.progress}
      ></div>
    </div>
  );
};
