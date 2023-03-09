import { Box, Button, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import MenuItem from "@mui/material/MenuItem";
import Navbar from "../../components/navbar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CustomAlert from "../../components/actions/CustomAlert";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
  },
  box: {
    margin: 'auto',
    marginTop: '40px',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    boxShadow: "0px 0px 10px #ccc",
    padding: theme.spacing(5),
    width: "50%",
    borderRadius: "40px",
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-around',
    alignItems: "center",
    height: '60vh',
    width: "100%",
  }
}));

const ProfilePage = () => {
  const classes = useStyles();
  const [isAlert, setIsAlert] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <>
      <Navbar />
      <div className={classes.root}>

        <Formik
          initialValues={{
            name: user.username,
            email: user.email,
            authorizations: user.role,
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("يرجى تعبئة الاسم"),
            email: Yup.string()
              .required("يرجى تعبئة الايميل")
              .email("الايميل غير صالح"),
            authorizations: Yup.string().required("يرجى تعبئة الصلاحيات"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true)
            try {
              await setDoc(
                doc(db, "users", user.uid),
                {
                  uid: user.uid,
                  username: values.name,
                  email: values.email,
                  role: values.authorizations
                },
                { merge: true }
              );

              const docRef = doc(db, "users", user.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                localStorage.setItem("userInfo", JSON.stringify(docSnap.data()));
              }
              setIsAlert(true);
              const timer = setTimeout(() => {
                setIsAlert(false);
              }, 10000);
              return () => clearTimeout(timer);
            } catch (error) {
              console.log(error)
            }

            setSubmitting(false)
          }}

        >
          {({ errors, touched, isSubmitting }) => (
            <Box className={classes.box}>
              <Form className={classes.form}>
                <h1 className={classes.title}>الصفحة الشخصية</h1>

                <Field
                  variant="filled"
                  className={classes.input}
                  as={TextField}
                  type="text"
                  name="name"
                  label="اسم المستخدم"
                  fullWidth
                  helperText={touched.name ? errors.name : ""}
                  error={touched.name && Boolean(errors.name)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person2RoundedIcon />
                      </InputAdornment>
                    ),
                  }}

                />
                <Field
                  disabled
                  variant="filled"
                  className={classes.input}
                  type="email"
                  as={TextField}
                  name="email"
                  label="الايميل"
                  fullWidth
                  helperText={touched.email ? errors.email : ""}
                  error={touched.email && Boolean(errors.email)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Field
                  disabled
                  variant="filled"
                  className={classes.input}
                  as={Select}
                  name="authorizations"
                  label="الصلاحيات"
                  fullWidth
                  displayEmpty
                // disabled={user.role !== 0 ? true : false}
                >
                  <MenuItem value="" disabled>
                    الصلاحيات
                  </MenuItem>
                  <MenuItem value={0}>مدير</MenuItem>
                  <MenuItem value={1}>مشرف</MenuItem>
                  <MenuItem value={2}>مندوب</MenuItem>
                </Field>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: '#e22f56',
                    width: "50%",
                    border: 0,
                    borderRadius: '30px',
                    fontSize: '20px',
                    padding: '15px',
                  }}
                >
                  حفظ التغييرات
                </Button>
                {/* <Button >
                  تغير كلمة السر
                </Button> */}
              </Form>
              <div style={{ marginTop: '15px', color: 'green' }}>{isAlert && <CustomAlert severity="success"  > تم تخزين البيانات بنجاح</CustomAlert>}</div>
            </Box>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ProfilePage;