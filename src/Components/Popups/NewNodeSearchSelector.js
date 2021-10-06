import React, { useEffect, useState, useContext } from 'react'
import { Accordion, MenuItem, MenuList, AccordionDetails, AccordionSummary, Button, Divider, Paper } from '@material-ui/core'
import nodeList from '../../Resources/Platforms.json'
import RESOURCES from '../../Resources/resources'
import { AppDataManager } from '../../Context/AppDataManager'
import { ExpandMore } from '@material-ui/icons'
import { PopupManager, setPopupState } from '../../Context/PopupManager'

const axios = require('axios')

export default function NewPlanSearchSelector(props) {

    const [searchTerm, setSearchTerm] = useState('')
    const [customNodes, setCustomNodes] = useState(null)

    const { appData } = useContext(AppDataManager)
    const {popups, setPopups} = useContext(PopupManager)

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        // var result = await axios.get(`${RESOURCES.apiURL}/nodes/custom?user=${appData.UserIDRoute}`)
        var result = await axios.get(`${RESOURCES.apiURL}/nodes/custom?user=Nodemap`)
        console.log(result.data)
        setCustomNodes(result.data)
    }

    function onClick(e, type) {
        console.log(e.target.innerText)
        props.onSelect(e.target.innerText, type)
    }

    return (
        <div style={{ width: '70%' }}>
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                <Accordion style={{ background: '#F7F6F3' }}>
                    <AccordionSummary style={{ width: 'auto' }}><div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2b2b2b' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <ExpandMore />
                            <div>Nodemap nodes</div>
                        </div>
                    </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuList style={{ width: '100%' }}>
                            {nodeList.Custom.map(nodeType => {
                                return (
                                    <MenuItem onClick={(e) => props.onSelect(nodeType, 'Nodemap')} style={{ border: '1px solid #e5e5e5', borderRadius: '5px', marginBottom: '1vh', background: '#fff', padding: '2%', color: '#2b2b2b' }}>
                                        <img alt={nodeType} style={{ maxHeight: '2vw', margin: 0, padding: '0', width: '2vw', height: '2vw', borderRadius: '50%', transition: '0.1s', transformOrigin: 'center', transitionDelay: '0.1s', border: '4px solid transparent', marginRight: '10px' }} src={`https://firebasestorage.googleapis.com/v0/b/nodemap-app.appspot.com/o/Nodes%2F${nodeType}.svg?alt=media&token=abc2964c-b9e2-4837-bca1-84d46025f806`}></img>
                                        {nodeType}
                                    </MenuItem>
                                )
                            })}
                        </MenuList>
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ background: '#F7F6F3' }}>
                    <AccordionSummary style={{ width: 'auto' }}><div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2b2b2b' }}><div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <ExpandMore />
                        <div>Your custom nodes</div>
                        </div>
                            <Button onClick={()=>setPopups(setPopupState('AddCustomNode', true, popups))} style={{ border: '1px solid #d2d3d4', background: '#6930C3', color: 'white', padding: '0' }}>+ Add</Button>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        {customNodes &&
                            <MenuList style={{ width: '100%' }}>
                                {customNodes.map(node => {
                                    return (
                                        <MenuItem onClick={(e) => props.onSelect(e, 'Custom', node)} style={{ border: '1px solid #e5e5e5', borderRadius: '5px', marginBottom: '1vh', background: '#fff', padding: '2%', color: '#2b2b2b' }}><img alt={node} style={{ maxHeight: '2vw', margin: 0, padding: '0', width: '2vw', height: '2vw', borderRadius: '50%', transition: '0.1s', transformOrigin: 'center', transitionDelay: '0.1s', border: '4px solid transparent', marginRight: '10px' }} src={node.Url}></img>{node.Title}</MenuItem>
                                    )
                                })}
                            </MenuList>
                        }
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    )
}