import {StatePropertyAccessor, TurnContext} from 'botbuilder';
import {
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

import clientes from '../Models/Cliente';

export class VisitasDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || 'visitasDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                // this.initStep.bind(this),
                this.finalStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    private async initStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Entre al visita del dialogo' });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        let cliente: any = null;
        for (let i = 0; i < clientes.length; i++) {
            cliente = clientes[i];
            await stepContext.context.sendActivity(`
Codigo: ${cliente.codigo}
Cliente: ${cliente.nombre}
RUC: ${cliente.cedula}
Objetivo: ${cliente.objetivo}
Direccion: ${cliente.direccion}`);
        }
        return await stepContext.endDialog();
    }

}
