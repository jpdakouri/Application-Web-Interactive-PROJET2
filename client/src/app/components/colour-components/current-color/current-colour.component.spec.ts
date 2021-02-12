import { CurrentColourComponent } from '@app/components/colour-components/current-color/current-colour.component';
import { CurrentColourService } from '@app/services/current-colour/current-colour.service';

describe('CurrentColorComponent', () => {
    let component: CurrentColourComponent;
    let serviceSpy: jasmine.SpyObj<CurrentColourService>;
    beforeEach(() => {
        serviceSpy = jasmine.createSpyObj('CurrentColorService', ['swapColors']);
        component = new CurrentColourComponent(serviceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('swapcolors calls the swapcolors method of the current color service', () => {
        component.swapColours();
        expect(serviceSpy.swapColors.calls).toBeTruthy();
    });
});
