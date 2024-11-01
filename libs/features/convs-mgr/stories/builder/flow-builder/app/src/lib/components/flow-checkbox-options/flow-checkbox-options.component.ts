import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OptionGroupFormService } from '../../services/input-options-group-form.service';

import { FEFlowOptionGroup } from '../../models/fe-flow-option-element.model';
import { buildV31CheckboxGroup } from '../../utils/build-checkbox-group.util';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControlType, FlowControl } from '@app/model/convs-mgr/stories/flows';
import { SubSink } from 'subsink';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-flow-checkbox-options',
  templateUrl: './flow-checkbox-options.component.html',
  styleUrl: './flow-checkbox-options.component.scss',
})
export class FlowCheckboxOptionsComponent implements OnInit, OnDestroy
{
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl
  /* Pass in the radio group */
  flowGroup?: FEFlowOptionGroup; 
  checkboxGroupForm: FormGroup;
  /** Toggle view state */
  showConfigs = true;

  charCounts = {
    label: 0,
    option: 0,
  };
  readonly maxChars = {
    label: 30,
    option: 30,
  };

  private _sBS = new SubSink()

  constructor(private optionGroupFormService: OptionGroupFormService,
              private fb: FormBuilder,
              private _trackerService: ChangeTrackerService,
              private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkboxGroupForm = this.optionGroupFormService.createRadioGroupForm(this.flowGroup);
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
  
  /** Options controls */
  get options() {
    return this.checkboxGroupForm.get('options') as FormArray;
  }

  /** Adding another option */
  addOption() {
    const optionGroup = this.fb.group({
      optionId: [Math.random().toString()],
      label: ['', Validators.required]
    });
    this.options.push(optionGroup);
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  /**
   * Gets form values
   * Returns a V31OptionsGroup object
   * Then sends the object to tracker service for saving in state
   */
  saveRadioConfig() {
    if (this.checkboxGroupForm.valid) {
      this.flowGroup = this.checkboxGroupForm.value;      
      const metaRGroup = buildV31CheckboxGroup(this.checkboxGroupForm.value)

      this.showConfigs = false;
      this._trackerService.updateValue(metaRGroup);
      
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy(): void {
      this._sBS.unsubscribe()
  }

}
