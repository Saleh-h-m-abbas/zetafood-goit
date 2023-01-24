import { Box, Button, Select, TextField } from "@mui/material";
import React from "react";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MenuItem from "@mui/material/MenuItem";
import Navbar from "../../components/navbar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";

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
    backgroundColor: "#d9d9d9",
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
  },
  button: {
    marginTop: theme.spacing(4),
    width: "50%",
    padding: '110px',
    backgroundColor: "#e22f56",
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <>
      <Navbar />
      <div className={classes.root}>

        <Formik
          initialValues={{
            name: user.username,
            password: "",
            email: user.email,
            authorizations: user.role,
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("يرجى تعبئة الاسم"),
            password: Yup.string()
              .required("يرجى تعبئة كلمة السر")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                "كلمة السر غير صالحة "
              ),
            email: Yup.string()
              .required("يرجى تعبئة الايميل")
              .email("الايميل غير صالح"),
            authorizations: Yup.string().required("يرجى تعبئة الصلاحيات"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log("formdata", values);
            setSubmitting(false);
            // Dispatch an action to save the user data to the store
            dispatch({ type: "SAVE_USER_DATA", payload: values });
            // Navigate to the homepage
            navigate("/home");
          }}
        >
          {({errors, touched, isSubmitting }) => (
            <Box className={classes.box}>
              <Form className={classes.form}>
                <h1 className={classes.title}>الصفحة الشخصية</h1>

                <Field
                  variant="outlined"
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
                  variant="outlined"
                  className={classes.input}
                  type="password"
                  name="password"
                  as={TextField}
                  label="كلمة المرور"
                  helperText={touched.password ? errors.password : ""}
                  error={touched.password && Boolean(errors.password)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Field
                  variant="outlined"
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
                  
                  variant="outlined"
                  className={classes.input}
                  as={Select}
                  name="authorizations"
                  label="الصلاحيات"
                  fullWidth
                  displayEmpty
                  disabled={user.role==='0'?true:false}
                >
                  <MenuItem value="" disabled>
                    الصلاحيات
                  </MenuItem>
                  <MenuItem value="0">مدير</MenuItem>
                  <MenuItem value="1">مشرف</MenuItem>
                  <MenuItem value="2">مندوب</MenuItem>
                </Field>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    fontSize: '20px',
                    padding: '15px',
                    backgroundColor: '#e22f56'
                  }}
                  className={`${classes.button} biggerSaveButton`}
                  disabled={isSubmitting}
                >
                  حفظ التغييرات
                </Button>
              </Form>
            </Box>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ProfilePage;