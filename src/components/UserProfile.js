import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../mdstyles.css';

export default function UserProfile({ user }) {
    const [userDecks, setUserDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecks = async () => {
        // Guard Clause: Don't fetch if user data is missing or invalid
        if (!user || !user.id || isNaN(parseInt(user.id))) {
            return; 
        }

        try {
            // Force the ID to be an integer in the URL
            const userIdInt = parseInt(user.id);
            const response = await fetch(`https://api.happybush-e43d89b2.eastus.azurecontainerapps.io/api/mongodb/DeckListMongoDb/user/${user.id}`);
            
            if (response.ok) {
                const data = await response.json();
                setUserDecks(data);
            } else {
                // If the API returns 404, just set decks to empty instead of crashing
                setUserDecks([]);
            }
        } catch (error) {
            console.error("DATABASE_LINK_FAILURE:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDecks();
}, [user]);

    if (!user) return <div className="md-theme-bg text-info p-5">ACCESS_DENIED: PLEASE_LOGIN</div>;

    const handleDeleteDeck = async (deckId) => {
    if (!user?.id) return;

    if (!window.confirm("SYSTEM_CONFIRMATION: PURGE_ARCHIVED_DECK?")) return;

    try {
        const response = await fetch(`https://api.happybush-e43d89b2.eastus.azurecontainerapps.io/api/mongodb/DeckListMongoDb/${deckId}/user/${user.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // This is the "React Way" to re-render:
            // Filter out the deck that matches the deleted ID
            setUserDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
            
            console.log("UI_SYNCHRONIZED: DECK_REMOVED");
        } else {
            console.error("DELETION_FAILED");
        }
    } catch (error) {
        console.error("NETWORK_ERROR", error);
    }
};

    return (
        <div className="md-theme-bg min-vh-100 py-5 mt-5">
            <Container>
                {/* User Header HUD */}
                <div className="md-panel p-4 mb-4 border-info">
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <div className="empty-avatar" style={{ width: '80px', height: '80px' }}></div>
                        </Col>
                        <Col>
                            <h2 className="text-info m-0" style={{ fontFamily: 'Cascadia Mono' }}>
                                {user.firstName?.toUpperCase()}_{user.lastName?.toUpperCase()}
                            </h2>
                            <p className=" m-0">RANK: DUELIST // ID: {user.id}</p>
                        </Col>
                        <Col xs="auto" className="text-end">
                            <div className="text-info">DECKS_ARCHIVED: {userDecks.length}</div>
                        </Col>
                    </Row>
                </div>

                <h4 className="text-white mb-4" style={{ letterSpacing: '2px' }}>SAVED_DECKLISTS</h4>

                {loading ? (
                    <div className="text-center text-info"><Spinner animation="border" /></div>
                ) : (
                    <Row className="g-4">
                        {userDecks.length > 0 ? (
                            userDecks.map((deck) => (
                                <Col key={deck.id} md={4}>
                                    <Card className="md-nav-card h-100">
                                        <Card.Body className="d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="text-info">{deck.title?.toUpperCase()}</h5>
                                                <img 
                                                    src={deck.mainDeck[0]?.image || "/images/card_back_placeholder.png"} 
                                                    alt="" 
                                                    style={{width: "100%", height: "85%", objectFit: "contain"}}
                                                />
                                                <p className="md-text-disabled small">
                                                    MAIN: {deck.mainDeck?.length || 0} | 
                                                    EXTRA: {deck.extraDeck?.length || 0}
                                                </p>
                                            </div>
                                            <div className="mt-3">
                                                <Button as={Link} to={`/deckprofiledetails/${deck.id}`} className="md-btn-outline w-100 mb-2">
                                                    VIEW_DATA
                                                </Button>
                                                <Button 
                                                    // as={Link} 
                                                    // to={`/deckdetails/${deck.id}`} 
                                                    className="md-btn-delete w-100 mb-2" 
                                                    variant="outline-danger"
                                                    onClick={() => handleDeleteDeck(deck.id)}>
                                                    DELETE_DECK
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <p className="text-muted">NO_DECK_DATA_FOUND_IN_ARCHIVE</p>
                                <Button as={Link} to="/deckbuilder" className="md-btn-primary">INITIALIZE_DECK_BUILDER</Button>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}