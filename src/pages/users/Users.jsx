import {Grid} from "@material-ui/core";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import AddUser from "../../components/users/UserForm";
import UserDataTable from "../../components/users/UserDataTable";

const Users = () => {
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid item xs={8}>
          <UserDataTable />
        </Grid>
        <Grid item xs={4}>
            <AddUser />
        </Grid>
      </Grid>
    </>
  );
};

export default Users;
