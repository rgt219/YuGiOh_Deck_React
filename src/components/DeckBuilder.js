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
import { deckList } from "../components/CardApi";

export default function DeckBuilder()
{
    const [cardList, setCardList] = useState([]);
    const [deckName, setDeckName] = useState('');

    const handleTextareaChange = (event) => {
        // Update the state with the current value from the input field
        setDeckName(event.target.value);
  };
    
    const addCard = (newCard) => {
        setCardList(prevCards => [...prevCards, newCard]);
    }

    const deleteCard = (cardId) => {
        const newCardList = [...cardList];
        const index = newCardList.findIndex(card => card.id === cardId);
        if (index > -1) {
            newCardList.splice(index, 1);
            setCardList(newCardList);
        }
    }

    const handleSave = async () => {
    try {
        console.log(JSON.stringify(deckList));
        deckList.title = String(deckName);
        deckList.id = (String)(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1);
        
      const response = await fetch("https://localhost:7276/api/mongodb/DeckListMongoDb", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckList),
      });

      console.log(response.body);

      if (response.ok) {
        // Handle success
        console.log('Data saved successfully!');
        // Optional: clear the array or show a success message
      } else {
        // Handle error
        console.error('Failed to save data. Sorry buddy');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    return (
        <>
            <div class="container">
                <div class="row" border>
                    <div class="col bg-black border">
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="basic-addon3"> Deck Name</InputGroup.Text>
                            <Form.Control as="textarea" aria-label="With textarea" value={deckName}  onChange={handleTextareaChange} />
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => handleSave()}>
                                Save
                            </Button>
                        </InputGroup>

                        <CustomDeck cardList={cardList}></CustomDeck>
                    </div>
                    <div class="col bg-black border">
                        <CardApi onAddCard={addCard} onDeleteCard={deleteCard} cardList={cardList}></CardApi>
                    </div>
                </div>
            </div>
        </>
    )
}