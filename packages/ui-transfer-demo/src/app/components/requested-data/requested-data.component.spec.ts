import { ComponentFixture, TestBed } from '@angular/core/testing';
import { declarations, imports, providers } from '../../app.module';
import { RequestedDataComponent } from './requested-data.component';

describe('RequestedDataComponent', () => {
  let component: RequestedDataComponent;
  let fixture: ComponentFixture<RequestedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports,
      providers,
      declarations,
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
