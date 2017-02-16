const sessions = require('./sessions');

module.exports = (room) => {
    return sessions.sessions.find((element) => element.room.toLowerCase() === room.toLowerCase());
}