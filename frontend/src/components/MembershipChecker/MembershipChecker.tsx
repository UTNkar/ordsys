import React, { useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button as MuiButton, CircularProgress, TextField } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { UtnMembership, UtnMembershipResponse } from '../../api/UtnMembership';
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

/**
 * Valid Swedish personal IDs are:
 * - YYMMDDXXXX
 * - YYMMDD-XXXX
 * - YYYYMMDDXXXX
 * - YYYYMMDD-XXXX
 *
 * The regex tests for 6 or 8 digits, followed by an optional -, followed by 4 digits
 */
const personalIdRegex = /^(\d{6}|\d{8})-?\d{4}$/

function MembershipChecker() {

    const [isCheckingPersonalId, setIsCheckingPersonalId] = useState(false)
    const [isInvalidPersonalId, setIsInvalidPersonalId] = useState(false)
    const [isMember, setIsMember] = useState<boolean | undefined>(undefined)

    const { enqueueSnackbar } = useSnackbar();
    const personalIdInputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null)
    const [personalId, setPersonalId] = useState('')

    function validateUtnMembership(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!personalIdRegex.test(personalId)) {
            setIsInvalidPersonalId(true)
            return
        }
        setIsCheckingPersonalId(true)
        UtnMembership.post<UtnMembershipResponse>('/member_check_api/', `ssn=${personalId}`)
            .then(response => {
                setPersonalId('')
                setIsMember(response.data.is_member)
                personalIdInputRef.current?.focus()
                // Show the result colour for 2500 ms before resetting to original state
                setTimeout(() => setIsMember(undefined), 2500)
            })
            .catch(reason => {
                if (reason.response !== undefined) {
                    setIsInvalidPersonalId(true)
                } else {
                    enqueueSnackbar('A network error occurred, check your internet connection', {
                        variant: 'error'
                    })
                }
            })
            .finally(() => setIsCheckingPersonalId(false))
    }

    return (
        <form noValidate onSubmit={validateUtnMembership}>
            <Row className='justify-content-between' noGutters xl={2} lg={1}>
                <Col xl={6} className='d-flex justify-content-center'>
                    <TextField
                        error={isInvalidPersonalId}
                        helperText={isInvalidPersonalId ? 'Not a valid personal ID' : ' '}
                        inputRef={personalIdInputRef}
                        size='small'
                        label='Swedish personal ID'
                        onChange={e => {
                            if (isInvalidPersonalId || isMember) {
                                // Clear invalid personal ID error and unset membership status on new input
                                setIsInvalidPersonalId(false)
                                setIsMember(undefined)
                            }
                            setPersonalId(e.target.value)
                        }}
                        type='text'
                        value={personalId}
                        variant='outlined'
                    />
                </Col>
                <Col xl={6} className='d-flex justify-content-center'>
                    {renderPersonalIdSubmit(isCheckingPersonalId, isInvalidPersonalId, isMember)}
                </Col>
            </Row>
        </form>
    )
}

export default MembershipChecker
