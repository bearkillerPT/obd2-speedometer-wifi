// UI to setup the connection to the obd device

import React, { useState } from 'react';
import { Alert, ImageBackground, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import TcpSocket from 'react-native-tcp-socket';

const ConnectionSetup = () => {
  const [ip, setIp] = useState('192.168.1.120');
  const [port, setPort] = useState('35000');
  const { tcpSocket, data, setTcpSocket } = useAppContext();

  const [connectionStatus, setConnectionStatus] = useState<
  "disconnected" |
  "connecting" |
  "connected">('disconnected');

  const disconnect = () => {
    if (tcpSocket?.readyState === 'open')  {
      tcpSocket?.end()
      setTcpSocket(null);
      setConnectionStatus('disconnected');
    }
  };

  const connect = () => {
    if(connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
      const options = {
        port: Number(port),
        host: ip,
        localAddress: '127.0.0.1',
        reuseAddress: true,
        // localPort: 20000,
        // interface: "wifi",
      };
      
      // Create socket
      const client = TcpSocket.createConnection(options, () => {
        // Write on the socket
        client.write('ATZ\r\n');
      
        // Close socket
        client.destroy();
      });
      
      client.on('data', function(data) {
        setTcpSocket(client);
        console.log('message was received', data);
      });
      
      client.on('error', function(error) {
        console.log(error);
      });
      
      client.on('close', function(){
        console.log('Connection closed!');
      });
    }
    else {
      Alert.alert("Connection is already being established");
    }
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
            editable={connectionStatus === "disconnected"}
          />
        </View>
        <View style={connectionStyles.entryContainer}>
          <Text style={connectionStyles.title}>Port</Text>
          <TextInput
            onChangeText={setPort}
            value={port}
            placeholder="35000"
            style={connectionStyles.textInput}
            editable={connectionStatus === "disconnected"}
          />
        </View>
        <View style={connectionStyles.entryContainer}>
          {tcpSocket === null || connectionStatus === "disconnected" ? (
            <TouchableOpacity onPress={connect} style={[connectionStyles.connectButton, {
              backgroundColor: ip === '' || port === '' ? 'gray' : connectionStyles.connectButton.backgroundColor,
            }]}>
              <Text style={connectionStyles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={disconnect} style={[connectionStyles.connectButton, {
              backgroundColor: "red",
            }]}>
              <Text style={connectionStyles.connectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={connectionStyles.footNote}>Please connect the OBD2 Wifi reader to your car and connect to its Wifi Access Point! This are the default host ip and port that readers like elm327 use.</Text>
      </View>
    </ImageBackground>
  );
}
export default ConnectionSetup;

export const connectionStyles = StyleSheet.create({
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
  },
  data: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center"
  }
});
