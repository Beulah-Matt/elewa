import { RestRegistrar } from '@ngfi/functions';
import { ConvLearnFunction } from "../../conv-learn-func.class";
import { UpdateWhatsappFlowHandler } from '@app/functions/whatsapp-flows';

const onUpdateWhatsappFlowHandler = new UpdateWhatsappFlowHandler();

export const updateWhatsappFlow = new ConvLearnFunction('updateWhatsappFlow',
                                                  new RestRegistrar(),
                                                  [],
                                                  onUpdateWhatsappFlowHandler)
                                                  .build()
