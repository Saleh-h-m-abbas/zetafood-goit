import React from "react";
import { Dialog } from "@mui/material";
import { useState } from "react";
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
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: theme.spacing(10),
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
    // margin:'50px'
  },
}));

export const UpdateModelCustomers = ({customerData}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  
  useEffect(()=>{console.log(customerData)},[customerData])
  return (
    <>
      <div className="deleteButton" onClick={() => handleOpen()}>
        تحديث بيانات المستخدم
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className={classes.content}>
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
                // const addCustomer = await addDoc(collection(db, "customers"), {
                //   createdAt: serverTimestamp(),
                //   name: values.username,
                //   sales_manager_id: values.salesperson,
                //   sales_manager_name: usersList.find(
                //     (e) => e.id === values.salesperson
                //   ).name,
                //   user_create: user.username,
                //   saleTarget: values.saleTarget,
                // });
                // values.username = "";
                // values.salesperson = "";
                // values.saleTarget = '';
                // setSubmitting(true);
                // await setDoc(
                //   doc(db, "customers", addCustomer.id),
                //   {
                //     uid: addCustomer.id,
                //   },
                //   { merge: true }
                // );
              }}
            >
               {({ touched, errors}) => (
               <Form>
               <Field
                 name="username"
                 as={TextField}
                 label="اسم المستخدم"
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
                 {/* <Field
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
                 </Field> */}
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
        </div>
      </Dialog>
    </>
  );
};
