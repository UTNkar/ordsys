import React, { PropsWithChildren } from 'react';
import { Container, Col, Row }  from 'react-bootstrap';
import './FormContainer.scss';

function FormContainer({ children }: PropsWithChildren<{}>) {
    return (
        <Container fluid className="d-flex flex-column justify-content-center flex-grow-1 form-container">
            <Row className="align-self-center form-row">
                <Col className="form-column">
                    { children }
                </Col>
            </Row>
        </Container>
    );
}

export default FormContainer
