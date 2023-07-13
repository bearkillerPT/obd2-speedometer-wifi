// UI to setup the connection to the obd device

import React, { useState } from 'react';
import { Alert, ImageBackground, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../context/AppContext';

const ConnectionSetup = () => {
  const [ip, setIp] = useState('192.168.0.10');
  const [port, setPort] = useState('35000');
  const { ws, data, setWs } = useAppContext();

  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">('disconnected');

  const connect = () => {
    const newWs = new WebSocket(`ws://${ip}:${port}`, undefined);
    setTimeout(() => {
      if(newWs.readyState !== 1) {
        Alert.alert("Connection failed");
        return;
      }
    }, 2000);
    newWs.onopen = () => {
      console.log("ws opened");
      Alert.alert("Connection established");
      setTimeout(() => {
        newWs.send('01 0D');
      }, 200); // Send command to request vehicle speed
    setWs(newWs); // Update the value of ws using setWs
    setConnectionStatus('connected');
    };
    newWs.onmessage = (e) => {
      // A message was received
      console.log(e.data);
    };
    newWs.onerror = (e) => {
      // An error occurred
      console.log(e.currentTarget);
      setConnectionStatus('disconnected');
    };
    newWs.onclose = () => {
      console.log("ws closed");
      setConnectionStatus('disconnected');
      Alert.alert("Connection closed");
    };

  };

  return (
    <ImageBackground
      source={require('../../assets/dark_night_sky.jpg')}
      resizeMode='stretch'
    >
      <View style={connectionStyles.topContainer}>
        <View style={connectionStyles.entryContainer}>
          <Text style={connectionStyles.title}>IP</Text>
          <TextInput
            onChangeText={setIp}
            value={ip}
            placeholder="192.168.0.10"
            style={connectionStyles.textInput}
          />
        </View>
        <View style={connectionStyles.entryContainer}>
          <Text style={connectionStyles.title}>Port</Text>
          <TextInput
            onChangeText={setPort}
            value={port}
            placeholder="35000"
            style={connectionStyles.textInput}
          />
        </View>
        <View style={connectionStyles.entryContainer}>
          {ws === null || connectionStatus === "disconnected" ? (
            <TouchableOpacity onPress={connect} style={[connectionStyles.connectButton, {
              backgroundColor: ip === '' || port === '' ? 'gray' : connectionStyles.connectButton.backgroundColor,
            }]}>
              <Text style={connectionStyles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          ) : (
            <Text style={connectionStyles.connectedText}>Connected!</Text>
          )}
        </View>
        <Text style={connectionStyles.footNote}>Please connect the OBD2 Wifi reader to your car and connect to its Wifi Access Point! This are the default host ip and port that readers like elm327 use.</Text>
      </View>
    </ImageBackground>
  );
}
export default ConnectionSetup;

const connectionStyles = StyleSheet.create({
  topContainer: {
    display: "flex",
    postion: "relative",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    height: "100%",
  },
  entryContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    color: "white",
  },
  connectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  connectButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: "#FFFFFF",
  },
  connectedText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: "#00FF00",
    textAlign: "center"
  },
  footNote: {
    position: "absolute",
    bottom: 0,
    fontSize: 12,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: "#000000",
    textAlign: "center"
  }
});