import React, { createContext, useContext, useState } from 'react';

export interface Data {
  speed: number;
  rpm: number;
}

interface AppContextType {
  ws: WebSocket | null;
  data: Data;
  setWs: (ws: WebSocket | null) => void;
  setData: (data: Data) => void;
}

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType>({
  ws: null,
  data: {
    speed: 0,
    rpm: 0,
  },
  setWs: () => {},
  setData: () => {},
});

export const useAppContext = (): AppContextType => useContext(AppContext);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [data, setData] = useState<Data>({
    speed: 0,
    rpm: 0,
  });

  const updateWs = (newWs: WebSocket | null) => {
    setWs(newWs);
  };

  const updateData = (newData: Data) => {
    setData(newData);
  };

  return (
    <AppContext.Provider value={{ ws, data, setWs: updateWs, setData: updateData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
