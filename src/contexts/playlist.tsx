import React, {createContext, useState} from 'react';
import {Playlist, PlaylistContextType, PlaylistId} from '../types';

const PlaylistContext = createContext<PlaylistContextType>({
  playlists: {},
  setPlaylists: () => {},
});

export const PlaylistProvider = ({children}: {children: React.ReactNode}) => {
  const [playlists, setPlaylists] = useState<Record<PlaylistId, Playlist>>({});

  return (
    <PlaylistContext.Provider value={{playlists, setPlaylists}}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
