import React, { useState, useEffect }from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import CardApi from "../components/CardApi";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import CustomDeck from "./CustomDeck";
import { deckList } from "../components/CardApi";
import '../mdstyles.css';

export default function DeckBuilder({user})
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
        console.log(user);
        if(!user || !user.id) {
            alert("CRITICAL_ERROR: USER_ID_NOT_FOUND. LOG IN OR THIS SITE WILL SELF DESTRUCT");
            return;
        }

        console.log(JSON.stringify(deckList));
        deckList.title = String(deckName) || "NEW_DECKLIST";
        deckList.id = (String)(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1);
        deckList.userId = user.id;
        deckList.extraDeck = [];
        deckList.sideDeck = [];

        console.log("COMMENSING_DATABASE_UPLINK");
        
      const response = await fetch("https://localhost:5276/api/mongodb/DeckListMongoDb", {
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
        <div className="master-duel-theme py-5 mt-5">
            <Container fluid className="px-4">
                {/* Header Controls */}
                <Row className="mb-4">
                    <Col md={12} className="md-panel p-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3 w-50">
                            <h4 className="m-0 text-info" style={{fontFamily: 'Cascadia Mono'}}>DECK EDITOR</h4>
                            <Form.Control 
                                className="md-input"
                                placeholder="ENTER DECK NAME..."
                                value={deckName} 
                                onChange={(e) => setDeckName(e.target.value)} 
                            />
                        </div>
                        <Button className="md-btn-save" onClick={handleSave}>SAVE DECK</Button>
                    </Col>
                </Row>

                <Row className="g-4" style={{minHeight: '80vh'}}>
                    {/* Left Side: The Deck Gallery */}
                    <Col md={7} className="md-panel p-4">
                        <h5 className="text-muted mb-3">MAIN DECK ({cardList.length}/60)</h5>
                        <div className="deck-scroll-container">
                            <CustomDeck cardList={cardList} />
                        </div>
                    </Col>

                    {/* Right Side: Search and API */}
                    <Col md={5} className="md-panel p-4 bg-black bg-opacity-50">
                        <CardApi onAddCard={addCard} onDeleteCard={deleteCard} cardList={cardList} />
                    </Col>
                </Row>
            </Container>

            <Modal show={show} onHide={() => setShow(false)} centered contentClassName="md-modal">
                <Modal.Header closeButton className="border-info">
                    <Modal.Title className="text-info">SYSTEM MESSAGE</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <h5>Deck "{deckName}" successfully archived to database.</h5>
                </Modal.Body>
            </Modal>
        </div>
    );
}