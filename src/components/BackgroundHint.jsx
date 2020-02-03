/**
 * @file Component that gives a hint to the user about the usage of the
 * application.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    userSelect: 'none'
  }
}));

/**
 * Component that gives a hint to the user about the usage of the
 * application.
 *
 * The hint is presented as text in large print placed in the middle of
 * the area dedicated to the component.
 *
 * @return {Object} the rendered component
 */
const BackgroundHint = ({ header, text, ...rest }) => {
  const classes = useStyles();

  return (
    <Box color="text.secondary" className={classes.root} {...rest}>
      <div>
        {header && (
          <Typography paragraph variant="h6">
            {header}
          </Typography>
        )}
        <div>{text}</div>
      </div>
    </Box>
  );
};

BackgroundHint.propTypes = {
  header: PropTypes.string,
  text: PropTypes.string
};

export default BackgroundHint;
