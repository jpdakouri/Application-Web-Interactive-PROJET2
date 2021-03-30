import { ShapeStyle } from '@app/utils/enums/shape-style';

export type CurrentAttributes = {
    LineThickness?: number;
    ShapeStyle?: ShapeStyle;
    DotRadius?: number;
    ShowDots?: boolean;
    DropletDiameter?: number;
    Frequency?: number;
    JetDiameter?: number;
    numberOfSides?: number;
    BucketTolerance?: number;
};
