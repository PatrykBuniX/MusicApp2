import { useState } from "react";

export const songsStates = {
  empty: "empty",
  isLoading: "loading",
  hasLoaded: "loaded",
  hasError: "error",
} as const;

export type SongsState = typeof songsStates[keyof typeof songsStates];

const transitions: Transitions = {
  [songsStates.empty]: {
    FETCH_SONGS: songsStates.isLoading,
  },
  [songsStates.isLoading]: {
    FETCH_SONGS_SUCCESS: songsStates.hasLoaded,
    FETCH_SONGS_ERROR: songsStates.hasError,
  },
  [songsStates.hasLoaded]: {
    FETCH_SONGS: songsStates.isLoading,
  },
  [songsStates.hasError]: {
    FETCH_SONGS: songsStates.isLoading,
  },
};

type Action = "FETCH_SONGS" | "FETCH_SONGS_SUCCESS" | "FETCH_SONGS_ERROR";

type Transitions = {
  [key in SongsState]: { [key in Action]?: SongsState };
};

const useSongsState = () => {
  const [songsState, setSongsState] = useState<SongsState>(songsStates.empty);

  function transition(currentState: SongsState, action: Action): SongsState {
    const nextState = transitions[currentState][action];
    return nextState || currentState;
  }

  function updateSongsState(action: Action) {
    setSongsState((currentState) => transition(currentState, action));
  }

  return [songsState, updateSongsState] as const;
};

export { useSongsState };
