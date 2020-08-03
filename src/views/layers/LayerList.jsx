/**
 * @file Component that shows the list of layers on the current map.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';

import { addLayer, showLayersDialog } from '~/actions/layers';
import { selectableListOf } from '~/components/helpers/lists';
import { labelForLayerType, iconForLayerType } from '~/model/layers';
import { getLayersInOrder } from '~/selectors/ordered';

/**
 * Creates a single list item for the layer list.
 *
 * @param  {Object} layer  the layer for which the item will be created
 * @param  {Object} props  the props of the list in which this item will be placed
 * @return {React.Node}  the rendered list item
 */
const createListItemForLayer = (layer, props) => {
  const icon = iconForLayerType(layer.type);
  return (
    /* eslint-disable react/prop-types */
    <ListItem
      key={layer.id}
      button
      style={layer.visible ? undefined : { opacity: 0.3 }}
      onClick={props.onItemSelected}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={layer.label}
        secondary={labelForLayerType(layer.type)}
      />
    </ListItem>
    /* eslint-enable react/prop-types */
  );
};

/**
 * Creates the "add new layer" item for the layer list.
 *
 * @param  {Object} props  the props of the list in which this item will be placed
 * @return {React.Node}  the rendered list item
 */
const createNewItemEntry = (props) => {
  /* eslint-disable react/prop-types */
  return (
    <ListItem key='__newItem__' button onClick={props.onNewItem}>
      <ListItemIcon>
        <AddCircleOutline />
      </ListItemIcon>
      <ListItemText primary='Add new layer' />
    </ListItem>
  );
  /* eslint-enable react/prop-types */
};

/**
 * Presentation component for a list that shows the currently added
 * layers.
 */
const LayerListPresentation = selectableListOf(createListItemForLayer, {
  dataProvider: 'layers',
  postprocess: (items, props) => [createNewItemEntry(props), ...items],
});

LayerListPresentation.propTypes = {
  onChange: PropTypes.func,
  onNewItem: PropTypes.func,
  layers: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  ).isRequired,
};

/**
 * Container for the layer list that binds it to the Redux store.
 */
const LayerList = connect(
  // mapStateToProps
  (state) => ({
    dense: true,
    layers: getLayersInOrder(state),
  }),
  // mapDispatchToProps
  (dispatch) => ({
    onChange(_event, layerId) {
      dispatch(showLayersDialog(layerId));
    },

    onNewItem() {
      const action = addLayer();
      dispatch(action);
      if (action.id) {
        dispatch(showLayersDialog(action.id));
      }
    },
  })
)(LayerListPresentation);

export default LayerList;
