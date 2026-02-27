import React from "react";
import '../styles.css';
import {useState, useEffect, useContext} from 'react';
import { DecksContext } from "./DecksContext";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'
import { SplitPane } from 'react-split-pane';
import ImagePopup from "./ImagePopup";



export default function ImageGrid({archetype, yugipedia})
{

    return (
        <>
        <div class="gallery" style={{overflowX: 'visible'}}>
           
            {
                archetype.deckList.main.map(x => (
                        <div className="gallery__item">
                            <ImagePopup archetype={x} image={`/images/${x.image}`} effect={x.effect} yugipedia={x.yugipedia}>
                                
                            </ImagePopup>
                            
                        </div>
                ))
            }
        </div>

</>
        
    )
}
