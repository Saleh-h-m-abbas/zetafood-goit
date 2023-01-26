import { TextField, NativeSelect, InputLabel, Stack, Select, MenuItem, Grid } from "@mui/material";
import { React, useState, useEffect } from "react";

function HomeInputs({ datePickerValue }) {
    const [delegate] = useState("اشرف");
    const [supervisor] = useState("قيس");

    return (
        < >
            <Grid sx={{
                maxHeight: '350px',
                }}>
                <Stack
                    direction={'row'}
                >
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
                        defaultValue={datePickerValue.$d.toLocaleString('en-us', { weekday: 'long' }) + "  " + datePickerValue.$d.getFullYear() + "-" + (datePickerValue.$d.getMonth() + 1) + "-" + datePickerValue.$d.getDate()}
                        size="small"
                    />
                </Stack>
                <Stack
                    direction={'row'}
                    maxHeight={40}
                >
                    <TextField
                        hiddenLabel
                        id="filled-hidden-label-small"
                        defaultValue=" المندوب:"
                        variant="filled"
                        size="small"
                        disabled
                    />
                    <Select >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Stack>
                <Stack
                    direction={'row'}
                    maxHeight={40}
                    spacing={5}
                >
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

                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Stack>
            </Grid>
        </>
    )
}

export default HomeInputs