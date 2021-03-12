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

export enum Sign {
    Negative = -1,
    Positive = 1,
}
