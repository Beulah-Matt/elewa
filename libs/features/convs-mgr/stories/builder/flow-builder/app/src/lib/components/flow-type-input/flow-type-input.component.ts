import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Subject } from 'rxjs';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowTextInput } from '@app/model/convs-mgr/stories/flows';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-flow-type-input',
  templateUrl: './flow-type-input.component.html',
  styleUrl: './flow-type-input.component.scss',
})
export class FlowTypeInputComponent implements OnInit 
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

  element: FlowTextInput
  showConfigs = true;

  /** Array of allowed html input types */
  htmlElementTypes = ['text', 'number', 'email', 'password', 'passcode', 'phone'];
  
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
  private autosaveSubject = new Subject<any>();

  private _sbS = new SubSink ()

  constructor(
    private trackerService: ChangeTrackerService,
    private _dialog: MatDialog
) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    this.charCounts.label = this.textInputForm.get('label')?.value?.length || 0;
    this.charCounts.helperText = this.textInputForm.get('helperText')?.value?.length || 0;
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
  
  saveInputConfig(): void 
  {
    if (this.textInputForm.valid) {
      this.element = this.textInputForm.value;  // Capture form values
      this.showConfigs = false;  // Hide configuration form
      this.triggerAutosave(this.element)
    }
  }
  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }

  getInputType(element: FlowTextInput): string {
    return element['input-type'] || 'text';
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(newValue);
  }
}
