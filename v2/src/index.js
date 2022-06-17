const eris = require('eris');
const config = require('../config.js');
const axios = require('axios');
const client = new eris(config.token, {
    allowedMentions: {
        everyone: false, 
        roles: false,
        repliedUser: true,
        users: true
    }
});

if(!config.token) {
    console.log('кто токен украл?');
    process.exit();
};

function generate_message(msg) {
    return axios.post('https://xu.su/api/send', {
        "bot": config.type,
        "text": msg,
    }).then(r => {
        return r.data.text
        }
    )
    .catch(e => console.log(e));
};

client.on('messageCreate', async (m) => {
    if(m.author.bot) return;

    if(!config.channelID) {
        if(!m.mentions.includes(client.user)) return;
    };

    if(config.channelID) {
        if(m.channel.id != config.channelID) {
			if(config.canBotWriteToOtherChannel) {
				if(!m.mentions.includes(client.user)) return;
			}
			if(!config.canBotWriteToOtherChannel) return;
		}
    }

    let newContent = m.content;

    if(m.attachments[0]) {
        if(!m.content) newContent = `${m.attachments[0].url}`;
        if(m.content) newContent = `${m.content} ${m.attachments[0].url}`;
    }
    let pattern = new RegExp(`<!?${client.user.id}>`);

    return client.createMessage(m.channel.id, await generate_message(newContent.replace(pattern, '')))
    .catch(e => console.log(e));
})

client.once('ready', async () => {
    console.log(`logged,\nuser: ${client.user.username}\navatarURL: ${client.user.avatarURL}\nclient_id: ${client.user.id}\nguilds_count: ${client.guilds.size}\ntype: ${config.type}\n`);
    client.editStatus(config.botonlineStatus, { name: config.bottextStatus, type: config.typeofStatus });
});

client.on('error', (e) => {
    console.error(e);
});

client.connect();