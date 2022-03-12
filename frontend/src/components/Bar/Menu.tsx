import React from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import './Menu.scss';
import { MenuItem } from '../../@types';
import { useActiveMenuItems } from "../../hooks";

interface MenuProps {
    onMenuItemClick: (item: MenuItem) => void
}

function Menu({ onMenuItemClick }: MenuProps) {
    const { activeMenuItems } = useActiveMenuItems();

    return (
        activeMenuItems.length ?
        <CardColumns className="menu-items mt-3">
            {activeMenuItems.map(item =>
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
        :   <h5>No menu items found. Are there any?</h5>
    );
}

export default Menu
