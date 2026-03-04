import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Card, Container, Row, Col } from 'react-bootstrap';

export default function CustomDeck({ cardList }) {
    return (
        <div class="gallery__small" style={{overflowX: 'visible'}}>
                {
                cardList.map(card => (
                <>
                    <OverlayTrigger
                    key='right'
                    placement='right'
                    overlay={
                        <Card style={{ width: '36rem' }} bg="dark" text="white">
                        <Card.Body>
                            <Container style={{margin: 0}}>
                            <Row>
                                <Col>
                                <Card.Title style={{fontFamily: "Cascadia Mono"}}>
                                    {card.name}
                                </Card.Title>
                                </Col>
                                <Col xs lg="3">
                                {card.attribute} | 
                                <img src={"/images/level.png"} alt="" style={{width: "15px", height: "15px"}}/>{card.level}
                                </Col>
                            </Row>
                            </Container>
                            <Card.Subtitle className="mb-2 text-grey">
                            {card.race} / {card.type}
                            </Card.Subtitle>
                            <Card.Text bg="dark">
                            {card.desc}
                            </Card.Text>
                        </Card.Body>
                        </Card>
                    }>
                        <div className="gallery__item__small">
                        <div key={card.id}>
                            <img src={card.image} alt={card.name} className="card-image"/>
                        </div>
                        </div>
                    </OverlayTrigger>
                    </>
                ))}
        </div>
        
    )
}