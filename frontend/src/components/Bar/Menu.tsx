import React from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import './Menu.scss';
import { MenuItem } from '../../@types';

interface MenuProps {
    menuItems: MenuItem[]
    onMenuItemClick: (item: MenuItem) => void
}

function Menu({ menuItems, onMenuItemClick }: MenuProps) {
    return (
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
    );
}

export default Menu
