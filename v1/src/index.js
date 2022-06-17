const fs = require('fs');
const eris = require('eris');
const axios = require('axios');

let config = require('../config.js');
if(!config.token || !config.idChanneltoSaveAndWrite || !config.bottextStatus || !config.botonlineStatus) console.log('ale, ti konfig ne zapolnil');
const { createCanvas, loadImage } = require('canvas');

const client = new eris.Client(config.token, {
    allowedMentions: {
        everyone: false, 
        roles: false,
    }
});


function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

async function zap(args) {
    let buffer = new Buffer.from(`\n${args}`);
    return fs.open(config.path, 'a', function(err, fd) {
        if(err) {
            console.error(err)
        } else {
            fs.write(fd, buffer, 0, buffer.length, 
                    null, function(err,writtenbytes) {
                if(err) {
                    console.error(err);
                } else {
                    console.log(writtenbytes +
                        ' символов добавлено в файл');
                }
            })
        }
})};

async function downloadFile(url, path) {
    const res = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    return res.data.pipe(fs.createWriteStream(path));
};


async function demotivatorImage(img, title, subtitle) {

 const canvas = createCanvas(714, 745)
  const ctx = canvas.getContext('2d')
  ctx.font = '48px Times New Roman'

  const image = await loadImage('../assets/demotivator.png')
  ctx.drawImage(image, 0, 0)
  const avatar = await loadImage(img)
  ctx.drawImage(avatar, 46, 46, 622, 551)

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText(title, 345, 660)

  if(subtitle) {
  ctx.font = 'normal 40px Times New Roman'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText(subtitle, 346, 710)
  }
  return canvas.toBuffer()
};

client.on('messageCreate', async (m) => {
    let data = fs.readFileSync(config.path, 'UTF-8');
    let lines = data.split(/\r?\n/);

    let imgdir = fs.readdirSync('../img');

    if(m.author.bot) return;
    if(m.channel.id != config.idChanneltoSaveAndWrite) return;

    if(m.content.length < config.maxLenghtToWrite && config.saveAnyData) {
        let contentmessage = m.content.split('\n').join(' ')
        if(!m.attachments[0] && m.content && m.content != `<@${client.user.id}>`) zap(contentmessage);
        if(imgdir.length > config.limitimg) {
            console.log(`Место в ../img закончилось. ${imgdir.length} > ${config.limitimg}`)
        }
        if (config.imgSaveAndUse && imgdir.length < config.limitimg) {
            for (let attachment of m.attachments) {
                // TODO: support .jpg
                if(!m.attachments[config.limitToImgOnce] && attachment.filename.endsWith('.jpeg') || attachment.filename.endsWith('.png') || attachment.filename.endsWith('.gif')) {
                    await downloadFile(`${attachment.url}`, `../img/${m.id}_${attachment.filename}`);
                    console.log(`Скачан файл: ${attachment.filename}`)
                    if(m.content) zap(`${contentmessage} ${attachment.url}`)
                }
            }
        }
    }

    if(!m.mentions.includes(client.user)) {
        if(!config.randomMessage) return;
        if (random(0, 11) < config.chance && config.randomMessage) {
            return;
        }
    }

    if (config.imgSaveAndUse) {
        if (random(0, 11) < 4) {
            const file = imgdir[random(0, imgdir.length)];
            if(random(0, 11) < config.demotivatorChance) {
                const image = await demotivatorImage(fs.readFileSync(`../img/${file}`), lines[random(0, lines.length)], lines[random(0, lines.length)])
                if(random(0, 11) < 5) {
                    return client.createMessage(m.channel.id, lines[random(0, lines.length)], [{ file: image, name: file }])
                }
                return client.createMessage(m.channel.id, lines[random(0, lines.length)], [{ file: image, name: file }])
            } 
            try{
                let img = fs.readFileSync(`../img/${file}`)
                return client.createMessage(m.channel.id, lines[random(0, lines.length)], [{ file: img, name: file }])
            } catch (e) {
                console.error(e)
            }
        }
    }
    let randomLine = random(0, lines.length)
    if (random(0, 3) === 1) {
        return client.createMessage(m.channel.id, lines[randomLine])
    }
    return client.createMessage(m.channel.id, lines[randomLine] + ' ' + lines[random(0, lines.length)])
})

client.once('ready', async () => {
    if(config.cycleTyping) {
        await client.getChannel(config.idChanneltoSaveAndWrite).sendTyping();
    }
    console.log(`logged,\nuser: ${client.user.username}\navatarURL: ${client.user.avatarURL}\nclient_id: ${client.user.id}\nguilds_count: ${client.guilds.size}\nrandom_number: ${random(0, 100)}`)
    client.editStatus(config.botonlineStatus, { name: config.bottextStatus, type: config.typeofStatus })
});

client.on('error', (e) => {
    console.error(e)
});

client.connect()