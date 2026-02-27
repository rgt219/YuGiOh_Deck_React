import logo from './logo.svg';
import './App.css';
import './styles.css';
import Header from './components/Header';
import Footer from './components/Footer';
import DecksGrid from './components/DecksGrid';
import DeckList from './components/DeckList';
import DeckDetails from './components/DeckDetails';
import BlueEyes from './components/BlueEyes';
import CardApi from './components/CardApi';
import { DecksProvider } from './components/DecksContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import TestComponent from './components/TestComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import DeckBuilder from './components/DeckBuilder';

function App(deck) {
  const [decks, setDecks] = useState([]);
  const [decklist, setDeckList] = useState([]);

  useEffect(() => {
          fetch("decks.json")
          .then(response => response.json())
          .then(data => setDecks(data));
      }, []);

  const toggleDeckList = (deckId) => {
    setDeckList(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId) 
        : [...prev, deckId]
    )
  }

  return (
    <DecksProvider>
      <div class="p-5 bg-secondary bg-gradient text-white text-white App">
        <div className="container-box">
          <Carousel className="bg-dark bg-opacity-75 p-2 rounded" style={{width: "100%", height: "515px"}}>
            <Carousel.Item>
              <header class="absolute inset-x-0 top-0 z-50">
                <img className='ygoss' src='./images/ygoss1.jpg' alt="yugioh" />
              </header>
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
              
            <Carousel.Item>
              <header class="absolute inset-x-0 top-0 z-50">
                  <img className='ygoss' src='./images/ygoss2.jpg' alt="yugioh" />
              </header>
            </Carousel.Item>

            <Carousel.Item>
              <header class="absolute inset-x-0 top-0 z-50">
                  <img className='ygoss' src='./images/ygoss3.jpg' alt="yugioh" />
              </header>
            </Carousel.Item>
            
          </Carousel>
          

          <Router>
            <nav>
              <ul>
                <Card as={Link} to="/" style={{ width: '18rem', cursor: 'pointer', height: "200px" }} class="hover-card" className="bg-gray-500">
                  <Card.Img variant="top"  src="./images/lenatus_art.jpg" style={{objectFit: "cover", height: "100%"}}/>
                  <Card.ImgOverlay>
                    <Card.Body className="text-center">
                      <Card.Header style={{backgroundColor: "bg-primary"}}>
                        <Card.Title className="bg-dark bg-opacity-75 p-2 rounded text-white">Home</Card.Title>
                      </Card.Header>
                    </Card.Body>
                  </Card.ImgOverlay>
                </Card>
                <Card as={Link} to="/decklist" style={{ width: '18rem', cursor: 'pointer', height: "200px" }} class="hover-card">
                  <Card.Img src="./images/droplet_art.jpg" style={{objectFit: "cover", height: "100%"}}/>
                  <Card.ImgOverlay>
                    <Card.Body className="text-center">
                      <Card.Header style={{backgroundColor: "bg-primary"}}>
                        <Card.Title className="bg-dark bg-opacity-75 p-2 rounded text-white">Deck List</Card.Title>
                      </Card.Header>
                    </Card.Body>
                  </Card.ImgOverlay>
                </Card>
                <Card as={Link} to="/deckbuilder" style={{ width: '18rem', cursor: 'pointer', height: "200px" }} class="hover-card">
                  <Card.Img src="./images/exodia.png" style={{objectFit: "cover", height: "100%"}}/>
                  <Card.ImgOverlay>
                    <Card.Body className="text-center">
                      <Card.Header style={{backgroundColor: "bg-primary"}}>
                        <Card.Title className="bg-dark bg-opacity-75 p-2 rounded text-white">Deck Builder</Card.Title>
                      </Card.Header>
                    </Card.Body>
                  </Card.ImgOverlay>
                </Card>
                {/* <Card as={Link} to="/test" style={{ width: '18rem', cursor: 'pointer' }}>TEST</Card> */}
              </ul>
            </nav>

            <Routes>
              <Route 
                path="/" 
                element={<DecksGrid decks={decks} decklist={decklist} toggleDeckList={toggleDeckList}/>}>
              </Route>

              <Route 
                path="/decklist" 
                element={<DeckList decks={decks} decklist={decklist} toggleDeckList={toggleDeckList}/>}>
              </Route>

              <Route
                path={"/decks/:deckId"}
                element={<DeckDetails></DeckDetails>}
                >
              </Route>
              <Route 
                path="/deckbuilder" 
                element={<DeckBuilder></DeckBuilder>}>
              </Route>
              <Route 
                path="/test" 
                element={<TestComponent></TestComponent>}>
              </Route>
            </Routes>

          </Router>
        </div>


        <Footer></Footer>
      </div>
    </DecksProvider>
  );
  
}

export default App;
