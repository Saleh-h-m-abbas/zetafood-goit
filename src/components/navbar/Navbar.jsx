import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

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
      color: "white",
    },
  },
  button: {
    marginRight: theme.spacing(2),
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      background: "#f40057"
    },
  },
  IconButton: {
    fontSize: '100%',
  }
}));

export default function Navbar() {
  const settings = [{ 'name': "الصفحة الشخصية", 'link': '/profile' }, { 'name': "تسجيل خروج", 'link': 'logout' }];
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navitage = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [user] = useState(JSON.parse(localStorage.getItem("userInfo")));



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
            <Link to="/" className={classes.link}>
              <Button className={classes.button}>
                الرئيسية
              </Button>
            </Link>
            {(user.role === 0 || user.role === 1) &&
              <>
                <Link to="/customers" className={classes.link}>
                  <Button className={classes.button}>
                    الزبائن
                  </Button>
                </Link>
              </>
            }
            {user.role === 0 &&
              <>
                <Link to="/users" className={classes.link}>
                  <Button className={classes.button}>
                    المستخدمين
                  </Button>
                </Link>
                <Link to="/userInfo" className={classes.link}>
                  <Button className={classes.button}>
                    تحديد الزبائن
                  </Button>
                </Link>
              </>
            }

          </Typography>
          <Typography >{user.username}</Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              className={classes.IconButton}>
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
              {settings.map((setting) => (
                <MenuItem onClick={() => { setting.link === 'logout' ? dispatch({ type: "LOGOUT" }) : navitage(setting.link) }}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
