const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.rgiehzy.mongodb.net', (error, addresses) => {
  if (error) {
    console.error('Error resolviendo SRV desde Node.js:');
    console.error(error);
    return;
  }

  console.log('SRV resuelto correctamente desde Node.js:');
  console.log(addresses);
});