import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewoneproductComponent } from './viewoneproduct.component';

describe('ViewoneproductComponent', () => {
  let component: ViewoneproductComponent;
  let fixture: ComponentFixture<ViewoneproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewoneproductComponent]
    });
    fixture = TestBed.createComponent(ViewoneproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
