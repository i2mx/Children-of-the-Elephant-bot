// import Message from "./message.js"
import { spawn } from "child_process";


import dotenv from "dotenv"
dotenv.config();
const token = process.env.token;

import { Client, MessageAttachment, MessageEmbed } from "discord.js"
const client = new Client(); // Starts the Discord Bot 

import databaseManager from "./messageDatabaseManager.js"
let dbManager = new databaseManager(); // Creates an object to interact with the Message Database 
await dbManager.start();

async function getCurrentWindow() {
  return new Promise((resolve, reject) => {
    let dataToSend;
    const python = spawn('python', ['activewindow.py']);

    python.stdout.on('data', function (data) {
      dataToSend = data.toString();
      resolve(dataToSend);
    });

    python.on('close', (code) => {
      resolve(dataToSend);
    });
  });
}

async function getScreenshot() {
  return new Promise((resolve, reject) => {
    let dataToSend;
    const python = spawn('python', ['screenshot.py']);

    python.stdout.on('data', function (data) {
      dataToSend = data.toString();
      console.log(dataToSend);
      resolve(dataToSend.trim());
    });

    python.on('close', (code) => {
      resolve(dataToSend.trim());
    });
  });
}


// When the discord bot starts
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}! \n`)
  client.user.setActivity('type \"setstatus (something funny)\" ', { type: 'PLAYING' });
  // client.user.setPresence({ activities: [{ name: 'with YOUR MOM' }] });
})

// When a message is send in chat
client.on("message", async msg => {

  if (!msg.author.bot) {
    let messageContent = msg.content.toLowerCase();

    // Lets people spy on me
    if (messageContent.startsWith("whatsjaydoing")) {
      let whatJayIsLookingAt = new MessageEmbed()
        .setColor("#A3BE8C")
        .setTitle("Jay's currently on")
        .setDescription(await getCurrentWindow())
      msg.reply(whatJayIsLookingAt);
    }
    // Lets ppl spy on me more
    else if (messageContent.startsWith("screenshot ;)")) {
      let a = await getScreenshot()
      let embed = new MessageAttachment(`./screenshots/${a}.png`);
      msg.reply(embed)
    }
    else if (messageContent.startsWith("setstatus")) {
      client.user.setActivity(msg.content.substr(10), { type: 'PLAYING' });
      msg.delete()
    }
    else if (messageContent.startsWith("setname")) {
      client.user.setUsername(msg.content.substr(8));
      msg.delete()
    }

    
    // Funny Jokes
    else if (messageContent.includes("ping")) {
      msg.reply("pong");
    }
    else if (messageContent.includes("joe")) {
      msg.reply("joe mama");
    }
    else if (messageContent.includes("wendy")) {
      msg.reply("wendy imposter is sus");
    }
    else if (messageContent.includes("sus")) {
      msg.reply("ding ding ding ding ding ding ding, ding ding ding");
    }
    else if (messageContent.includes("ligma")) {
      msg.reply("ligma balls");
    }
    else if (messageContent.includes("deez")) {
      msg.reply("deez nuts");
    }
    else if (messageContent.includes("kid amogus")) {
      msg.reply("sugoma dik");
    }


    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();

    // if (h == 0 && m < 10) {
    //   // Tells ppl to go to sleep between 0:00 and 0:10
    //   msg.reply(`HOLY SHIT GO TO SLEEP ITS ${d.getHours()}:${d.getMinutes()}`);

    //   // Tells aaron, caitlin or kanishk to shut up if they say good morning
    //   if (msg.author.id == 494662510859780098) {
    //     if (msg.content.includes("morning")) {
    //       let fuckuaaron = new MessageEmbed()
    //         .setColor("#BF616A")
    //         .setTitle("FUCK YOU AARON LITERALLY NO ONE ASKED")
    //         .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fmax%2F642%2F1*80oWb_VBySaQIup7nitcDA.png&f=1&nofb=1')
    //         .setFooter("just pretend that says aaron")
    //       msg.reply(fuckuaaron);
    //     }
    //   } else if (msg.author.id == 306896897472200704) {
    //     if (msg.content.includes("morning")) {
    //       let fuckuaaron = new MessageEmbed()
    //         .setColor("#BF616A")
    //         .setTitle("FUCK YOU CAITLIN LITERALLY NO ONE ASKED")
    //         .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fmax%2F642%2F1*80oWb_VBySaQIup7nitcDA.png&f=1&nofb=1')
    //         .setFooter("just pretend that says caitlin")
    //       msg.reply(fuckuaaron);
    //     }
    //   } else if (msg.author.id == 598619229868261379) {
    //     if (msg.content.includes("morning")) {
    //       let fuckuaaron = new MessageEmbed()
    //         .setColor("#BF616A")
    //         .setTitle("FUCK YOU KANISHK LITERALLY NO ONE ASKED")
    //         .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmiro.medium.com%2Fmax%2F642%2F1*80oWb_VBySaQIup7nitcDA.png&f=1&nofb=1')
    //         .setFooter("just pretend that says kanishk")
    //       msg.reply(fuckuaaron);
    //     }
    //   }
    // }

  }

  // 1 in 100 chance of reacting to sunny's message witha poop emoji
  if (msg.author.id == 779470090244325406) {
    if (Math.random() < 1 / 100) {
      msg.react('💩');
    }
  }

  // let message = new Message(msg.channel.id, Date.now(), msg.content) // Creates a discord message object

  console.log(`author: ${msg.author.username}#${msg.author.discriminator}`)
  console.log(`channel: ${msg.channel.name}`)
  console.log(`time: ${Date.now()}`)
  console.log(`content: ${msg.content} \n`)

  try { dbManager.addMessageToDatabase(msg.author.id, msg.channel.id, msg.content) } // Adds the message to the databse
  catch (error) { console.error(error) }
}
)

client.login(token) // Starts the Discord Bot
