import { Component, OnInit } from '@angular/core';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Store } from '@ngrx/store';
import { PaySlip } from 'src/app/models/payslip.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss']
})
export class ConfirmationPageComponent implements OnInit {
  public name = null;
  public allowanceSuccess: boolean;
  public netAmountAvailable = false;

  constructor(
    private store: Store<{ app: { session: Session; name: string; payslips: PaySlip[] } }>,
  ) { }

  ngOnInit(): void {
    this.store.select<string>(state => state.app.name).subscribe(name => this.name = name);

    this.store.select<PaySlip[]>(state => state.app.payslips).subscribe(payslips => {
      if (payslips && payslips.length > 0) {
        const latestSlip: PaySlip = _.orderBy(payslips, 'until', 'desc')[0];
        this.netAmountAvailable = latestSlip.netAmount !== null && latestSlip.netAmount !== undefined;
        this.allowanceSuccess = this.netAmountAvailable ? latestSlip.netAmount < 1000 : false;
      }
    });
  }
}
