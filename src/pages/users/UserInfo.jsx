import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Checkbox,
  ListItemText,
  Select as MUISelect,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/navbar/Navbar";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import CustomAlert from "../../components/actions/CustomAlert";
import UserDataTableInfo from "../../components/users/UserDataTableInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    direction: "rtl",
    margin: '20px'
  },
  box: {
    boxShadow: "0px 0px 10px 0px #ccc",
    backgroundColor: "white",
    padding: theme.spacing(10),
    width: "30%",
    borderRadius: "40px",
    [theme.breakpoints.down("sm")]: {
      width: "70%",
    },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  formContainer: {
    boxShadow: "0px 0px 10px #ccc",
    padding: "40px",
    marginTop: "40px",
  },
  submitButton: {
    width: "100%",
    marginTop: "20px",
    padding: "15px",
    fontSize: "20px",
    color: "white",
    border: "0",
    borderRadius: "20px",
    backgroundColor: "#e22f56",
    "&:hover": {
      backgroundColor: "#c81d40",
    },
  },
}));

const dayList = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Other"
];

const validationSchema = Yup.object({
  day: Yup.string().required("Day is required"),
  customers: Yup.array()
    .required("At least one customer is required")
    .min(1, "At least one customer is required"),
});

function UserInfo() {
  const [usersList, setUsersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const getUsers = async () => {
    const userArray = [];
    const q = query(collection(db, "users"), where("role", "==", 2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ id: doc.data().uid, name: doc.get("username") });
    });
    setUsersList(userArray);
  };
  const getCustomers = async (userId) => {
    const docRef = doc(db, "users", userId);
    const snapshot = await getDoc(docRef);
    const item = snapshot.data().customerListByDay;
    const userArray = [];
    const q = query(
      collection(db, "customers"),
      where("sales_manager_id", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ id: doc.id, name: doc.get("name") });
    });
    const UsersIdArray = []
    item.map((e) => e.customers.map((s) => UsersIdArray.push(s)))
    const filteredUsers = userArray.filter(user => !UsersIdArray.includes(user.id));
    setCustomersList(filteredUsers);
  };
  const updateData = async (values) => {
    const docRef = doc(db, "users", nameValue);
    const docSnap = await getDoc(docRef);
    const map = Array.from(docSnap.data().customerListByDay);
    const exist = map.some((map) => map.day === values.day);
    try {
      if (exist) {
        const newMap = map.filter((e) => e.day !== values.day);
        const newMapOfDay = map.filter((e) => e.day === values.day);
        values.customers.map((e)=>{newMapOfDay[0].customers.push(e)})
        newMap.push(newMapOfDay[0])

        const frankDocRef = doc(db, "users", nameValue);
        await updateDoc(frankDocRef, {
          customerListByDay: newMap,
        });
      } else {
        const frankDocRef = doc(db, "users", nameValue);
        await setDoc(
          frankDocRef,
          {
            customerListByDay: arrayUnion(values),
          },
          { merge: true }
        );
      }
      values.day = "";
      values.customers = [];
      setNameValue("");
      setIsAlert(true);
      const timer = setTimeout(() => {
        setIsAlert(false);
      }, 10000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <div className={classes.root}>
        <Box className={classes.box}>
          <h1 className={classes.title}>تحديد الزبائن حسب اليوم للمندوب</h1>
          <Formik
            initialValues={{ day: "", customers: [] }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              updateData(values);
            }}
          >
            {({ handleChange, values }) => (
              <Form>
                <FormControl
                  variant="filled"
                  fullWidth
                  margin="normal"
                  required
                >
                  <InputLabel>اختر المندوب</InputLabel>
                  <Select
                    name="name"
                    onChange={(e) => {
                      setNameValue(e.target.value);
                      getCustomers(e.target.value);
                    }}
                    value={nameValue}
                    label="اختر المندوب"
                    disabled={usersList.length === 0}
                  >
                    {usersList.map((user, index) => (
                      <MenuItem key={index} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage name="day" component={FormHelperText} />
                </FormControl>
                <FormControl
                  variant="filled"
                  fullWidth
                  margin="normal"
                  required
                >
                  <InputLabel>اختر يوم العمل</InputLabel>
                  <Select
                    name="day"
                    onChange={handleChange}
                    value={values.day}
                    label="Name of Day"
                  >
                    {dayList.map((day, index) => (
                      <MenuItem key={index} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage name="day" component={FormHelperText} />
                </FormControl>
                <FormControl
                  variant="filled"
                  fullWidth
                  margin="normal"
                  required
                >
                  <InputLabel>اختار الزبائن</InputLabel>
                  <MUISelect
                    multiple
                    name="customers"
                    onChange={handleChange}
                    value={values.customers}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            customersList.find((customer) => customer.id === id)
                              .name??''
                        )
                        .join(", ")
                    }
                    label="اختار الزبائن"
                  >
                    {customersList.map((customer, index) => (
                      <MenuItem key={index} value={customer.id}>
                        <Checkbox
                          checked={values.customers.indexOf(customer.id) > -1}
                        />
                        <ListItemText primary={customer.name} />
                      </MenuItem>
                    ))}
                  </MUISelect>
                  <ErrorMessage name="customers" component={FormHelperText} />
                </FormControl>
                <button
                  type="submit"
                  className={classes.submitButton}
                >
                  Save
                </button>
                <div style={{ marginTop: '15px', color: 'green' }}>{isAlert && <CustomAlert severity="success"  > تم تخزين البيانات بنجاح</CustomAlert>}</div>
              </Form>

            )}
          </Formik>
        </Box>

        <UserDataTableInfo userId={nameValue} getCustomers={getCustomers} />
      </div>

    </>
  );
}

export default UserInfo;
