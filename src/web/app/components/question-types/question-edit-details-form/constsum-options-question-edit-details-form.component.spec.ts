import { DragDropModule } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ConstsumOptionsFieldComponent } from "./constsum-options-field/constsum-options-field.component";
import { ConstsumOptionsQuestionEditDetailsFormComponent } from "./constsum-options-question-edit-details-form.component";

describe("ConstsumOptionsQuestionEditDetailsFormComponent", () => {
  let component: ConstsumOptionsQuestionEditDetailsFormComponent;
  let fixture: ComponentFixture<ConstsumOptionsQuestionEditDetailsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, DragDropModule],
      declarations: [
        ConstsumOptionsQuestionEditDetailsFormComponent,
        ConstsumOptionsFieldComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ConstsumOptionsQuestionEditDetailsFormComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should prevent alphabetical character inputs in onIntegerInput", () => {
    const event = new KeyboardEvent("keypress", {
      key: "b",
    });

    const eventSpy = jest.spyOn(event, "preventDefault");
    component.onIntegerInput(event);
    expect(eventSpy).toHaveBeenCalled();
  });

  it("should prevent decimal point inputs in onIntegerInput", () => {
    const event = new KeyboardEvent("keypress", {
      key: ".",
    });

    const eventSpy = jest.spyOn(event, "preventDefault");
    component.onIntegerInput(event);
    expect(eventSpy).toHaveBeenCalled();
  });

  it("should allow digit inputs in onIntegerInput", () => {
    const event = new KeyboardEvent("keypress", {
      key: "7",
    });

    const eventSpy = jest.spyOn(event, "preventDefault");
    component.onIntegerInput(event);
    expect(eventSpy).not.toHaveBeenCalled();
  });

  it("should allow number input with less than or equal to 9 digits", () => {
    const inputElement = fixture.debugElement.query(By.css("#max-point"))
      .nativeElement as HTMLInputElement;
    const inputEvent = new InputEvent("input");
    inputElement.dispatchEvent(inputEvent);
    (inputEvent.target as HTMLInputElement).value = "12345";
    component.restrictIntegerInputLength(inputEvent, "points");
    expect((inputEvent.target as HTMLInputElement).value).toEqual("12345");
  });

  it("should restrict number input with more than 9 digits to 9 digits", () => {
    const inputElement = fixture.debugElement.query(By.css("#max-point"))
      .nativeElement as HTMLInputElement;
    const inputEvent = new InputEvent("input");
    inputElement.dispatchEvent(inputEvent);
    (inputEvent.target as HTMLInputElement).value = "123456789012345";
    component.restrictIntegerInputLength(inputEvent, "points");
    expect((inputEvent.target as HTMLInputElement).value).toEqual("123456789");
  });

  it("should render separate Constant Sum question instances with independent options", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const fixture1 = TestBed.createComponent(
      ConstsumOptionsQuestionEditDetailsFormComponent
    );
    const fixture2 = TestBed.createComponent(
      ConstsumOptionsQuestionEditDetailsFormComponent
    );

    fixture1.componentInstance.model.constSumOptions = ["Option 1", "Option 2"];
    fixture2.componentInstance.model.constSumOptions = [
      "Option A",
      "Option B",
      "Option C",
    ];

    container.appendChild(fixture1.nativeElement);
    container.appendChild(fixture2.nativeElement);

    fixture1.detectChanges();
    fixture2.detectChanges();

    const radios1 = fixture1.nativeElement.querySelectorAll(
      '#radio-options-test-wrapper input[type="radio"]'
    );
    const radios2 = fixture2.nativeElement.querySelectorAll(
      '#radio-options-test-wrapper input[type="radio"]'
    );

    expect(radios1.length).toBe(2);
    expect(radios2.length).toBe(3);

    (radios1[0] as HTMLInputElement).click();
    fixture1.detectChanges();

    expect((radios2[0] as HTMLInputElement).checked).toBe(false);

    container.remove();
  });
});

it.only("should isolate radio selections between different instances", waitForAsync(() => {
  const fixture1 = TestBed.createComponent(
    ConstsumOptionsQuestionEditDetailsFormComponent
  );
  const fixture2 = TestBed.createComponent(
    ConstsumOptionsQuestionEditDetailsFormComponent
  );

  fixture1.componentInstance.model.constSumOptions = ["Option A", "Option B"];
  fixture2.componentInstance.model.constSumOptions = ["Option X", "Option Y"];

  const container = document.createElement("div");
  document.body.appendChild(container);
  container.appendChild(fixture1.nativeElement);
  container.appendChild(fixture2.nativeElement);

  fixture1.detectChanges();
  fixture2.detectChanges();

  // Use nativeElement.querySelectorAll to ensure DOM elements are queried
  const radio1 = fixture1.nativeElement.querySelectorAll('input[type="radio"]');
  const radio2 = fixture2.nativeElement.querySelectorAll('input[type="radio"]');

  expect(radio1.length).toBeGreaterThan(0);
  expect(radio2.length).toBeGreaterThan(0);

  (radio1[0] as HTMLInputElement).click();
  fixture1.detectChanges();

  expect((radio1[0] as HTMLInputElement).checked).toBe(true);
  expect((radio2[0] as HTMLInputElement).checked).toBe(false);

  container.remove();
}));
