import { ShapeStyle } from '@app/utils/enums/shape-style';

export type CurrentAttributes = {
    LineThickness?: number;
    PrimaryColor?: string;
    SecondaryColor?: string;
    ShapeStyle?: ShapeStyle;
    DotRadius?: number;
    ShowDots?: boolean;
};
