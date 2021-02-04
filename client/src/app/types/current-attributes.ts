import { ShapeStyle } from '@app/enums/shape-style';

export type CurrentAttributes = {
    LineThickness?: number;
    PrimaryColor?: string;
    SecondaryColor?: string;
    ShapeStyle?: ShapeStyle;
    DotRadius?: number;
    ShowDots?: boolean;
};
