import React, { useContext } from 'react'
import { AppDataManager, setDataState } from '../../../Context/AppDataManager'
import { UserManager } from '../../../Context/userManager'
import Editor from "rich-markdown-editor"


const firebase = require('firebase').default

export default function EditorPane(props) {

    const { appData, setAppData } = useContext(AppDataManager)
    const { userData } = useContext(UserManager)

    console.log(appData.UserIDRoute)


    async function uploadImage(file) {
        try {
            let ref = firebase.storage().ref().child(userData[0] ? userData.displayName : 'userData.displayName/' + file.name)
            let snap = await ref.put(file)
            if (snap)
                return await ref.getDownloadURL()
        }
        catch (e) {
            alert(e.message)
            return
        }
    }

    //markdown content change handler
    function handleEditorChange(getText) {
        const newValue = getText();
        // setMdValue(newValue)
        setAppData(setDataState('MdValue', newValue, appData))
        if (appData.ActiveNode) {
            props.updateNodeData(appData.ActiveNode.id, 'md', newValue)
        }
    }

    return (
        <Editor
            readOnly={appData.UserIDRoute !== 'Demo1' && (userData.displayName !== appData.UserIDRoute)}
            readOnlyWriteCheckboxes={true}
            style={{ width: '100%', height: '100%', textAlign: 'left', background: '#FFF', borderRight: '1px solid #d2d3d4' }}
            value={appData.ActiveNode ? appData.ActiveNode.md : 'test'}
            defaultValue={appData.ActiveNode ? appData.ActiveNode.md : "# Hover over the start node for help with creating your plan #"}
            onChange={handleEditorChange}
            uploadImage={uploadImage}
            embeds={[
                {
                    title: "Youtube",
                    keywords: "youtube",
                    defaultHidden: false,
                    matcher: href => href.match(/youtube.com\//i),
                    href: href => href,
                    component: Youtube
                },
                {
                    title: "Vimeo",
                    keywords: "Vimeo",
                    defaultHidden: false,
                    matcher: href => href.match(/vimeo.com\//i),
                    href: href => href,
                    component: Vimeo
                },
                {
                    title: "Vimeo",
                    keywords: "Vimeo",
                    defaultHidden: false,
                    matcher: href => href.match(/loom.com\//i),
                    href: href => href,
                    component: Loom
                }
            ]}
        >
        </Editor>
    )
}

const Youtube = (props) => {
    let str = props.attrs.href
    if(str.includes('watch?v=')){
        str = str.replace('watch?v=', 'embed/')
        console.log(str)
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe style={{ height: '32vh', padding: '0', margin: 0 }} title='video'
                src={str}
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen">
            </iframe>
        </div>
    )
}

const Vimeo = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe style={{ height: '32vh', padding: '0', margin: 0 }} title='video'
                src={props.attrs.href.replace('vimeo', 'player.vimeo').replace('.com', '.com/video')}
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                frameBorder="0" 
                >
            </iframe>
        </div>
    )
}

const Loom = (props) => {
    return (
        <div style={{height: '32vh', display: 'flex', justifyContent: 'center' }}>
            <iframe style={{  padding: '0', margin: 0 }} title='video'
                src={props.attrs.href.replace('share', 'embed')}
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                frameBorder="0" 
                >
            </iframe>
        </div>
    )
}