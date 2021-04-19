// tslint:disable:no-empty
export class GridServiceMock {
    showGrid: boolean;
    gridSize: number;
    constructor() {
        this.showGrid = true;
        // tslint:disable-next-line:no-magic-numbers
        this.gridSize = 50;
    }
    newGrid(newSize: number | null): void {}
    clear(): void {}
    changeOpacity(value: number | null): void {}
    gridSizeCanModify(increaseSize: boolean): boolean {
        return true;
    }
}
