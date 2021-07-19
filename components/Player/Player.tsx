import { useEffect, useRef } from "react";

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

  return <audio ref={audioRef} crossOrigin="anonymous" src={currentSong} onEnded={onEnded}></audio>;
};
