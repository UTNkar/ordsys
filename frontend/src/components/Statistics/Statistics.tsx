import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@material-ui/core';
import './Statistics.scss';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order } from '../../@types';

function Statistics() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        Promise.all([DjangoBackend.get<MenuItem[]>('/api/menu_items/')])
            .then(([menuItems]) => {
                setMenuItems(menuItems.data)
            })
            .catch(reason => console.log(reason.response))
    }, [])

    function onDateSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoadingData(true)
        DjangoBackend.get<Order[]>(`/api/orders_with_order_items/`)
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
                        text: `Breakdown of orders for organisation`
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
                    <form noValidate autoComplete="off" onSubmit={onDateSubmit}>
                        <MuiButton
                            className="statistics-event-submit"
                            color="primary"
                            disabled={isLoadingData}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {isLoadingData ? 'Crunching the data...' : 'Load selected date'}
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
