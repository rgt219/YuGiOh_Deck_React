import React from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import '../styles.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlueEyes from './BlueEyes';


export default function DeckBoss({deck, isDeckListed, toggleDeckList})
{
    const handleError = (e) => {
        e.target.src = "images/cardback.jpg";
    };

    const getRatingClass = (rating) => {
        if(rating >= 8) return 'rating-good';
        if(rating >= 5 && rating < 8) return 'rating-ok';
        if(rating < 5) return 'rating-bad';

    };

    return(
        <div>
            <div key={deck.id} className='deck-boss'>
                

                <HoverVideoPlayer
                    videoSrc={`videos/${deck.video}`}
                    pausedOverlay={
                        <img src={`images/${deck.image}`} alt="" 
                        style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    }}/>
                    }
                    loop={true}
                    muted={true}
                />


                <h3 className='deck-title'>
                    <Link to={`/decks/${deck.id}`}>
                        {deck.title}
                    </Link>
                </h3>
                <div>
                    <span className='deck-genre'>{deck.extraDeckType}</span>
                    <span className={`deck-rating ${getRatingClass(deck.rating)}`}>
                        {deck.rating}
                    </span>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={isDeckListed} onChange={() => toggleDeckList(deck.id)}>
                    </input>
                    <span className="slider">
                        <span className="slider-label">
                            {isDeckListed ? "In DeckList" : "Add to DeckList"}
                        </span>
                    </span>
                </label>
            </div> 
        </div>
    );

}