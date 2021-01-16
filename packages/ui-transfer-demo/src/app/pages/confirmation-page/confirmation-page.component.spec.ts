import { ComponentFixture, TestBed } from '@angular/core/testing';
import { declarations, imports, providers } from '../../app.module';
import { ConfirmationPageComponent } from './confirmation-page.component';

describe('AppConnectConfirmationPageComponent', () => {
  let component: ConfirmationPageComponent;
  let fixture: ComponentFixture<ConfirmationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports,
      providers,
      declarations,
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
