import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import './Home.scss';
import IconButton from './IconButton';

function Home() {
    interface ButtonProps {
        link: string
        iconUrl: string,
        buttonText: string
    }

    function Button({ link, iconUrl, buttonText }: ButtonProps) {
        return (
            <Col xs={4} md={2} className="home-button">
                <Link to={link}>
                    <IconButton iconUrl={"/assets/images/" + iconUrl} text={buttonText} />
                </Link>
            </Col>
        )
    }
    return (
        <Container className="home-buttons-container">
            <p className="home-buttons-row-header">Ordering</p>
            <Row xs={2} className="home-buttons-row">
                <Button iconUrl='glass.svg' buttonText='Bar' link='/bar' />
                <Button iconUrl='waiter.svg' buttonText='Waiter' link='/waiter' />
            </Row>

            <p className="home-buttons-row-header">Fullfilling/Delivery</p>
            <Row xs={2} md={3} className="home-buttons-row">
                <Button iconUrl='pot.svg' buttonText='Kitchen' link='/kitchen' />
                <Button iconUrl='beer.svg' buttonText='Tap' link='/tap' />
                <Button iconUrl='take-away.svg' buttonText='Delivery' link='/bar' />
            </Row>

            <p className="home-buttons-row-header">History</p>
            <Row xs={2} md={3} className="home-buttons-row">
                <Button iconUrl='chart.svg' buttonText='Statistics' link='/statistics' />
                <Button iconUrl='history.svg' buttonText='Order History' link='/history' />
            </Row>
        </Container>
    );
}

export default Home
