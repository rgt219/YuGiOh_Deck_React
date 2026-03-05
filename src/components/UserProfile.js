import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../mdstyles.css';

export default function UserProfile({ user }) {
    const [userDecks, setUserDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecks = async () => {
            if (!user?.id) return;
            try {
                // Fetching decks filtered by the logged-in User ID
                const response = await fetch(`https://localhost:5276/api/mongodb/DeckListMongoDb/user/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserDecks(data);
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
                            <p className="text-muted m-0">RANK: DUELIST // ID: {user.id}</p>
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
                                                <p className="text-muted small">
                                                    MAIN: {deck.mainDeck?.length || 0} | 
                                                    EXTRA: {deck.extraDeck?.length || 0}
                                                </p>
                                            </div>
                                            <div className="mt-3">
                                                <Button as={Link} to={`/deckdetails/${deck.id}`} className="md-btn-outline w-100 mb-2">
                                                    VIEW_DATA
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