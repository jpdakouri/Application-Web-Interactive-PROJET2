// colour history

export enum RgbSettings {
    RGB_START = 'rgb(',
    RGBA_START = 'rgba(',
    RGB_RGBA_END = ')',
    RGB_RGBA_SEPARATOR = ',',
    RGB_NUMBER_OF_COLOURS = 3,
    DEFAULT_PRIMARY_RGB = '0,0,0',
    DEFAULT_SECONDARY_RGB = '255,255,255',
    DEFAULT_TRANSPARENCY = '1',
}

export const DEFAULT_COLOUR = RgbSettings.RGB_START + RgbSettings.DEFAULT_SECONDARY_RGB + RgbSettings.RGB_RGBA_END;

/****************************/
/***GLOBAL DRAWING CONSTANTS***/
/****************************/
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const MINIMUM_WIDTH = 250;
export const MINIMUM_HEIGHT = 250;

export const LOWER_BOUND_WIDTH = 500;
export const LOWER_BOUND_HEIGHT = 500;

export const SIDEBAR_WIDTH = 465;

export const WORKING_ZONE_VISIBLE_PORTION = 100;

export const DEFAULT_WHITE = '#fff';
