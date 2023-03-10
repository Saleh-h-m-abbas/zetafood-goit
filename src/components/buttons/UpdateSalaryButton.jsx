import React from "react";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

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

export const UpdateSalaryButton = ({customerId}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="deleteButton" onClick={() => handleOpen()}>
        تحديث الهدف الشهري
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className={classes.content}>
          <div className={classes.root}>
            <h2 className={classes.title}>تعديل الهدف الشهري</h2>
            <div className={classes.line}></div>
            <Formik
              initialValues={{ saleTarget:customerId.saleTarget }}
              validate={(values) => {
                const errors = {};
                if (!values.saleTarget) {
                  errors.saleTarget = "يرجى ادخال الهدف الشهري";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                await setDoc(
                    doc(db, "customers", customerId.id),
                    {
                      saleTarget: values.saleTarget,
                    },
                    { merge: true }
                  );
                  values.saleTarget="";
                handleClose();
              }}
            >
              {({ touched, errors }) => (
                <Form>
                  <Field
                    name="saleTarget"
                    as={TextField}
                    type="number"
                    label="الهدف الشهري"
                    className={classes.inputField}
                    variant="filled"
                    helperText={touched.saleTarget ? errors.saleTarget : ""}
                    error={touched.saleTarget && Boolean(errors.saleTarget)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className={classes.addButton}
                  >
                    حفظ
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
