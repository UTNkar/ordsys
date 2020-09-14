import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import './Home.scss';
import IconButton from './IconButton';

function Home() {
    return (
        <Container className="home-buttons-container">
            <Row xs={2} md={3} className="home-buttons-row">
                <Col xs={5} md={3} className="home-button">
                    <Link to='/bar'>
                        <IconButton iconUrl='/assets/images/glass.svg' text='Bar' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/delivery'>
                        <IconButton iconUrl='/assets/images/take-away.svg' text='Delivery' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/history'>
                        <IconButton iconUrl='/assets/images/history.svg' text='Order History' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/kitchen'>
                        <IconButton iconUrl='/assets/images/pot.svg' text='Kitchen' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/tap'>
                        <IconButton iconUrl='/assets/images/beer.svg' text='Tap' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/statistics'>
                        <IconButton iconUrl='/assets/images/chart.svg' text='Statistics' />
                    </Link>
                </Col>
                <Col xs={5} md={3} className="home-button">
                    <Link to='/waiter'>
                        <IconButton iconUrl='/assets/images/waiter.svg' text='Waiter' />
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Home
