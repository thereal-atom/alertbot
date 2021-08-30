const express = require('express');
const analyticsSchema = require('../models/analyticsSchema');
const presetSchema = require("../models/presetSchema");


//Get stuff
const getPresets = async (req, res) => {
    try{
        const result = await presetSchema.find({email: req.query.email});
        if(result.find(preset => preset.name.toLowerCase() === req.query.presetName)){
            res.status(200).send(result.find(preset => preset.name.toLowerCase() === req.query.presetName));
        }else{
            res.status(200).send({
                error: "not found",
                message: "Preset could not be found"
            })
        }
    }catch{
        res.status(200).send({
            error: "server error",
            message: "Internal server error"
        });
    }
    
}
const allPresets = async (req, res) => {
    const { email } = req.query;
    const result = await presetSchema.find({email});
    res.status(200).send(result);
}


/*
    New stuff
*/
const newParamater = async (req, res) => {
    const { presetName, email } = req.query;
    const { name, type } = req.body;
    const result = await presetSchema.find({email});
    let paramatersArray = result.find(preset => preset.name.toLowerCase() === presetName).paramaters;

    try {
        paramatersArray.push({
            name,
            withTitle: true,
            titleBold: true,
        });
        await presetSchema.updateOne({email, name: presetName}, {
            paramaters: paramatersArray
        })
        res.status(200).send({error: 200, message: "Field added succesfully", type: "success"})
        //res.status(200).send({error: 200, message: "Paramater added succesfully", type: "success"})
    } catch (error) {
        console.log(error);
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
const newPreset = async (req, res) => {
    if(req.body.presetName){
        try {
            if(req.body.presetName.includes(" ")){
                return res.status(200).send({error: 400, message: "You cannot include spaces in your name", type: "danger"})
            }else{
                const newPresetObject = {
                    name: req.body.presetName.toLowerCase(),
                    email: req.query.email,
                    color: "#2bffa3",
                }
                await new presetSchema(newPresetObject).save();
                const result = await analyticsSchema.findOne({});
                await analyticsSchema.updateOne({}, {
                    presets: result.presets + 1,
                })
                res.status(200).send({error: 200, message: "Preset created succesfully", type: "success"})
            }
        } catch (error) {
            console.log(error);
            res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
        }
    }else{
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
const updatePreset = async (req, res) => {
    if(req.body.newName){
        try {
            if(req.body.newName.includes(" ")){
                return res.status(200).send({error: 400, message: "You cannot include spaces in your name", type: "danger"})
            }else{
                await presetSchema.updateOne({email: req.query.email, name: req.query.presetName}, {
                    name: req.body.newName.toLowerCase()
                });
                res.status(200).send({error: 200, message: "Preset name updated succesfully", type: "success"})
            }
        } catch (error) {
            res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
        }
    }else{
        res.status(200).send({error: 400, message: "You did not provied a new name", type: "danger"})
    }
}

//Update paramater
const updateParamater = async (req, res) => {
    const { email, presetName } = req.query;
    const { oldParam, newParam } = req.body; 
    const result = await presetSchema.findOne({email, name: presetName});
    try {
        const index = result.paramaters.findIndex(param => param.name === oldParam);
        let newArray = result.paramaters;
        newArray[index].name = newParam;
        await presetSchema.updateOne({email, name: presetName}, {
            paramaters: newArray,
        })
        res.status(200).send({error: 200, message: "Paramater update succesfully", type: "success"})
    } catch (error) {
        console.log(error);
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
//Delete Paramater
const deleteParamater = async (req, res) => {
    const { presetName, email, paramName } = req.query;
    const result = await presetSchema.findOne({email, name: presetName});
    try {
        const paramatersArray = result.paramaters.filter(param => param.name !== paramName);
        await presetSchema.updateOne({email, name: presetName}, {
            paramaters: paramatersArray,
        })
        res.status(200).send({error: 200, message: "Paramater deleted succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}

/*
    Update attributes
*/

const updateColor = async (req, res) => {
    try {
        await presetSchema.updateOne({email: req.query.email, name: req.query.presetName}, {
            color: req.body.color
        })
        res.status(200).send({error: 200, message: "Preset color updated succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
const updateAuthor = async (req, res) => {
    try {
        await presetSchema.updateOne({email: req.query.email, name: req.query.presetName}, {
            author: req.body.author
        })
        res.status(200).send({error: 200, message: "Author updated succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }

}
const updateDesc = async (req, res) => {
    try {
        await presetSchema.updateOne({email: req.query.email, name: req.query.presetName}, {
            description: req.body.desc
        })
        res.status(200).send({error: 200, message: "Description updated succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
const updateTitle = async (req, res) => {
    try {
        await presetSchema.updateOne({email: req.query.email, name: req.query.presetName}, {
            title: req.body.title
        })
        res.status(200).send({error: 200, message: "Author updated succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}
const updateFooter = async (req, res) => {
    const { presetName, email } = req.query;
    try {
        if(req.body.footer){
            await presetSchema.updateOne({email, name: presetName}, {
                footer: req.body.footer,
            })
        }else{
            await presetSchema.updateOne({email, name: presetName}, {
                footer: null,
            })
        }
        res.status(200).send({error: 200, message: "Footer updated succesfully", type: "success"})
    } catch (error) {
        res.status(200).send({error: 500, message: "There was an internal server error", type: "danger"})
    }
}

module.exports = {
    getPresets,
    allPresets,
    newPreset,
    updatePreset,
    newParamater,
    deleteParamater,
    updateParamater,
    updateFooter,
    updateColor,
    updateAuthor,
    updateTitle, 
    updateDesc,
}