import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowTextAreaInput } from '@app/model/convs-mgr/stories/flows';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss',
})
export class TextAreaInputComponent implements OnInit
{
  @Input() elementForm: FormGroup;

  elementIndex: number;

  /** The type of input, for text inputs */
  type: FlowControlType;
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl;

  /** Dynamic input id */
  inputId = '';
  /** Form fields for inputs */
  textInputForm: FormGroup;

  element: FlowTextAreaInput;
  showConfigs = true;

  charCounts = {
    label: 0,
    name: 0,
  };
  readonly maxChars = {
    label: 30,
    name: 80,
  };

  /** View Container */
  vrc = inject(ViewContainerRef);

  private _sbS = new SubSink ();

  constructor(
    private trackerService: ChangeTrackerService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void 
  {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    this.charCounts.label = this.textInputForm.get('label')?.value?.length || 0;
    this.charCounts.name = this.textInputForm.get('name')?.value?.length || 0;

    // Setup autosave with debounce
    this.textInputForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
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
  
  /** Trigger autosave */
  private triggerAutosave(newValue: any): void 
  {
    this.trackerService.updateValue(newValue, this.elementIndex);
  }

  /**
   * Function called to save inputs 
   * Important to setting view mode as well for forms with multiple inputs for configuration.
   */
  saveInputConfig(): void 
  {
    if (this.textInputForm.valid) {
      const inputConfigs = this.textInputForm.value;  // Capture form values
      this.element = inputConfigs
      this.showConfigs = false;  // Hide configuration form
      this.triggerAutosave(this.element)
    }
  }
}
