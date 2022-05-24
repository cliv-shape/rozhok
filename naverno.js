console.clear()
const fs = require('fs')
const eris = require('eris')
let path = 'naverno.txt';
const fetch = require('node-fetch'); // npm i node-fetch@2.0.0
let files = fs.readdirSync('./img')

fs.existsSync(path) ? console.log('file exists..') : fs.writeFile(path, 'hi', () => { console.log('file don\'t exists, creating new..')})
let { token, imgSaveAndUse, save, txtSave, bottextStatus, typeofStatus, botonlineStatus, idChanneltoSaveAndWrite, limitimg } = require('./naverno.json')

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
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
    return fetch(url).then(res => {
      res.body.pipe(fs.createWriteStream(path));
    });
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

client.on('messageCreate', async (m) => {
    if(m.author.bot) return;
    if(m.channel.id != idChanneltoSaveAndWrite) return;
    let e = random(0, 10)
    if(m.content.length < 60 && save === true) {
        if(m.attachments[0]) {
            if(txtSave === true) {
            await zap(m.content + m.attachments[0].url)
            }
            if(files.length < limitimg && imgSaveAndUse === true && m.attachments[0].filename.endsWith('.jpg') || m.attachments[0].filename.endsWith('.png') || m.attachments[0].filename.endsWith('.jpeg') || m.attachments[0].filename.endsWith('.gif')) {
            await downloadFile(`${m.attachments[0].url}`, `./img/${m.id}_${m.attachments[0].filename}`)
            }
        }
        if(!m.attachments[0] && txtSave === true) {
        await zap(m.content)
        }
    }
    if(m.mentions[0]?.id != client.user.id || !e > 7) return;
    let data = fs.readFileSync(path, 'UTF-8');
    let lines = data.split(/\r?\n/)
    let e1 = random(1, 10)
    if(imgSaveAndUse === true) {
    if(files.length < limitimg) {
    let imagehas = random(1, 10)
    if(imagehas < 2) {
        let randomfile = random(0, files.length)
        let randomline = random(0, lines.length)
        let img = fs.readFileSync(`./img/${files[randomfile]}`)
        
        return client.createMessage(m.channel.id, lines[randomline], [{ file: img, name: `${files[randomfile]}`}])
    }
}
}
    if(e1 > 5) {
    let randomline = random(0, lines.length)
    return client.createMessage(m.channel.id, lines[randomline])
    }
    if(e1 < 5) {
    let randomline = random(0, lines.length)
    let randomlinetoplus = random(0, lines.length)
    return client.createMessage(m.channel.id, lines[randomline] + ' ' + lines[randomlinetoplus])
    }
})
client.on('error', (e) => {
    console.error(e)
})
client.once('ready', () => {
    console.log(`logged,\nuser: ${client.user.username}\navatarURL: ${client.user.avatarURL}\nclient_id: ${client.user.id}\nguilds_count: ${client.guilds.size}`)
    client.editStatus(botonlineStatus, { name: bottextStatus, type: typeofStatus })
})
client.connect();
