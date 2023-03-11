import "./datatable.scss";
import { React, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import {
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import CustomAlert from "../actions/CustomAlert";
import { CustomLoading } from "../actions/CustomLoading";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  paper: {
    overflowX: "auto",
    margin: "10px",
    direction: "rtl",
    textAlign: "right",
    border: "1px solid #ddd",
    borderRadius: "5px",
    maxWidth: "100%",
    overflow: "hidden",
  },
  table: {
    minWidth: "600px",
    maxWidth: '1400px',
    tableLayout: "fixed",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.grey[100],
    padding: "10px",
  },
}));
const SelectedCustomerDataTable = ({ todayDateSelected, userId, isAdmin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [visitId, setVisitID] = useState("");
  const [valuesForSelectedDay, setValuesForSelectedDay] = useState([]);
  const [dates, setDates] = useState([]);
  const [customerDataForWeek, setCustomerDataForWeek] = useState([]);
  const handleChange = (e, index, key) => {
    const newData = [...valuesForSelectedDay];
    newData[index][key] = e.target.innerText;
  };
  const classes = useStyles();

  const handleSelect = (e, index, key) => {
    const newData = [...valuesForSelectedDay];
    newData[index][key] = e.target.value;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(
      doc(db, "visitInformation", visitId),
      {
        listOfCustomers: valuesForSelectedDay,
      },
      { merge: true }
    );
    setIsAlert(true);
    const timer = setTimeout(() => {
      setIsAlert(false);
    }, 10000);
    return () => clearTimeout(timer);
  };

  const getSimilarDaysDate = async (inputStringDate) => {
    // Convert String Date
    const convertDateString = inputStringDate;
    const convertParts = convertDateString.split("-");
    const convertYear = convertParts[0];
    const convertMonth = convertParts[1] - 1; // month is 0-based
    const convertDay = convertParts[2];
    const inputDate = new Date(convertYear, convertMonth, convertDay);
    // Get all Similar Days from the selected date
    const inputDay = inputDate.getDay();
    const month = inputDate.getMonth();
    const year = inputDate.getFullYear();
    const similarDays = [];
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numberOfDaysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === inputDay) {
        similarDays.push(
          date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
        await getDataForThisDay(
          date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
      }
    }
    setDates(similarDays);
    setCustomerDataForWeek([...customerDataForWeek]);
  };
  const getDataForThisDay = async (dayDate) => {
    try {
      const q = query(
        collection(db, "visitInformation"),
        where("dateOfVisit", "==", dayDate),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      var x = [];
      querySnapshot.forEach((doc) => {
        x = doc.data().listOfCustomers;
      });
      customerDataForWeek.push({ date: dayDate, customersList: x });
    } catch (error) {
      console.log(error);
    }
  };
  const getDataFromUsers = (date, customerId) => {
    const selectedDateCustomers =
      customerDataForWeek.find((data) => data.date === date)?.customersList ||
      [];
    const selectedCustomer = selectedDateCustomers.find(
      (customer) => customer.customerId === customerId
    );
    return selectedCustomer?.note !== "" && selectedCustomer;
  };

  const changeColor = (value, index) => {
    if (value === "موجود") {
      document.getElementById("customerVisit" + index).style.backgroundColor =
        "green";
    }
    if (value === "غير موجود") {
      document.getElementById("customerVisit" + index).style.backgroundColor =
        "red";
    }
  };
  useEffect(() => {
    setValuesForSelectedDay([]);
    setVisitID("");
    getSelectedDayData();
    setCustomerDataForWeek([]);
    getSimilarDaysDate(todayDateSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDateSelected]);
  const getSelectedDayData = async () => {
    try {
      const q = query(
        collection(db, "visitInformation"),
        where("dateOfVisit", "==", todayDateSelected),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValuesForSelectedDay(doc.data().listOfCustomers);
        setVisitID(doc.id);
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        {isAlert && (
          <CustomAlert severity="success">
            {" "}
            تم تخزين البيانات بنجاح{" "}
          </CustomAlert>
        )}

        {isLoading ? (
          <CustomLoading />
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              {!isAdmin && (
                <div className="buttonspace">
                  <input type="submit" className="updateButton" value={"حفظ"} />
                </div>
              )}
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.headerCell}>
                        اسم الزبون
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        معدل الهدف الشهري
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        الزيارة المندوب
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        الهدف من الزيارة
                      </TableCell>
                      <TableCell className={classes.headerCell}>
                        ملاحظات المندوب
                      </TableCell>
                      {dates.map((e, index) => (
                        <TableCell key={index} className={classes.headerCell}>
                          W{index + 1}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {valuesForSelectedDay.map((item, index) => (
                    <TableBody>
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            InputProps={{
                              readOnly: true,
                            }}
                            style={{ color: "white"}}
                            fullWidth
                            name="customerName"
                            variant="filled"
                            defaultValue={item.customerName}
                            onInput={(e) =>
                              handleChange(e, index, "customerName")
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="filled">
                            {item.saleTarget}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Select
                            readOnly={isAdmin}
                            id={"customerVisit" + index}
                            variant="filled"
                            defaultValue={item.customerVisit}
                            name="customerVisit"
                            onChange={(e) => {
                              handleSelect(e, index, "customerVisit");
                              changeColor(e.target.value, index);
                            }}
                            style={{
                              width: "100%",
                              color: "white",
                              backgroundColor:
                                item.customerVisit != ""
                                  ? item.customerVisit === "موجود"
                                    ? "green"
                                    : "red"
                                  : "",
                            }}
                          >
                            <MenuItem value={"موجود"}>موجود</MenuItem>
                            <MenuItem value={"غير موجود"}>غير موجود</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            readOnly={isAdmin}
                            variant="filled"
                            defaultValue={item.visitGoal}
                            name="visitGoal"
                            onChange={(e) =>
                              handleSelect(e, index, "visitGoal")
                            }
                            style={{ width: "100%" }}
                          >
                            <MenuItem value={"بيع"}>بيع</MenuItem>
                            <MenuItem value={"تحصيل"}>تحصيل</MenuItem>
                            <MenuItem value={"بيع + تحصيل"}>
                              بيع + تحصيل
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            variant="filled"
                            multiline
                            maxRows={4}
                            name="note"
                            defaultValue={item.note}
                            onChange={(e) => handleSelect(e, index, "note")}
                          />
                        </TableCell>
                        {dates.map((e, index) => (
                          <>
                            {customerDataForWeek.length != 0 &&
                            getDataFromUsers(dates[index], item.customerId) ? (
                              <TableCell
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                }}
                              >
                                Y
                              </TableCell>
                            ) : (
                              <TableCell
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                }}
                              >
                                X
                              </TableCell>
                            )}
                          </>
                        ))}
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </Paper>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default SelectedCustomerDataTable;
