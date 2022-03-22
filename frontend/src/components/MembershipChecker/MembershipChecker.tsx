import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button as MuiButton, CircularProgress, TextField } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useSnackbar } from 'notistack';

import { useCheckMembershipMutation } from "../../api/utn";
import './MembershipChecker.scss';

function renderPersonalIdSubmit(
    isCheckingPersonalId: boolean,
    isInvalidPersonalId: boolean,
    isMember: boolean | undefined
) {
    // iconSize matches the button text size in order to avoid jerky movements
    const iconSize = '1.62rem'
    let backgroundColor, content
    if (isCheckingPersonalId) {
        backgroundColor = 'inherit'
        content = <CircularProgress size={iconSize} />
    } else if (isMember) {
        backgroundColor = green[300]
        content = 'Is a member'
    } else if (isMember === false) {
        // Explicitly check for 'false' as !isMember is 'true' for both 'false' and 'undefined'
        backgroundColor = red[300]
        content = 'Not a member'
    } else {
        backgroundColor = 'inherit'
        content = 'Check UTN membership'
    }
    return <MuiButton
        disabled={isCheckingPersonalId || isInvalidPersonalId}
        id='personal-id-submit'
        style={{ backgroundColor }}
        type='submit'
        variant='outlined'
    >
        { content }
    </MuiButton>
}

function MembershipChecker() {
    const [
        checkUtnMembership,
        {
            data,
            error,
            isError,
            isLoading,
            isSuccess,
            reset,
        },
    ] = useCheckMembershipMutation();
    const { enqueueSnackbar } = useSnackbar();
    const personalIdInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null)
    const [personalId, setPersonalId] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setPersonalId("");
            personalIdInputRef.current?.focus()
            // Show the result colour for 2500 ms before resetting to original state
            const timeoutId = setTimeout(reset, 2500);

            return () => clearTimeout(timeoutId);
        }
    }, [enqueueSnackbar, isSuccess, reset]);

    function onCheckMembership(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        checkUtnMembership(personalId);
    }

    return (
        <form noValidate onSubmit={onCheckMembership}>
            <Row className='justify-content-between' noGutters xl={2} lg={1}>
                <Col xl={6} className='d-flex justify-content-center'>
                    <TextField
                        error={isError}
                        helperText={!isError
                            ? "YYYYMMDD-XXXX"
                            : typeof error === "boolean"
                                ? "Not a valid personal ID."
                                : "Network error."
                        }
                        inputRef={personalIdInputRef}
                        size='small'
                        label='Swedish personal ID'
                        onChange={e => {
                            reset();
                            setPersonalId(e.target.value)
                        }}
                        type='text'
                        value={personalId}
                        variant='outlined'
                    />
                </Col>
                <Col xl={6} className='d-flex justify-content-center'>
                    {renderPersonalIdSubmit(isLoading, isError, data?.is_member)}
                </Col>
            </Row>
        </form>
    )
}

export default MembershipChecker
