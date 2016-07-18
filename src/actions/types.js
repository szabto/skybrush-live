/**
 * @file Central repository of action type constants used in the app.
 */

// Clock-related actions
export const CLEAR_CLOCK_LIST = 'CLEAR_CLOCK_LIST'
export const SET_CLOCK_STATE = 'SET_CLOCK_STATE'
export const SET_CLOCK_STATE_MULTIPLE = 'SET_CLOCK_STATE_MULTIPLE'

// Connection-related actions
export const CLEAR_CONNECTION_LIST = 'CLEAR_CONNECTION_LIST'
export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE'
export const SET_CONNECTION_STATE_MULTIPLE = 'SET_CONNECTION_STATE_MULTIPLE'

// Map-related actions
export const SELECT_MAP_SOURCE = 'SELECT_MAP_SOURCE'
export const SELECT_MAP_TOOL = 'SELECT_MAP_TOOL'
export const SET_SELECTED_FEATURES = 'SET_SELECTED_FEATURES'
export const ADD_SELECTED_FEATURES = 'ADD_SELECTED_FEATURES'
export const SELECT_ALL_FEATURES = 'SELECT_ALL_FEATURES'
export const CLEAR_SELECTED_FEATURES = 'CLEAR_SELECTED_FEATURES'
export const REMOVE_SELECTED_FEATURES = 'REMOVE_SELECTED_FEATURES'

// Layer-related actions
export const ADD_LAYER = 'ADD_LAYER'
export const CHANGE_LAYER_TYPE = 'CHANGE_LAYER_TYPE'
export const CLOSE_LAYERS_DIALOG = 'CLOSE_LAYERS_DIALOG'
export const REMOVE_LAYER = 'REMOVE_LAYER'
export const RENAME_LAYER = 'RENAME_LAYER'
export const SHOW_LAYERS_DIALOG = 'SHOW_LAYERS_DIALOG'
export const SET_SELECTED_LAYER_IN_LAYERS_DIALOG =
  'SET_SELECTED_LAYER_IN_LAYERS_DIALOG'
export const TOGGLE_LAYER_VISIBILITY = 'TOGGLE_LAYER_VISIBILITY'

// Server settings related actions
export const CLOSE_SERVER_SETTINGS_DIALOG = 'CLOSE_SERVER_SETTINGS_DIALOG'
export const SHOW_SERVER_SETTINGS_DIALOG = 'SHOW_SERVER_SETTINGS_DIALOG'
export const UPDATE_SERVER_SETTINGS = 'UPDATE_SERVER_SETTINGS'

// Error handling related actions
export const CLOSE_ERROR_DIALOG = 'CLOSE_ERROR_DIALOG'
export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE'

// Snackbar-related actions
export const SHOW_SNACKBAR_MESSAGE = 'SHOW_SNACKBAR_MESSAGE'
