import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete/useAutocomplete';
import './EventSelector.scss';
import { DjangoBackend } from '../../api/DjangoBackend';
import { setEvent } from '../../utils/event';
import { Event } from '../../@types';

function getEventOptionLabel(option: string | EventOption) {
    if (typeof option === 'string') {
        return option
    } else if (option.inputValue) {
        return option.inputValue
    } else {
        return option.name
    }
}

function filterEvents(
    filter: (options: EventOption[], params: FilterOptionsState<EventOption>) => EventOption[],
    events: EventOption[],
    params: FilterOptionsState<EventOption>,
) {
    const filteredEvents = filter(events, params)
    if (params.inputValue !== '') {
        // User has input something
        const matchingEvent = filteredEvents.find(event =>
            !event.name.localeCompare(params.inputValue, ['sv', 'en'], { sensitivity: 'accent' })
        )
        if (matchingEvent === undefined) {
            // Add an option to create a new event if no events exactly matches the input
            filteredEvents.push({
                inputValue: params.inputValue,
                name: `Create event "${params.inputValue}"`
            } as EventOption)
        }
    }
    return filteredEvents
}

interface EventSelectorProps {
    onEventChosen: () => void
}

interface EventOption extends Event {
    inputValue?: string
}

function EventSelector({ onEventChosen }: EventSelectorProps) {
    const [events, setEvents] = useState<EventOption[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventOption | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const eventSelectorFieldRef = useRef<HTMLInputElement | null>(null)
    const filter = createFilterOptions<EventOption>()

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
        if (selectedEvent?.inputValue) {
            // User wants to create a new event
            setIsLoading(true)
            DjangoBackend.post<Event>('/api/events/', { name: selectedEvent.inputValue })
                .then(response => {
                    setEvent(response.data)
                    onEventChosen()
                })
                .catch(reason => console.log(reason.response))
        } else {
            // User selected an existing event.
            setEvent(selectedEvent as Event)
            onEventChosen()
        }
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
                            filterOptions={(events, params) => filterEvents(filter, events, params)}
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
                                    label="Search for, or create, an event"
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
                            {!selectedEvent?.inputValue ? 'Confirm event' : 'Create event'}
                        </MuiButton>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default EventSelector
