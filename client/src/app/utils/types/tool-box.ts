import { Tool } from '@app/classes/tool';
import { ToolsNames } from '@app/utils/enums/tools-names';

export type ToolBox = {
    [name in ToolsNames]: Tool;
};
