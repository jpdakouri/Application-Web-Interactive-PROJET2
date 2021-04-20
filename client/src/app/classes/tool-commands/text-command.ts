import { Vec2 } from '@app/classes/vec2';
import { TextService } from '@app/services/tools/text-service/text.service';
import { TextAlign } from '@app/utils/enums/text-align.enum';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

export class TextCommand implements ToolCommand {
    readonly tool: TextService;
    readonly primaryColor: string;
    readonly text: string;
    readonly fontStyle: string;
    readonly fontFace: TextFont;
    readonly textAlign: TextAlign;
    readonly textBoxPosition: Vec2;
    readonly fontSize: number;

    constructor(
        tool: TextService,
        primaryColor: string,
        text: string,
        fontStyle: string,
        fontFace: TextFont,
        textAlign: TextAlign,
        textBoxPosition: Vec2,
        fontSize: number,
    ) {
        this.tool = tool;
        this.primaryColor = primaryColor;
        this.text = text;
        this.fontStyle = fontStyle;
        this.fontFace = fontFace;
        this.textAlign = textAlign;
        this.textBoxPosition = textBoxPosition;
        this.fontSize = fontSize;
    }
}
