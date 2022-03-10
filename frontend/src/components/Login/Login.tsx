import React, { useState } from 'react';
import {
    Button as MuiButton,
    CircularProgress,
    MenuItem,
    TextField,
} from '@mui/material';
import './Login.scss';
import FlexContainer from '../FlexContainer/FlexContainer';
import { Organisation, User } from '../../@types';
import { useAvailableOrganisations } from "../../hooks";
import { useSignInMutation } from "../../api/backend";

function Login() {
    const {
        organisations,
        isError: isOrganisationFetchError,
        isLoading,
    } = useAvailableOrganisations();
    const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | string>('')
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [
        signIn,
        { isLoading: isSigningIn, error: signInError }
    ] = useSignInMutation();

    function onLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        signIn({ username: selectedUser, password: inputPassword })
    }

    function onOrganisationChange(event: React.ChangeEvent<HTMLInputElement>) {
        // Selecting an organisation always returns the organisation object.
        const selectedOrg = event.target.value as unknown as Organisation
        setSelectedOrganisation(selectedOrg)
        setUsers(selectedOrg.users)
        setSelectedUser(selectedOrg.users[0].username ?? '')
    }

    return (
        <FlexContainer fluid='md'>
            <div
                className="pb-5"
                // @ts-ignore
                align="center"
            >
                <h1>OrdSys</h1>
            </div>
            <form id='login-form' noValidate autoComplete="off" onSubmit={onLoginSubmit}>
                <TextField
                    disabled={organisations.length === 0}
                    error={isOrganisationFetchError}
                    helperText={
                        isOrganisationFetchError && "Could not retrieve organisations"
                    }
                    fullWidth
                    id="organisation-select"
                    label="Organisation"
                    margin="normal"
                    onChange={onOrganisationChange}
                    select
                    value={selectedOrganisation}
                    variant="outlined"
                    SelectProps={{
                        SelectDisplayProps: {
                            style: {
                                cursor: isLoading ? "wait" : undefined,
                            }
                        },
                    }}
                >
                    {organisations.map(org =>
                        // Using objects as value is valid as long as TextField has 'select' prop.
                        <MenuItem key={org.id} value={org as any}>{org.name}</MenuItem>)
                    }
                </TextField>
                <TextField
                    disabled={!selectedOrganisation}
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
                    error={
                        // @ts-ignore
                        signInError?.status === 400}
                    fullWidth
                    // Having an empty string ensures the size of the TextField is constant
                    helperText={
                        // @ts-ignore
                        signInError?.status !== 400 ? ' ' : 'Invalid password'
                    }
                    label="Password"
                    margin="normal"
                    onChange={e => setInputPassword(e.target.value)}
                    type="password"
                    value={inputPassword}
                    variant="outlined"
                />
                <MuiButton
                    className="mt-3 mb-2"
                    color="primary"
                    disabled={inputPassword === '' || isSigningIn}
                    fullWidth
                    size='large'
                    type="submit"
                    variant="contained"
                >
                    {isSigningIn ? <CircularProgress size='1.6rem' /> : 'Sign in'}
                </MuiButton>
            </form>
        </FlexContainer>
    );
}

export default Login
