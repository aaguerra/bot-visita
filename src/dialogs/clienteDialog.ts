import {
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import {setPriority} from 'os';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';

import clientes from '../Models/Cliente';

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

export class ClienteDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || 'clienteDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
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
     * If an origin city has not been provided, prompt for one.
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
Cliente: ${cliente.nombre}
RUC: ${cliente.cedula}
Objetivo: ${cliente.objetivo}
Direccion: ${cliente.direccion}
Detalle:
${cliente.detalle}
            `);
        } else {
            await stepContext.context.sendActivity(`Error!. No exsiste un cliente asociado con el codigo: "${codigoCliente}"`);
        }
        return await stepContext.next();
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.endDialog();
    }

}
