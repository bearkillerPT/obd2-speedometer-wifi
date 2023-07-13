
import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { Data, useAppContext } from '../context/AppContext';

const App = () => {
  const { ws, data, setWs, setData } = useAppContext();
  const [viewableData, setViewableData] = useState<Data>({
    speed: 0,
    rpm: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setViewableData(data);
    }, 200);

    if(ws) {
      ws.onmessage = (e) => {
        // A message was received
        console.log(e.data);
        const message = e.data;
        const messageArray = message.split(' ');
        const mode = messageArray[0];
        const pid = messageArray[1];
        const data = messageArray[2];
        if(mode === '41' && pid === '0D') {
          const speed = parseInt(data, 16);
          setData({
            ...data,
            speed,
          });
        }
        if(mode === '41' && pid === '0C') {
          const rpm = parseInt(data, 16) / 4;
          setData({
            ...data,
            rpm,
          });
        }
      };
      ws.onerror = (e) => {
        // An error occurred
        console.log(e.currentTarget);
        setWs(null);
      }

      ws.onclose = () => {
        console.log("ws closed");
        setWs(null);
      }
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <Text>OB2 Reader</Text>
  );
};

export default App;