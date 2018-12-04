import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomModalPopUpComponent } from './custom-modal-pop-up.component';

describe('CustomModalPopUpComponent', () => {
  let component: CustomModalPopUpComponent;
  let fixture: ComponentFixture<CustomModalPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomModalPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomModalPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
