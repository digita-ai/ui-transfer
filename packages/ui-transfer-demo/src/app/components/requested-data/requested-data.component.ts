import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-requested-data',
  templateUrl: './requested-data.component.html',
  styleUrls: ['./requested-data.component.scss']
})
export class RequestedDataComponent implements OnInit {

  @Input() public text: string;
  @Input() public prefixIcon: string;
  @Input() public prefixIconFontSet = 'material-icons-outlined';

  constructor() { }

  ngOnInit(): void { }

}
