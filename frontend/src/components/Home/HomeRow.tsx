import {
  Box, Divider, Grid, Typography,
} from '@mui/material';

import HomeButton from './HomeButton';

interface HomeRowProps {
  title: string
  links: { to: string, label: string, icon: React.ElementType }[]
}

export default function HomeRow({ title, links }: HomeRowProps) {
  const labelId = `${title.replace(/[/ ]/g, '-').toLowerCase()}-row-label`;
  return (
    <Box aria-labelledby={labelId} component="nav" marginY={3}>
      <Typography
        id={labelId}
        align="center"
        component="h2"
        variant="h4"
      >
        {title}
      </Typography>
      <Divider sx={{ marginY: 1 }} />
      <Grid container spacing={3} justifyContent="center" columns={30}>
        {links.map((link) => (
          <Grid xs={14} sm={9} md={8} key={link.label} item>
            <HomeButton {...link} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
