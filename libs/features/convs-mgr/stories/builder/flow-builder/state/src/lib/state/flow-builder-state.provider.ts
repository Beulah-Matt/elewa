import { SubSink } from "subsink";
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from "rxjs";

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";
import { __StoryToFlowFrame, _CreateScreen } from "../model/story-to-flow-frame.function";

import { WFlowService } from "@app/state/convs-mgr/wflows";
import { FlowControl, FlowPageLayoutElementV31, FlowScreenV31 } from "@app/model/convs-mgr/stories/flows";
import { Injectable, ViewContainerRef } from "@angular/core";
import { _MapToFlowControl } from "../utils/map-to-flow-element.util";

@Injectable({
  providedIn: 'root',
})
export class FlowBuilderStateProvider
{
  private _sbS = new SubSink();

  private _isLoaded = false;
  private _activeInstance?: FlowBuilderStateFrame;

  /** Index of the active screen. For now it will only show the first screen */
  private activeScreen = new BehaviorSubject<number>(0);
  activeScreen$ = this.activeScreen.asObservable();

  /** BehaviorSubject to track changes in control state */
  private _controls$$ = new BehaviorSubject<FlowControl[]>([]);
  private _screens = new BehaviorSubject<FlowScreenV31[]>([]);
  screens$ = this._screens.asObservable();

  state: FlowBuilderStateFrame;

  private _state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);
  private _state$: Observable<FlowBuilderStateFrame>;

  constructor(private _flow$$: WFlowService)
  { }

  /** 
   * Initialise a new flow builder state. 
   * This is done on loading of the flow page (ngOnInit).
   */
  get()
  {
    const flow$ = this._flow$$.get();
    const flowConfig$ = this._flow$$.getFlowConfig();

    return combineLatest([flow$, flowConfig$]).pipe(map(([story, flow]) =>
    {
      this.state = __StoryToFlowFrame(story, flow);

      this._state$$.next(this.state);
      // this._elements.next(this.state.flow.flow.screens[screen].layout.children);
      return this.state;
    }));
  }

  getScreens() {
    return this.screens$;
  }

  getControls() {

     return combineLatest([this.get(), this.activeScreen$]).pipe(switchMap(([state, screen])=> {
      let elements:  FlowPageLayoutElementV31[] = [];
      const activeScreen  = state.flow.flow.screens[screen];

      if(!activeScreen) {
        const newScreen = _CreateScreen(state.story.id as string, activeScreen);

        elements = newScreen.layout.children;
      } else {
        elements  = activeScreen.layout.children;
      }

      const controls = elements.map((e)=>  _MapToFlowControl(e))
      this._controls$$.next(controls);
      this.setScreens(state.flow.flow.screens);
      return this._controls$$;
    }))
  }

  addScreen()
  {
    const screens = this._screens.getValue();
    const lastScreenIndex = screens.length - 1;
    const newScreenIndex = lastScreenIndex + 1;

    const newScreen  = _CreateScreen(this.state.story.id as string, newScreenIndex + 1);

    screens.push(newScreen);

    this.setScreens(screens);
    // Update the state with the current screens
    // this._state$$.next(this.state);

    // Move the user to the new screen
    this.changeScreen(newScreenIndex);

    return screens;
  }

  setScreens(screens: FlowScreenV31[]) {
    this._screens.next(screens);
  }

  changeScreen(i: number) {
    this.activeScreen.next(i);
  }

  /**
   * @returns The active instance, if set.
   */
  // get()
  // {
  //   return this._state$$.asObservable().pipe(filter(s => s != null));
  // }

  /**
  * Gets the BehaviorSubject for controls.
  */
  // getControls(): Observable<FlowControl[]>
  // {
  //   return this._controls$$.asObservable();
  // }

  /**
   * Updates the list of controls and notifies subscribers.
   * @param controls - The new list of controls.
   */
  setControls(control: FlowControl)
  {
    const current = this._controls$$.getValue();
    current.push(control);
    this._controls$$.next(current);
  }



  /** Done at ngOnDelete of Flow builder page. Used to avoid memory leaks at the flow level. */
  unset()
  {
    this._isLoaded = false;
    this._activeInstance = undefined;
    this._state$$ = new BehaviorSubject<FlowBuilderStateFrame>(null as any);

    this._sbS.unsubscribe();
    this._sbS = new SubSink();
  }
}