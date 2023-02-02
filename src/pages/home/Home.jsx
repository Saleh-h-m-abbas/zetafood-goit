import "./home.css";
import { React, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Sidebar } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import dayjs from "dayjs";
import HomeInputs from "../../components/homeinputs/HomeInputs";
import { Button } from "@material-ui/core";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import SelectedCustomerDataTable from "../../components/datatable/SelectedCustomerDataTable";
import { CustomLoading } from "../../components/actions/CustomLoading";
import CustomAlert from "../../components/actions/CustomAlert";
const Home = () => {
  const date = new Date();
  const [customersList, setCustomersList] = useState([]);
  const [errorNoCustomer, setErrorNoCustomer] = useState(false);
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
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomers = async () => {
    if (customersList.length === 0) {
      const customersArray = [];
      const q = query(collection(db, "customers"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        customersArray.push({
          uid: doc.id,
          name: doc.get("name"),
          saleTarget: doc.get("saleTarget"),
        });
      });
      setCustomersList(customersArray);
    }
  };

  const newEntry = async () => {
    setIsLoading(true);
    setErrorNoCustomer(false);
    const customersListSelected = [];
    var dayName = days[datePickerValue.$d.getDay()];
    const dayListForUser = user.customerListByDay;
    if (dayListForUser.find((item) => item.day === dayName)) {
      var result = dayListForUser.find(
        (item) => item.day === dayName
      ).customers;
      result.forEach((e) => {
        customersListSelected.push({
          customerId: e,
          customerName: customersList.find((x) => x.uid === e).name,
          saleTarget: customersList.find((x) => x.uid === e).saleTarget ?? 0,
          customerVisit: "",
          visitGoal: "",
          note: "",
        });
      });
      try {
        await addDoc(collection(db, "visitInformation"), {
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          dateOfVisit: todayDateSelected,
          day: dayName,
          listOfCustomers: customersListSelected,
          superId: user.superId??'',
          superName: user.superName??'',
          userUsername: user.username,
          userId: user.uid,
        });
        await setDoc(
          doc(db, "users", user.uid),
          {
            days: arrayUnion(todayDateSelected),
          },
          { merge: true }
        );
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          localStorage.setItem("userInfo", JSON.stringify(docSnap.data()));
          setUser(JSON.parse(localStorage.getItem("userInfo")));
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setErrorNoCustomer(true);
        const timer = setTimeout(() => {
          setErrorNoCustomer(false);
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsLoading(false);
      setErrorNoCustomer(true);
      const timer = setTimeout(() => {
        setErrorNoCustomer(false);
      }, 10000);
      return () => clearTimeout(timer);
     
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, p: 1, direction: "rtl" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            <HomeInputs datePickerValue={datePickerValue} />
          </Typography>
          {isLoading ? (
            <CustomLoading />
          ) : (
            <>
              {user.days.includes(todayDateSelected) ? (
                <SelectedCustomerDataTable
                  todayDateSelected={todayDateSelected}
                  userId={user.uid}
                  isAdmin={false}
                />
              ) : (
                <Box mt={5}>
                  <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={newEntry}
                  >
                    اضافة يوم جديد
                  </Button>
                  {errorNoCustomer && (
                    <div style={{ color: "red" }}>
                      <CustomAlert severity="error">
                        {" "}
                        {
                          "لا يمكن اضافه يوم جديد بسبب عدم وجود زبائن معرفين لهذا اليوم"
                        }{" "}
                      </CustomAlert>
                    </div>
                  )}
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

export default Home;
