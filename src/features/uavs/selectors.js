import isNil from 'lodash-es/isNil';
import { getDistance as haversineDistance } from 'ol/sphere';
import createCachedSelector from 're-reselect';

import { createSelector } from '@reduxjs/toolkit';

import {
  getHomePositionsInMission,
  getMissionMapping,
  getReverseMissionMapping,
  getTakeoffHeadingsInMission
} from '~/features/mission/selectors';

/**
 * Returns the list of UAV IDs that should be shown on the UI, in the
 * order preferred by the state of the application.
 *
 * @param  {Object}  state  the state of the application
 */
export const getUAVIdList = state => state.uavs.order;

/**
 * Key selector function for cached selectors that cache things by UAV ID.
 */
const selectUavId = (_state, uavId) => uavId;

/**
 * Returns the UAV with the given ID, given the current state.
 */
export const getUavById = (state, uavId) => state.uavs.byId[uavId];

/**
 * Returns the current position of the UAV with the given ID, given the current
 * state.
 */
export const getCurrentPositionByUavId = (state, uavId) => {
  const uav = getUavById(state, uavId);
  return uav ? uav.position : undefined;
};

/**
 * Returns the current heading of the UAV with the given ID, given the current
 * state.
 */
export const getCurrentHeadingByUavId = (state, uavId) => {
  const uav = getUavById(state, uavId);
  return uav ? uav.heading : undefined;
};

/**
 * Returns the home position of the UAV with the given ID, given the current
 * state.
 *
 * @param  {Object}  state  the state of the application
 * @param  {string}  uavId  the ID of the UAV
 */
export const getHomePositionByUavId = createCachedSelector(
  getReverseMissionMapping,
  getHomePositionsInMission,
  selectUavId,
  (revMapping, homePositions, uavId) => {
    const index = revMapping[uavId];

    if (index === undefined) {
      // UAV is not in the mission. Later on, we can return the UAV's own home
      // position here if we decide to implement that.
      return undefined;
    }

    return homePositions[index];
  }
)({
  keySelector: selectUavId
  // TODO: use a FIFO or LRU cache if it becomes necessary
});

/**
 * Returns the takeoff heading of the UAV with the given ID, given the current
 * state.
 *
 * @param  {Object}  state  the state of the application
 * @param  {string}  uavId  the ID of the UAV
 */
export const getTakeoffHeadingByUavId = createCachedSelector(
  getReverseMissionMapping,
  getTakeoffHeadingsInMission,
  selectUavId,
  (revMapping, takeoffHeadings, uavId) => {
    const index = revMapping[uavId];

    if (index === undefined) {
      // UAV is not in the mission. Later on, we can return the UAV's own takeoff
      // heading here if we decide to implement that.
      return undefined;
    }

    return takeoffHeadings[index];
  }
)({
  keySelector: selectUavId
  // TODO: use a FIFO or LRU cache if it becomes necessary
});

/**
 * Returns the distance of the UAV to its home position.
 */
export const getXYDistanceToHomePositionByUavId = createCachedSelector(
  getHomePositionByUavId,
  getCurrentPositionByUavId,
  (homePosition, currentPosition) => {
    if (homePosition !== undefined && currentPosition !== undefined) {
      return haversineDistance(
        [homePosition.lon, homePosition.lat],
        [currentPosition.lon, currentPosition.lat]
      );
    }

    return undefined;
  }
)({
  keySelector: selectUavId
  // TODO: use a FIFO or LRU cache if it becomes necessary
});

/**
 * Returns the distances of the UAVs from their home positions, restricted to the
 * UAVs that are in the mapping.
 */
export const getDistancesFromHome = state => {
  const mapping = getMissionMapping(state);
  const result = {};

  for (const uavId of mapping) {
    if (isNil(uavId)) {
      result[uavId] = undefined;
    } else {
      result[uavId] = getXYDistanceToHomePositionByUavId(state, uavId);
    }
  }

  return result;
};

/**
 * Creates a selector that selects all UAV IDs that are in the mission mapping
 * and that are farther than a given threshold from their designated home
 * positions.
 */
export const createSelectorToGetUAVIdsTooFarFromHome = threshold =>
  createSelector(
    getDistancesFromHome,
    distances =>
      Object.entries(distances).reduce((acc, [uavId, distance]) => {
        if (distance > threshold) {
          acc.push(uavId);
        }

        return acc;
      }, [])
  );

/**
 * Returns the farthest distance of an UAV from its home position, or undefined
 * if there are no UAVs with known current and home positions
 */
export const getFarthestDistanceFromHome = state => {
  const distancesByUavId = getDistancesFromHome(state);
  let maxDistance = -1;

  for (const distance of Object.values(distancesByUavId)) {
    if (!isNil(distance) && distance > maxDistance) {
      maxDistance = distance;
    }
  }

  return maxDistance < 0 ? undefined : maxDistance;
};

/**
 * Returns the deviation of the current heading of the UAV from the takeoff
 * heading.
 */
export const getDeviationFromTakeoffHeadingByUavId = createCachedSelector(
  getTakeoffHeadingByUavId,
  getCurrentHeadingByUavId,
  (takeoffHeading, currentHeading) => {
    if (takeoffHeading !== undefined && currentHeading !== undefined) {
      const diff = takeoffHeading - currentHeading;

      // Formula from https://stackoverflow.com/a/54820295/156771
      return ((diff + 540) % 360) - 180;
    }

    return undefined;
  }
)({
  keySelector: selectUavId
  // TODO: use a FIFO or LRU cache if it becomes necessary
});

/**
 * Returns the deviations of the headings of the UAVs from their preferred
 * headings during the mission, restricted to the UAVs that are in the mapping.
 */
export const getDeviationsFromTakeoffHeadings = state => {
  const mapping = getMissionMapping(state);
  const result = {};

  for (const uavId of mapping) {
    if (isNil(uavId)) {
      result[uavId] = undefined;
    } else {
      result[uavId] = getDeviationFromTakeoffHeadingByUavId(state, uavId);
    }
  }

  return result;
};

/**
 * Creates a selector that selects all UAV IDs that are in the mission mapping
 * and that are farther than a given threshold from their designated home
 * positions.
 */
export const createSelectorToGetMisalignedUAVIds = threshold =>
  createSelector(
    getDeviationsFromTakeoffHeadings,
    deviations =>
      Object.entries(deviations).reduce((acc, [uavId, deviation]) => {
        if (Math.abs(deviation) > threshold) {
          acc.push(uavId);
        }

        return acc;
      }, [])
  );

/**
 * Returns an array containing all the UAV IDs that appear in the mission mapping
 * but are not present in the UAV registry.
 */
export const getMissingUAVIdsInMapping = createSelector(
  getMissionMapping,
  state => state.uavs.byId,
  (mapping, uavsById) =>
    mapping.filter(uavId => !isNil(uavId) && isNil(uavsById[uavId]))
);
