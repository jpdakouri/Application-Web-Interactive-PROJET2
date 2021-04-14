import { TestBed } from '@angular/core/testing';
import { ClipboardService } from '@app/services/tools/clipboard-service/clipboard.service';
import { ClipboardDeleteCommand } from './clipboard-delete-command';

describe('ClipboardDeleteCommand', () => {
    it('should create an instance', () => {
        expect(new ClipboardDeleteCommand(TestBed.inject(ClipboardService), [])).toBeTruthy();
    });
});
