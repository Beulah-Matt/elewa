import axios from 'axios';

import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Query } from '@ngfi/firestore-qbuilder';


const GRAPH_API = process.env['GRAPH_API'];
const API_VERSION: string = process.env['MESSENGER_VERSION'] || 'v18.0';

/** 
 * In order to visualize the Flows created, you can generate a web preview URL with this handler. 
 *  The preview URL is public and can be shared with different stakeholders to visualize the Flow.
 * 
 * You can also interact with it in a similar way users will interact on their phones adding the 
 *  URL parameters described in the link below
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowsapi/#preview
 */
export class GetWhatsappFlowPreviewHandler extends FunctionHandler<{flowId: string, orgId: string}, any> {
  async execute(data: {flowId: string, orgId: string}, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    try {
      const channel = await this._getChannel(data.orgId, tools);
      tools.Logger.log(()=> `🟤 Channel: ${channel}`)

      if(!channel && channel.length < 1) {
        throw 'Channel does not exist for org: ' + data.orgId;
      }
      
      const whatsappChannel = channel[0];
  
      const GRAPH_ACCESS_TOKEN = whatsappChannel.accessToken;

      if(!GRAPH_ACCESS_TOKEN) {
        throw "No access token found!";
      }
  
      const base_url= `${GRAPH_API}/${API_VERSION}/${data.flowId}?fields=preview.invalidate(false)`;
  
      tools.Logger.log(()=> `🟤 Generated URL: ${base_url}`);
  
      // Update the flow ID
      const resp = await axios.get(base_url, {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${GRAPH_ACCESS_TOKEN}`
        }
      })
  
      if(resp.data && resp.data.preview) {
    
        return {data: resp.data, success: true};
      } else {
        tools.Logger.error(()=> `Error when creating flow :: ${JSON.stringify(resp.data || "")}`)
        return {success: false, error: resp.data};
      }
      
    } catch (error) {
      tools.Logger.error(()=> `Error when creating flow :: ${error}`)
      return {success: false, error: error};
    }
  }

  private _getChannel(orgId: string, tools: HandlerTools) {
    const channelRepo$ = tools.getRepository<WhatsAppCommunicationChannel>(`channels`);

    return channelRepo$.getDocuments(new Query().where("orgId", "==", orgId));
  }
}
