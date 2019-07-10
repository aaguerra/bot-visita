import {TurnContext} from 'botbuilder';
import {
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

export class MenuDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || 'menuDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                // this.initStep.bind(this),
                this.finalStep.bind(this),
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {TurnContext} context
     * @param accessor
     */
    // public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
    //     const dialogSet = new DialogSet(accessor);
    //     dialogSet.add(this);
    //
    //     const dialogContext = await dialogSet.createContext(context);
    //     const results = await dialogContext.continueDialog();
    //     if (results.status === DialogTurnStatus.empty) {
    //         await dialogContext.beginDialog(this.id);
    //     }
    // }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    private async initStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Entre al menu del dialogo' });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        await stepContext.context.sendActivity(`
El sistema posee las siguientes palabras como opciones del menu:
    * "actividades": ( Para saber las actividades planificadas del dia en curso )
    * "?": ( Para saber el detalle de una actividad planificada)
    * "+": ( Para confirmar que una actividad ya fue realizada)
                `);
        return await stepContext.endDialog();
    }

}
