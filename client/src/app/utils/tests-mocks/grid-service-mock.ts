// tslint:disable:no-empty
export class GridServiceMock {
    showGrid: boolean;
    constructor() {
        this.showGrid = true;
        // tslint:disable-next-line:no-magic-numbers
    }
    newGrid(newSize: number | null): void {}
    clear(): void {}
    changeOpacity(value: number | null): void {}
    gridSizeCanModify(increaseSize: boolean): boolean {
        return true;
    }
}
