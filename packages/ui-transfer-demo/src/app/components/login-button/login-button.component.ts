import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

  @Input() public description: string;
  @Input() public imgpath: string;

  constructor() { }

  ngOnInit(): void { }
}
