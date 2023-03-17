import React, { useState } from "react";
import { Container, Stack, TextField, Typography } from "@mui/material";
import {
  MobileDateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { subDays } from "date-fns";
import sv from "date-fns/locale/sv";

import { CanvasJSChart } from "../../libs/canvasjs.react";
import { useOrderHistory } from "../../hooks";
import { useSnackbar } from "notistack";

const DATE_TIME_PICKER_COMMON_PROPS = Object.freeze({
  mask: "____-__-__ __:__",
  disableFuture: true,
  minutesStep: 5,
  showTodayButton: true,
});

function Statistics() {
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(subDays(endDate, 1));
  const { enqueueSnackbar } = useSnackbar();
  const { getOrderHistory, orderHistory, isFetching } = useOrderHistory();

  function onDateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    getOrderHistory(startDate, endDate).then(({ data, isError, isSuccess }) => {
      if (isSuccess && (!data || data.length === 0)) {
        enqueueSnackbar("No orders found for the selected interval.", {
          variant: "info",
        });
      } else if (isError) {
        enqueueSnackbar("Something went wrong when fetching the orders.", {
          variant: "error",
        });
      }
    });
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Typography
        align="center"
        component="h1"
        fontWeight="bold"
        marginBottom={4}
        variant="h3"
      >
        Order statistics
      </Typography>
      <Stack
        alignItems="center"
        marginBottom={4}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={onDateSubmit}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={sv}>
          <Stack
            spacing={4}
            direction={{ xs: "column", sm: "row" }}
            marginBottom={2}
          >
            <MobileDateTimePicker
              {...DATE_TIME_PICKER_COMMON_PROPS}
              value={startDate}
              // @ts-ignore
              onChange={setStartDate}
              disabled={isFetching}
              maxDateTime={endDate}
              label={"Start date"}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  helperText="The date and time to filter from"
                  variant="outlined"
                />
              )}
            />
            <MobileDateTimePicker
              {...DATE_TIME_PICKER_COMMON_PROPS}
              value={endDate}
              // @ts-ignore
              onChange={setEndDate}
              disabled={isFetching}
              label={"End date"}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  helperText="The date and time to filter to"
                  variant="outlined"
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
        <LoadingButton
          loading={isFetching}
          size="large"
          type="submit"
          variant="contained"
        >
          Load interval
        </LoadingButton>
      </Stack>
      <CanvasJSChart options={orderHistory} />
    </Container>
  );
}
export default Statistics;
