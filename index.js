console.clear()
const fs = require('fs')
const eris = require('eris')
let path = 'data.txt';
const axios = require('axios')
let files = fs.readdirSync('./img')

let { token, imgSaveAndUse, save, txtSave, bottextStatus, typeofStatus, botonlineStatus, idChanneltoSaveAndWrite, limitimg, chance } = require('./config')

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
async function zap(args) {
let buffer = new Buffer.from(`\n${args}`);
fs.open(path, 'a', function(err, fd) {
    if(err) {
        console.error(err)
    } else {
        fs.write(fd, buffer, 0, buffer.length, 
                null, function(err,writtenbytes) {
            if(err) {
                console.error(err);
            } else {
                console.log(writtenbytes +
                    ' characters added to file');
            }
        })
    }
})}
async function downloadFile(url, path) {
    const res = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    })
    return res.data.pipe(fs.createWriteStream(path));
}
const client = new eris.Client(token, {
    allowedMentions: {
        everyone: false, 
        roles: false,
    }
}, {
    prefix: 'o',
    defaultHelpCommand: false
})
// check config
if(!path || typeof path != 'string') {
    console.log('Your path incorrect!')
} 
if(typeofStatus > 5 || typeofStatus < 0 || typeof typeofStatus != 'number') { // typeof typeofStatus xd
    console.log('Your bot text status incorrect!')
    process.exit()
}
if(chance > 50 || chance < 0 || typeof chance != 'number') {
   console.log('chance > 50 || < 0')
   process.exit()
}
if(!token || typeof token != 'string') {
    console.log('Your bot token incorrect!')
    process.exit()
}
if(!idChanneltoSaveAndWrite || typeof idChanneltoSaveAndWrite != 'string') {
    console.log('Your ID channel incorrect!')
    process.exit()
}
if(!bottextStatus || typeof bottextStatus != 'string') {
    console.log('Your bot text status incorrect!')
    process.exit()
}
if(!botonlineStatus || typeof botonlineStatus != 'string') {
    console.log('Your bot text status incorrect!')
    process.exit()
}
// check config

client.on('messageCreate', async (m) => {
    if(m.author.bot) return;
    if(m.channel.id != idChanneltoSaveAndWrite) return;

    if(m.content.length < 60 && save === true) {
        if(m.attachments[0]) {
            if(files.length < limitimg && imgSaveAndUse === true && m.attachments[0].filename.endsWith('.jpg') || m.attachments[0].filename.endsWith('.png') || m.attachments[0].filename.endsWith('.jpeg') || m.attachments[0].filename.endsWith('.gif')) {
            await downloadFile(`${m.attachments[0].url}`, `./img/${m.id}_${m.attachments[0].filename}`)
            }
            if(txtSave === true) {
                await zap(`${m.content} ${m.attachments[0].url}`)
            }
        } 
        if(!m.attachments[0] && txtSave === true) {
        await zap(m.content)
        }
    }
    if(m.mentions[0]?.id != client.user.id || random(0, 50) > chance) return;

    let data = fs.readFileSync(path, 'UTF-8');
    let lines = data.split(/\r?\n/)

    if(imgSaveAndUse === true) {
    if(files.length < limitimg) {
    if(random(1, 10) < 2) {
        let randomfile = random(0, files.length)
        let img = fs.readFileSync(`./img/${files[randomfile]}`)
        return client.createMessage(m.channel.id, lines[random(0, lines.length)], [{ file: img, name: `${files[randomfile]}`}])
    }
}
    }
    if(random(1, 2) < 1) {
    return client.createMessage(m.channel.id, `${lines[random(0, lines.length)]} ${lines[random(0, lines.length)]}`)
    }
    return client.createMessage(m.channel.id, lines[random(0, lines.length)])  
})

client.on('error', (e) => {
    console.error(e)
})

client.once('ready', () => {
    fs.existsSync(path) ? console.log('file exists..') : fs.writeFile(path, 'hi\nwho\nwhat', () => { console.log('file don\'t exists, creating new..')})
    console.log(`logged,\nuser: ${client.user.username}\navatarURL: ${client.user.avatarURL}\nclient_id: ${client.user.id}\nguilds_count: ${client.guilds.size}`)
    client.editStatus(botonlineStatus, { name: bottextStatus, type: typeofStatus })
})
client.connect();