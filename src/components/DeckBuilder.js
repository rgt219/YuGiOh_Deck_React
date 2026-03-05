import React, { useState, useEffect }from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import CardApi from "../components/CardApi";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import CustomDeck from "./CustomDeck";
import { deckList } from "../components/CardApi";

export default function DeckBuilder()
{
    const [cardList, setCardList] = useState([]);
    const [deckName, setDeckName] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const handleTextareaChange = (event) => {
        setDeckName(event.target.value);
    };
    
    const addCard = (newCard) => {
        const uniqueId = { ...newCard, instanceId: Math.random()}
        setCardList(prevCards => {
            const updated = [...prevCards, uniqueId];
            deckList.mainDeck = updated;
            return updated;
        });
    }

    const deleteCard = (cardId) => {
        setCardList(prevCards => {
            const index = prevCards.findIndex(card => parseInt(card.id) === parseInt(cardId));
            if (index > -1) {
                const newCards = [...prevCards];
                newCards.splice(index, 1);
                
                // ALSO update your global deckList here if you must use it
                deckList.mainDeck = newCards; 
                
                return newCards; // This new reference triggers the UI update
            } else {
                console.log("cant delete card")
            }
            return prevCards;
        });
    }

    useEffect(() => {
        // Whenever cardList changes, force the global deckList to match it
        deckList.mainDeck = cardList;
        console.log("Global DeckList Synced:", deckList.mainDeck);
    }, [cardList]);

    const handleSave = async () => {
    try {
        console.log(JSON.stringify(deckList));
        deckList.title = String(deckName);
        deckList.id = (String)(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1);
        
      const response = await fetch("http://localhost:5276/api/mongodb/DeckListMongoDb", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckList),
      });

      console.log(response.body);
      setShow(true);

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



            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deck "{deckName}" has been saved.   
                </Modal.Body>
            </Modal>
        </>
    )
}