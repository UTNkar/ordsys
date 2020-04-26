import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, MenuItem, TextField } from '@material-ui/core';
import './Login.scss';
import { DjangoBackend } from '../../api/DjangoBackend';
import { logIn } from '../../utils/authenticationHelper';
import { AxiosResponse } from 'axios';
import { Organisation, User } from '../../@types';

function handleNetworkError(response: AxiosResponse) {
    if (response !== undefined && response.status >= 500) {
        alert('A server error occurred, please try again later.')
    }
    else {
        alert('An unknown error occurred, please try again later.')
    }
}

function Login({ history }: RouteComponentProps) {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | string>('')
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState('')
    const [inputPassword, setInputPassword] = useState({
        isValid: true,
        value: '',
    })

    useEffect(() => {
        DjangoBackend.get<Organisation[]>('/api/organisations_with_users/')
            .then(response => setOrganisations(response.data))
            .catch(reason => console.log(reason.response))
    }, [])

    function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        logIn(selectedUser, inputPassword.value)
            .then(() => history.push('/'))
            .catch(reason => {
                const response = reason.response
                if (response !== undefined && response.status === 400) {
                    setInputPassword({
                        isValid: false,
                        value: '',
                    })
                } else {
                    handleNetworkError(response)
                }
            })
    }

    function onOrganisationChange(event: React.ChangeEvent<HTMLInputElement>) {
        // Selecting an organisation always returns the organisation object.
        const selectedOrg = event.target.value as unknown as Organisation
        setSelectedOrganisation(selectedOrg)
        setUsers(selectedOrg.users)
        setSelectedUser(selectedOrg.users[0].username ?? '')
    }

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
                    <form noValidate autoComplete="off" onSubmit={onLoginSubmit}>
                        <TextField
                            disabled={organisations.length === 0}
                            fullWidth
                            id="organisation-select"
                            label="Organisation"
                            margin="normal"
                            onChange={onOrganisationChange}
                            select
                            value={selectedOrganisation}
                            variant="outlined"
                        >
                            {organisations.map(org =>
                                // Using objects as value is valid as long as TextField has 'select' prop.
                                <MenuItem key={org.id} value={org as any}>{org.name}</MenuItem>)
                            }
                        </TextField>
                        <TextField
                            disabled={selectedOrganisation === ''}
                            fullWidth
                            id="user-select"
                            label="User"
                            margin="normal"
                            onChange={e => setSelectedUser(e.target.value)}
                            select
                            value={selectedUser}
                            variant="outlined"
                        >
                            {users.map(user =>
                                <MenuItem key={user.id} value={user.username}>{user.username}</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            disabled={selectedUser === ''}
                            error={!inputPassword.isValid}
                            fullWidth
                            // Having an empty string ensures the size of the TextField is constant
                            helperText={inputPassword.isValid ? ' ' : 'Invalid password'}
                            label="Password"
                            margin="normal"
                            onChange={e => setInputPassword({ isValid: true, value: e.target.value })}
                            type="password"
                            value={inputPassword.value}
                            variant="outlined"
                        />
                        <MuiButton
                            className="mt-3 mb-2"
                            color="primary"
                            disabled={inputPassword.value === ''}
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
