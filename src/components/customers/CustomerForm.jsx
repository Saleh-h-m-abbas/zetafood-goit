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
  doc,
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
    const q = query(collection(db, "users"), where("role", "==", 2));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ id: doc.data().uid, name: doc.get("username") });
    });
    setUsersList(userArray);
  };
  useEffect(() => {
    getSales();
  }, []);
  return (
    <div className={classes.root}>
      <h2 className={classes.title}>اضافة زبون</h2>
      <div className={classes.line}></div>
      <Formik
        initialValues={{ username: "", salesperson: "", saleTarget: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "يرجى تعبئة اسم السمتخدم";
          }
          if (!values.salesperson) {
            errors.salesperson = "يرجى اختيار مسؤول المبيعات";
          }
          if (!values.saleTarget) {
            errors.saleTarget = "يرجى ادخال الهدف الشهري";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const addCustomer = await addDoc(collection(db, "customers"), {
            createdAt: serverTimestamp(),
            name: values.username,
            sales_manager_id: values.salesperson,
            sales_manager_name: usersList.find(
              (e) => e.id === values.salesperson
            ).name,
            user_create: user.username,
            saleTarget: values.saleTarget,
          });
          values.username = "";
          values.salesperson = "";
          values.saleTarget = '';
          setSubmitting(true);
          await setDoc(
            doc(db, "customers", addCustomer.id),
            {
              uid: addCustomer.id,
            },
            { merge: true }
          );
        }}
      >
        {({ touched, errors}) => (
          <Form>
            <Field
              name="username"
              as={TextField}
              label="اسم الزبون"
              className={classes.inputField}
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              helperText={touched.username ? errors.username : ""}
              error={touched.username && Boolean(errors.username)}
              fullWidth
            />
            <FormControl
              variant="filled"
              className={classes.inputField}
              fullWidth
            >
              <InputLabel id="salesperson-label">
                اختار مسؤول المبيعات
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
                {usersList.map((values) => (
                  <MenuItem value={values.id}>{values.name}</MenuItem>
                ))}
              </Field>
            </FormControl>

            <Field
              name="saleTarget"
              as={TextField}
              type="number"
              label="الهدف الشهري"
              className={classes.inputField}
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              helperText={touched.saleTarget ? errors.saleTarget : ""}
              error={touched.saleTarget && Boolean(errors.saleTarget)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={classes.addButton}
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
