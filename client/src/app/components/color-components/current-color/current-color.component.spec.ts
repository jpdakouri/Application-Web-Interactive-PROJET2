import { CurrentColorComponent } from '@app/components/color-components/current-color/current-color.component';
import { CurrentColorService } from '@app/services/current-color/current-color.service';

describe('CurrentColorComponent', () => {
    let component: CurrentColorComponent;
    let serviceSpy: jasmine.SpyObj<CurrentColorService>;
    beforeEach(() => {
        serviceSpy = jasmine.createSpyObj('CurrentColorService', ['swapColors']);
        component = new CurrentColorComponent(serviceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('swapcolors calls the swapcolors method of the current color service', () => {
        component.swapColors();
        expect(serviceSpy.swapColors).toHaveBeenCalled();
    });
});
