import React, {useState} from 'react'
import { Accordion,MenuItem, MenuList, AccordionDetails, AccordionSummary, TextField} from '@material-ui/core'
import nodeList from '../../Resources/Platforms.json'



export default function NewPlanSearchSelector(props) {

    const [searchTerm, setSearchTerm] = useState('')

    function onClick(e, type){
        console.log(e.target.innerText)
        props.onSelect(e.target.innerText, type)
    }

    return (
        <div style={{ width: '70%' }}>
            <TextField variant='outlined' size='small' fullWidth placeholder='Search nodes' style={{ marginBottom: '1vh' }} onChange={e => setSearchTerm(e.target.value)}></TextField>
            <div style={{ maxHeight: '54vh', overflow: 'auto' }}>
                {searchTerm ?
                    <MenuList style={{ width: '100%' }}>
                        {nodeList.Custom.filter(nodeName => nodeName.toLowerCase().includes(searchTerm.toLowerCase())).map(nodeType => {
                            return (
                                <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
                            )
                        })}
                        {nodeList.Platforms.filter(nodeName => nodeName.toLowerCase().includes(searchTerm.toLowerCase())).map(nodeType => {
                            return (
                                <MenuItem onClick={(e)=>onClick(e, 'Platform')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType}></img>{nodeType}</MenuItem>
                            )
                        })}
                    </MenuList>
                    :
                    <div style={{}}>
                        <Accordion>
                            <AccordionSummary>Nodemap Nodes</AccordionSummary>
                            <AccordionDetails>
                                <MenuList style={{ width: '100%' }}>
                                    {nodeList.Custom.map(nodeType => {
                                        return (
                                            <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary>Platform Nodes</AccordionSummary>
                            <AccordionDetails>
                                <MenuList style={{ width: '100%' }}>
                                    {nodeList.Platforms.map(nodeType => {
                                        return (
                                            <MenuItem onClick={(e)=>onClick(e, 'Platform')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType}></img>{nodeType}</MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                }
            </div>
        </div>
    )
}
