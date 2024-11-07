import { FirestoreCreateRegistrar } from '@ngfi/functions';
import { UpdateWhatsappFlowHandler } from '@app/functions/whatsapp-flows';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const updateWhatsappFlowHandler = new UpdateWhatsappFlowHandler();
const FLOWS_REPO = `orgs/{orgId}/stories/{storyId}/flows/{flowId}`;

export const onUpdateWhatsappFlow = new ConvLearnFunction('onUpdateWhatsappFlow',
                                                  new FirestoreCreateRegistrar(FLOWS_REPO),
                                                  [],
                                                  updateWhatsappFlowHandler)
                                                  .build()
