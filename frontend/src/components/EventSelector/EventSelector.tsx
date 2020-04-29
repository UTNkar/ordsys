import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './EventSelector.scss';
import { DjangoBackend } from '../../api/DjangoBackend';
import { setEvent } from '../../utils/event';
import { Event } from '../../@types';

function getEventOptionLabel(option: string | Event) {
    if (typeof option === 'string') {
        return option
    } else {
        return option.name
    }
}

interface EventSelectorProps extends RouteComponentProps {}

function EventSelector({ history }: EventSelectorProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const eventSelectorFieldRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        DjangoBackend.get<Event[]>('/api/events/')
            .then(response => {
                setEvents(response.data)
                setIsLoading(false)
                eventSelectorFieldRef?.current?.focus()
            })
            .catch(reason => console.log(reason.response))
    }, [])

    function onEventSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // Selected event is always non-null when this function is called (ensured by disabling submit if null)
        setEvent(selectedEvent as Event)
        history.push('/')
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
            <Row className="align-self-center event-selector-form-row">
                <Col>
                    <form noValidate autoComplete="off" onSubmit={onEventSubmit}>
                        <Autocomplete
                            autoHighlight
                            className="my-4"
                            clearOnBlur={false}
                            disabled={isLoading}
                            freeSolo
                            fullWidth
                            getOptionLabel={getEventOptionLabel}
                            onChange={(e, newValue) => setSelectedEvent(newValue as Event)}
                            openOnFocus
                            options={events}
                            renderOption={option => option.name}
                            renderInput={props =>
                                <TextField
                                    {...props}
                                    inputRef={eventSelectorFieldRef}
                                    label="Search for an event"
                                    variant="outlined"
                                />
                            }
                            value={selectedEvent}
                        />
                        <MuiButton
                            className="mt-2"
                            color="primary"
                            disabled={selectedEvent === null || isLoading}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Confirm event
                        </MuiButton>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default EventSelector
