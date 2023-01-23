import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { doc, getDoc, getDocFromCache } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#003d4d",
    direction: "rtl",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: theme.spacing(2),
    width: "50%",
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    width: "50%",
    backgroundColor: "#e22f56",
  },
  poweredBy: {
    color: "white",
    textAlign: "center",
    position: "absolute",
    bottom: "30%",
    width: "50%",
  },
}));

const Login = () => {
  const classes = useStyles();
  const navitage = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const handleSubmit = (e) => {
    // e.preventDefault();
    signInWithEmailAndPassword(auth, e.email, e.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
        // localStorage.setItem("userInfo", JSON.stringify(3.data()));
        dispatch({ type: "LOGIN", payload: user });
        navitage("/");
      })
      .catch((error) => {
        // setError(true);
        console.log(error);
      });
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("ايميل غير صحيح")
      .required("يجب ادخال الايميل"),
    password: Yup.string().required("يجب ادخال كلمة المرور"),
  });

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        <h1 className={classes.title}>ZetaFood</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                style={{ flex: 1, width: "100%" }}
                name="email"
                as={TextField}
                className={classes.input}
                label="الايميل"
                variant="outlined"
                helperText={touched.email ? errors.email : ""}
                error={touched.email && Boolean(errors.email)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Field
                style={{ flex: 1, width: "100%" }}
                name="password"
                as={TextField}
                className={classes.input}
                label="كلمة المرور"
                type="password"
                variant="outlined"
                helperText={touched.password ? errors.password : ""}
                error={touched.password && Boolean(errors.password)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                تسجيل الدخول
              </Button>
            </Form>
          )}
        </Formik>
        <Typography className={classes.poweredBy} variant="body2">
          Powered by GoIT
        </Typography>
      </Box>
    </div>
  );
};

export default Login;
