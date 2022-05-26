"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const config_1 = __importDefault(require("../config"));
const axios_1 = __importDefault(require("axios"));
const eris_1 = __importDefault(require("eris"));
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
async function writeToFile(args) {
    let buffer = Buffer.from(`\n${args}`);
    fs_1.default.open(config_1.default.path, 'a', function (err, fd) {
        if (err) {
            console.error(err);
        }
        else {
            fs_1.default.write(fd, buffer, 0, buffer.length, null, function (err, writtenBytes) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(writtenBytes + ' characters added to file');
                }
            });
        }
    });
}
async function downloadFile(url, path) {
    const res = await (0, axios_1.default)({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    return res.data.pipe(fs_1.default.createWriteStream(path));
}
const client = new eris_1.default.Client(config_1.default.token, {
    allowedMentions: {
        everyone: false,
        roles: false,
    }, intents: ["guildMessages"]
});
client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    if (message.channel.id !== config_1.default.idChannelToSaveAndWrite)
        return;
    let files = fs_1.default.readdirSync('./img');
    const lines = fs_1.default.readFileSync(config_1.default.path, { encoding: "utf-8" }).split(/\r?\n/);
    if (config_1.default.imgSaveAndUse && files.length < config_1.default.limitimg) {
        for (const attachment of message.attachments) {
            if (attachment.filename.endsWith('.jpg') || attachment.filename.endsWith('.png') || attachment.filename.endsWith('.gif')) {
                await downloadFile(`${attachment.url}`, `./img/${attachment.filename}`);
                console.log("Downloaded file " + attachment.filename);
            }
        }
    }
    if (random(0, 10) < 9 || message.mentions.includes(client.user))
        return;
    if (config_1.default.txtSave) {
        await writeToFile(message.content);
    }
    if (config_1.default.imgSaveAndUse) {
        if (random(1, 10) < 2) {
            const file = files[random(0, files.length)];
            try {
                let img = fs_1.default.readFileSync(`./img/${file}`);
                return client.createMessage(message.channel.id, lines[random(0, lines.length)], [{ file: img, name: file }]);
            }
            catch (e) {
                console.error(e.message);
            }
        }
    }
    let randomLine = random(0, lines.length);
    if (random(1, 2) === 1) {
        return client.createMessage(message.channel.id, lines[randomLine]);
    }
    return client.createMessage(message.channel.id, lines[randomLine] + ' ' + lines[random(0, lines.length)]);
});
client.on('error', (e) => {
    console.error(e);
});
client.once('ready', () => {
    let now = Date.now();
    fs_1.default.existsSync(config_1.default.path) ? console.log(config_1.default.path + ' exists') : fs_1.default.writeFile(config_1.default.path, 'Test message.', () => { console.log(config_1.default.path + ' doesn\'t exist, created new'); });
    client.editStatus(config_1.default.botonlineStatus, { name: config_1.default.bottextStatus, type: config_1.default.typeofStatus });
    console.log(`Logged in as user: ${client.user.username}#${client.user.discriminator} (${client.user.id}) in ${Date.now() - now}ms`);
});
client.connect();
