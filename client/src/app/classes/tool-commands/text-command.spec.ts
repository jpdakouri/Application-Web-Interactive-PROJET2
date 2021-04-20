import { TestBed } from '@angular/core/testing';
import { TextService } from '@app/services/tools/text-service/text.service';
import { TextAlign } from '@app/utils/enums/text-align.enum';
import { TextFont } from '@app/utils/enums/text-font.enum';
import { TextCommand } from './text-command';

describe('TextCommand', () => {
    it('should create an instance', () => {
        expect(new TextCommand(TestBed.inject(TextService), '', '', '', TextFont.Arial, TextAlign.Start, 1, { x: 0, y: 0 }, 1)).toBeTruthy();
    });
});
