const express = require('express');
const http = require('http');
const { SerialPort, ReadlineParser } = require('serialport');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// CONFIGURAR A PORTA SERIAL CERTA!
const portSerial = new SerialPort({
  path: 'COM3', // AJUSTE AQUI pra porta correta do Arduino
  baudRate: 115200,
});

const parser = portSerial.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (data) => {
  try {
    const jsonData = JSON.parse(data.trim());
    const { bpm, spo2 } = jsonData;

    console.log(`BPM: ${bpm}, SpO2: ${spo2}`);
    io.emit('dadosSensor', { bpm, spo2 });
  } catch (err) {
    console.error('Erro ao processar os dados:', err);
  }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
