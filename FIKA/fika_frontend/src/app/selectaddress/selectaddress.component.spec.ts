import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectaddressComponent } from './selectaddress.component';

describe('SelectaddressComponent', () => {
  let component: SelectaddressComponent;
  let fixture: ComponentFixture<SelectaddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectaddressComponent]
    });
    fixture = TestBed.createComponent(SelectaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
