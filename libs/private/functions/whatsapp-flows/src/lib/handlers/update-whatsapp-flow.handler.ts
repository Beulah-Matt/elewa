import axios from 'axios';
import * as fs from "fs/promises";
import * as path from 'path';
import { FlowJSONV31, WFlow } from "@app/model/convs-mgr/stories/flows";
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Query } from '@ngfi/firestore-qbuilder';
import { tmpdir } from 'os';


const GRAPH_API = process.env['GRAPH_API'];
const API_VERSION: string = process.env['API_VERSION'] || 'v18.0';

export class UpdateWhatsappFlowHandler extends FunctionHandler<{data: WFlow, orgId: string}, {success: boolean, validationErrors?: any[];}> {
  _tools: HandlerTools;

  async execute(req: {data: WFlow, orgId: string}, context: FunctionContext, tools: HandlerTools): Promise<{success: boolean, validationErrors?: any[];}> 
  {
    this._tools = tools;

    try {
      const base_url= `${GRAPH_API}/${API_VERSION}/${req.data.flow.id}/assets`;
    
      const channel = await this._getChannel(req.orgId, tools);
      tools.Logger.log(()=> `🟤 This is the channel: ${channel}`)
  
      if(!channel && channel.length < 1) {
        throw 'Channel does not exist for org: ' + req.orgId;
      }
      
      const whatsappChannel = channel[0];
  
      const GRAPH_ACCESS_TOKEN = whatsappChannel.accessToken;
  
      const jsonPath = await this.createJSON(req.data.flow);
  
      if(!jsonPath) {
        throw 'Error creating JSON file';
      }
  
      const formData = this._prepareData(jsonPath);
  
      return axios.post(base_url, formData, {
        headers: {
          'Authorization': `Bearer ${GRAPH_ACCESS_TOKEN}`
        }
      })
    } catch (error) {
      this._tools.Logger.error(()=> `Error when updating flow :: ${error}`);
      return {success: false};
    }
  }

  async createJSON(flowJson: FlowJSONV31) {
    // Create json file with data and return path
    try {
      const tempFilePath = path.join(tmpdir(), ('flow.json'));

      await fs.writeFile(tempFilePath, JSON.stringify(flowJson))
      this._tools.Logger.log(()=> `JSON saved: ${tempFilePath}`);
      
      return tempFilePath;
    } catch (error) {
      this._tools.Logger.error(()=> `Error saving file: ${error}`);
    }
  }

  private _prepareData(path: string): FormData{
    const formData = new FormData();

    formData.append('asset_type', 'FLOW_JSON');
    formData.append('name', 'flow.json');
    formData.append('file', path);
    formData.append('type', 'application/json');
    
    return formData;
  }

  private _getChannel(orgId: string, tools: HandlerTools) {
    const channelRepo$ = tools.getRepository<WhatsAppCommunicationChannel>(`channels`);

    return channelRepo$.getDocuments(new Query().where("orgId", "==", orgId));
  }

}
