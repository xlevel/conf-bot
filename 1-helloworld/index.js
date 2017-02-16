
const restify = require('restify');
const builder = require('botbuilder');

// Restify Server
const server = restify.createServer();
server.listen(
    /* Port number */ 3978, 
    () => console.log(`Starting server ${server.name} listerning to port ${server.port}`));

// Configure Bot Framework Connector
const connector = new builder.ChatConnector(/* Chat Connector Credentials */);

// Configure the main  
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/', [(session) => session.send('Hello World!')]);
