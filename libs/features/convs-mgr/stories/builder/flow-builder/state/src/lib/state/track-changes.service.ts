
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, switchMap, take } from 'rxjs';
// import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlow, FlowPageLayoutElementV31, FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';
import { WFlowService } from '@app/state/convs-mgr/wflows';

import { FlowBuilderStateProvider } from './flow-builder-state.provider';
import { getUUID } from '../utils/get-uuid.util';
import { FlowBuilderStateFrame } from '../model/flow-builder-state-frame.interface';
import { buildFlowJSON } from '../utils/build-json.util';
// import { WFlowService } from '../providers/wflow.service';


@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any, screenId?: number }[]>([]);

  constructor(private _wFlowService: WFlowService, private _flowBuilderState: FlowBuilderStateProvider) { }

  public change$ = this.changeSubject.asObservable();

  /**
   * Update value and trigger save
   */
  updateValue(newValue: FlowPageLayoutElementV31) {
      // Build and post the updated flow with all screens and controls
      const state = this._flowBuilderState.get();
      const activeScreen = this._flowBuilderState.activeScreen$;
      const screens = this._flowBuilderState.getScreens();

      return combineLatest([state, activeScreen, screens]).pipe(take(1),switchMap(([state, activeScreen, screens]) => {

        const wflow = this._generateFlow(state, newValue, activeScreen, screens[activeScreen]);

        const config = state.flow;
        if (config && config.flow.id) {

          return this._wFlowService.add(wflow);
        } else {
          wflow.flow.id = config.flow.id;
          return this._wFlowService.initFlow(wflow);
        }
      }));
  }

  updateScreens(screens: FlowScreenV31[]) {
    const state = this._flowBuilderState.get();

    return state.pipe(take(1),switchMap((state) => {

      const wFlow = state.flow;
      if(!wFlow || !wFlow.flow.id) {
        return of(null);
      }

      wFlow.flow.screens = screens;
      
      return this._wFlowService.add(wFlow);
    }));
  }
  

  private _generateFlow(state: FlowBuilderStateFrame, update: FlowPageLayoutElementV31,screenIndex: number, screen: FlowScreenV31) {
    const wflow: WFlow = {
      flow: buildFlowJSON(state, update,screenIndex, screen),
      name: `Flow_${Date.now()}`,
      validation_errors: [],
      timestamp: new Date().getTime(),
      id: getUUID()
    };
    
    return wflow
  }

  /**
   * Clear all changes
   */
  clearChanges(): void {
    this.changeSubject.next([]);
  }
}
