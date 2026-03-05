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
    <div className="md-api-container">
      <Form>
      {/* Search Input Row */}
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="cardSearch">
            <Form.Control
              type="search"
              placeholder="SYSTEM_SEARCH: ENTER CARD NAME..."
              className="md-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Filter Row */}
      <Row className="g-2 mb-4">
        <Col md={4}>
          <Form.Select 
            className="md-select-box"
            onChange={(e) => setSelectedFrame(e.target.value)} 
            value={selectedFrame}
          >
            <option value="all">FRAME_TYPE</option>
            {frameTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select 
            className="md-select-box"
            onChange={(e) => setCardLevel(e.target.value)} 
            value={cardLevel}
          >
            <option value="">LEVEL</option>
            {cardLevels.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={5}>
          <Form.Select 
            className="md-select-box"
            onChange={(e) => setAttribute(e.target.value)} 
            value={attribute}
          >
            <option value="">ATTRIBUTE</option>
            {attributes.map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
    </Form>
      
      
      
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
              
              } variant="outline-danger" size="sm" className="md-btn-delete w-100">Delete</Button>
              <div className="d-flex flex-column gap-1 mt-2">
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
                }}  variant="outline-success" size="sm" className="md-btn-add w-100">Add</Button>
                </div>
              {/* </form> */}
            
            {/* <p style={{color: "white", fontFamily: "Cascadia Mono"}}>{card.name}</p> */}
            
          </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}