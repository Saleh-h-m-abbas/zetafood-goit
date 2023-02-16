import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import "./datatable.scss";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#326370",
    padding: theme.spacing(10),
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
    marginTop: theme.spacing(4),
  },
  content: {
    width: "100%",
  },
}));

const UserUpdateButton = (userId) => {

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    console.log(userId);
    setOpen(true);
  };


  const classes = useStyles();
  const [usersList, setUsersList] = useState([]);
  const [superId, setSuperId] = useState('');

  const getUsers = async () => {
    const userArray = [];
    const q = query(
      collection(db, "users"),
      where("role", "==", 1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userArray.push({ id: doc.id, name: doc.get("username") });
    });
    setUsersList(userArray);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <Button
        className="deleteButton"
        onClick={() => handleOpen()}
      >
        تعديل
      </Button>
      <Dialog className="dialogbody" open={open} onClose={handleClose}>
        <div className={classes.root}>
          <h2 className={classes.title}>اضافة مستخدم</h2>
          <div className={classes.line}></div>
          <Formik
            initialValues={{ username: "", email: "", password: "", role: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.username) {
                errors.username = "يرجى تعبئة اسم السمتخدم";
              }
              if (values.role === "") {
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
                  if (values.role == 2) {
                    await setDoc(doc(db, "users", user.uid), {
                      createdAt: serverTimestamp(),
                      customerListByDay: [],
                      days: [],
                      email: user.email,
                      role: values.role,
                      superId: superId,
                      superName: usersList.find(
                        (e) => e.id === superId
                      ).name ?? '',
                      uid: user.uid,
                      username: values.username,
                    })
                  } else {
                    await setDoc(doc(db, "users", user.uid), {
                      createdAt: serverTimestamp(),
                      customerListByDay: [],
                      days: [],
                      email: user.email,
                      role: values.role,
                      uid: user.uid,
                      username: values.username,
                    })
                  }
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
            {({ values, touched, errors, isSubmitting }) => (
              <Form>
                <Field
                  name="username"
                  as={TextField}
                  label= 'اسم المستخدم'
                  className={classes.inputField}
                  variant="filled"
                  helperText={touched.username ? errors.username : ""}
                  error={touched.username && Boolean(errors.username)}
                  fullWidth
                />
                <Field
                  name="email"
                  as={TextField}
                  label="الايميل"
                  className={classes.inputField}
                  variant="filled"
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
                  variant="filled"
                  helperText={touched.password ? errors.password : ""}
                  error={touched.password && Boolean(errors.password)}
                  fullWidth
                />
                <FormControl
                  variant="filled"
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
                    <MenuItem value={0}>مدير مبيعات</MenuItem>
                    <MenuItem value={1}>مشرف</MenuItem>
                    <MenuItem value={2}>مندوب</MenuItem>
                  </Field>
                  <ErrorMessage name="role" component={FormHelperText} style={{ color: "red" }} />
                </FormControl>

                {values.role != '' && values.role == 2 && <FormControl
                  variant="filled"
                  className={classes.inputField}
                  fullWidth
                >
                  <InputLabel id="super-label">اختر المشرف</InputLabel>
                  <Select
                    labelId="super-label"
                    label="المشرف"
                    onChange={(e) => { setSuperId(e.target.value) }}
                  >
                    {usersList.map((e) => <MenuItem value={e.id}>{e.name}</MenuItem>)}
                  </Select>
                </FormControl>}
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
      </Dialog>
    </>
  );
};

export default UserUpdateButton;
