import React, {useEffect, useState, useContext} from 'react'
import { Accordion,MenuItem, MenuList, AccordionDetails, AccordionSummary, Button, Divider} from '@material-ui/core'
import nodeList from '../../Resources/Platforms.json'
import RESOURCES from '../../Resources/resources'
import { AppDataManager } from '../../Context/AppDataManager'
import { ExpandMore } from '@material-ui/icons'

const axios = require('axios')

export default function NewPlanSearchSelector(props) {

    const [searchTerm, setSearchTerm] = useState('')
    const [customNodes, setCustomNodes]  = useState(null)

    const { appData } = useContext(AppDataManager)

    useEffect(()=>{
        getData()
    }, [])

    async function getData(){
        // var result = await axios.get(`${RESOURCES.apiURL}/nodes/custom?user=${appData.UserIDRoute}`)
        var result = await axios.get(`${RESOURCES.apiURL}/nodes/custom?user=Nodemap`)
        console.log(result.data)
        setCustomNodes(result.data)
    }

    function onClick(e, type){
        console.log(e.target.innerText)
        props.onSelect(e.target.innerText, type)
    }

    return (
        <div style={{ width: '70%' }}>
            {/* <TextField variant='outlined' size='small' fullWidth placeholder='Search nodes' style={{ marginBottom: '1vh' }} onChange={e => setSearchTerm(e.target.value)}></TextField> */}
            <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                <Accordion>
                    <AccordionSummary style={{width:'auto' }}><div style={{width:'100%',display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{display:'flex', justifyContent:'flex-start'}}><ExpandMore/><div>Nodemap nodes</div></div></div></AccordionSummary>
                    <AccordionDetails>
                        <MenuList style={{ width: '100%' }}>
                            {nodeList.Custom.map(nodeType => {
                                return (
                                    <MenuItem onClick={(e)=> props.onSelect(e, 'Nodemap')}><img alt={nodeType} style={{ maxHeight: '2vw', margin:0, padding:'0', width: '2vw', height: '2vw', borderRadius: '50%', transition: '0.1s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={`https://firebasestorage.googleapis.com/v0/b/nodemap-app.appspot.com/o/Nodes%2F${nodeType}.svg?alt=media&token=abc2964c-b9e2-4837-bca1-84d46025f806`}></img>{nodeType}</MenuItem>
                                )
                            })}
                        </MenuList>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary style={{width:'auto' }}><div style={{width:'100%',display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{display:'flex', justifyContent:'flex-start'}}><ExpandMore/><div>Your custom nodes</div></div></div></AccordionSummary>
                    <AccordionDetails>
                        {customNodes &&
                        <MenuList style={{ width: '100%' }}>
                            {customNodes.map(node => {
                                return (
                                    <MenuItem onClick={(e)=> props.onSelect(e, 'Custom', node)}><img alt={node} style={{ maxHeight: '2vw', margin:0, padding:'0', width: '2vw', height: '2vw', borderRadius: '50%', transition: '0.1s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={node.Url}></img>{node.Title}</MenuItem>
                                )
                            })}
                            <MenuItem>+ Add a custom node</MenuItem>
                        </MenuList>
                        }
                    </AccordionDetails>
                </Accordion>
                {/* <Accordion>
                    <AccordionSummary style={{width:'auto' }}><div style={{width:'100%',display:'flex', justifyContent:'space-between', alignItems:'center'}}><div style={{display:'flex', justifyContent:'flex-start'}}><ExpandMore/><div>Your Custom Nodes</div></div></div></AccordionSummary>
                    <AccordionDetails>
                        <MenuList style={{ width: '100%' }}>
                            {customNodes.map(nodeType => {
                                return (
                                    <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '2vw', margin:0, padding:'0', width: '2vw', height: '2vw', borderRadius: '50%', transition: '0.1s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
                                )
                            })}
                        </MenuList>
                    </AccordionDetails>
                </Accordion> */}
            </div>
        </div>
    )
}


// {searchTerm ?
//     <MenuList style={{ width: '100%' }}>
//         {nodeList.Custom.filter(nodeName => nodeName.toLowerCase().includes(searchTerm.toLowerCase())).map(nodeType => {
//             return (
//                 <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
//             )
//         })}
//         {/* {nodeList.Platforms.filter(nodeName => nodeName.toLowerCase().includes(searchTerm.toLowerCase())).map(nodeType => {
//             return (
//                 <MenuItem onClick={(e)=>onClick(e, 'Platform')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType}></img>{nodeType}</MenuItem>
//             )
//         })} */}
//         {customNodes.filter(nodeName => nodeName.Title.toLowerCase().includes(searchTerm.toLowerCase())).map(nodeType => {
//             return (
//                 <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
//             )
//         })}

//     </MenuList>
//     :
//     <div style={{}}>
        // <Accordion>
        //     <AccordionSummary>Nodemap Nodes</AccordionSummary>
        //     <AccordionDetails>
        //         <MenuList style={{ width: '100%' }}>
        //             {nodeList.Custom.map(nodeType => {
        //                 return (
        //                     <MenuItem onClick={(e)=>onClick(e, 'Custom')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType + '.png'}></img>{nodeType}</MenuItem>
        //                 )
        //             })}
        //         </MenuList>
        //     </AccordionDetails>
        // </Accordion>
//         {/* <Accordion>
//             <AccordionSummary>Platform Nodes</AccordionSummary>
//             <AccordionDetails>
//                 <MenuList style={{ width: '100%' }}>
//                     {nodeList.Platforms.map(nodeType => {
//                         return (
//                             <MenuItem onClick={(e)=>onClick(e, 'Platform')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType}></img>{nodeType}</MenuItem>
//                         )
//                     })}
//                 </MenuList>
//             </AccordionDetails>
//         </Accordion> */}
//         <Accordion>
//             <AccordionSummary>Platform Nodes</AccordionSummary>
//             <AccordionDetails>
//                 <MenuList style={{ width: '100%' }}>
//                     {nodeList.Platforms.map(nodeType => {
//                         return (
//                             <MenuItem onClick={(e)=>onClick(e, 'Platform')}><img alt={nodeType} style={{ maxHeight: '3vw', width: '3vw', height: '3vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + nodeType}></img>{nodeType}</MenuItem>
//                         )
//                     })}
//                 </MenuList>
//             </AccordionDetails>
//         </Accordion>
//     </div>
// }