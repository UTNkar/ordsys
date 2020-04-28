import React from 'react';
import { Card, CardColumns, Col, Container, Row } from 'react-bootstrap';
import './Menu.scss';
import { MenuItem } from '../../@types';

interface MenuProps {
    mealNote: string
    menuItems: MenuItem[]
    onMealNoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onMenuItemClick: (item: MenuItem) => void
}

function Menu({ mealNote, menuItems, onMealNoteChange, onMenuItemClick }: MenuProps) {
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
                                onClick={() => onMenuItemClick(item)}
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
