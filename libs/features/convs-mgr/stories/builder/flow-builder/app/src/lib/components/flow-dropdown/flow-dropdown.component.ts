import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FlowControl, FlowControlType, FlowDropDownInput } from '@app/model/convs-mgr/stories/flows';
import { debounceTime } from 'rxjs';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

@Component({
  selector: 'lib-flow-dropdown',
  templateUrl: './flow-dropdown.component.html',
  styleUrl: './flow-dropdown.component.scss',
})
export class FlowDropdownComponent implements OnInit {
  @Input() elementForm: FormGroup;

  type: FlowControlType;
  flowControlType = FlowControlType;

  control: FlowControl;
  inputId = '';
  textInputForm: FormGroup;

  element: FlowDropDownInput;
  showConfigs = true;

  vrc = inject(ViewContainerRef)

  charCounts = {
    label: 0,
    option: 0,
  };
  readonly maxChars = {
    label: 20,
    option: 80,
  };
  
  constructor(
    private trackerService: ChangeTrackerService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void 
  {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    this.charCounts.label = this.textInputForm.get('label')?.value?.length || 0;

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
  private triggerAutosave(newValue: any): void 
  {
    this.trackerService.updateValue(newValue);
  }

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
