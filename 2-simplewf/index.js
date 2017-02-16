
const restify = require('restify');
const builder = require('botbuilder');
const sessionData = require('./sessionData');

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

bot.dialog('/', [
    (session, args, next) => {
        if (session.conversationData.location) {
            next();
        } else {
            session.beginDialog('/location');
        }
    },
    (session, results) => {
        const currentSession = sessionData(session.conversationData.location);
        session.send(`The current session for ${session.conversationData.location} is ${currentSession.title}`);
    }
]);

bot.dialog('/location', [
    (session) => {
        builder.Prompts.text(session, 'Hi! What room are you interested in?');
    },
    (session, results) => {
        session.conversationData.location = results.response;
        session.endDialog();
    }
]);