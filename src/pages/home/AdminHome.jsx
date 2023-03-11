import "./home.css";
import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Sidebar } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import dayjs from "dayjs";
import {  Select } from "@material-ui/core";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import SelectedCustomerDataTable from "../../components/datatable/SelectedCustomerDataTable";
import { CustomLoading } from "../../components/actions/CustomLoading";
import { Grid, MenuItem, TextField } from "@mui/material";
import { Stack } from "@mui/system";

const AdminHome = () => {
  const date = new Date();
  const [salesUsersList, setSalesUsersList] = useState([]);
  const [salesUserSelected, setSalesUserSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(
    dayjs(
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    )
  );
  const todayDateSelected =
    datePickerValue.$d.getFullYear() +
    "-" +
    (datePickerValue.$d.getMonth() + 1) +
    "-" +
    datePickerValue.$d.getDate();
  const [user, setUser] = useState([]);
 

  useEffect(() => {
    getSalesUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getSalesUsers = async () => {
    const userArray = [];
    const q = query(collection(db, "users"), where("role", "==", 2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ uid: doc.data().uid, username: doc.get("username") });
    });
    setSalesUsersList(userArray);
  };


  const getDataForSelectedUser = async(userIdSeletect) => {
    setIsLoading(true);
    const docRef = doc(db, "users", userIdSeletect);
    const snapshot = await getDoc(docRef);
    setUser(snapshot.data())
    setIsLoading(false)
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, p: 1, direction: "rtl" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            <Grid
              sx={{
                maxHeight: "350px",
              }}
            >
              <Stack direction={"row"}>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  defaultValue=" اليوم والتاريخ:"
                  variant="filled"
                  size="small"
                  disabled
                />
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={
                    datePickerValue.$d.toLocaleString("en-us", {
                      weekday: "long",
                    }) +
                    "  " +
                    datePickerValue.$d.getFullYear() +
                    "-" +
                    (datePickerValue.$d.getMonth() + 1) +
                    "-" +
                    datePickerValue.$d.getDate()
                  }
                  size="small"
                  disabled
                />
              </Stack>
              <Stack direction={"row"} maxHeight={40}>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  defaultValue="المندوب:"
                  variant="filled"
                  size="small"
                  disabled
                />
                <Select
                disabled={salesUsersList.length===0}
                  style={{ width: "200px" }}
                  label={"اختار مندوب المبيعات"}
                  value={salesUserSelected}
                  onChange={(e) => {
                    setSalesUserSelected(e.target.value);
                    getDataForSelectedUser(e.target.value);
                  }}
                >
                  {salesUsersList.map((e) => (
                    <MenuItem value={e.uid}>{e.username}</MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack direction={"row"} maxHeight={40} spacing={5}>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  defaultValue=" المشرف:"
                  variant="filled"
                  size="small"
                  disabled
                />
                {user.superId&&<Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  style={{ width: "200px" }}
                  disabled
                  defaultValue={user.superId}
                >
                  <MenuItem value={user.superId} selected>{user.superName}</MenuItem>
                </Select>}
              </Stack>
            </Grid>
          </Typography>
          {isLoading ? (
            <CustomLoading />
          ) : (
            <>
              {user.uid&&user.days.includes(todayDateSelected) ? (
                <SelectedCustomerDataTable
                  todayDateSelected={todayDateSelected}
                  userId={user.uid}
                  isAdmin={true}
                />
              ) : (
                <Box mt={5}>
                    {user.uid&&<div style={{ color: "red" }}>
                        {"لا يوجد بيانات لهذا اليوم لليوزر الذي تم اختياره"}{" "}
                    </div>}
                </Box>
              )}
            </>
          )}
        </Box>
        <Sidebar
          datePickerValue={datePickerValue}
          setDatePickerValue={setDatePickerValue}
        />
      </Box>
    </>
  );
};

export default AdminHome;
