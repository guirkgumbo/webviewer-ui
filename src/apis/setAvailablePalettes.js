import { mapToolNameToKey } from 'constants/map';
import mapPaletteToAnnotationColorProperty from 'constants/mapPaletteToAnnotationColorProperty';
import actions from 'actions';
import selectors from 'selectors';
import setActivePalette from './setActivePalette';

/**
 * Sets the available palettes for a particular tool
 * @method WebViewerInstance#setAvailablePalettes
 * @param {string} toolName The tool name.
 * @param {string[]} colorPalettes An array of palettes that are available for a particular tool. Contains one of 'text', 'border' and 'fill'.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setAvailablePalettes('AnnotationCreateRectangle', ['text', 'border', 'fill']);
  });
 */

export default store => (toolName, colorPalettes) => {
  if (!colorPalettes) {
    console.warn(`No palette names were provided: ${colorPalettes}. Please use one of the following: 'text', 'border' and/or 'fill'.`);
    return;
  }

  const currentOverride = {
    ...(selectors.getCustomElementOverrides(store.getState(), 'availablePalettes') || {}),
  };

  const key = mapToolNameToKey(toolName);
  if (!toolName || !key) {
    console.warn(`${toolName} is not a valid tool name!`);
    return;
  }
  const currentPalette = selectors.getCurrentPalette(store.getState(), key);
  const availablePalettes = colorPalettes.map(palette => mapPaletteToAnnotationColorProperty[palette]);
  currentOverride[key] = availablePalettes;

  if (availablePalettes.length > 0 && !availablePalettes.includes(currentPalette)) {
    setActivePalette(store)(toolName, colorPalettes[0]);
  }

  store.dispatch(actions.setCustomElementOverrides('availablePalettes', currentOverride));
};