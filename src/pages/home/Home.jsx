import "./home.css";
import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Sidebar } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import dayjs from 'dayjs';
import DataTable from "../../components/datatable/DataTable";
import HomeInputs from "../../components/homeinputs/HomeInputs";
import { Button } from "@material-ui/core";

const Home = () => {
  const date = new Date();
  const [datePickerValue, setDatePickerValue] = useState(dayjs(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()));
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [value] = useState([
    {
      name: "yousef",
      notesD: "42",
      notesS: "",
      notesM: "",
      attend: "",
      attend2: "",
    },
    {
      name: "ahmad",
      notesD: "323",
      notesS: "",
      notesM: "",
      attend: "",
      attend2: "",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ value });
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1, p: 1, direction: "rtl" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              <HomeInputs datePickerValue={datePickerValue} />
            </Typography>
            <DataTable datePickerValue={datePickerValue} />
            <Box mt={5}>
              <Button
                color='secondary'
                variant="contained"
                fullWidth
              >
                اضافة جدول جديد
              </Button>
            </Box>
          </Box>
          <Sidebar datePickerValue={datePickerValue} setDatePickerValue={setDatePickerValue} />
        </Box>
      </form>
    </>
  );
};

export default Home;
