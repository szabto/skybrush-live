import isNil from 'lodash-es/isNil';
import range from 'lodash-es/range';
import { createSelector } from '@reduxjs/toolkit';

import { getSelectedUAVIds } from '~/selectors/selection';

/**
 * Returns the current list of home positions in the mission.
 *
 * @param  {Object}  state  the state of the application
 */
export const getHomePositionsInMission = state => state.mission.homePositions;

/**
 * Returns the current list of landing positions in the mission.
 *
 * @param  {Object}  state  the state of the application
 */
export const getLandingPositionsInMission = state =>
  state.mission.landingPositions;

/**
 * Returns the current list of takeoff headings in the mission.
 */
export const getTakeoffHeadingsInMission = state =>
  state.mission.takeoffHeadings;

/**
 * Returns the current mapping from mission-specific slots to the corresponding
 * UAV identifiers.
 *
 * @param  {Object}  state  the state of the application
 */
export const getMissionMapping = state => state.mission.mapping;

/**
 * Returns a list containing the indices of all the empty mapping slots (i.e.
 * slots that have no assigned drone yet).
 */
export const getEmptyMappingSlotIndices = createSelector(
  getMissionMapping,
  mapping =>
    mapping ? range(mapping.length).filter(index => isNil(mapping[index])) : []
);

/**
 * Returns the index of the mapping slot being edited.
 */
export const getIndexOfMappingSlotBeingEdited = state =>
  state.mission.mappingEditor.indexBeingEdited;

/**
 * Returns the reverse mapping from UAV IDs to the corresponding mission IDs.
 */
export const getReverseMissionMapping = createSelector(
  getMissionMapping,
  mapping =>
    mapping.reduce((acc, uavId, index) => {
      if (!isNil(uavId)) {
        acc[uavId] = index;
      }

      return acc;
    }, {})
);

/**
 * Returns the ID of the UAV that is currently at the mapping slot being edited.
 */
export const getUAVIdForMappingSlotBeingEdited = createSelector(
  getMissionMapping,
  getIndexOfMappingSlotBeingEdited,
  (mapping, index) => (index >= 0 ? mapping[index] : undefined)
);

/**
 * Returns whether the current mapping is editable at the moment.
 */
export const isMappingEditable = state => state.mission.mappingEditor.enabled;

/**
 * Returns whether the current selection has at least one drone that appears in
 * the mission mapping.
 */
export const selectionIntersectsMapping = createSelector(
  getMissionMapping,
  getSelectedUAVIds,
  (mapping, selectedUAVIds) => {
    for (const uavId of selectedUAVIds) {
      if (uavId !== undefined && mapping.includes(uavId)) {
        return true;
      }
    }

    return false;
  }
);
