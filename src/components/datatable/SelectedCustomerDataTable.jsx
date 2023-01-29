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

const SelectedCustomerDataTable = ({ todayDateSelected }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setIsLoading] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [visitId, setVisitID] = useState("");
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
    }, 3000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    getSelectedDayData();
    console.log(todayDateSelected)
  }, [todayDateSelected]);
  const getSelectedDayData = async () => {
    try {
      const q = query(
        collection(db, "visitInformation"),
        where("dateOfVisit", "==", todayDateSelected),
        where("userId", "==", user.uid)
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
          <form onSubmit={handleSubmit}>
            <div className="buttonspace">
              <input type="submit" className="updateButton" value={"حفظ"} />
            </div>
            <Table>
              <thead>
                <tr>
                  <th className="tr">اسم الزبون </th>
                  <th className="tr">معدل الهدف الشهري</th>
                  <th className="tr">الزيارة المندوب</th>
                  <th className="tr">الهدف من الزيارة</th>
                  <th className="tr">ملاحظات المندوب</th>
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
                        variant="filled"
                        defaultValue={item.customerVisit}
                        name="customerVisit"
                        onChange={(e) =>
                          handleSelect(e, index, "customerVisit")
                        }
                        style={{ width: "100%" }}
                      >
                        <MenuItem value={"موجود"}>موجود</MenuItem>
                        <MenuItem value={"غير موجود"}>غير موجود</MenuItem>
                      </Select>
                    </td>
                    <td>
                      <Select
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
                        fullWidth
                        variant="filled"
                        multiline
                        maxRows={4}
                        name="note"
                        defaultValue={item.note}
                        onChange={(e) => handleSelect(e, index, "note")}
                      />
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </form>
        )}
      </div>
    </>
  );
};

export default SelectedCustomerDataTable;
