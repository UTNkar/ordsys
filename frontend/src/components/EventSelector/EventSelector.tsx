import React, { useEffect, useRef, useState } from 'react';
import { Button as MuiButton, CircularProgress, TextField } from '@material-ui/core';
import Autocomplete, { AutocompleteInputChangeReason, createFilterOptions } from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete/useAutocomplete';
import { useSnackbar } from 'notistack';
import './EventSelector.scss';
import FormContainer from '../FormContainer/FormContainer';
import { DjangoBackend } from '../../api/DjangoBackend';
import { setEvent } from '../../utils/event';
import { AxiosResponse } from 'axios';
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

function getDescriptiveErrorMessage(response: AxiosResponse) {
    if (response !== undefined && response.status >= 500) {
        return  'An internal server error occurred, please try again'
    } else {
        return 'An unknown error occurred, please try again'
    }
}

function renderSubmitButtonChildren(isCreatingEvent: boolean, event: EventOption | null) {
    if (isCreatingEvent) {
        return <CircularProgress size='1.6rem' />
    } else if (event?.inputValue) {
        return 'Create event'
    } else {
        return 'Confirm event'
    }
}

interface EventSelectorProps {
    isEditingEvent: boolean
    onEditCancel: () => void
    onEventChosen: () => void
}

interface EventOption extends Event {
    inputValue?: string
}

function EventSelector({ isEditingEvent, onEditCancel, onEventChosen }: EventSelectorProps) {
    const [events, setEvents] = useState<EventOption[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventOption | null>(null)
    const [isCreatingEvent, setIsCreatingEvent] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [eventInput, setEventInput] = useState('')

    const eventSelectorFieldRef = useRef<HTMLInputElement | null>(null)
    const { enqueueSnackbar } = useSnackbar()
    const filter = createFilterOptions<EventOption>()

    useEffect(() => {
        DjangoBackend.get<Event[]>('/api/events/')
            .then(response => {
                setEvents(response.data)
                setIsLoadingData(false)
                eventSelectorFieldRef?.current?.focus()
            })
            .catch(reason => enqueueSnackbar(getDescriptiveErrorMessage(reason.response), {
                variant: 'error',
            }))
        // We only want this to once so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onEventInputChange(event: React.ChangeEvent<{}>, newValue: string, reason: AutocompleteInputChangeReason) {
        switch (reason) {
            case 'input':
                setEventInput(newValue)
                setSelectedEvent(null)
                break
            /*
              User either selected an event in the dropdown or started typing after previously selecting one.
              If they had previously selected one, the reason is still 'reset' with newValue of ''.
              Don't update state if that's the case.
             */
            case 'reset':
                if (newValue !== '') {
                    setEventInput(newValue)
                }
                break
            // User clicked the 'X' at the end of the field
            case 'clear':
                setEventInput(newValue)
                break
        }
    }

    function onEventSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // Selected event is always non-null when this function is called (ensured by disabling submit if null)
        if (selectedEvent?.inputValue) {
            // User wants to create a new event
            setIsCreatingEvent(true)
            DjangoBackend.post<Event>('/api/events/', { name: selectedEvent.inputValue })
                .then(response => {
                    setEvent(response.data)
                    enqueueSnackbar(`Created event '${response.data.name}'`, {
                        autoHideDuration: 2000,
                        variant: 'success',
                    })
                    onEventChosen()
                })
                .catch(reason => {
                    setIsCreatingEvent(false)
                    enqueueSnackbar(getDescriptiveErrorMessage(reason.response), {
                        variant: 'error',
                    })
                })
        } else {
            // User selected an existing event.
            setEvent(selectedEvent as Event)
            onEventChosen()
        }
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
            <form noValidate autoComplete="off" onSubmit={onEventSubmit}>
                <Autocomplete
                    autoHighlight
                    className="my-4"
                    clearOnBlur={false}
                    disabled={isLoadingData}
                    filterOptions={(events, params) => filterEvents(filter, events, params)}
                    freeSolo
                    fullWidth
                    getOptionLabel={getEventOptionLabel}
                    inputValue={eventInput}
                    onChange={(e, newValue) => setSelectedEvent(newValue as Event)}
                    onInputChange={onEventInputChange}
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
                    disabled={selectedEvent === null || isLoadingData || isCreatingEvent}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    {renderSubmitButtonChildren(isCreatingEvent, selectedEvent)}
                </MuiButton>
                {!isEditingEvent
                    ? null
                    : <MuiButton
                        className='mt-4'
                        color='default'
                        fullWidth
                        hidden={!isEditingEvent}
                        onClick={onEditCancel}
                        size='large'
                        type='button'
                        variant='outlined'
                    >
                        Cancel edit
                    </MuiButton>
                }
            </form>
        </FormContainer>
    );
}

export default EventSelector
