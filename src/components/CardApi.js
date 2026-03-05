import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navbar, Form, FormControl, NavDropdown, Nav, Card } from 'react-bootstrap';

export const deckList = {
      mainDeck: [],
      extraDeck: [

      ], 
      sideDeck: [

      ],
      id: '30',
      title: '',
      userId: ''
    }


export default function CardApi({ onAddCard, onDeleteCard, cardList }) 
{
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFrame, setSelectedFrame] = useState('all');
    const [cardLevel, setCardLevel] = useState();
    const [attack, setAttack] = useState();
    const [defense, setDefense] = useState();
    const [attribute, setAttribute] = useState();

    // 1. Fetch data from YGOPRODeck API [3]
    useEffect(() => {
        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
        .then(response => response.json())
        .then(data => {
            setCards(data.data);
            setLoading(false);
        });
    }, []);

    fetch("https://localhost:5276/api/mongodb/DeckListMongoDb")
      .then(response => {
        // Clone the response so it can be read in both the console and the next .then()
        const responseClone = response.clone(); 
        // Check if the response status is in the 200 range (success)
        if (!response.ok) { 
          // Log the raw HTML error page content
          responseClone.text().then(text => console.error('Server Response (HTML):', text));
          throw new Error('Network response was not ok');
        }
        return response.json(); // Attempt to parse as JSON
      })
      .then(data => {
        //console.log('JSON Data:', data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  // 2. Filter logic: Filter cards based on search input [4]

    const frameTypes = ["All", ...new Set(cards.map(card => card.frameType))];
    const cardLevels = ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const attributes = ['', ...new Set(cards.map(card => card.attribute))];

    const filteredCards = cards.filter(card => {
        const matchesText = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            card.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFrame = selectedFrame === 'all' || card.frameType === selectedFrame;
        const matchesLevel = cardLevel === '' || card.level === parseInt(cardLevel);
        const matchesAttack = attack === parseInt(card.attack);
        const matchesDefense = defense === parseInt(card.defense);
        const matchesAttribute = attribute === card.attribute;
        return matchesText && matchesFrame && matchesLevel && (matchesAttribute || matchesAttack || matchesDefense);
    },
  [cards, searchTerm, selectedFrame, cardLevel, attribute]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar expand="lg">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="w-100">
            <Form.Control
              type="search"
              placeholder="Search for a card..."
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: '#f0f0f0', color: '#333' }}
              expand="lg"
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
      <div class="d-flex gap-3">
        <div style={{width: "25%"}}>
              <select id="frame_select" class="form-select"onChange={(e) => setSelectedFrame(e.target.value)} value={selectedFrame}>
                <option defaultValue key={selectedFrame}>Frame Type</option>
                {frameTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
        </div>
        <div style={{width: "25%"}}>
            <select class="form-select" onChange={(e) => setCardLevel(e.target.value)} value={parseInt(cardLevel)}>
              <option defaultValue key={cardLevel}>Level</option>
            {cardLevels.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div style={{width: "25%"}}>
            <select class="form-select" onChange={(e) => setAttack(e.target.value)} value={cardLevel}>
              <option defaultValue key={attack}>Attack</option>
            {/* {attack.map(type => (
              <option key={type} value={type}>{type}</option>
            ))} */}
          </select>
        </div>
        <div style={{width: "25%"}}>
            <select class="form-select" onChange={(e) => setAttribute(e.target.value)} value={attribute}>
              <option defaultValue key={attribute}>Attribute</option>
            {attributes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
    </div>
      
      
      
      <div class="gallery" style={{overflowX: 'visible'}}>
        {filteredCards.map(card => (
            <div className="gallery__item">
          <div key={card.id} 
            className="card-container">

            <OverlayTrigger
              key='left'
              placement='left'
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
          }
        >
            <img class="card_details" src={card.card_images[0].image_url_small} alt=""/>


        </OverlayTrigger>
              <Button onClick={() => {
                onDeleteCard(card.id);
              }
              
              } variant="outline-danger" size="sm">Delete</Button>
              
              <Button onClick={() => {
                  const newCard = {
                    id: String(card.id),
                    name: String(card.name),
                    type: String(card.type),
                    frameType: card.frameType,
                    desc: String(card.desc),
                    atk: parseInt(card.atk),
                    def: parseInt(card.def),
                    level: parseInt(card.level),
                    race: String(card.race),
                    attribute: String(card.attribute),
                    image: card.card_images[0].image_url_small
                  }

                  onAddCard(newCard);

                  //deckList.mainDeck.push(newCard);
                  console.log(deckList.mainDeck);
                }}  variant="outline-success" size="sm">Add</Button>
              {/* </form> */}
            
            {/* <p style={{color: "white", fontFamily: "Cascadia Mono"}}>{card.name}</p> */}
            
          </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}