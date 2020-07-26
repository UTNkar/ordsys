import React, { useEffect, useState } from 'react';
import { Button as MuiButton, CircularProgress, MenuItem, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import './Login.scss';
import FormContainer from '../FormContainer/FormContainer';
import { DjangoBackend } from '../../api/DjangoBackend';
import { logIn } from '../../utils/authenticationHelper';
import { AxiosResponse } from 'axios';
import { Organisation, User } from '../../@types';

function getDescriptiveErrorMessage(response: AxiosResponse) {
    if (response !== undefined && response.status >= 500) {
        return 'An internal server error occurred, please try again'
    } else {
        return 'An unknown error occurred, please try again'
    }
}

interface LoginProps {
    onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
    const [organisations, setOrganisations] = useState<Organisation[]>([])
    const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | string>('')
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState('')
    const [inputPassword, setInputPassword] = useState({
        isValid: true,
        value: '',
    })
    const [authenticationInProgress, setAuthenticationInProgress] = useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        DjangoBackend.get<Organisation[]>('/api/organisations_with_users/')
            .then(response => setOrganisations(response.data))
            .catch(reason => enqueueSnackbar(getDescriptiveErrorMessage(reason.response), {
                variant: 'error'
            }))
        // We only want this to once so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        closeSnackbar()
        setAuthenticationInProgress(true)
        logIn(selectedOrganisation as Organisation, selectedUser, inputPassword.value)
            .then(() => {
                enqueueSnackbar('Successfully signed in!', {
                    autoHideDuration: 2500,
                    variant: 'success',
                })
                onLogin()
            })
            .catch(reason => {
                const response = reason.response
                setAuthenticationInProgress(false)
                if (response !== undefined && response.status === 400) {
                    setInputPassword({
                        isValid: false,
                        value: '',
                    })
                } else {
                    enqueueSnackbar(getDescriptiveErrorMessage(response), {
                        variant: 'error',
                    })
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
        <FormContainer>
            <div
                className="pb-5"
                // @ts-ignore
                align="center"
            >
                <h1>OrdSys</h1>
            </div>
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
                    disabled={inputPassword.value === '' || authenticationInProgress}
                    fullWidth
                    size='large'
                    type="submit"
                    variant="contained"
                >
                    {authenticationInProgress ? <CircularProgress size='1.6rem' /> : 'Sign in'}
                </MuiButton>
            </form>
        </FormContainer>
    );
}

export default Login
