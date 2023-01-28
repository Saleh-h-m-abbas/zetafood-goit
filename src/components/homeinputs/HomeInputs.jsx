import {
  TextField,
  Stack,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { React} from "react";

function HomeInputs({ datePickerValue }) {

  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <>
      <Grid
        sx={{
          maxHeight: "350px",
        }}
      >
        <Stack direction={"row"}>
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue=" اليوم والتاريخ:"
            variant="filled"
            size="small"
            disabled
          />
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            value={
              datePickerValue.$d.toLocaleString("en-us", { weekday: "long" }) +
              "  " +
              datePickerValue.$d.getFullYear() +
              "-" +
              (datePickerValue.$d.getMonth() + 1) +
              "-" +
              datePickerValue.$d.getDate()
            }
            size="small"
            disabled
          />
        </Stack>
        <Stack direction={"row"} maxHeight={40}>
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue="المندوب:"
            variant="filled"
            size="small"
            disabled
          />
          <Select style={{ width: "200px" }} disabled value={user.uid}>
            <MenuItem value={user.uid} selected>
              {user.username}
            </MenuItem>
          </Select>
        </Stack>
        <Stack direction={"row"} maxHeight={40} spacing={5}>
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue=" المشرف:"
            variant="filled"
            size="small"
            disabled
          />
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            style={{ width: "200px" }}
            disabled
            value={user.superId}
          >
            <MenuItem value={user.superId}>{user.superName}</MenuItem>
          </Select>
        </Stack>
      </Grid>
    </>
  );
}

export default HomeInputs;
