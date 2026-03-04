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
import Login from './components/Login';
import NavbarYGO from './components/NavbarYGO';
import Home from './components/Home'

function App(deck) {


  return (
    <>
    <NavbarYGO></NavbarYGO>
    
    <DecksProvider>
      <Home></Home>
    </DecksProvider>
    </>
  );
  
}

export default App;
