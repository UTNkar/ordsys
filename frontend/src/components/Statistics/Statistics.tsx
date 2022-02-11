import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@mui/material';
import './Statistics.scss';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DjangoBackend } from '../../api/DjangoBackend';
import { MenuItem, Order } from '../../@types';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { subDays } from 'date-fns';
import { sv } from "date-fns/locale";
import { useSnackbar } from 'notistack';

const DATE_TIME_PICKER_COMMON_PROPS = Object.freeze({
    mask: "____-__-__ __:__",
    disableFuture: true,
    minutesStep: 5,
    showTodayButton: true,
});

function Statistics() {
    const [endDate, setEndDate] = useState(new Date())
    const [startDate, setStartDate] = useState(subDays(endDate, 1));
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
                            className='w-75 justify-content-between my-4'
                        >
                            <LocalizationProvider dateAdapter={DateFnsUtils} locale={sv}>
                                <DateTimePicker
                                    {...DATE_TIME_PICKER_COMMON_PROPS}
                                    value={startDate}
                                    // @ts-ignore
                                    onChange={setStartDate}
                                    disabled={isLoadingData}
                                    maxDateTime={endDate}
                                    label={"Start date"}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            helperText="The date and time to filter from"
                                            variant="outlined"
                                        />
                                    )}
                                />
                                <DateTimePicker
                                    {...DATE_TIME_PICKER_COMMON_PROPS}
                                    value={endDate}
                                    // @ts-ignore
                                    onChange={setEndDate}
                                    disabled={isLoadingData}
                                    label={"End date"}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            helperText="The date and time to filter to"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </LocalizationProvider>
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
