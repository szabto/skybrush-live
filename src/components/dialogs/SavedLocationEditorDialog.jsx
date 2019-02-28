/**
 * @file Dialog that shows the editor for a saved location.
 */

import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { deleteSavedLocation, updateSavedLocation } from '~/actions/saved-locations'
import { cancelLocationEditing } from '~/actions/saved-location-editor'
import { NEW_ITEM_ID } from '~/utils/collections'
import { createValidator, between, integer, finite, required } from '~/utils/validation'

/**
 * Presentation of the form that shows the fields that the user can use to
 * edit the server settings.
 */
class SavedLocationEditorFormPresentation extends React.Component {
  render () {
    return (
      <div onKeyPress={this.props.onKeyPress}>
        <Field margin='normal' fullWidth
          name='name'
          component={TextField}
          label='Name'
        />
        <Field margin='normal' fullWidth
          name='center.lon'
          component={TextField}
          label='Longitude'
        />
        <Field margin='normal' fullWidth
          name='center.lat'
          component={TextField}
          label='Latitude'
        />
        <Field margin='normal' fullWidth
          name='rotation'
          component={TextField}
          label='Rotation'
        />
        <Field margin='normal' fullWidth
          name='zoom'
          component={TextField}
          label='Zoom level'
        />
      </div>
    )
  }
}

SavedLocationEditorFormPresentation.propTypes = {
  onKeyPress: PropTypes.func
}

/**
 * Container of the form that shows the fields that the user can use to
 * edit the saved location.
 */
const SavedLocationEditorForm = connect(
  // mapStateToProps
  state => {
    const id = state.dialogs.savedLocationEditor.editedLocationId
    const currentLocation = state.savedLocations.byId[id]

    return { initialValues: currentLocation }
  },
  // mapDispatchToProps
  null,
  null,
  { withRef: true }
)(reduxForm({
  form: 'SavedLocationEditor',
  validate: createValidator({
    name: required,
    center: createValidator({
      lon: [required, finite, between(-90, 90)],
      lat: [required, finite, between(-180, 180)]
    }),
    rotation: [required, finite, between(0, 360)],
    zoom: [required, integer, between(1, 30)]
  })
})(SavedLocationEditorFormPresentation))

/**
 * Presentation component for the dialog that shows the form that the user
 * can use to edit the saved location.
 */
class SavedLocationEditorDialogPresentation extends React.Component {
  constructor (props) {
    super(props)

    this.currentLocation = {}
    this._assignFormRef = value => { this._form = value }
  }

  @autobind
  handleSubmit () {
    if (this._form) {
      this._form.getWrappedInstance().submit()
    }
  }

  @autobind
  _handleKeyPress (e) {
    if (e.nativeEvent.code === 'Enter') {
      this.handleSubmit()
    }
  }

  render () {
    const { editedLocationId, onClose, onDelete, onSubmit, open } = this.props
    const isNew = editedLocationId === NEW_ITEM_ID
    const title = isNew ? 'Create new location' : 'Edit saved location'

    const actions = [
      <Button key='save' color='primary' onClick={this.handleSubmit}>Save</Button>
    ]

    if (isNew) {
      actions.push(
        <Button key='discard' onClick={onDelete(editedLocationId)}>Discard</Button>
      )
    } else {
      actions.push(
        <Button key='delete' color='secondary'
          onClick={onDelete(editedLocationId)}>
          Delete
        </Button>,
        <Button key='cancel' onClick={onClose}>Cancel</Button>
      )
    }

    return (
      <Dialog open={open} fullWidth maxWidth='sm' onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <SavedLocationEditorForm ref={this._assignFormRef}
            onSubmit={onSubmit}
            onKeyPress={this._handleKeyPress} />
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    )
  }
}

SavedLocationEditorDialogPresentation.propTypes = {
  editedLocationId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

SavedLocationEditorDialogPresentation.defaultProps = {
  open: false
}

/**
 * Container of the dialog that shows the form that the user can use to
 * edit the server settings.
 */
const SavedLocationEditorDialog = connect(
  // mapStateToProps
  state => ({
    open: state.dialogs.savedLocationEditor.dialogVisible,
    editedLocationId: state.dialogs.savedLocationEditor.editedLocationId
  }),
  // mapDispatchToProps
  dispatch => ({
    onClose () {
      dispatch(cancelLocationEditing())
    },
    onDelete (id) {
      return () => {
        dispatch(deleteSavedLocation(id))
        dispatch(cancelLocationEditing())
      }
    },
    onSubmit (data) {
      const currentLocation = JSON.parse(JSON.stringify(data))

      currentLocation.center.lon = Number(currentLocation.center.lon)
      currentLocation.center.lat = Number(currentLocation.center.lat)
      currentLocation.rotation = Number(currentLocation.rotation)
      currentLocation.zoom = Number(currentLocation.zoom)

      dispatch(updateSavedLocation(currentLocation))
      dispatch(cancelLocationEditing())
    }
  })
)(SavedLocationEditorDialogPresentation)

export default SavedLocationEditorDialog
