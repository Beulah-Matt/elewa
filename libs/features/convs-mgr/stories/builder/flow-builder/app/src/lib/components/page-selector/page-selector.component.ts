import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';

import { Observable, switchMap } from 'rxjs';

import { ChangeTrackerService, FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent implements OnInit
{
  screens: FlowScreenV31[];
  state$: Observable<FlowBuilderStateFrame>;

  constructor(private _flowBuilderState: FlowBuilderStateProvider, private _trackChangesService: ChangeTrackerService) { }

  ngOnInit(): void
  {
    this._flowBuilderState.getScreens().subscribe((screens)=> {
      this.screens = screens;
    });
  }

  /** Function handling drag and drop functionality for a component */
  drop(event: CdkDragDrop<FlowScreenV31[]>) {
    moveItemInArray(this.screens, event.previousIndex, event.currentIndex);

    /** Update the order of screens */
    this._flowBuilderState.setScreens(this.screens)
        .pipe((switchMap((screens)=> this._trackChangesService.updateScreens(screens))))
          .subscribe();
  }

  changeScreen(i: number) {
    this._flowBuilderState.changeScreen(i);
  }
  
  addScreen() {
    this._flowBuilderState.addScreen()
  }
}
