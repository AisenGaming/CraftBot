const db = require('better-sqlite3')("./database.sqlite");

// Queries
const   FetchQuery = db.prepare("SELECT * FROM Users WHERE userID = $userID"),
        AddXPQuery = db.prepare("UPDATE Users SET xp = xp + $addXP WHERE userID = $userID"),
        SetXPQuery = db.prepare("UPDATE Users SET xp = $setXP WHERE userID = $userID"),
        LevelQuery = db.prepare("UPDATE Users SET level = level + 1 WHERE userID = $userID"),
        CommQuery = db.prepare("UPDATE Users SET commendations = commendations + 1 WHERE userID = $userID"),
        InfoQuery = db.prepare("UPDATE Users SET info = $info WHERE userID = $userID"),
        CreateUserQuery = db.prepare("INSERT INTO Users (userID) values ($userID)"),
        LastMessageQuery = db.prepare("UPDATE Users SET lastMessage = datetime('now') WHERE userID = $userID"),
        LastExpQuery = db.prepare("UPDATE Users SET lastexp = datetime('now') WHERE userID = $userID"),
        LastCommQuery = db.prepare("UPDATE Users SET lastcommend = datetime('now') WHERE userID = $userID");

function fetch(userID) {
    return FetchQuery.get({userID});
}

function initUser(userID) {
    CreateUserQuery.run({userID});
}

function addXP(userID, addXP) {
    AddXPQuery.run({userID, addXP});
}

function setXP(userID, setXP) {
    SetXPQuery.run({userID, setXP});
}

function addLevel(userID) {
    LevelQuery.run({userID});
}

function addComm(userID) {
    CommQuery.run({userID});
}

function updateInfo(userID, info) {
    InfoQuery.run({userID, info});
}

function lastMessage(userID) {
    LastMessageQuery.run({userID});
}

function lastExp(userID) {
    LastExpQuery.run({userID});
}

function lastComm(userID) {
    LastCommQuery.run({userID});
}

module.exports = {fetch, addXP, setXP, addLevel, addComm, initUser, updateInfo, lastMessage, lastExp, lastComm};
