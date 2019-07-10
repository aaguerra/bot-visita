import {
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';

import clientes from '../Models/Cliente';

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

export class EditarClienteDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || 'editarClienteDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.initStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    private async initStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Ingrese el código del cliente:' });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        let cliente: any;
        const codigoCliente: string = stepContext.result as string;
        for (var i = 0; i < clientes.length; i++) {
            if (clientes[i].codigo === codigoCliente.trim()) {
                cliente = clientes[i];
                break;
            }
        }
        if (cliente) {
            await stepContext.context.sendActivity(`
Codigo: ${cliente.codigo}
Cliente: ${cliente.nombre}
Objetivo: ${cliente.objetivo}
            `);
            const msg = `Por favor confirme que desea finalizar la actividad`;

            // Offer a YES/NO prompt.
            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
        } else {
            await stepContext.context.sendActivity(`Error!. No exsiste un cliente asociado con el codigo: "${codigoCliente}"`);
            return await stepContext.next();
        }
    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            await stepContext.context.sendActivity(`La actividad a sido confirmada!`);

            return await stepContext.endDialog();
        } else {
            return await stepContext.endDialog();
        }
    }

}
