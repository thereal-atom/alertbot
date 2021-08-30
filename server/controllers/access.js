const accessSchema = require("../models/accessSchema");
const addUser = async (req, res) => {
    const user = {
        id: req.query.id
    }
    await new accessSchema(user).save();
    res.sendStatus(201);
}
const getUsers = async (req, res) => {
    const result = await accessSchema.find({});
    res.status(200).send(result);
}
module.exports = {
    addUser,
    getUsers,
}