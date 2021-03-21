import { ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpService } from '@app/services/http/http.service';
import { TAG_NAME_REGEX } from '@app/services/services-constants';
import { Tag } from '@app/utils/interfaces/tag';

@Component({
    selector: 'app-search-by-tags',
    templateUrl: './search-by-tags.component.html',
    styleUrls: ['./search-by-tags.component.scss'],
})

/*********************************/
/************TODO: TESTS**********/
/*********************************/
export class SearchByTagsComponent {
    tagName: FormControl;
    tags: Tag[];
    readonly separatorKeysCodes: number[] = [ENTER];
    @Output() tagFlag: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private httpService: HttpService) {
        this.tagName = new FormControl('', [Validators.pattern(TAG_NAME_REGEX)]);
        this.tags = [];
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim() && TAG_NAME_REGEX.test(value)) {
            this.tags.push({ name: value.trim() });
        }
        if (input) {
            input.value = '';
        }
    }

    remove(labelToRemove: Tag): void {
        const indexToRemove = this.tags.indexOf(labelToRemove);
        if (indexToRemove >= 0) this.tags.splice(indexToRemove, 1);
    }

    getErrorMessageLabel(): string {
        return this.tagName.invalid ? 'Peut seulement être composé de chiffres, lettres et espaces' : '';
    }

    toStringArray(labels: Tag[]): string[] {
        const tempArray = new Array<string>();
        let i: number;
        for (i = 0; i < labels.length; i++) tempArray.push(labels[i].name);
        return tempArray;
    }

    getDrawingsByTags(): void {
        let tags = this.toStringArray(this.tags);
        tags = this.tags != undefined ? tags : ['none'];
        this.httpService.sendTags(tags).subscribe((result) => {
            this.tagFlag.emit(true);
        });
    }
}
