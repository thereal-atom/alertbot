import React, { useState, useEffect, useRef } from 'react';
import './Styles/Send.css';
import axios from 'axios';
import { format } from 'date-fns'; 
import { Permissions } from "discord.js";
import Loading from '../components/Loading/Loading';

const Send = ({currentUser, currentUserGuilds, allPresets, subscriptionUser}) => {
    const [selectedGuild, setSelectedGuild] = useState();
    const [guilds, setGuilds] = useState();
    const [channels, setChannels] = useState();
    const [roles, setRoles] = useState();
    const [presets, setPresets] = useState();
    const [embedColor, setEmbedColor] = useState();
    const [loading, setLoading] = useState();
    const [error] = useState();
    const [hovered] = useState("");
    const [sendChannels, setSendChannels] = useState();
    const [active, setActive] = useState(false);
    const [paramaters, setParamaters] = useState();
    const [alert, setAlert] = useState(' hide');
    const [errorText, setErrorText] = useState();
    const [bot, setBot] = useState();
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState();
    const [tag, setTag] = useState(true);

    const guildRef = useRef();
    const channelRef = useRef();
    const roleRef = useRef();

    const getGuildInfo = async () => {
        const data4 = await axios.get(`${process.env.REACT_APP_API_URL}/alert/channels/get?email=${currentUser.email}`);
        setSendChannels(data4.data);
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/discord/channels?email=${currentUser.email}`);
        setRoles(data.roles.sort((a, b) => b.rawPosition - a.rawPosition));
        setChannels(data.channels.filter(channel => channel.type === "text").sort((a, b) => a.rawPosition - b.rawPosition));
        setGuilds(data.guilds)
        // console.log(data.guilds.filter(guild => guild.id === currentUserGuilds.find(userGuild => userGuild.id === guild.id && new Permissions(parseInt(userGuild.permissions_new)).serialize().MANAGE_GUILD)));
    }
    const getPresets = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/presets/get?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`);
        setPresets(data);
        setEmbedColor(data.color);
        if(!paramaters){
            let paramsArray = []
            data.paramaters.forEach(param => {
                paramsArray.push({param: param.name, value: ``});
            })
            setParamaters(paramsArray);
        }
        const botData = await axios.get(`${process.env.REACT_APP_API_URL}/discord/user?email=${currentUser.email}`);
        setBot(botData.data);
    }
    const handleNewChannel = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== 'premium' && sendChannels.length > 2){
            setModal(true)
        }else{
            if(guildRef.current.value && channelRef.current.value && roleRef.current.value){
                try {
                    setLoading(true);
                    const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/alert/channel/new?email=${currentUser.email}`, {
                        guild: guildRef.current.value,
                        channel: channelRef.current.value,
                        role: roleRef.current.value,
                        userId: currentUser.id
                    });
                    setErrorText({type: data.type, msg: `${data.message}`})
                    setAlert(' show showAlert');
                } catch (error) {
                    setErrorText({type: "danger", msg: `There was an unexpected error`})
                    setAlert(' show showAlert');
                    console.log(error);
                }
            }else{
                setErrorText({type: "warning", msg: 'You did not provide all the fields'})
                setAlert(' show showAlert');
            }
        }
        setLoading(false);  
        setTimeout(() => {
            setAlert(' hide');
        }, 4000);
    }
    const handleDeleteChannel = async (id) => {
        try {
            setLoading(true)
            const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/alert/channel/delete?email=${currentUser.email}&id=${id}`);
            setErrorText({type: data.type, msg: `${data.message}`})
            setAlert(' show showAlert');
            setTimeout(() => {
                setAlert(' hide');
            }, 5000);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);  
    }
    const handleParam = async (e, paramName) => {
        let newArray = paramaters;
        newArray.find(param => param.param === paramName).value = `${e.target.value}`;
        setParamaters(newArray);
        setLoading(!loading);
    }
    const handleSelectedGuild = (e) => {
        // setSelectedGuild(guilds.find(guild => guild.id === e.target.value));
        setSelectedGuild(e.target.value);
    }
    const handleActive = () => {
        setActive(!active);
    }
    const handleSend = async () => {
        try{
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/alert/send?email=${currentUser.email}&presetName=${window.location.search.replace('?name=', '')}`, {
                tag,
                values: paramaters,
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        }catch(error){
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleClear = () => {
        let paramsArray = paramaters;
        paramsArray.forEach(param => {
            param.value = ``
        })
        setParamaters(paramsArray);
        setLoading(!loading);
    }
    const handleClose = (e) => {
        if(e.target.className === "sidebar-modal active"){
            setModal(false);
        }
    }
    const handleImage = (e) => {
        setImage(e.target.value)
    }
    const handleTag = () => {
        setTag(!tag);
    }
    useEffect(() => {
        getPresets();
        getGuildInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])
    return (
        bot ? <>  
            <div className={`sidebar-modal${modal?' active':''}`} onClick={handleClose}>
                <div className="sidebar-modal-box">
                    {/* <i class='bx bxs-diamond'></i> */}
                    <i class='bx bxs-crown'></i>
                    <h1>Join Premium</h1>
                    <p>Upgrade to AlertBot Premium (from $8/month) to unlock this feature</p>
                    <a href="/premium">Upgrade</a>
                </div>
            </div>
            {errorText && <div class={`alert${errorText ? (errorText.type === 'warning' ? '' : errorText.type === 'success' ? ' success' : ' danger') : ''}${alert}`}>
                <span class={`fas fa-${errorText.type === 'warning' ? 'info' : errorText.type === 'success' ? 'check' : 'exclamation'}-circle`}></span>
                <span class="msg">{errorText.type === "warning" ? "Warning: " : errorText.type === "success" ? "Success: " : "Error: "}{errorText.msg}</span>
                <div class="close-btn" onClick={(event) => {setAlert(' hide')}}>
                    <span class="fas fa-times"></span>
                </div>
            </div>}
            <div className={`modal-container${active?' active':''}`}>
                <div className="modal-box">
                    <div className="title-container">
                        <h3>Send alerts help</h3>
                        <i class='bx bx-x-circle' onClick={handleActive}></i>
                    </div>
                    <hr />
                    <p>
                        - To select a preset to send with you must select one at the title at the very top of the page.<br /> 
                        - To make a new preset you must go to the presets page. <br />
                        - To send alerts you must type in each field in the input boxes. <br />
                        - If you dont fill in a field the title for it wont show up. <br />
                        - If you want to make any text use double asteriks on both sides of the text like <strong>**text**</strong>. <br />
                        - If you want to make any text a link do []() like <a href={process.env.REACT_APP_HOME_URL}>[AlertBot](https://alertbot.net)</a> <br />
                        - To make a new line in your text use \n<br />
                        - To add more servers you must select a server, channel and @role in the box at the top. <br />
                        - If no channels or roles show up it means you havent added <a href={process.env.REACT_APP_INVITE}>AlertBot</a> to that server. <br />
                        - If you dont have a paid subscription and not all guilds show up it means you arent in that server or you dont have manage server perms
                        - You have to make sure the bot has perms to add a new field. <br />
                        - To delete a field you must press the red x button and to change one you must select the channel or role you want to change and press the save button. <br />
                        - If you need any more help visit the <a href={process.env.REACT_APP_DOCS_URL}>docs</a> or dm me on discord Atomツ#6969.
                    </p>
                </div>
            </div>
            <div className="send-container">
                <select name="preset" className="preset-select" onChange={(event) => window.location.search = `?name=${event.target.value.toLowerCase()}`}>
                    {allPresets ? <option value={allPresets[0].name}>{window.location.search.replace('?name=', '')}</option> : ''}
                    {allPresets ? allPresets.map(preset => (
                        preset.name !== window.location.search.replace('?name=', '') ? <option value={preset.name.toLowerCase()}>{preset.name}</option> : ''

                    )) : ''} 
                </select>
                <form className="add-server-container" onSubmit={handleNewChannel}>
                    <i class='bx bx-info-circle' id="info" onClick={handleActive}></i>
                    <select name="guild" onChange={handleSelectedGuild} ref={guildRef}>
                        <option value="" disabled selected hidden>Select a server to add</option>
                        {
                            currentUserGuilds && guilds ? guilds.map((guild, i) => (
                                bot.id === "871038939560050739" ? new Permissions(parseInt(guild.permissions_new)).serialize().MANAGE_GUILD ? <option key={i} value={guild.id}>{guild.name} ({guild.id})</option> : '' : <option key={i} value={guild.id}>{guild.name} ({guild.id})</option>
                            )) : ''
                        }
                    </select>
                    <select name="channel" ref={channelRef}>
                        <option value="" disabled selected hidden>Select a channel to add</option>
                        {
                            selectedGuild && channels ? channels.map(channel => (
                                channel.guild === selectedGuild ? <option value={channel.id}>{channel.name} ({channel.id})</option> : ''
                            )) : ''
                        }
                    </select>
                    <select name="channel" ref={roleRef}>
                        <option value="" disabled selected hidden>Select a role to add</option>
                        {
                            roles && selectedGuild ? roles.map(role => (
                                role.guild === selectedGuild ? <option value={role.id}>{role.name} ({role.id})</option> : ''
                            )) : ''
                        }
                    </select>
                    <button><i className='bx bx-save'></i></button>
                </form>
                <div className="alerts-wrapper">
                    <div className="send-alert-container">
                        <div className="alert-input-container">
                            {
                                presets && paramaters ?
                                <> 
                                    {presets.paramaters.map(param => (
                                        <input type="text" placeholder={param.name} onChange={(event) => handleParam(event, param.name)} value={paramaters.find(paramater => paramater.param === param.name).value}/>
                                    ))} 
                                    <input type="text" placeholder="Image link" onChange={handleImage} value={image}/>
                                
                                </>: ''
                            }
                        </div>
                        <div className="output-container send">
                            <div className="user-container">
                                <div className="img-container">
                                    {!bot ? <img src={`https://cdn.discordapp.com/avatars/871038939560050739/6a241f6bcdef12b59de45b50ccdd5a83.webp`} alt="pfp" /> :<img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="pfp" /> }
                                </div>
                                <div className="user-text-container">
                                    <div className="username-container">{bot.username} <span className="bot-tag">BOT</span><span className="date">{format(new Date(), "'Today at' p")}</span></div>
                                    {tag ? <div className="tag-container">@Example Alerts</div> : ''}
                                </div>
                            </div>
                            {presets ? <div className="discord-container" style={{borderLeftColor: embedColor?embedColor:'#009dff' }} >
                                {presets.author ? <div className="embed-author" style={{color: hovered === "author"?'#5f6373':'#fff'}}> <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="author"/> <p className="embed-author-text">{presets.author}</p></div> : ''}
                                {presets.title ? <p className="embed-title" style={{color: hovered === "title"?'#5f6373':'#fff'}}>{presets.title}</p> : ''}
                                {
                                    presets && !error && paramaters ? presets.paramaters.map((param, i) => (
                                        <strong className="paramater" key={i} style={{color: hovered === param.name?'#5f6373':'#fff'}}>{param.name}: <span id="param">{paramaters.find(paramater => paramater.param.toLowerCase() === param.name.toLowerCase()).value.replace("\\n", "\n")}</span></strong>
                                        // <span className="paramater" key={i} style={{color: hovered === param.name?'#5f6373':'#fff'}}>{param.name}: {paramaters[0].value}</span>
                                    )) : !error ? 'Loading...' : error
                                }
                                {presets.description ? <p className="embed-description">{presets.description.replace("\\n", "\n")}</p> : ''}
                                {/* {presets.description ? <p className="embed-description">{presets.description.replace(presets.description.match(/\(([^)]+)\)/)[0], "")}</p> : ''} */}
                                {image ? <img src={image} className="embed-image" alt="embed" /> : '' }
                                {presets && !error && presets.footer ? <span className="footer" style={{color: hovered === 'footer'?'#5f6373':'#fff'}}>
                                    {!bot ? <img src={`https://cdn.discordapp.com/avatars/871038939560050739/6a241f6bcdef12b59de45b50ccdd5a83.webp`} alt="pfp" /> :<img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="pfp" /> }
                                    <p>{presets.footer} • {format(new Date(), "'Today at' p")}</p>
                                </span> : ''}
                            </div> : ''}
                            <div className="buttons-container">
                                <button onClick={handleSend} className="send-button">Send</button>
                                <button className="clear-button" onClick={handleClear}>Clear</button>
                                <button onClick={handleTag} className="tag-button" style={{opacity: tag?1:0.8}}>{tag?"Disable":"Enable"} ping</button>
                            </div>
                        </div>
                    </div>
                    <div className="server-select-container">
                        {
                            sendChannels[0] && channels && roles && guilds ? sendChannels.map(channel => (
                                guilds.find(guild => guild.id === channel.guild) !== undefined ? <div className="server">
                                    <img src={`https://cdn.discordapp.com/icons/${guilds.find(guild => guild.id === channel.guild).id}/${guilds.find(guild => guild.id === channel.guild).icon}.png`} alt="icon" />
                                    {
                                        guilds ? <div className="change-guilds">
                                            <h5 >{guilds.find(guild => guild.id === channel.guild).name} ({guilds.find(guild => guild.id === channel.guild).id})</h5> 
                                        </div> : ''
                                    }
                                    <select name="channel">
                                        <option value={channel.channel} selected>{channels.find(chan => channel.channel === chan.id).name} ({channel.channel})</option>
                                        {
                                            channels ? channels.map(allChannels => (
                                                channel.guild === allChannels.guild && channel.channel !== allChannels.id ? <option value={allChannels.id}>{allChannels.name} ({allChannels.id})</option> : ''
                                            ))
                                            :''
                                        }
                                    </select>
                                    <select name="role" id="role">
                                        {roles ? <option value={channel.role} selected>{roles.find(role => role.id === channel.role).name} ({channel.role})</option> : '' }
                                        {
                                            roles ? roles.map(role => (
                                                role.guild === channel.guild && role.id !== channel.role ? <option value={role.id}>{role.name} ({role.id})</option> : ''
                                            )): ''
                                        }
                                    </select>
                                    <button onClick={(event) => handleDeleteChannel(channel.id)}><i className='bx bx-x' ></i></button>
                                </div> : <div className="server-not-found-container"> 
                                    <img className="icon-not-found" src="https://cdn.discordapp.com/attachments/810932922306789406/848931071193513994/dclogo.jpg" alt="Guild icon" />
                                    <div className="server-not-found">
                                        Server could not be found. Make sure you have your <a href={`https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=8`}> Bot </a> AND <a href="https://discord.com/oauth2/authorize?client_id=871038939560050739&scope=bot&permissions=8"> AlertBot </a> in this server({channel.guild}).
                                    </div>
                                    <button onClick={(event) => handleDeleteChannel(channel.id)}><i className='bx bx-x' ></i></button>
                                </div>
                                
                            )) : ''
                        }
                    </div>
                </div>
            </div>
        </> : <Loading />
    );
};

export default Send;
