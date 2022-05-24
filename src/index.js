const fs = require('fs')
const eris = require('eris');
const axios = require('axios')
const config = require('../config')

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
async function writeToFile(args) {
    let buffer = new Buffer.from(`\n${args}`);
    fs.open(config.path, 'a', function (err, fd) {
        if (err) {
            console.error(err)
        } else {
            fs.write(fd, buffer, 0, buffer.length,
                null, function (err, writtenBytes) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(writtenBytes + ' characters added to file');
                    }
                })
        }
    })
}
async function downloadFile(url, path) {
    const res = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
    return res.data.pipe(fs.createWriteStream(path));
}
const client = new eris.Client(config.token, {
    allowedMentions: {
        everyone: false,
        roles: false,
    },
    prefix: 'o',
    defaultHelpCommand: false
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== config.idChanneltoSaveAndWrite) return;
    let files = fs.readdirSync('./img')
    const lines = fs.readFileSync(config.path, "UTF-8").split(/\r?\n/)
    if (config.imgSaveAndUse && files.length < config.limitimg) {
        for (const attachment of message.attachments) {
            if(attachment.filename.endsWith('.jpg') || attachment.filename.endsWith('.png') || attachment.filename.endsWith('.gif')){
                await downloadFile(`${attachment.url}`, `./img/${message.id}_${attachment.filename}`);
                console.log("Downloaded file "+attachment.filename)
            }
        }
    }
    if (message.mentions[0]?.id !== client.user.id || !random(0, 10) > 7) return;
    if (config.txtSave) {
        await writeToFile(message.content)
    }
    if (config.imgSaveAndUse) {
        if (random(1, 10) < 2) {
            let img = fs.readFileSync(`./img/${files[random(0, files.length)]}`)
            return client.createMessage(message.channel.id, lines[random(0, lines.length)], [{ file: img, name: `unknown.png` }])
        }
    }
    let randomLine = random(0, lines.length)
    if (random(1, 2)===1) {
        return client.createMessage(message.channel.id, lines[randomLine])
    }
    return client.createMessage(message.channel.id, lines[randomLine] + ' ' + lines[random(0, lines.length)])
})

client.on('error', (e) => {
    console.error(e)
})

client.once('ready', () => {
    let now = Date.now();
    fs.existsSync(config.path) ? console.log(config.path+' exists') : fs.writeFile(config.path, 'Test message.', () => { console.log(config.path+' doesn\'t exist, created new') })
    client.editStatus(config.botonlineStatus, { name: config.bottextStatus, type: config.typeofStatus })
    console.log(`Logged in as user: ${client.user.username}#${client.user.discriminator} (${client.user.id}) in ${Date.now()-now}ms`)
})

client.connect();
