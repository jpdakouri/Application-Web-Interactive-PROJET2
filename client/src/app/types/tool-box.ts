import { Tool } from '../classes/tool';
import { ToolsNames } from '../enums/tools-names';

export type ToolBox = {
    [name in ToolsNames]: Tool;
};
