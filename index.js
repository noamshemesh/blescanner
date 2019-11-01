var Bleacon = require('bleacon');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')
var lastTime = new Date()

console.log('Attempt to connect to mqtt')
var oldReporter;
client.on('connect', function () {
  console.log('Connected to mqtt')
  client.subscribe('presence', function (err) {
    console.log('Start scanning')
    if (err) {
      console.log('ERR: ', err)
    } else {
      Bleacon.startScanning();
      Bleacon.on('discover', function(event) {
        if (event.uuid === 'b9407f30f5f8466eaff925556b57fe6d') {
          lastTime = new Date()
        }
      });
    }
  })

  if (!oldReporter) {
    clearInterval(oldReporter);
  }

  oldReporter = setInterval(function () {
    if ((new Date() - lastTime) <= 30000) {
      client.publish('location/brian', 'home')
      console.log('Brian is home')
    } else {
      client.publish('location/brian', 'not_home')
      console.log('Brian is away')
    }
  }, 10000)
})

client.on('error', function (err) {
  console.log('ERR when connecting', err)
})
