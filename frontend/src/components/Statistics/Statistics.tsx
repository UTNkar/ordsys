import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { Event, MenuItem, Order } from '../../@types';

function Statistics() {
    const [events, setEvents] = useState<Event[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [selectedEventName, setSelectedEventName] = useState('')
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        Promise.all([fetch('http://localhost:8000/api/events/'), fetch('http://localhost:8000/api/menu_items/')])
            .then((responses) => Promise.all([responses[0].json(), responses[1].json()]))
            .then(([events, menuItems]: [Event[], MenuItem[]]) => {
                setEvents(events)
                setMenuItems(menuItems)
                setSelectedEventName(events[0].name ?? '')
            })
            .catch(reason => console.log(reason))
    }, [])

    function onEventIdConfirmed() {
        setIsLoadingData(true)
        const event = events.find(item => item.name === selectedEventName) as Event
        fetch(`http://localhost:8000/api/orders_with_order_items/?event=${event.id}`)
            .then(response => response.json())
            .then((orders: Order[]) => {
                const dataPoints: { label: string, y: number }[] = []
                orders.forEach(order => {
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
            .catch(reason => console.log(reason))
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
