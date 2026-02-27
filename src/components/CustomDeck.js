import React, { useState, useEffect } from "react";

export default function CustomDeck({ cardList }) {
    return (
        <div class="gallery__small" style={{overflowX: 'visible'}}>
                {
                cardList.map(card => (
                    <div className="gallery__item__small">
                    <div key={card.id}>
                        <img src={card.image} alt={card.name} className="card-image"/>
                    </div>
                    </div>
                ))}
        </div>
        
    )
}