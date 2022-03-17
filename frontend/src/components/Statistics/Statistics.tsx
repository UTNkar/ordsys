import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Button as MuiButton, TextField } from '@mui/material';
import './Statistics.scss';
import { CanvasJSChart } from '../../libs/canvasjs.react';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { subDays } from 'date-fns';
import { sv } from "date-fns/locale";
import { useSnackbar } from 'notistack';
import { useOrderHistory } from "../../hooks";

const DATE_TIME_PICKER_COMMON_PROPS = Object.freeze({
    mask: "____-__-__ __:__",
    disableFuture: true,
    minutesStep: 5,
    showTodayButton: true,
});

function Statistics() {
    const [endDate, setEndDate] = useState(new Date())
    const [startDate, setStartDate] = useState(subDays(endDate, 1));
    const { enqueueSnackbar } = useSnackbar()
    const { getOrderHistory, orderHistory, isFetching } = useOrderHistory();

    function onDateSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        getOrderHistory(startDate, endDate)
            .then(({ data, isError, isSuccess }) => {
                if (isSuccess && (!data || data.length === 0)) {
                    enqueueSnackbar('No orders found for the selected interval.', {
                        variant: 'info',
                    });
                } else if (isError) {
                    enqueueSnackbar('Something went wrong when fetching the orders.', {
                        variant: 'error',
                    })
                }
            });
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
                                    disabled={isFetching}
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
                                    disabled={isFetching}
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
                            disabled={isFetching}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {isFetching ? 'Crunching the data...' : 'Load selected interval'}
                        </MuiButton>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col>
                        <CanvasJSChart options={orderHistory} />
                </Col>
            </Row>
        </Container>
    );
}
export default Statistics
