import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, MenuItem, TextField } from '@material-ui/core';
import './Login.scss';

function Login() {
    return (
        <Container fluid className="d-flex flex-column justify-content-center flex-grow-1">
            <Row>
                <Col
                    className="pb-5"
                    // @ts-ignore
                    align="center"
                >
                    <h1>OrdSys</h1>
                </Col>
            </Row>
            <Row className="align-self-center login-form-row">
                <Col className="w-100">
                    <form noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Organisation"
                            margin="normal"
                            select
                            variant="outlined"
                        >
                            <MenuItem>Organisation 1</MenuItem>
                            <MenuItem>Organisation 2</MenuItem>
                            <MenuItem>Organisation 3</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="User"
                            margin="normal"
                            select
                            variant="outlined"
                        >
                            <MenuItem>User 1</MenuItem>
                            <MenuItem>User 2</MenuItem>
                            <MenuItem>User 3</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Password"
                            margin="normal"
                            type="password"
                            variant="outlined"
                        />
                        <MuiButton
                            className="mt-4 mb-2"
                            color="primary"
                            fullWidth
                            size='large'
                            type="submit"
                            variant="contained"
                        >
                            Sign in
                        </MuiButton>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login
