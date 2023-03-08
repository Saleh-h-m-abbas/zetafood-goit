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
  const [id, setId] = useState([]);
  const [valuesForSelectedDay, setValuesForSelectedDay] = useState([]);

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
  const dates = [];
  const getSaturdaysOfMonth = () => {
    // console.log(todayDateSelected)
    // const now = new Date('2023-03-08');
    // const date = new Date(now.getFullYear(), now.getMonth(), now.getDay());

    // console.log("date")
    // console.log(date)
    // while (date.getMonth() === month) {
    //   if (date.getDay() === 3) { // Saturday is day 6 in JS
    //     dates.push(new Date(date.getTime()));
    //   }
    //   date.setDate(date.getDate() + 1);
    // }
    // return dates;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const selectedDayOfWeek = datePickerValue.$d.getDay();

    const similarDays = [];

    for (let i = 1; i <= new Date(currentYear, currentMonth + 1, 0).getDate(); i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      if (currentDate.getDay() === selectedDayOfWeek) {
        dates.push(currentDate);
      }
    }
    console.log(dates)
    return similarDays;
  }

  const getDataFromUsers = (selectedDate, customerId) => {
      

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
    console.log(id)
    getSelectedDayData();
    // console.log(dates)
    // console.log(datePickerValue)
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
  const saturdays = getSaturdaysOfMonth();

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
                      {dates.map((e,index) => <>
                        <td>
                          <p
                            onChange={console.log(item.customerId,item.customerName,dates[index])}
                          />
                          {/* <p style={{ width: "30px", height: '20px', color: 'white', backgroundColor: item.customerVisit != '' ? item.customerVisit === "/" ? 'green' : 'red' : '' }}>/</p> */}
                        </td>
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
