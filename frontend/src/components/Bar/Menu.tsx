import React, { useEffect, useState } from 'react';
import { Card, CardColumns, Col, Container, Row } from 'react-bootstrap';
import './Menu.scss';
import { MenuItem } from '../../@types';

interface MenuProps {
    mealNote: string
    onMealNoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function Menu({ mealNote, onMealNoteChange }: MenuProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])

    useEffect(() => {
        fetch('http://localhost:8000/api/menu_items/?active=true')
            .then(response => response.json())
            .then(menuItems => setMenuItems(menuItems))
            .catch(reason => console.log(reason.response))
    }, [])

    return (
        <Container className="h-100">
            <Row className="menu align-items-start h-100">
                <Col>
                    <input
                        id='meal-note-input'
                        onChange={onMealNoteChange}
                        placeholder="Modification"
                        value={mealNote}
                        type="text"
                    />
                    <CardColumns className="menu-items mt-3">
                        {menuItems.map(item =>
                            <Card
                                key={item.id}
                                className="menu-card"
                            >
                                <Card.Body>
                                    <Card.Text>{item.item_name}</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </CardColumns>
                </Col>
            </Row>
        </Container>
    );
}

export default Menu
