import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton } from '@material-ui/core';
import './Statistics.scss';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order } from '../../@types';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useSnackbar } from 'notistack';

function Statistics() {
    const [startDate, setStartDate] = useState(new Date(Date.now()-3600*24*1000))
    const [endDate, setEndDate] = useState(new Date())
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [chartOptions, setChartOptions] = useState({})
    const { enqueueSnackbar } = useSnackbar()


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
        let hasValue = false;
        DjangoBackend.get<Order[]>('/api/orders_with_order_items/?younger_than='
            +startDate.toISOString()+'&older_than='+endDate.toISOString())
            .then(orders => {
                const dataPoints: { label: string, y: number }[] = []
                orders.data.forEach(order => {
                    hasValue = true;
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
                if (!hasValue)
                    enqueueSnackbar('No orders found for the selected interval.', {
                        variant: 'info',
                    })
                setChartOptions({
                    animationEnabled: true,
                    exportEnabled: true,
                    data: [{
                        type: 'bar',
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
            <Row className="justify-content-center">
                <Col
                    className="col-auto w-75"
                    // @ts-ignore
                    align="center"
                >
                    <h2 className="pr-2 pt-2 align-self-center">Order Statistics</h2>
                    <form noValidate autoComplete="off" onSubmit={onDateSubmit}>
                        <Row
                            className='w-50 justify-content-between statistics-input-row'
                        >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    // @ts-ignore
                                    value={startDate}
                                    // @ts-ignore
                                    onChange={setStartDate}
                                    ampm={false}
                                    disabled={isLoadingData}
                                    minutesStep={5}
                                    showTodayButton={true}
                                    label={"Start date"}
                                    helperText={"The date and time to filter from"}
                                />
                                <DateTimePicker
                                    // @ts-ignore
                                    value={endDate}
                                    // @ts-ignore
                                    onChange={setEndDate}
                                    ampm={false}
                                    disabled={isLoadingData}
                                    minutesStep={5}
                                    showTodayButton={true}
                                    label={"End date"}
                                    helperText={"The date and time to filter to"}
                                />
                            </MuiPickersUtilsProvider>
                        </Row>
                        <MuiButton
                            className="statistics-submit"
                            color="primary"
                            disabled={isLoadingData}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {isLoadingData ? 'Crunching the data...' : 'Load selected interval'}
                        </MuiButton>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col>
                        <CanvasJSChart options={chartOptions} />
                </Col>
            </Row>
        </Container>
    );
}
export default Statistics
