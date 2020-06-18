import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    borderTop: 2,
    borderBottom: 2,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    border: 2,
    borderColor: 'silver',
    borderStyle: 'solid',
  },
  italic: {
    fontStyle: 'italic',
  },
});

const SearchRow = props => {
  const classes = useStyles();
  const { rowData, tabindex } = props;
  return (
    <Card className={classes.root} variant="outlined" tabIndex={tabindex}>
      <CardContent className={classes.content}>
        <Typography variant="h5" component="h2">
          {rowData.id}
        </Typography>
        <Typography
          className={classes.italic}
          color="textSecondary"
          style={{ margin: '10px', color: 'black' }}
        >
          {rowData.name}
        </Typography>
        <Typography variant="body2" component="p" color="textSecondary">
          {rowData.address}
        </Typography>
        <Typography variant="body2" component="p" color="textSecondary">
          {rowData.pincode}
        </Typography>
        {rowData.items.map(item => (
          <Typography variant="body2" component="p" color="textSecondary">
            {item}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchRow;
