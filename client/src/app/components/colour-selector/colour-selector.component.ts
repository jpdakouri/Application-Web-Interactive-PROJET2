import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent implements OnInit {
  // Code inspiré par https://malcoded.com/posts/angular-color-picker/
  constructor() { }

  ngOnInit(): void {
  }

}
