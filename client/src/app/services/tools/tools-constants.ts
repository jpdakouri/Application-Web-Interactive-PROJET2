/****************************/
/***GLOBAL TOOLS CONSTANTS***/
/****************************/

export const DEFAULT_COLOR_BLACK = '#000000';
export const DEFAULT_MIN_THICKNESS = 1;

/**********************/
/***PENCIL CONSTANTS***/
/**********************/
export const DEFAULT_SIZE = 30;
export const DOT_DIVIDER = 3;
export const DEFAULT_RADIUS: number = DEFAULT_SIZE / DOT_DIVIDER;

/**********************/
/****LINE CONSTANTS****/
/**********************/
export const PIXEL_DISTANCE = 20;
export const QUARTER_CIRCLE_RAD = Math.PI / 2;
export const SHIFT_ANGLE_45 = QUARTER_CIRCLE_RAD / 2;
export const SHIFT_ANGLE_HALF_45 = SHIFT_ANGLE_45 / 2;
export const DEFAULT_DOT_RADIUS = 5;
export const MIN_ARRAY_LENGTH = 3;

/**********************/
/****ERASER CONSTANTS****/
/**********************/
export const MIN_ERASER_THICKNESS = 5;

/***********************/
/***SELECTOR CONSTANTS**/
/***********************/
export const PIXELS_ARROW_STEPS = 3;
/**********************/
/****AEROSOL CONSTANTS****/
/**********************/
export const DOTS_PER_SPRAY = 10;
export const MIN_FREQUENCY = 10;
export const MIN_DROPLET_DIAMETER = 1;
export const MIN_JET_DIAMETER = 1;

export const MAX_FREQUENCY = 2500;
export const MAX_DROPLET_DIAMETER = 25;
export const MAX_JET_DIAMETER = 250;

export const DEFAULT_FREQUENCY = 250;
export const DEFAULT_DROPLET_DIAMETER = 2;
export const DEFAULT_JET_DIAMETER = 50;

export const MS_PER_S = 1000;

export const MIN_GRID_SIZE = 50;
export const MAX_GRID_SIZE = 300;
export const MIN_GRID_OPACITY = 0.1;
export const MAX_GRID_OPACITY = 1;
export const GRID_SIZE_CHANGE_VALUE = 5;

/***********************/
/***POLYGON CONSTANTS**/
/***********************/

export const DEFAULT_NUMBER_OF_SIDE = 3;
export const LINE_DASH = 5;

/***********************/
/***PIPETTE CONSTANTS**/
/***********************/
export const PREVIEW_SIZE = 15;
export const PREVIEW_HALF_SIZE = (PREVIEW_SIZE - 1) / 2; // 7
export const OUT_OF_BOUND_COLOR_RGBA = 'rgba(100,100,100,1)';

/***********************/
/***STAMP CONSTANTS**/
/***********************/
export const STAMP_SIZE = 100;
export const BASE_STAMP_IMAGE_PATH = '../../assets/stamps/';
export const SMALL_ANGLE_CHANGE = 1;
export const BIG_ANGLE_CHANGE = 15;
export const STAMP_IMAGE_EXTENSION = '.png';
export const HALF_CIRCLE_DEG = 180;
export const DEG_TO_RAD_RATIO = Math.PI / HALF_CIRCLE_DEG;

/**********************/
/****TEXT CONSTANTS****/
/**********************/
export const MIN_FONT_SIZE = 5;
export const MAX_FONT_SIZE = 150;
export const DEFAULT_FONT_SIZE = 30;
export const FONT_HEIGHT_FACTOR = 0.025;

export const DEFAULT_TEXT_BOX_WIDTH = 800;
export const DEFAULT_TEXT_BOX_HEIGHT = 200;

/***************************/
/* ERROR MESSAGE CONSTANT***/
/***************************/
export const INVALID_FILE_NAME_ERROR_MESSAGE = 'Nom de fichier invalide';
export const REQUIRED_FILE_NAME_ERROR_MESSAGE = 'Vous devez entrer un nom';
export const NO_ERROR_MESSAGE = '';
export const INVALIDE_TAG_NAME_ERROR_MESSAGE = 'Peut seulement être composé de chiffres, lettres et espaces';
