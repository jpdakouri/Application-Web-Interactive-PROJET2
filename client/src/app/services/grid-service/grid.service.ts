import { Injectable } from '@angular/core';
import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '@app/services/tools/tools-constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    readonly minGridSize: number = MIN_GRID_SIZE;
    readonly maxGridSize: number = MAX_GRID_SIZE;
    gridSize: number = 
    constructor() {}
}
