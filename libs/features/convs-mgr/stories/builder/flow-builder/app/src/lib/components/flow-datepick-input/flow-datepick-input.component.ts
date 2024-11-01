import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowDatePickerInput, FlowPageLayoutElementTypesV31, FlowTextAreaInput, FlowTextInput } from '@app/model/convs-mgr/stories/flows';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';

@Component({
  selector: 'lib-flow-datepick-input',
  templateUrl: './flow-datepick-input.component.html',
  styleUrl: './flow-datepick-input.component.scss',
})
export class FlowDatepickInputComponent implements OnInit
{ 
  @Input() elementForm: FormGroup;
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl

  /** Dynamic input id */
  inputId = '';
  /** Form fields for inputs */
  textInputForm: FormGroup;

  element: FlowTextInput | FlowDatePickerInput | FlowTextAreaInput
  showConfigs = true;

  charCounts = {
    label: 0,
    helperText: 0,
  };
  readonly maxChars = {
    label: 20,
    helperText: 80,
  };

  /** View Container */
  vrc = inject(ViewContainerRef)

  private _sbS = new SubSink ()

  constructor(
    private trackerService: ChangeTrackerService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    this.textInputForm.valueChanges
    .pipe(debounceTime(10000))  //10 seconds
      .subscribe(value=> {
      this.triggerAutosave(value);
    });
  }
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const inputId = input.id as keyof typeof this.charCounts;

    if (this.charCounts[inputId] !== undefined) {
      if (input.value.length > this.maxChars[inputId]) {
        input.value = input.value.slice(0, this.maxChars[inputId]);
      }
      this.charCounts[inputId] = input.value.length;
    }
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }
  
  saveInputConfig(_values: FlowDatePickerInput): void {
    if (this.textInputForm.valid) {
    
      const metaDateInput: FlowDatePickerInput = {
        name: _values.name,
        label: _values.label,
        required: _values.required,
        "helper-text": _values['helper-text'] || '', 
        type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT,
      };
      this.element = metaDateInput
      this.showConfigs = false;  
      this.triggerAutosave(metaDateInput);
    }
  } 

   /** Trigger autosave servie */
   private triggerAutosave(newValue: FlowDatePickerInput): void {
    this.trackerService.updateValue(newValue);
  }

}