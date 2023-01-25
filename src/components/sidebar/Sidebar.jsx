import {  useEffect } from "react";
import * as React from "react";
import "./sidebar.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



const isWeekend = (date) => {
  const day = date.day();
  return day === 5;
};

export const Sidebar = ({datePickerValue,setDatePickerValue}) => {
  const drawerWidth = 320;

  useEffect(() => {
    // console.log(datePickerValue);
//     let day = datePickerValue.$d.toLocaleString('en-us', {weekday: 'long'});
// console.log(day +"  " + datePickerValue.$d.getFullYear() + "-" + (datePickerValue.$d.getMonth()+1) + "-" + datePickerValue.$d.getDate());
    // console.log(datePickerValue.$d.getDay());
    console.log(datePickerValue);
  }, [datePickerValue]);

  return (
    <>
      <div
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            height: "100vh",
            display: 'flex',
            flexDirection:'column',
          },
        }}
        variant="permanent"
        anchor="right"
      >
            <Grid >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid sx={{
                mt:'10px',
              borderRadius:'25px'
            }} bgcolor={'#56a7bc'}>
                <CalendarPicker
                  openTo="day"
                  shouldDisableDate={isWeekend}
                  value={datePickerValue} onChange={(newDate) => setDatePickerValue(newDate)} />
              </Grid>
            </LocalizationProvider>
          </Grid>
      </div>
    </>
  );
};
