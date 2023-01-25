import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    direction: "rtl",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: "bold",
    fontSize: "1.5em",
  },
  link: {
    marginRight: theme.spacing(2),
    color: "white",
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      color: "#ffc107",
    },
  },
  button: {
    marginRight: theme.spacing(2),
    background: "#ffc107",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      background: "#ffa000",
    },
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#003d4d" }}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              ZetaFood
            </Link>
          </Typography>
          <Button className={classes.button}>
            <Link to="/page1" className={classes.link}>
              Page 1
            </Link>
          </Button>
          <Button className={classes.button}>
            <Link to="/page2" className={classes.link}>
              Page 2
            </Link>
          </Button>
          <Button className={classes.button}>
            <Link to="/page3" className={classes.link}>
              Page 3
            </Link>
          </Button>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
