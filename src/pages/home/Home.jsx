import "./home.css";
import { React, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { MenuItem, Select, TextField } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import dayjs from 'dayjs';

const Home = () => {
  const [delegate] = useState("اشرف");
  const [supervisor] = useState("قيس");
  const date = new Date();
  const [datePickerValue, setDatePickerValue] = useState(dayjs(date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()));
  const user = JSON.parse(localStorage.getItem("userInfo"));
 
  const [value] = useState([
    {
      name: "yousef",
      notesD: "42",
      notesS: "",
      notesM: "",
      attend: "",
      attend2: "",
    },
    {
      name: "ahmad",
      notesD: "323",
      notesS: "",
      notesM: "",
      attend: "",
      attend2: "",
    },
  ]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "gray",
      color: theme.palette.common.white,
      fontSize: 20,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 17,
    },
  }));


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ value }); 
  };

  const handleChange = (e, index, key) => {
    const newData = [...value];
    newData[index][key] = e.target.innerText;
  };

  const handleSelect = (e, index, key) => {
    const newData = [...value];
    newData[index][key] = e.target.value;
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1, p: 1, direction: "rtl" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              <p>
                اليوم والتاريخ:
                {`  ${datePickerValue.$d.toLocaleString('en-us', {weekday: 'long'}) +"  " + datePickerValue.$d.getFullYear() + "-" + (datePickerValue.$d.getMonth()+1) + "-" + datePickerValue.$d.getDate()}`}
              </p>
              <p>المندوب: {delegate}</p>
              <p>المشرف: {supervisor}</p>
            </Typography>
            <div className="buttonspace">
              <input type="submit" className="updateButton" value={"حفظ"} />
            </div>
          {user.days.includes(`${datePickerValue.$d.getFullYear()+ "-"+ (datePickerValue.$d.getMonth()+1)+"-" + datePickerValue.$d.getDate()}`) &&  
             <Table>
              <thead>
                <tr>
                  <StyledTableCell align="right">اسم الزبون </StyledTableCell>
                  <StyledTableCell align="right">
                    الزيارة المندوب
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    معدل الهدف الشهري
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ملاحظات المندوب
                  </StyledTableCell>
                  <StyledTableCell align="right">زيارة المشرف</StyledTableCell>
                  <StyledTableCell align="right">
                    ملاحظات المشرف
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ملاحظات مدير المبيعات
                  </StyledTableCell>
                </tr>
              </thead>
              {value.map((item, index) => (
                <tbody className="TableCell">
                  <tr key={index}>
                    <TableCell
                      required
                      align="right"
                      contentEditable={true}
                      onInput={(e) => handleChange(e, index, "name")}
                    >
                      {item.name}
                    </TableCell>

                    <td>
                      <Select
                        onChange={(e) => handleSelect(e, index, "attend")}
                        style={{ width: "100%" }}
                      >
                        <MenuItem value={"Attend"}>Attend</MenuItem>
                        <MenuItem value={"did not Attend"}>
                          did not Attend
                        </MenuItem>
                      </Select>
                    </td>
                    <td>
                      <Typography variant="filled">30</Typography>
                    </td>
                    <TableCell
                      contentEditable={true}
                      onInput={(e) => handleChange(e, index, "notesD")}
                      multiline
                      align="right"
                    >
                      {item.notesD}
                    </TableCell>
                    <td>
                      <Select
                        onChange={(e) => handleSelect(e, index, "attend2")}
                        style={{ width: "100%" }}
                      >
                        <MenuItem value={"Attend"}>Attend</MenuItem>
                        <MenuItem value={"did not Attend"}>
                          did not Attend
                        </MenuItem>
                      </Select>
                    </td>
                    <TableCell
                      contentEditable={true}
                      onInput={(e) => handleChange(e, index, "notesS")}
                      multiline
                      align="right"
                      type="text"
                      placeholder="ملاحظات المشرف"
                    />
                    <TableCell
                      className="tableCell"
                      contentEditable={true}
                      onInput={(e) => handleChange(e, index, "notesM")}
                      multiline
                      align="right"
                      type="text"
                      placeholder=" ملاحظات مدير المبيعات "
                    />
                  </tr>
                </tbody>
              ))}
            </Table>}
          </Box>
          <Sidebar datePickerValue={datePickerValue}  setDatePickerValue={setDatePickerValue} />
        </Box>
      </form>
    </>
  );
};

export default Home;
