import {  makeStyles, TextField, InputLabel, Select, FormControl, Button, FormLabel } from '@material-ui/core'
import React, { useState } from 'react'


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            maxWidth: '1200px',
            width: '100%',
            margin: theme.spacing(0.5),
            marginBottom: theme.spacing(2),
            borderRadius: '5px',
            backgroundColor: 'white',
        },
        '& .MuiFormLabel-root': {
            left: 'inherit!important',
            right: '1.75rem !important',
            transformOrigin: 'right !important',
        },
        '& .MuiSvgIcon-root': {
            left: '1.75rem !important',
            right: 'inherit!important',
            transformOrigin: 'right !important',
        },
        '& .MuiButtonBase-root': {
            width: '80%',
        },
        '& .MuiSelect-root': {
            direction: 'rtl'
        },
    },
}))

const CustomerForm = () => {
    const [values, setValues] = useState("");
    const classes = useStyles();
    return (
        <form className={classes.root} >
            <FormLabel style={{ color: 'white', fontSize: '25px', direction: 'rtl' }} >إضافة زبون</FormLabel>
            <hr />
            <TextField
                varient="outlined"
                label="اسم المستخدم"
                id="outlined-basic"
                required
                dir='rtl'
            />
            <FormControl variant="outlined" >
                <InputLabel htmlFor="dataManager">اختيار مسؤول البيانات</InputLabel>
                <Select
                    required
                    native
                    label="dataManager"
                >
                    {/* Example data to be removed */}
                    <option aria-label="None" value="" />
                    <option value={"أحمد"}>أحمد</option>
                    <option value={"محمد"}>محمد</option>
                    <option value={"حسان"}>حسان</option>
                </Select>
            </FormControl>
            <Button variant="contained" href="/" color="secondary" style={{ fontSize: '20px' }}>
                إضافة
            </Button>

        </form>
    )
}

export default CustomerForm;