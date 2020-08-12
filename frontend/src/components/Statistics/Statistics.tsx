import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Statistics.scss';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DjangoBackend } from '../../api/DjangoBackend';
import { Event, MenuItem, Order } from '../../@types';

function Statistics() {
    const [events, setEvents] = useState<Event[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        Promise.all([DjangoBackend.get<Event[]>('/api/events/'), DjangoBackend.get<MenuItem[]>('/api/menu_items/')])
            .then(([events, menuItems]) => {
                setEvents(events.data)
                setMenuItems(menuItems.data)
            })
            .catch(reason => console.log(reason.response))
    }, [])

    function onEventSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoadingData(true)
        DjangoBackend.get<Order[]>(`/api/orders_with_order_items/?event=${selectedEvent?.id}`)
            .then(orders => {
                const dataPoints: { label: string, y: number }[] = []
                orders.data.forEach(order => {
                    order.order_items.forEach(orderItem => {
                        const menuItem = menuItems.find(item => item.id === orderItem.menu) as MenuItem
                        const dataPointIndex = dataPoints.findIndex(item => item.label === menuItem.item_name)
                        if (dataPointIndex === -1) {
                            dataPoints.push({ label: menuItem.item_name, y: orderItem.quantity})
                        } else {
                            dataPoints[dataPointIndex].y += orderItem.quantity
                        }
                    })
                })
                setChartOptions({
                    animationEnabled: true,
                    exportEnabled: false,
                    title: {
                        text: `Breakdown of orders for event "${selectedEvent?.name}"`
                    },
                    data: [{
                        type: 'pie',
                        startAngle: 270,
                        toolTipContent: "<b>{label}</b>: {y} st",
                        showInLegend: true,
                        legendText: '{label}',
                        indexLabelFontSize: 16,
                        indexLabel: '{label} - {y} st',
                        dataPoints,
                    }]
                })
                setSelectedEvent(null)
            })
            .catch(reason => console.log(reason.response))
            .finally(() => setIsLoadingData(false))
    }

    return (
        <Container className="flex-grow-1">
            <Row className="h-25 justify-content-center">
                <Col
                    className="col-auto w-50"
                    // @ts-ignore
                    align="center"
                >
                    <form noValidate autoComplete="off" onSubmit={onEventSubmit}>
                        <Autocomplete
                            autoHighlight
                            className="statistics-event-selector"
                            clearOnBlur={false}
                            disabled={isLoadingData}
                            getOptionLabel={option => option.name}
                            onChange={(e, newValue) => setSelectedEvent(newValue)}
                            options={events}
                            renderOption={option => option.name}
                            renderInput={props =>
                                <TextField
                                    {...props}
                                    label="Search for an event"
                                    variant="outlined"
                                />
                            }
                            value={selectedEvent}
                        />
                        <MuiButton
                            className="statistics-event-submit"
                            color="primary"
                            disabled={selectedEvent === null || isLoadingData}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {isLoadingData ? 'Crunching the data...' : 'Confirm event'}
                        </MuiButton>
                    </form>
                </Col>
            </Row>
            <Row className="h-75">
                <Col>
                    <CanvasJSChart options={chartOptions} />
                </Col>
            </Row>
        </Container>
    );
}

export default Statistics
