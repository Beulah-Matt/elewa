import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext, RestResult } from '@ngfi/functions';

import { MicroAppProgress, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';

import { AssessmentProgressService } from './assessments/assessment-progress.service';

/**
 * Handler responsible for updating user progress in micro-apps via a webhook callback.
 */
export class UpdateMicroAppProgressHandler extends FunctionHandler<MicroAppProgress, RestResult> 
{
  public async execute(req: MicroAppProgress, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    const payload = req;
    
    tools.Logger.log(() => `Received progress update callback ${JSON.stringify(req)}`);

    tools.Logger.log(() => `Processing progress for app with ID ${payload.appId} for user ${payload.endUserId}`);
    
    try {
      if(req.type === MicroAppTypes.Assessment) {
        const assessmentProgressSrv = new AssessmentProgressService(tools);
        return assessmentProgressSrv.trackProgress(req);
      } else {
        tools.Logger.log(() => `[UpdateMicroAppProgressHandler].execute - Progress tracking for micro app type - ${req.type} - not configured `);
        return { status: 200 } as RestResult;
      }
    } catch (error) {
      tools.Logger.error(() => `[UpdateMicroAppProgressHandler].execute - Encountered error :: ${error}`);
      return { success: false, error: JSON.stringify(error) };
    }
  }
}
