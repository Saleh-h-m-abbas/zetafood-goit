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
import CustomAlert from "./CustomAlert";
const Home = () => {
  const date = new Date();
  const [customersList, setCustomersList] = useState([]);
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
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
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
  }, []);
  const getCustomers = async () => {
    const userArray = [];
    const q = query(collection(db, "customers"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ uid: doc.id, name: doc.get("name") });
    });
    setCustomersList(userArray);
  };

  const newEntry = async () => {
    const customersListSelected = [];
    var dayName = days[datePickerValue.$d.getDay()];
    const dayListForUser = user.customerListByDay;
    var result = dayListForUser.find((item) => item.day === dayName).customers;
    console.log(customersList);
    console.log(result);
    result.forEach((e) => {
      customersListSelected.push({
        customerId: e,
        customerName: customersList.find((x) => x.uid === e).name,
        saleTarget: "",
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
        superID: "",
        superName: "",
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
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
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
          {user.days.includes(todayDateSelected) ? (
            <SelectedCustomerDataTable todayDateSelected={todayDateSelected} />
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
            </Box>
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
