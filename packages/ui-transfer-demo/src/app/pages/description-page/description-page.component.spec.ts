import { ComponentFixture, TestBed } from '@angular/core/testing';
import { imports, providers, declarations } from '../../app.module';
import { DescriptionPageComponent } from './description-page.component';

describe('DescriptionPageComponent', () => {
  let component: DescriptionPageComponent;
  let fixture: ComponentFixture<DescriptionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports,
      providers,
      declarations,
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
