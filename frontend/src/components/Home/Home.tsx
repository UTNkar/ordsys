import React from 'react';
import { Container } from "@mui/material";

import HomeRow from "./HomeRow";
import { ReactComponent as BeerIcon } from "../../assets/icons/beer.svg";
import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
import { ReactComponent as GlassIcon } from "../../assets/icons/glass.svg";
import { ReactComponent as HistoryIcon } from "../../assets/icons/history.svg";
import { ReactComponent as PickupIcon } from "../../assets/icons/pickup.svg";
import { ReactComponent as PotIcon } from "../../assets/icons/pot.svg";
import { ReactComponent as TakeAwayIcon } from "../../assets/icons/take-away.svg";
import { ReactComponent as WaiterIcon } from "../../assets/icons/waiter.svg";

const orderLinks = [
    {
        to: "/bar",
        label: "Bar",
        icon: GlassIcon,
    },
    {
        to: "/waiter",
        label: "Waiter",
        icon: WaiterIcon,
    },
];

const deliveryLinks = [
    {
        to: "/kitchen",
        label: "Kitchen",
        icon: PotIcon,
    },
    {
        to: "/tap",
        label: "Tap",
        icon: BeerIcon,
    },
    {
        to: "/delivery",
        label: "Delivery",
        icon: TakeAwayIcon,
    },
];

const overviewLinks = [
    {
        to: "/pickup",
        label: "Pickup",
        icon: PickupIcon,
    },
    {
        to: "/statistics",
        label: "Statistics",
        icon: ChartIcon,
    },
    {
        to: "/history",
        label: "History",
        icon: HistoryIcon,
    },
];

function Home() {
    return (
        <Container maxWidth="md" sx={{ paddingY: 4 }}>
            <HomeRow title="Ordering" links={orderLinks} />
            <HomeRow title="Fulfilling/Delivery" links={deliveryLinks} />
            <HomeRow title="Overview" links={overviewLinks} />
        </Container>
    );
}

export default Home
