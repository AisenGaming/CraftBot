const db = require('better-sqlite3')("./database.sqlite");

// Queries
const   FetchQuery = db.prepare("SELECT * FROM Users WHERE userID = $userID"),
        XPQuery = db.prepare("UPDATE Users SET xp = xp + $addXP WHERE userID = $userID"),
        LevelQuery = db.prepare("UPDATE Users SET level = level + 1 WHERE userID = $userID"),
        CommQuery = db.prepare("UPDATE Users SET commendations = commendations + 1 WHERE userID = $userID"),
        InfoQuery = db.prepare("UPDATE Users SET info = $info WHERE userID = $userID"),
        CreateUserQuery = db.prepare("INSERT INTO Users (userID) values ($userID)"),
        LastMessageQuery = db.prepare("UPDATE Users SET lastMessage = $lastMessage WHERE userID = $userID");

function fetch(userID) {
    return FetchQuery.get({userID});
}

function initUser(userID) {
    CreateUserQuery.run({userID});
}

function addXP(userID, addXP) {
    XPQuery.run({addXP, userID});
}

function addLevel(userID) {
    LevelQuery.run({userID});
}

function addComm(userID) {
    CommQuery.run({userID});
}

function updateInfo(userID, info) {
    InfoQuery.run({info, userID});
}

function lastMessage(userID, lastMessage) {
    LastMessageQuery.run({userID, lastMessage});
}

module.exports = {fetch, addXP, addLevel, addComm, initUser, updateInfo, lastMessage};
