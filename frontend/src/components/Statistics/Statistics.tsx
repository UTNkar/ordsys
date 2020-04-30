import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DjangoBackend } from '../../api/DjangoBackend';
import { Event, MenuItem, Order } from '../../@types';

function Statistics() {
    const [events, setEvents] = useState<Event[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [selectedEventName, setSelectedEventName] = useState('')
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        Promise.all([DjangoBackend.get<Event[]>('/api/events/'), DjangoBackend.get<MenuItem[]>('/api/menu_items/')])
            .then(([events, menuItems]) => {
                setEvents(events.data)
                setMenuItems(menuItems.data)
                setSelectedEventName(events.data[0].name ?? '')
            })
            .catch(reason => console.log(reason.response))
    }, [])

    function onEventIdConfirmed() {
        setIsLoadingData(true)
        const event = events.find(item => item.name === selectedEventName) as Event
        DjangoBackend.get<Order[]>(`/api/orders_with_order_items/?event=${event.id}`)
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
                        text: `Breakdown of orders for event "${selectedEventName}"`
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
                    <Form className="my-3">
                        <Form.Group>
                            <Form.Label>Event ID</Form.Label>
                            <Form.Control
                                as="select"
                                className="text-center"
                                onChange={e => setSelectedEventName(e.target.value)}
                                disabled={events.length === 0}
                                value={selectedEventName}
                            >
                                {events.map(event => <option key={event.id}>{event.name}</option>) }
                            </Form.Control>
                        </Form.Group>
                        <Button
                            variant="outline-primary"
                            disabled={isLoadingData || selectedEventName === ''}
                            onClick={onEventIdConfirmed}
                        >
                            {isLoadingData ? 'Crunching the data...' : 'Create some graphs!'}
                        </Button>
                    </Form>
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
