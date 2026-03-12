import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import CustomDeck from "./CustomDeck"; // Reusing your working deck display
import '../mdstyles.css';

export default function DeckProfileDetails() {
const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDeckData = async () => {
            try {
                // 1. Fetch the Master Card list (YGOPRODeck)
                const masterRes = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
                const masterData = await masterRes.json();
                
                // 2. Fetch the specific deck from your Azure API
                const deckRes = await fetch(`https://api.happybush-e43d89b2.eastus.azurecontainerapps.io/api/mongodb/DeckListMongoDb/${deckId}`);
                if (!deckRes.ok) throw new Error("DECK_NOT_FOUND");
                const deckData = await deckRes.json();

                // 3. HYDRATION: Link your saved data to the master images
                // This handles both full objects AND the "Thin ID" approach
                const hydratedMain = deckData.mainDeck.map(savedItem => {
                    const idToMatch = savedItem.id || savedItem; 
                    const match = masterData.data.find(m => String(m.id) === String(idToMatch));
                    
                    return match ? {
                        ...match,
                        instanceId: Math.random(), // Unique key for rendering
                        image: match.card_images[0].image_url_small
                    } : null;
                }).filter(Boolean);

                setDeck({ ...deckData, mainDeck: hydratedMain });
            } catch (error) {
                console.error("ARCHIVE_ACCESS_ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDeckData();
    }, [deckId]);

    if (loading) return (
        <div className="md-theme-bg min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <Spinner animation="border" variant="info" />
            <h5 className="text-info mt-3" style={{fontFamily: 'Cascadia Mono'}}>SYNCHRONIZING_WITH_AZURE_DATABASE...</h5>
        </div>
    );

    if (!deck) return <div className="md-theme-bg text-danger p-5">ERROR: DECK_DATA_CORRUPTED_OR_MISSING</div>;

    return (
        <div className="md-theme-bg min-vh-100 py-5 mt-5">
            <Container>
                {/* Deck Info Header */}
                <div className="md-panel p-4 mb-4 border-info">
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="text-info m-0" style={{ fontFamily: 'Cascadia Mono' }}>
                                {deck.title?.toUpperCase() || "UNNAMED_DECK"}
                            </h2>
                            <p className="text-muted m-0 small">FILE_PATH: ROOT/DECKS/{deck.id}</p>
                        </Col>
                        <Col xs="auto">
                            <Button as={Link} to="/profile" className="md-btn-outline">
                                BACK_TO_PROFILE
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row>
                    {/* Reusing your CustomDeck component to maintain the same UI/UX */}
                    <Col md={12} className="md-panel p-4">
                        <h5 className="text-white mb-4" style={{letterSpacing: '1px'}}>
                            MAIN_DECK_MANIFEST ({deck.mainDeck.length}/60)
                        </h5>
                        <div className="deck-scroll-container">
                            <CustomDeck cardList={deck.mainDeck} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}