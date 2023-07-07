import React, { useEffect, useRef } from 'react';
import { Text } from 'react-native';

const App = () => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.0.10:35000');

    ws.current.onopen = () => {
      console.log("ws opened");
      if (ws.current)
      ws.current.send('01 0D'); // Send command to request vehicle speed
    };

    ws.current.onmessage = (e) => {
      // A message was received
      console.log(e.data);
    };

    ws.current.onerror = (e) => {
      // An error occurred
      console.log(e.currentTarget);
    };

    ws.current.onclose = () => {
      console.log("ws closed");
    };

    return () => {
      // Cleanup function
      if (ws.current)
      ws.current.close();
    };
  }, []);

  return (
    <Text>OB2 Reader</Text>
  );
};

export default App;
