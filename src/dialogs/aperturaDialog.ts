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

const TEXT_PROMPT = 'textPromptApertura';
const WATERFALL_DIALOG = 'waterfallDialogApertura';

export class AperturaDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || 'aperturaDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.initStep.bind(this),
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
        console.log('-----------------------------1');
        return await stepContext.prompt(TEXT_PROMPT, { prompt: 'Entre al apertura del dialogo' });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        console.log('-----------------------------2');
        return await stepContext.endDialog();
    }

}
