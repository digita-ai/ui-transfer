import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports, providers, declarations } from '../../app.module';
import { ConnectPageComponent } from './connect-page.component';

describe('ConnectPageComponent', () => {
  let component: ConnectPageComponent;
  let fixture: ComponentFixture<ConnectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports,
      providers,
      declarations,
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
