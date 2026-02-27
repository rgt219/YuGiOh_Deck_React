import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {DecksContext} from './DecksContext';
import HoverVideoPlayer from 'react-hover-video-player';
import { SplitPane } from 'react-split-pane';
import ImageGrid from './ImageGrid';
import ImagePopup from './ImagePopup';
import CardApi from './CardApi';

export default function DeckDetails({archetype}) {

    const { deckId } = useParams();
    const decks = useContext(DecksContext);
    const deck = decks.find(d => d.id === parseInt(deckId));

    if(deck == null)
        return <div>Deck not found.</div>

    return (
        
    <>
        <div class="three" style={{overflow: 'visible', maxWidth: "2000px"}}>
            <h1 class="h1 center has-text-centered svelte-1c6r74u is-uppercase">{deck.title} Deck Breakdown</h1>
        </div>
        <div class="card" bg-color="#2f6a9d" style={{overflow: 'visible'}}>
            <h1>Key Cards</h1>
            <div key={deck.id} className='decks-grid' style={{overflow: 'visible', display: 'flex'}}>
                <img src={`/images/${deck.keyCard1}`} alt="Missing Card..." width="20%" height="20%" />
                <img src={`/images/${deck.keyCard2}`} alt="Missing Card..." width="20%" height="20%" />
                <img src={`/images/${deck.keyCard3}`} alt="Missing Card..." width="20%" height="20%" />
                <img src={`/images/${deck.keyCard4}`} alt="Missing Card..." width="20%" height="20%" />
            </div>
        </div>

        <div style={{overflow: 'hidden'}}>
            
            <SplitPane split="vertical" defaultSize="50%">
                <div className="left-content" 
                style={{overflow: 'visible'}}>
                    <h1>Sample Deck List</h1>
                    <ImageGrid archetype={deck}></ImageGrid>
                </div>
                <div className="right-content">
                    <div class="card bg-black" maxWidth="100%" maxHeight="500px" overflowY="scroll">
                        <CardApi></CardApi>
                    </div>
                    
                </div>
            </SplitPane>
        </div>

        <ImagePopup></ImagePopup>
    </>
        
    )
}