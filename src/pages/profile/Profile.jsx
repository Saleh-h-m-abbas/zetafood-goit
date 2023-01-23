import { Button, Input, Select } from "@mui/material";
import React from "react";
import { from } from "stylis";
import { useFormik } from "formik";
import { margin } from "@mui/system";
import Typography from "@mui/material/Typography";
import { InputAdornment } from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MenuItem from "@mui/material/MenuItem";
import Navbar from "../../components/navbar/Navbar";

const ProfilePage = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      authorizations: "",
    },
    onSubmit: (values) => {
      console.log("formdata", values);
    },
    validate: (values) => {
      let errors = {};
      if (!values.name) {
        errors.name = "يرجى تعبئة الاسم";
      }

      if (!values.password) {
        errors.password = "يرجى تعبئة كلمة السر";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
          values.password
        )
      ) {
        errors.password = "كلمة السر غير صالحة ";
      }

      if (!values.authorizations) {
        errors.authorizations = "يرجى تعبئة الصلاحيات";
      }

      return errors;
    },
  });


  return (
    <div>
        <Navbar />
      <form
        style={{
          backgroundColor: "#d9d9d9",
          borderRadius: "3%",
          width: "30%",
          margin: "0 auto",
          padding: "1%",
          marginTop: "5%",
          direction: "rtl",
        }}
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h4" gutterBottom>
          الصفحة الشخصية
        </Typography>
        <label htmlFor="name" style={{ marginBottom: "2px" }}>
          اسم المستخدم
        </label>
        <br />
        <Input
          type="text"
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
          style={{ backgroundColor: "white", marginTop: "2%" }}
          fullWidth
        />
        {formik.touched.name && formik.errors.name ? (
          <div style={{ color: "#e22f56" }}>{formik.errors.name}</div>
        ) : null}
        <br />
        <br />
        <label htmlFor="name">كلمة المرور </label>
        <br />
        <Input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
          style={{ backgroundColor: "white", marginTop: "2%" }}
          fullWidth
        />
        {formik.touched.password && formik.errors.password ? (
          <div style={{ color: "#e22f56" }}>{formik.errors.password}</div>
        ) : null}
        <br />
        <br />

        <label htmlFor="name">الصلاحيات </label>
        <br />

        {formik.touched.authorizations && formik.errors.authorizations ? (
          <div style={{ color: "#e22f56" }}>{formik.errors.authorizations}</div>
        ) : null}
        <Select
          name="authorizations"
          id="authorizations"
          fullWidth
          style={{ backgroundColor: "white", height: "30px", marginTop: "2%" }}
          onChange={formik.handleChange}
          value={formik.values.authorizations}
          onBlur={formik.authorizations}
        >
          <br />
          <MenuItem value="auth1">صلاحية 1</MenuItem>
          <MenuItem value="auth2">صلاحية 2</MenuItem>
          <MenuItem value="auth3">صلاحية 3</MenuItem>
          <MenuItem value="auth4">صلاحية 4</MenuItem>
        </Select>

        <br />
        <br />

        <Button
          variant="text"
          type="submit"
          sx={{
            backgroundColor: "#e22f56",
            color: "white",
            "&:hover": { backgroundColor: "#e22f56b8" },
          }}
          fullWidth
        >
          حفظ التغيرات
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
