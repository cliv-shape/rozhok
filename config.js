module.exports = {
    token: "", // your bot token
    saveAnyData: true, // if switch this to false imgSaveAndUse will be useless
    imgSaveAndUse: true, // save and use user's images of gifs in random bot`s answers
    txtSave: true, // save user's messages to path variable file
    bottextStatus: "", // message which will be shown in rpc of bot, for example: Watching your server
    botonlineStatus: "", // sets the bot's status, either "online", "idle", "dnd", or "invisible"
    typeofStatus: 3, // type of status, 0 is playing, 1 is streaming (Twitch only), 2 is listening, 3 is watching, 5 is competing in
    idChanneltoSaveAndWrite: "", // the channel's id where messages will be sent and message`s content will be saved
    limitimg: 100, // limit to save images
    path: 'data.txt', // path to file where user's messages saves
    chance: 25 // chance to message (0-50)
}