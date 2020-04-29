import { Event } from '../@types';

const eventIdKey = 'eventId'
const eventNameKey = 'eventName'

/**
 * Checks if an event is registered for the current session.
 */
export function hasEvent(): boolean {
    return sessionStorage.getItem(eventIdKey) !== null
}

/**
 * Gets the event ID for the current session.
 */
export function getEventId(): number {
    return Number(sessionStorage.getItem(eventIdKey))
}

/**
 * Gets the event name for the current session.
 */
export function getEventName(): string | null {
    return sessionStorage.getItem(eventNameKey)
}

/**
 * Sets the current event for the current session.
 */
export function setEvent(event: Event) {
    sessionStorage.setItem(eventIdKey, String(event.id))
    sessionStorage.setItem(eventNameKey, event.name)
}
