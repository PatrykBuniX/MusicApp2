import { RefObject, useEffect, useState } from "react";

type PlayerState = {
  prevSong: string | undefined;
  currentSong: string | undefined;
  nextSong: string | undefined;
  isPlaying: boolean;
};

const initialPlayerState = {
  prevSong: undefined,
  currentSong: undefined,
  nextSong: undefined,
  isPlaying: false,
};

export const usePlayer = (audioRef: RefObject<HTMLAudioElement>) => {
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const { currentSong, isPlaying } = playerState;

  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSong) return;
    audioRef.current.src = currentSong;
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  }, [currentSong, audioRef]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!currentSong) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying, audioRef]);

  return [playerState, setPlayerState] as const;
};
