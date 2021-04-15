import { TestBed } from '@angular/core/testing';
import { ClipboardService } from '@app/services/tools/clipboard-service/clipboard.service';
import { ClipboardPasteCommand } from './clipboard-paste-command';

describe('ClipboardPasteCommand', () => {
    it('should create an instance', () => {
        expect(new ClipboardPasteCommand(TestBed.inject(ClipboardService), new ImageData(1, 1), { x: 1, y: 1 })).toBeTruthy();
    });
});
