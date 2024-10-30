import { RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";
import { GetWhatsappFlowPreviewHandler } from '@app/functions/whatsapp-flows';

const getWhatsappFlowPreviewHandler = new GetWhatsappFlowPreviewHandler()

export const getWhatsappFlowPreview = new ConvLearnFunction('getWhatsappFlowPreview',
                                                  new RestRegistrar(),
                                                  [],
                                                  getWhatsappFlowPreviewHandler)
                                                  .build()
