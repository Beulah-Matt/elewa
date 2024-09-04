import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { BehaviorSubject, map } from 'rxjs';

import { JobTypes, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { TemplateMessage } from '@app/model/convs-mgr/conversations/messages';

import { ScheduledMessageStore } from '../store/scheduled-message.store';

@Injectable({
  providedIn: 'root',
})
export class ScheduleMessageService {
  private scheduleOption$ = new BehaviorSubject<{schedule: ScheduledMessage, template: TemplateMessage}>(null as any);
  optionsSet$ = this.scheduleOption$.asObservable();
  
  constructor(
    private _aff:  AngularFireFunctions, 
    private _scheduledMessageStore$$: ScheduledMessageStore
  ) {}

  setOptions(options: {schedule: ScheduledMessage, template: TemplateMessage}) {
    this.scheduleOption$.next(options);
  }

  addScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.add(message, message.id);
  }
  updateScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.update(message);
  }
  removeScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.remove(message);
  }

  getScheduledMessageById$(id: string) {
    return this._scheduledMessageStore$$.getOne(id);
  }

  getScheduleByTemplate$(templateId: string) {
    return this._scheduledMessageStore$$.get()
          .pipe(map((schedules)=> {
            const schedule = schedules.filter((sch)=> sch.objectID === templateId)[0];
            if(schedule) return schedule;
            return null;
          }))
  }


  getScheduledMessages$() {
    return this._scheduledMessageStore$$.get();
  }

  scheduleMessage(scheduleMessagePayload: any){
    return this.scheduleCallFunction(scheduleMessagePayload);
  }

  private scheduleCallFunction(data: any){
    return this._aff.httpsCallable('scheduleMessageTemplates')(data);
  }

  scheduleInactivity(inactivityPayload: any) {
    return this.callInactivityFunction(inactivityPayload);
  }

  private callInactivityFunction(data: {  message: TemplateMessage, inactivityTime: number; channelId: string;}) {
    const inactivityRef = this._aff.httpsCallable('setInactivity');
    return inactivityRef(data);
  }
  
}