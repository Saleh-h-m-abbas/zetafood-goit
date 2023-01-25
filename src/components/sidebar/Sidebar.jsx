import { useState, useEffect } from "react";
import * as React from "react";
import "./sidebar.css";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Directions } from "@mui/icons-material";



const isWeekend = (date) => {
  const day = date.day();

  return day === 5;
};

export const Sidebar = () => {
  const drawerWidth = 320;
  const [days] = useState([
    "السبت",
    "الاحد",
    "الاثنين",
    "الثلاثاء",
    "الاربعاء",
    "الخميس",
  ]);
  const [clickedDay, setClickedDay] = useState({
    day: "",
    date: "",
  });
  const date = new Date();
  const currentDay = date.getDay();
  const currentDate = date.toDateString();
  const [todayDay, setTodayDay] = useState("");
  const [value, setValue] = React.useState(dayjs('2022-04-07'));

  const handleButtonClick = (day) => {
    setClickedDay({
      day,
      date: new Date(
        date.setDate(date.getDate() + (days.indexOf(day) - currentDay - 1))
      ).toDateString(),
    });
  };

  useEffect(() => {
    if (currentDay == 0) {
      setTodayDay("الاحد");
    } else if (currentDay == 1) {
      setTodayDay("الاثنين");
    } else if (currentDay == 2) {
      setTodayDay("الثلاثاء");
    } else if (currentDay == 3) {
      setTodayDay("الاربعاء");
    } else if (currentDay == 4) {
      setTodayDay("الخميس");
    } else if (currentDay == 5) {
      setTodayDay("جمعه");
    } else if (currentDay == 6) {
      setTodayDay("السبت");
    }
    handleButtonClick(todayDay);
  }, [currentDay, todayDay]);

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
                  value={value} onChange={(newDate) => setValue(newDate)} />
              </Grid>
            </LocalizationProvider>
          </Grid>
      </div>
    </>
  );
};
