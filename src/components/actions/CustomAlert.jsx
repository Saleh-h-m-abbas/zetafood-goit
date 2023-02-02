import { makeStyles } from '@material-ui/core/styles';
import { Alert } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: theme.spacing(10),
    left: theme.spacing(1),
    width: theme.spacing(50),
    height: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function CustomAlert(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Alert {...props} />
    </div>
  );
}
