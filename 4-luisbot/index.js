
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

var recognizer = new builder.LuisRecognizer( /* LUIS API URL HERE */ );
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', intents);
intents.matches('what-is-on', (session, args, next) => {
        const room = args.entities[0].entity;
        session.beginDialog('/location', room);
    })
    .matches('None', (session) => {
        session.beginDialog('/location');
    });

bot.dialog('/location', [
    (session, args, next) => {
        if (args) {
            session.conversationData.location = args;
            next();
        }
        else {
            builder.Prompts.text(session, 'Hi! What room are you interested in?');
        }
    },
    (session, results) => {
        if (results.response) {
            session.conversationData.location = results.response;
        }

        const currentSession = sessionData(session.conversationData.location);
        session.endDialog(`The current session for ${session.conversationData.location} is ${currentSession.title}`);
    }
]);