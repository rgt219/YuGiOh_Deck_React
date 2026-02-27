import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import CardInfo from '../components/CardInfo';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function CardApi({ onAddCard }) 
{
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFrame, setSelectedFrame] = useState('all');
    const [cardLevel, setCardLevel] = useState();
    const [attack, setAttack] = useState();
    const [defense, setDefense] = useState();
    const [isHovered, setIsHovered] = useState(false);
    const [card, setCard] = useState();

    // 1. Fetch data from YGOPRODeck API [3]
    useEffect(() => {
        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
        .then(response => response.json())
        .then(data => {
            setCards(data.data);
            setLoading(false);
        });
    }, []);

    const handleSubmit = (event) => {
      onAddCard(card);
      setCard(null);
    }

  // 2. Filter logic: Filter cards based on search input [4]

    const frameTypes = ["All", ...new Set(cards.map(card => card.frameType))];
    const cardLevels = ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const filteredCards = cards.filter(card => {
        const matchesText = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            card.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFrame = selectedFrame === 'all' || card.frameType === selectedFrame;
        const matchesLevel = cardLevel === '' || card.level === parseInt(cardLevel);
        const matchesAttack = attack === parseInt(card.attack);
        const matchesDefense = defense === parseInt(card.defense);
        return matchesText && (matchesFrame && matchesLevel) || matchesAttack && matchesDefense;
    },
  [cards, searchTerm, selectedFrame, cardLevel]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input 
                type="text"
                className="search-input"
                placeholder="Search for a card..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{color: "white"}}>
                
      </input>
      
      <div class="d-flex gap-3">
        <div>
              <select id="frame_select" class="form-select"onChange={(e) => setSelectedFrame(e.target.value)} value={selectedFrame}>
                <option selected>Frame Type</option>
                {frameTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
        </div>
        <div>
            <select class="form-select" onChange={(e) => setCardLevel(e.target.value)} value={cardLevel}>
              <option selected>Level</option>
            {cardLevels.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
            <select class="form-select" onChange={(e) => setAttack(e.target.value)} value={cardLevel}>
              <option selected>Attack</option>
            {/* {attack.map(type => (
              <option key={type} value={type}>{type}</option>
            ))} */}
          </select>
        </div>
        
    </div>
      
      
      
      <div class="gallery" style={{overflowX: 'visible'}}>
        {filteredCards.map(card => (
            <div className="gallery__item">
          <div key={card.id} 
            className="card-container"
            onMouseEnter={() => setIsHovered(true)}
            OnMouseLeave={() => setIsHovered(false)} style={{paddingBottom: "15px"}}>
            <img src={card.card_images[0].image_url_small} alt={card.name} className="card-image"/>
              <Button onClick={() => console.log('Delete')} variant="outline-danger">- </Button>
              <OverlayTrigger trigger="click" placement="left" overlay={<Popover id="popover-basic">
                <Container fluid="md">
                  
                  <Popover.Header as="h3">
                  <Row>
                    <Col>
                      {card.name}
                    </Col>
                    <Col xs lg="2">
                    <div className="level-flex">
                      <img src="./images/level.png" alt=""></img>
                      <span>{card.level}</span>
                    </div>
                    </Col>
                  </Row>
                  </Popover.Header>
                </Container>
                          
                          <Popover.Body>
                            {card.race} / {card.frameType}<br></br>
                            {card.desc}
                          </Popover.Body>
                        </Popover>}>
                  <Button onClick={() => console.log('Info')}  variant="outline-info" className="cascadia-font">info   </Button>
              </OverlayTrigger>

              {/* <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={card}
                  onChange={(e) => card(e.target.value)}
                  placeholder="Enter item name"
                /> */}
                <Button onClick={() => {
                  const newCard = {
                    id: card.id,
                    name: card.name,
                    type: card.type,
                    frameType: card.frameType,
                    desc: card.desc,
                    atk: card.atk,
                    def: card.def,
                    level: card.level,
                    race: card.race,
                    atribute: card.attribute,
                    image: card.card_images[0].image_url_small
                  }

                  onAddCard(newCard);

                  console.log(newCard);
                }}  variant="outline-success">+</Button>
              {/* </form> */}
            
            {/* <p style={{color: "white", fontFamily: "Cascadia Mono"}}>{card.name}</p> */}
            
          </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}