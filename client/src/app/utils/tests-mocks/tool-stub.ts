import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolCommand } from '@app/utils/interfaces/tool-command';

@Injectable({
    providedIn: 'root',
})
export class ToolStub extends Tool {
    executeCommand(command: ToolCommand): void {
        // No command to undo/redo
        return;
    }
    getPositionFromMouse(event: MouseEvent): Vec2 {
        return {} as Vec2;
    }
}
