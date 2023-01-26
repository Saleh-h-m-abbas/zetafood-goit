import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#326370",
    padding: theme.spacing(4),
    marginTop: "40px",
    margin: "auto",
    width: "100%",
    borderRadius: "25px",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
    },
  },
  line: {
    borderBottom: "1px solid white",
    margin: "10px 0",
  },
  title: {
    color: "white",
    direction: "rtl",
    marginBottom: theme.spacing(2),
  },
  inputField: {
    marginBottom: theme.spacing(2),
    backgroundColor: "white",
    direction: "rtl",
  },
  addButton: {
    backgroundColor: "#F40057",
    color: "white",
    marginTop: theme.spacing(2),
  },
}));

const AddCustomer = () => {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [usersList, setUsersList] = useState([]);

  const getSales = async () => {
    const userArray = [];
    const q = query(collection(db, "users"), where("role", "==", 1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ id: doc.data().uid, name: doc.get("username") });
    });
    console.log(userArray);
    setUsersList(userArray);
  };
  useEffect(()=>{
    getSales();
  },[])
  return (
    <div className={classes.root}>
      <h2 className={classes.title}>اضافة زبون</h2>
      <div className={classes.line}></div>
      <Formik
        initialValues={{ username: "", salesperson: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "يرجى تعبئة اسم السمتخدم";
          }
          if (!values.salesperson) {
            errors.salesperson = "يرجى اختيار مسؤول المبيعات";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const newCityRef = await addDoc(collection(db, "customers"), {
            name: values.username,
            sales_manager_id: values.salesperson,
            user_create: user.username,
            createdAt: serverTimestamp(),
          });
          values.username = "";
          values.salesperson = "";
          setSubmitting(true);
          await setDoc(newCityRef, { ...newCityRef,'uid':newCityRef.id});
         
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <Field
              name="username"
              as={TextField}
              label="اسم المستخدم"
              className={classes.inputField}
              variant="standard"
              helperText={touched.username ? errors.username : ""}
              error={touched.username && Boolean(errors.username)}
              fullWidth
            />
            <FormControl
              variant="standard"
              className={classes.inputField}
              fullWidth
            >
              <InputLabel id="salesperson-label">
                {" "}
                اختار مسؤول المبيعات{" "}
              </InputLabel>
              <Field
                name="salesperson"
                as={Select}
                labelId="salesperson-label"
                helperText={touched.salesperson ? errors.salesperson : ""}
                error={touched.salesperson && Boolean(errors.salesperson)}
                label="Salesperson"
                disabled={usersList.length === 0}
              >
                {usersList.map((values)=><MenuItem value={values.id}>{values.name}</MenuItem>)}
                
      
              </Field>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={classes.addButton}
              // disabled={isSubmitting}
            >
              اضافة
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCustomer;
