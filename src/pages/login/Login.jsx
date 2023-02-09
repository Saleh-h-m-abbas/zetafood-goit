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
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100vh",
    backgroundColor: "#003d4d",
    direction: "rtl",
  },
  box: {
    height: "30vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: theme.spacing(10),
    width: "40%",
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
    marginTop: theme.spacing(3),
    width: "60%",
    backgroundColor: "#e22f56",
    color: "white",
  },
  poweredBy: {
    color: "white",
    fontSize: "20px",
  },
}));

const Login = () => {
  const classes = useStyles();
  const navitage = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  const handleSubmit = (e) => {
    // e.preventDefault();
    signInWithEmailAndPassword(auth, e.email, e.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          localStorage.setItem("userInfo", JSON.stringify(docSnap.data()));
        } 
        dispatch({ type: "LOGIN", payload: user });
        navitage("/");
      })
      .catch((error) => {
        console.log(error);
        setLoginError("Something Wrong Please Try Again");
      });
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("ايميل غير صحيح").required("يجب ادخال الايميل"),
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
                type="submit"
              >
                تسجيل الدخول
              </Button>

              <div style={{ color: "red", marginTop: "30px" }}>
                {loginError !== "" && loginError}
              </div>
            </Form>
          )}
        </Formik>
      </Box>
      <Typography className={classes.poweredBy} variant="body2">
        Powered by GoIT
      </Typography>
    </div>
  );
};

export default Login;
