const channelsSchema = require("../models/channelsSchema");
const presetSchema = require("../models/presetSchema");
const subscriptionSchema = require("../models/subscritpionSchema");

const axios = require('axios');
const client = require("../alerts");
const analyticsSchema = require("../models/analyticsSchema");

const sendAlert = async (req, res) => {
    const { email, presetName } = req.query;
    const { values, tag } = req.body
    const presets = await presetSchema.findOne({email, name: presetName});
    const result = await channelsSchema.findOne({email});
    const sub = await subscriptionSchema.findOne({customerEmail: email});

    let description = '';
    values.forEach(value => {
        if(value.value) description += (`
            ${presets.paramaters.find(param => param.name === value.param).titleBold ?'**':''}
            ${(presets.paramaters.find(param => param.name === value.param).withTitle) ? `${value.param}: ` : ''}
            ${presets.paramaters.find(param => param.name === value.param).titleBold ?'**':''}‎‎‎‎‎‎‏‏‎‎
            ${value.value.toString().replace("\\n", "\n")}\n
        `);
    })
    if(presets.description){
        description += (`\n${presets.description.replace("\\n", "\n")}`)
    } 
    if(values){
        try{
            result.channels.forEach(async channel => {
                await axios.post(`https://discord.com/api/v9/channels/${channel.channel}/messages`, {
                        "content": tag ? `<@&${channel.role}>` : "",
                        "embeds": [{
                            "author": {
                                name: presets.author,
                                icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`
                            },
                            "title": presets.title,
                            description,
                            "color": parseInt(presets.color.replace('#', ''), 16),
                            "footer": {
                                text: presets.footer,
                                icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`
                            },
                            "timestamp": new Date()
                        }]
                    },
                    {
                    headers: {
                        Authorization: `Bot ${sub !== null && sub.token?sub.token:process.env.BOT_TOKEN}`
                    },
                })
            })
            const { alerts } = await analyticsSchema.findOne({});
            await analyticsSchema.updateOne({}, {
                alerts: alerts + 1
            }) 
        }catch(error){
            console.log(error);
            return res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
        }
    } else if(!values){
        return res.status(200).send({error: 400, message: "You did not provide any paramaters", type: "warning"})
    }else if(missing){
        return res.status(200).send({error: 400, message: "You did not provide all the paramaters", type: "warning"})
    }else{
        return res.status(200).send({error: 400, message: "There was an unknown error", type: "danger"})
    }
    return res.status(200).send({error: 200, message: "Alert sent succesfully", type: "success"})
}
const getChannels = async (req, res) => {
    const result = await channelsSchema.findOne({email: req.query.email});
    if(result){
        try {
            res.status(200).send(result.channels);
        } catch (error) {
            res.status(200).send({error: 500, message: "There was an internal server error"})
        }
    }else{
        res.status(200).send({error: 400, message: "No channels could be found"});
    }
}
const addChannel = async (req, res) => {
    const { email } = req.query;
    const { guild, channel, role, userId } = req.body;
    const result = await channelsSchema.findOne({email});
    const subscription = await subscriptionSchema.findOne({customerEmail: email});
    if(guild && channel && role && email){
        try{
            const { data } = await axios.post(`https://discord.com/api/v9/channels/${channel}/messages`, {
                content: `Channel added with the role <@&${role}> by <@!${userId}>`
            }, {
                headers: {
                    Authorization: `Bot ${subscription !== null && subscription.token ? subscription.token : process.env.BOT_TOKEN}`
                }
            })
            try {
                if(result !== null){
                    await channelsSchema.updateOne({email}, {
                        $push: {
                            channels: {
                                id: result.channels[0] ? result.channels[result.channels.length-1].id + 1 : 1,
                                guild,
                                channel,
                                role
                            }
                        }
                    })
                }else{
                    const channelObject = {
                        email,
                        channels: [
                            {
                                id: 1,
                                guild,
                                channel,
                                role
                            }
                        ]
                    }
                    await new channelsSchema(channelObject).save();
                }
            } catch (error) {
                return res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"});
            }
        }catch(error){
            console.log("perms")
            return res.status(200).send({error: 403, message: "The bot does not have perms to send messages in that channel", type: "danger"});
        }
    }else{
        console.log("details")
        return res.status(200).send({error: 400, message: "You did not provide all the fields", type: "warning"});
    }
    await analyticsSchema.updateOne({}, {
        servers: client.guilds.cache.size,
        users: client.users.cache.size,
    })
    res.status(200).send({error: 200, message: "Server added succesfully", type: "success"});
}
const deleteChannel = async (req, res) => {
    const { email, id } = req.query;
    const result = await channelsSchema.findOne({email});
    let channelsArray = result.channels.filter(channel => channel.id !== parseInt(id));
    try {
        await channelsSchema.updateOne({email}, {
            channels: channelsArray,
        });
        res.status(200).send({error: 200, message: "Server deleted successfully", type: "success"});
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
module.exports = {
    sendAlert,
    addChannel,
    getChannels,
    deleteChannel,
}