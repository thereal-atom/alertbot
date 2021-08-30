import React from 'react';
import './Styles/Changelog.css';

const Changelog = () => {
    const changelogArray = [
        {
            type: "Alpha",
            version: "1.0.1",
            date: "30/08/21",
            changes: [
                "Added limited access",
                "Added changelog",
                "Changed docs url - docs.alert-bot.xyz",
                "Created alertbot youtube channel - https://www.youtube.com/channel/UCaNkDckM2-rmkJaAKJRXT3w",
                "Fixed warnings",
                "Fixed sidebar bugs",
            ]
        },
    ]
    return (
        <div className="changelog-container">
            <h1>Changelog</h1>
            {
                changelogArray.reverse().map((log, i) => (
                    <div key={i}>
                        <h2>{log.type} v{log.version}</h2>
                        <p>{log.date}</p>
                        <ul>
                            {log.changes.map((change, i) => (
                                <li>{change}</li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </div>
    )
}

export default Changelog
