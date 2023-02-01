import * as React from "react";
import "./sidebar.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const isWeekend = (date) => {
  const day = date.day();
  return day === 5;
};

export const Sidebar = ({ datePickerValue, setDatePickerValue }) => {
  const drawerWidth = 320;

  return (
    <>
<LocalizationProvider dateAdapter={AdapterDayjs}>
    <div
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
        variant="permanent"
        anchor="right"
      >
      <Grid  spacing={3} sx={{
                mt: "10px",
                borderRadius: "25px",
              }}
              bgcolor={"#56a7bc"}>
        <Grid item xs={6} md={2} >
          <CalendarPicker date={datePickerValue} onChange={(newDate) => setDatePickerValue(newDate)} />
        </Grid>
      </Grid>
      </div>
    </LocalizationProvider>
    </>
  );
};
