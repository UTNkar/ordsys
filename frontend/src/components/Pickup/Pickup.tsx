import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useWebSocket, WebSocketPath } from '../../hooks';
import './Pickup.scss';
import PickupOrders from './PickupOrders';
import { DjangoBackend } from '../../api/DjangoBackend';
import { orderDescSorter } from '../../utils/sorters';
import { onOrdersChange } from '../../utils/realtimeModelUpdate';
import { DatabaseChangeType, Order, OrderStatus } from '../../@types';


function Pickup() {
    const [orders, setOrders] = useState<Order[]>([])

    const componentIsMounted = useRef(true)
    const networkErrorSnackbarKey = useRef<SnackbarKey | null>(null)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const { sendJsonMessage } = useWebSocket({
        shouldReconnect: () => componentIsMounted.current,
        onOpen: () => {
            const currentNetworkErrorKey = networkErrorSnackbarKey.current
            if (currentNetworkErrorKey !== null) {
                // Re-fetch all data from the database if WebSocket was disconnected
                fetchOrders()
                closeSnackbar(currentNetworkErrorKey)
                networkErrorSnackbarKey.current = null
            }
            sendJsonMessage({ models: ['backend.Order'] })
        },
        onMessage: event => {
            const message = JSON.parse(event.data)
            switch (message.model_name) {
                case 'Order':
                    onOrdersChange(message.payload as Order, message.type as DatabaseChangeType, setOrders)
                    setOrders(prevState => prevState.sort(orderDescSorter))
                    break
                default:
                    break
            }
        },
        onError: () => {
            if (networkErrorSnackbarKey.current === null) {
                networkErrorSnackbarKey.current = enqueueSnackbar(
                    'Network error, please check your internet connection!',
                    {
                        // Disallow manually closing the Snackbar
                        action: () => { },
                        persist: true,
                        preventDuplicate: true,
                        variant: 'error',
                    }
                )
            }
        },
    }, WebSocketPath.MODEL_CHANGES)

    useEffect(() => {
        fetchOrders()
        return function cleanup() {
            componentIsMounted.current = false
            closeSnackbar()
        }
        // We only want this to once so ignore the eslint warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function fetchOrders() {
        let orderQuery = `/api/orders/?exclude_status=${OrderStatus.DELIVERED}`;
        Promise.all([
            DjangoBackend.get<Order[]>(orderQuery),
        ])
            .then(([orders]) => {
                setOrders(orders.data.sort(orderDescSorter))
            })
            .catch(reason => console.log(reason.response))
    }


    return (
        <Container className="pickup-main-container">
            <Row xs={2} className="bar-top">
                <Col xs={7} className="my-2 justify-content-center">
                    <h3 className="pr-2 pt-2 align-self-center">IN PROGRESS</h3>
                </Col>
                <Col xs={5} className="my-2 justify-content-center">
                    <h3 className="pt-2 align-self-center">PICKUP</h3>
                </Col>
            </Row>
            <Row xs={2}>
                <Col xs={7}>
                    <Container className="h-100">
                        <PickupOrders
                            orders={orders}
                            doneCol={false}
                        />
                    </Container>
                </Col>
                <Col xs={5}>
                    <Container className='h-100'>
                        <PickupOrders
                            orders={orders}
                            doneCol={true}
                        />
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Pickup
