import React, { useState }from "react";
import { SplitPane } from "react-split-pane";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import CardApi from "../components/CardApi";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useDropzone } from 'react-dropzone';
import Dropzone from '../components/Dropzone'
import CardInfo from './CardInfo';
import CustomDeck from "./CustomDeck";

export default function DeckBuilder()
{
    const [cardList, setCardList] = useState([]);
    
    const addCard = (newCard) => {
        setCardList(prevCards => [...prevCards, newCard]);
    }

    

    return (
        <>
            <div class="container border">
                <div class="row" border>
                    <div class="col bg-black border">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="basic-addon3"> Deck Name</InputGroup.Text>
                            <Form.Control as="textarea" aria-label="With textarea" />
                            <Button variant="outline-secondary" id="button-addon2">
                                Save
                            </Button>
                        </InputGroup>

                        <CustomDeck cardList={cardList}></CustomDeck>
                    </div>
                    <div class="col bg-black border">
                        <CardApi onAddCard={addCard}></CardApi>
                    </div>
                </div>
            </div>
        </>
    )
}