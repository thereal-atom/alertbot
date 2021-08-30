const client = require('../alerts')
const test = async (req, res) => {
    res.send(client.users.cache)//.find(user => user.username.includes("kj")))
}
module.exports = {
    test
}












// const guilds = await axios.get(`https://discord.com/api/users/@me/guilds`, {
//     headers: {
//         Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ "
//     }
// });
// let rolesArray = [];
// guilds.data.forEach(async guild => {
//     const { data } = await axios.get(`https://discord.com/api/v9/guilds/${guild.id}`, {
//         headers: {
//             Authorization: "Bot ODcxMDM4OTM5NTYwMDUwNzM5.YQVgOg.Li-JYe9QyytxzQjgGmMCtgn1MyQ"
//         }
//     });
//     rolesArray.push(data);
//     if(rolesArray.length === guilds.data.length){
//         res.status(200).send(rolesArray);
//     }
// })