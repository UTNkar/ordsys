import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import './Home.scss';
import IconButton from './IconButton';

function Home() {
    return (
        <Container className="flex-grow-1 h-100">
            <Row className="align-items-center home-buttons h-100">
                <Col
                    className="mx-5 p-0 border border-dark rounded"
                    // @ts-ignore
                    align="center"
                >
                    <Link to='/bar'>
                        <IconButton iconUrl='/assets/images/glass.svg' text='Bar' />
                    </Link>
                </Col>
                <Col
                    className="mx-5 p-0 border border-dark rounded"
                    // @ts-ignore
                    align="center"
                >
                    <Link to='/kitchen'>
                        <IconButton iconUrl='/assets/images/pot.svg' text='Kitchen' />
                    </Link>
                </Col>
                <Col
                    className="mx-5 p-0 border border-dark rounded"
                    // @ts-ignore
                    align="center"
                >
                    <Link to='/tap'>
                        <IconButton iconUrl='/assets/images/beer.svg' text='Tap' />
                    </Link>
                </Col>
                <Col
                    className="mx-5 p-0 border border-dark rounded"
                    // @ts-ignore
                    align="center"
                >
                    <Link to='/statistics'>
                        <IconButton iconUrl='/assets/images/chart.svg' text='Statistics' />
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}

export default Home
