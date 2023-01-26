import "./datatable.scss";
import { React, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { MenuItem, Select } from "@mui/material";
import { styled } from '@mui/styles';

const DataTable = ({datePickerValue})=> {

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


    useEffect(()=>{
        console.log(user.days);
        console.log(`${datePickerValue.$d.getFullYear() + "-" + (datePickerValue.$d.getMonth() + 1) + "-" + datePickerValue.$d.getDate()}`);
    },[datePickerValue])

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

            {
                user.days.includes(`${datePickerValue.$d.getFullYear() + "-" + (datePickerValue.$d.getMonth() + 1) + "-" + datePickerValue.$d.getDate()}`) &&
                <>
                    <div className="buttonspace">
                        <input type="submit" className="updateButton" value={"حفظ"} />
                    </div>
                <Table>
                    <thead>
                        <tr>
                            <th className="tr" >اسم الزبون </th>
                            <th className="tr">
                                الزيارة المندوب
                            </th>
                            <th className="tr" >
                                معدل الهدف الشهري
                            </th>
                            <th className="tr">
                                ملاحظات المندوب
                            </th>
                            <th className="tr">زيارة المشرف</th>
                            <th className="tr">
                                ملاحظات المشرف
                            </th>
                            <th className="tr">
                                ملاحظات مدير المبيعات
                            </th>
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
                </Table>
                </>
            }
        </>
    )
};

export default DataTable;