
import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import {  useAppContext } from '../context/AppContext';
import { connectionStyles } from './ConnectionSetup';

const App = () => {
  const { ws, data, setWs, setData } = useAppContext();
  useEffect(() => {
    if(ws) {
      setTimeout(() => { ws.send('01 0D') }, 200); // Send command to request vehicle speed
      setTimeout(() => { ws.send('01 0C') }, 400); // Send command to request vehicle rpm

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
  }, []);

  return (
    <>
    { ws && ws.readyState === 1 ? (
      <View style={connectionStyles.topContainer}>
       <View style={connectionStyles.entryContainer}>
         <Text style={connectionStyles.title}>Speed</Text>
         <Text style={connectionStyles.data}>{data.speed}</Text>
        </View>
        <View style={connectionStyles.entryContainer}>
          <Text style={connectionStyles.title}>RPM</Text>
          <Text style={connectionStyles.data}>{data.rpm}</Text>
        </View>
      </View>
    ) : (
      <View style={connectionStyles.topContainer}>
        <Text style={connectionStyles.title}>Not connected</Text>
      </View>
    )}
    </>
  );
};

export default App;