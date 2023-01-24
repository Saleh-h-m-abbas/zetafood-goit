import { React, useState, useEffect } from "react";
import "./sidebar.css";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import ListItemText from "@mui/material/ListItemText";

export const Sidebar = () => {
  const drawerWidth = 150;
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
      <Drawer
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#003d4d",
            color: "white",
            position: "relative",
            height: "100vh",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <List>
          <Typography id="today" className="sidebar">
            اليوم والتاريخ:
          </Typography>
          <Typography id="today" className="sidebar">
            <span className="theDay">{clickedDay.date}</span>
          </Typography>
          <div>
            {days.map((day, i) => (
              <>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText
                      sx={{
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                      key={day}
                      onClick={() => handleButtonClick(day)}
                    >
                      {day}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </div>
        </List>
      </Drawer>
    </>
  );
};
