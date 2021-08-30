const client = require('../alerts/index');
const axios = require("axios");

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

const subscriptionSchema = require("../models/subscritpionSchema");
const presetSchema = require("../models/presetSchema");

const dotenv = require('dotenv')
dotenv.config();

const CLIENT_ID = "871038939560050739" //process.env.CLIENT_ID;
const CLIENT_SECRET = "-b1ahJ1PdYOm_8ZpdhbO9ytMRZ_ofsdx" //process.env.CLIENT_SECRET;
const homeUrl = "https://alertbot.netlify.app" //process.env.HOME_URL
const redirect = encodeURIComponent('https://api-alertbot.herokuapp.com/discord/callback');

const loginDiscord = async (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=email%20identify%20guilds&response_type=code&redirect_uri=${redirect}`);
} 
const logoutDiscord = async (req, res) => {
    try{
        const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
        await oauth.revokeToken(req.query.token, credentials);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
const callbackDiscord = async (req, res) => {
    const authCode = await oauth.tokenRequest({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
    
        code: req.query.code,
        scope: "identify guilds",
        grantType: "authorization_code",
        
        redirectUri: 'https://api-alertbot.herokuapp.com/discord/callback',
    })
    const footer = "AlertBot";
    const description = `[Website](${process.env.CLIENT_URL})`
    const user = await oauth.getUser(authCode.access_token);
    const entry = {
        name: "entry",
        paramaters: [
            {
                name: "Coin",
                type: "with_title",
            },
            {
                name: "Entry",
                type: "with_title",
            },
            {
                name: "Leverage",
                type: "with_title",
            },
            {
                name: "Stop Loss",
                type: "with_title",
            },
            {
                name: "Take Profit",
                type: "with_title",
            },
            {
                name: "Comments",
                type: "with_title",
            },
        ],
        email: user.email,
        color: "#3bff70",
        description,
        footer,
    }
    console.log(user.email);
    const existing = await presetSchema.findOne({email: user.email});
    if(!existing) await new presetSchema(entry).save()
    res.redirect(`${homeUrl}/auth/${authCode.access_token}`)
}
const getChannels = async (req, res) => {
    const channelsArray = [];
    const rolesArray = [];
    const { email } = req.query;
    const result = await subscriptionSchema.findOne({customerEmail: email});
    const botToken = result !== null && result.token ? result.token : process.env.BOT_TOKEN
    try{
        const rawGuilds = await axios.get(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${botToken}`
            }
        });
        client.channels.cache.map(channel => {
            if(rawGuilds.data.find(rawGuild => rawGuild.id === channel.guild.id) && true) {
                channelsArray.push(channel)
            } 
        })
        client.guilds.cache.forEach(guild => {
            guild.roles.cache.forEach(role => {
                if(rawGuilds.data.find(rawGuild => rawGuild.id === guild.id)) rolesArray.push(role)
            })
        })
        res.status(200).send({channels: channelsArray, roles: rolesArray, guilds: rawGuilds.data});
    }catch(error){
        //if(error.response !== 429) console.log(error);
        res.status(500);
    }
}
const getUser = async (req, res) => {
    const result = await subscriptionSchema.findOne({customerEmail: req.query.email});
    if(result !== null && result.token && result.level === "premium"){
        const { data } = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `Bot ${result.token}`
            }
        })
        res.status(200).send(data);
    }else{
        const { data } = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `Bot ${process.env.BOT_TOKEN}`
            }
        })
        res.status(200).send(data);
    }
}
const updateBotAvatar = async (req, res) => {
    const { email } = req.query;
    const result = await subscriptionSchema.findOne({customerEmail: email});
    if(req.body.avatar){
        if(result.token){
            try{
                const { data } = await axios.patch(`https://discord.com/api/users/@me`, {
                        //username: req.body.username,
                        avatar: `${req.body.avatar}`
                    },{
                    headers: {
                        Authorization: `Bot ${result.token}`,
                        "Content-Type": `application/json`
                    }
                })
                res.status(200).send({error: 200, message: "Avatar updated succesfully", type: "success"});
            }catch{
                res.status(200).send({error: 500, message: "You are updating your avatar too quickly, try again later.", type: "danger"})
            }
        }else{
            res.status(200).send({error: 400, message: "You must set a token first", type: "danger"});
        }
    }else{
        res.status(200).send({error: 400, message: "You did not provide an image", type: "warning"})
    }
}
const updateBotUsername = async (req, res) => {
    const { email } = req.query;
    const result = await subscriptionSchema.findOne({customerEmail: email});
    console.log(req.body);
    if(req.body.username){
        try{
            const { data } = await axios.patch(`https://discord.com/api/users/@me`, {
                    username: req.body.username,
                },{
                headers: {
                    Authorization: `Bot ${result.token}`,
                    "Content-Type": `application/json`
                }
            })
            res.status(200).send({error: 200, message: "Username updated succesfully", type: "success"});
        }catch{
            res.status(200).send({error: 500, message: "You are updating your username too quickly, try again later.", type: "danger"})
        }
    }else{
        res.status(200).send({error: 400, message: "You did not provide a username", type: "warning"})
    }
}

module.exports = {
    loginDiscord,
    callbackDiscord,
    getChannels,
    getUser,
    updateBotAvatar,
    updateBotUsername,
    logoutDiscord,
}





















// const getRoles = async (req, res) => {
//     const rolesArray = [];
//     client.guilds.cache.forEach(guild => {
//         guild.roles.forEach(role => {
//             rolesArray.push(role)
//         })
//     })
//     res.send(rolesArray)
//     return;
//     const guilds = await axios.get(`https://discord.com/api/users/@me/guilds`, {
//         headers: {
//             Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ "
//         }
//     });
//     let rolesArray = [];
//     let i = 0;
//     const fetchInterval = setInterval(async () => {
//         try{
//             const { data } = await axios.get(`https://discord.com/api/v9/guilds/${guilds.data[i].id}`, {
//                 headers: {
//                     Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ"
//                 }
//             });
//             rolesArray.push(data);
//             if(i === guilds.data.length - 1) clearInterval(fetchInterval);
//             if(rolesArray.length === guilds.data.length){
//                 res.status(200).send(rolesArray);
//             }
//             console.log(`Roles ${i}`);
//             if(i === guilds.data.length - 1) {
//                 clearInterval(fetchInterval)
//             }else{
//                 i++;
//             };
//         }catch (error){
            
//         }
//     }, 1000/guilds.data.length);
// }













// const getChannels = async (req, res) => {
//     console.log(client);
//     return;
//     const guilds = await axios.get(`https://discord.com/api/users/@me/guilds`, {
//         headers: {
//             Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ "
//         }
//     });
//     let channelsArray = [];
//     let i = 0;
//     const fetchInterval = setInterval(async () => {
//         const { data } = await axios.get(`https://discord.com/api/v9/guilds/${guilds.data[i].id}/channels`, {
//             headers: {
//                 Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ"
//             }
//         });
//         channelsArray.push(data)
//         if(channelsArray.length === guilds.data.length){
//             res.status(200).send(channelsArray);
//         }
//         console.log(`Channels ${i}`);
//         if(i === guilds.data.length - 1) {
//             clearInterval(fetchInterval)
//         }else{
//             i++;
//         };
//     }, 1000/guilds.data.length)
// }