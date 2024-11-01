import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-flow-screen-settings',
  templateUrl: './flow-screen-settings.component.html',
  styleUrl: './flow-screen-settings.component.scss',
})
export class FlowScreenSettingsComponent {
  @Output() showScreenSettings = new EventEmitter<boolean>();

  isChecked = false;

  currentScreenChar = 0;
  readonly screenMaxChar = 20;

  onInputChange(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    this.currentScreenChar = input.value.length;

    if(this.currentScreenChar > this.screenMaxChar){
      input.value = input.value.slice(0, this.screenMaxChar);
    }
  }

  closeScreenSettings(){
    this.showScreenSettings.emit(false);
  }
}
