import "./datatable.scss";
import { React, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import {
  MenuItem,
  Select,
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

const SelectedCustomerDataTable = ({ todayDateSelected, userId, isAdmin, datePickerValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [visitId, setVisitID] = useState("");
  const [valuesForSelectedDay, setValuesForSelectedDay] = useState([]);
  const [dates, setDates] = useState([])
  const [customerDataForWeek, setCustomerDataForWeek] = useState([]);
  const handleChange = (e, index, key) => {
    const newData = [...valuesForSelectedDay];
    newData[index][key] = e.target.innerText;
  };

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

  const getSimilarDaysDate = async (inputDate) => {
    const inputDay = inputDate.getDay();
    const month = inputDate.getMonth();
    const year = inputDate.getFullYear();
    const similarDays = [];
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numberOfDaysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === inputDay) {
        similarDays.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
        await getDataForThisDay(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
      }
    }
    setDates(similarDays)
    setCustomerDataForWeek([...customerDataForWeek])
  };
  const getDataForThisDay = async (dayDate) => {

    const q = query(
      collection(db, "visitInformation"),
      where("dateOfVisit", "==", dayDate),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    var x = []
    querySnapshot.forEach((doc) => {
      x = doc.data().listOfCustomers
    });
    customerDataForWeek.push({ 'date': dayDate, 'customersList': x })
  }
  const getDataFromUsers = (date, customerId) => {
    const selectedDateCustomers = customerDataForWeek.find((data) => data.date === date)?.customersList || [];
    const selectedCustomer = selectedDateCustomers.find((customer) => customer.customerId === customerId);
    return selectedCustomer?.note !== "" && selectedCustomer;
  }

  const changeColor = (value, index) => {
    if (value === "موجود") {
      document.getElementById("customerVisit" + index).style.backgroundColor = "green"
    }
    if (value === "غير موجود") {
      document.getElementById("customerVisit" + index).style.backgroundColor = "red"
    }
  }
  useEffect(() => {
    setValuesForSelectedDay([]);
    setVisitID("");
    getSelectedDayData();
    setCustomerDataForWeek([])
    getSimilarDaysDate(new Date(todayDateSelected))
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
              {!isAdmin && <div className="buttonspace">
                <input type="submit" className="updateButton" value={"حفظ"} />
              </div>}
              <Table style={{ marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th className="tr">اسم الزبون </th>
                    <th className="tr">معدل الهدف الشهري</th>
                    <th className="tr">الزيارة المندوب</th>
                    <th className="tr">الهدف من الزيارة</th>
                    <th className="tr">ملاحظات المندوب</th>
                    {dates.map((e, index) => <>
                      <th className="tr">W{index + 1}</th>
                      {/* <th className="tr">s2</th> */}
                    </>)}
                  </tr>
                </thead>
                {valuesForSelectedDay.map((item, index) => (
                  <tbody className="TableCell">
                    <tr key={index}>
                      <td>
                        <TextField
                          disabled
                          fullWidth
                          name="customerName"
                          variant="filled"
                          defaultValue={item.customerName}
                          onInput={(e) => handleChange(e, index, "customerName")}
                        />
                      </td>
                      <td>
                        <Typography variant="filled">
                          {item.saleTarget}
                        </Typography>
                      </td>
                      <td>
                        <Select
                          disabled={isAdmin}
                          id={"customerVisit" + index}
                          variant="filled"
                          defaultValue={item.customerVisit}
                          name="customerVisit"
                          onChange={(e) => { handleSelect(e, index, "customerVisit"); changeColor(e.target.value, index) }
                          }
                          style={{ width: "100%", color: 'white', backgroundColor: item.customerVisit != '' ? item.customerVisit === "موجود" ? 'green' : 'red' : '' }}
                        >
                          <MenuItem value={"موجود"}>موجود</MenuItem>
                          <MenuItem value={"غير موجود"}>غير موجود</MenuItem>
                        </Select>
                      </td>
                      <td>
                        <Select
                          disabled={isAdmin}
                          variant="filled"
                          defaultValue={item.visitGoal}
                          name="visitGoal"
                          onChange={(e) => handleSelect(e, index, "visitGoal")}
                          style={{ width: "100%" }}
                        >
                          <MenuItem value={"بيع"}>بيع</MenuItem>
                          <MenuItem value={"تحصيل"}>تحصيل</MenuItem>
                          <MenuItem value={"بيع + تحصيل"}>بيع + تحصيل</MenuItem>
                        </Select>
                      </td>
                      <td>
                        <TextField
                          disabled={isAdmin}
                          fullWidth
                          variant="filled"
                          multiline
                          maxRows={4}
                          name="note"
                          defaultValue={item.note}
                          onChange={(e) => handleSelect(e, index, "note")}
                        />
                      </td>
                      {dates.map((e, index) => <>
                        {customerDataForWeek.length != 0 && getDataFromUsers(dates[index], item.customerId) ?
                          <td style={{ backgroundColor: 'green', color: 'white' }}>Y</td> : <td style={{ backgroundColor: 'red', color: 'white' }}>X</td>}
                      </>)}
                    </tr>
                  </tbody>
                ))}
              </Table>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default SelectedCustomerDataTable;
