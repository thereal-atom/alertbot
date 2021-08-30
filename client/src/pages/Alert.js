import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import './Styles/Alert.css';
import { format } from 'date-fns'; 
import Loading from '../components/Loading/Loading';

const Alert = ({currentUser, subscriptionUser}) => {
    const [presets, setPresets] = useState();
    const [embedColor, setEmbedColor] = useState("ffffff");
    const [loading, setLoading] = useState();
    const [presetName, setPresetName] = useState();
    const [error, setError] = useState();
    const [hovered, setCurrentHover] = useState("");
    const [paramatersArray, setParamatersArray] = useState();
    const [active, setActive] = useState(false);
    const [alert, setAlert] = useState(' hide');
    const [errorText, setErrorText] = useState();
    const [helpActive, setHelpActive] = useState(false);
    const [modal, setModal] = useState(false);
    const [bot, setBot] = useState();

    const newFieldRef = useRef();
    //const newFieldTypeRef = useRef();

    const presetNameRef = useRef();

    const footerRef = useRef();
    const titleRef = useRef();
    const authorRef = useRef();
    const descriptionRef = useRef();

    const getPresets = async () => {
        const preset = window.location.search;
        setPresetName(preset.replace('?name=',''))
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/presets/get?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`);
        if(!data.error){
            setPresets(data);
            setEmbedColor(data.color);
        }else{
            setError(data.message)
            setPresets({error: '404'})
        }
        const botData = await axios.get(`${process.env.REACT_APP_API_URL}/discord/user?email=${currentUser.email}`);
        setBot(botData.data);
    }
    const handleClose = e => {
        if(e.target.className === "sidebar-modal active"){
            setModal(false)
        }
    }
    const handleNewFieldSubmit = async e => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/presets/paramaters/new?email=${currentUser.email}&presetName=${presetName}`, {
                name: newFieldRef.current.value,
                type: "title",
            });
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleFieldDelete = async (name) => {
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/presets/paramaters/delete?email=${currentUser.email}&presetName=${presetName}&paramName=${name}`)
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
    }
    const handleFieldUpdate = async (e, paramName) => {
        if(subscriptionUser.level !== "premium") return setModal(true)
        setParamatersArray({
            oldName: paramName,
            name: e.target.value,
        });
    }
    const handleFieldUpdateSubmit = async () => {
        if(subscriptionUser.level !== "premium") return setModal(true)
        try{
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/paramaters/update?email=${currentUser.email}&presetName=${presetName}`, {
                oldParam: paramatersArray.oldName,
                newParam: paramatersArray.name,
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        }catch(error){
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleUpdateFooter = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update/footer?email=${currentUser.email}&presetName=${presetName}`, {
                footer: footerRef.current.value,
            });
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleColorChange = (event) => {
        if(subscriptionUser.level !== "premium") return setModal(true)
        setEmbedColor(event.target.value);
    }
    const handleColorSubmit = async () => {
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update/color?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`, {
                color: embedColor
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleUpdateDescription = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update/description?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`, {
                desc: descriptionRef.current.value
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleUpdateTitle = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update/title?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`, {
                title: titleRef.current.value
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleUpdateAuthor = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update/author?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`, {
                author: authorRef.current.value
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
        setTimeout(() => {
            setAlert(' hide');
        }, 5000);
    }
    const handleHover = (elm) => {
        setCurrentHover(elm.toString());
    }
    const handleUnHover = () => {
        setCurrentHover();
    }
    const handlePresetUpdate = async (e) => {
        e.preventDefault();
        if(subscriptionUser.level !== "premium") return setModal(true)
        console.log(window.location);
        try {
            setLoading(true);
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/presets/update?email=${currentUser.email}&presetName=${window.location.search.replace('?name=','')}`, {
                newName: presetNameRef.current.value.toLowerCase()
            })
            setErrorText({type: data.type, msg: data.message})
            setAlert(' show showAlert');
            if(data.error === 200){
                window.location.href = `${window.location.origin}${window.location.pathname}?name=${presetNameRef.current.value.toLowerCase()}`
            }
        } catch (error) {
            console.log(error);
            setErrorText({type: "warning", msg: 'There was an error'})
            setAlert(' show showAlert');
        }
        setLoading(false);
    } 
    useEffect(() => {
        getPresets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])
    return (
        <>
            {
                errorText && <div class={`alert${errorText ? (errorText.type === 'warning' ? '' : errorText.type === 'success' ? ' success' : ' danger') : ''}${alert}`}>
                    <span class={`fas fa-${errorText.type === 'warning' ? 'info' : errorText.type === 'success' ? 'check' : 'exclamation'}-circle`}></span>
                    <span class="msg">{errorText.type === "warning" ? "Warning: " : errorText.type === "success" ? "Success: " : "Error: "}{errorText.msg}</span>
                    <div class="close-btn" onClick={(event) => {setAlert(' hide')}}>
                        <span class="fas fa-times"></span>
                    </div>
                </div>
            }
            <div className={`sidebar-modal${modal?' active':''}`} onClick={handleClose}>
                <div className="sidebar-modal-box">
                    {/* <i class='bx bxs-diamond'></i> */}
                    <i class='bx bxs-crown'></i>
                    <h1>Join Premium</h1>
                    <p>Upgrade to AlertBot premium (from $8/month) to unlock this feature</p>
                    <a href="/premium">Upgrade</a>
                </div>
            </div>
            <div className={`modal-container${helpActive?' active':''}`}>
                <div className="modal-box">
                    <div className="title-container">
                        <h3>Presets help</h3>
                        <i class='bx bx-x-circle' onClick={(e) => setHelpActive(false)}></i>
                    </div>
                    <hr />
                    <p>
                        To edit preset name press the pencil at the top and enter the new name.<br /> 
                        To add a new field type in the name then press save. <br />
                        To edit a field type in the new name and press save. <br />
                        To delete a field press the x button. <br />
                        To edit author, title or footer type in the new values and press save on the right.<br />
                        To edit embed color press the color box, select a color and press save under.\n<br />
                        To edit preset description type in the text area the press save on the right. <br />
                        {/* - To put an image on the embed make sure your field type is image and type your image link, it will appear on the bottom and you can only use one. */} <br />
                        For more extensive help visit the <a href={process.env.REACT_APP_DOCS_URL}>docs</a> or dm me on discord Atomツ#696.
                    </p>
                </div>
            </div>
            {bot ? <div className="alert-container">
                {presets ? 
                    <>
                        <h1 className={`preset-title${active?'':' active'}`} style={{color: 'white'}}>{presets.name} <i className='bx bx-pencil' onClick={(event) => {if(subscriptionUser.level !== "premium") return setModal(true);setActive(!active)}}></i></h1> 
                        <form className={`edit-preset-title-container${active?' active':''}`} onSubmit={(event) => handlePresetUpdate(event)}>
                            <input type="text" className="edit-preset-title" placeholder="Enter new preset name" ref={presetNameRef}/>
                            <button className="add" onClick={(event) => setActive(!active)} type="submit"><i className='bx bx-save'></i></button>
                        </form>
                    </>
                : ''}
                <div className="new-field-container">
                    <form onSubmit={handleNewFieldSubmit}>
                        <div className="input-wrapper">
                            <i class='bx bx-info-circle' onClick={(e) => setHelpActive(true)}></i>
                            <input className="input" type="text" placeholder="Enter the name of your field" ref={newFieldRef}/>
                            {/* <select name="type" ref={newFieldTypeRef}>
                                <option value="" hidden>Field Type</option>
                                <option value="without">Text</option>
                                <option value="image">Image</option>
                            </select> */}
                            <button className="add"><i className='bx bx-pencil' type="submit"></i></button>
                        </div>
                    </form>
                </div>
                <div className="inout-container">
                    <div className="input-container">
                        {
                            presets && !error ? presets.paramaters.map((param, i) => (
                                    <div key={i}>
                                        <div className="input-wrapper" >
                                            <input className="input" type="text" placeholder={param.name} onChange={(event) => handleFieldUpdate(event, param.name)} onMouseEnter={(e) => {handleHover(param.name)}} onMouseLeave={handleUnHover}/>
                                            {/* <button className="arrow"><i className='bx bx-down-arrow' ></i></button> */}
                                            {/* <button className="arrow"><i className='bx bx-up-arrow'></i></button> */}
                                            <button className="add" onClick={handleFieldUpdateSubmit}><i className='bx bx-pencil' ></i></button>
                                            <button onClick={(event) => {event.preventDefault(); handleFieldDelete(param.name, param.type)}} disabled={loading ? loading : false} type="button"><i className='bx bx-x' ></i></button>
                                        </div>
                                    </div>
                            )) : !error ? <Loading/> : error
                        }
                    </div>
                    <div className="output-container">
                        <div className="user-container">
                            <div className="img-container">
                                <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="pfp" />
                            </div>
                            <div className="user-text-container">
                                <div className="username-container">{bot.username} <span className="bot-tag">BOT</span><span className="date">{format(new Date(), "P")}</span></div>
                                <div className="tag-container">@Example Alerts</div>
                            </div>
                        </div>
                        {presets ? <div className="discord-container" style={{borderLeftColor: embedColor?embedColor:'#ffffff', minHeight: embedColor?0:200 }} >
                            {presets.author ? <div className="embed-author" style={{color: hovered === "author"?'#5f6373':'#fff'}}> <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="avatar"/> <p className="embed-author-text">{presets.author}</p></div> : ''}
                            {presets.title ? <p className="embed-title" style={{color: hovered === "title"?'#5f6373':'#fff'}}>{presets.title}</p> : ''}
                            {
                                presets && !error ? presets.paramaters.map((param, i) => (
                                    <span className="paramater" key={i} style={{color: hovered === param.name?'#5f6373':'#fff'}}>{param.name}:</span>
                                )) : !error ? <Loading/> : error
                            }
                            {presets.description ? <p className="embed-description">{presets.description.replace("\\n", "\n")}</p> : ''}
                            {presets && !error && presets.footer ? <span className="footer" style={{color: hovered === 'footer'?'#5f6373':'#fff'}}>
                                <img src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`} alt="footer" />
                                <p>{presets.footer} • {format(new Date(), "'Today at' p")}</p>
                            </span> : ''}
                            
                        </div> : ''}
                    </div>
                </div>
                <div className="embed-container">
                    {/* <div className="edit-color"></div> */}
                    <div>
                        <input type="color" className="color-input" value={embedColor?embedColor:'#ffffff'} onChange={handleColorChange}/>
                        <button className="color-save" onClick={handleColorSubmit}><i className='bx bx-save' ></i></button>
                    </div>
                    <div className="input-container">
                        <form className="input-wrapper" onSubmit={(event) => handleUpdateAuthor(event)}>
                            <input className="input" type="text" placeholder="Enter your author" onMouseEnter={(event) => handleHover('author')} onMouseOut={handleUnHover} ref={authorRef}/>
                            <button className="add"><i className='bx bx-save' ></i></button>
                        </form>
                        <form className="input-wrapper" onSubmit={(event) => handleUpdateTitle(event)}>
                            <input className="input" type="text" placeholder="Enter your title" onMouseEnter={(e) => {handleHover('title')}} onMouseLeave={handleUnHover} ref={titleRef}/>
                            <button className="add" type="submit"><i className='bx bx-save' ></i></button>
                        </form>
                        <form onSubmit={(event) => {handleUpdateFooter(event)}} className="input-wrapper">
                            <input className="input" type="text" placeholder="Enter your footer" onMouseEnter={(e) => {handleHover('footer')}} onMouseLeave={handleUnHover} ref={footerRef}/>
                            <button className="add" type="submit"><i className='bx bx-save' ></i></button>
                        </form>
                    </div>
                    <form className="description-wrapper" onSubmit={(event) => handleUpdateDescription(event)}>
                        <textarea type="text" className="description-input" placeholder="Enter your description" ref={descriptionRef}/>
                        <button className="add" type="submit"><i className='bx bx-save' ></i></button>
                    </form>
                </div>
            </div> : ''}
        </>
    );
};

export default Alert;
