import React from "react";
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
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

const AddUser = () => {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className={classes.root}>
      <h2 className={classes.title}>اضافة مستخدم</h2>
      <div className={classes.line}></div>
      <Formik
        initialValues={{ username: "",email: "", password:"", role: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "يرجى تعبئة اسم السمتخدم";
          }
          if (!values.role) {
            errors.role = "يرجى اختيار مسؤول المبيعات";
          }
          if (!values.password) {
            errors.password = "يرجى ادخال كلمة المرور";
          }
          if (!values.email) {
            errors.email = "يرجى ادخال الحساب الالكتروني";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
          createUserWithEmailAndPassword(auth, values.email, values.password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user.uid);
            await addDoc(collection(db, "users"), {
              email: user.email,
              uid: user.uid,
              username: values.username,
              role: values.role,
              createdAt: serverTimestamp(),
              days: []
            });
            values.username = "";
            values.email = "";
            values.password = "";
            values.role = "";
            setSubmitting(false);
          })
          .catch((error) => {
            console.log(error);
          });
 
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
            <Field
              name="email"
              as={TextField}
              label="الايميل"
              className={classes.inputField}
              variant="standard"
              helperText={touched.email ? errors.email : ""}
              error={touched.email && Boolean(errors.email)}
              fullWidth
            />
            <Field
              name="password"
              type="password"
              as={TextField}
              label="الرقم السري"
              className={classes.inputField}
              variant="standard"
              helperText={touched.password ? errors.password : ""}
              error={touched.password && Boolean(errors.password)}
              fullWidth
            />
            <FormControl
              variant="standard"
              className={classes.inputField}
              fullWidth
            >
              <InputLabel id="role-label">اختر الصلاحيات</InputLabel>
              <Field
                name="role"
                as={Select}
                labelId="role-label"
                helperText={touched.role ? errors.role : ""}
                error={touched.role && Boolean(errors.role)}
                label="role"
              >
                {/* <MenuItem value={0}>مدير</MenuItem> */}
                <MenuItem value={1}>مشرف</MenuItem>
                <MenuItem value={2}>مندوب</MenuItem>
              </Field>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={classes.addButton}
              disabled={isSubmitting}
            >
              اضافة
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddUser;
