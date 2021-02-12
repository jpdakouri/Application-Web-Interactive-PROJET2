import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

import { CurrentColorComponent } from './current-color.component';

describe('CurrentColorComponent', () => {
    let component: CurrentColorComponent;
    let serviceSpy: jasmine.SpyObj<CurrentColourService>;
    beforeEach(() => {
        serviceSpy = jasmine.createSpyObj('CurrentColorService', ['swapColors']);
        component = new CurrentColorComponent(serviceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('swapcolors calls the swapcolors method of the current color service', () => {
        component.swapColours();
        expect(serviceSpy.swapColors).toHaveBeenCalled();
    });
});
