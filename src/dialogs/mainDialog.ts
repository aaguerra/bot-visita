// import { TimexProperty } from '@microsoft/recognizers-text-data-types-timex-expression';
// import { BookingDetails } from './bookingDetails';
// import { BookingDialog } from './bookingDialog';
// https://github.com/microsoft/BotBuilder-Samples/blob/master/samples/javascript_nodejs/06.using-cards/dialogs/mainDialog.js
// https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-state?view=azure-bot-service-4.0&tabs=javascript
import {BotState, CardFactory, StatePropertyAccessor, TurnContext} from 'botbuilder';
import {
    ComponentDialog, DialogContext,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
} from 'botbuilder-dialogs';
import {EnumIntencion} from '../Models/enum/EnumIntencion';
// import { LuisHelper } from './luisHelper';
import {CARDS, CONSTANTS} from '../util/constants';
import {Logger} from '../util/logger';
import {LuisHelper} from '../util/luisHelper';
import {AperturaDialog} from './aperturaDialog';
import {ClienteDialog} from './clienteDialog';
import {EditarClienteDialog} from './editarClienteDialog';
import {LoginDialog} from './loginDialog';
import {MenuDialog} from './menuDialog';
import {VisitasDialog} from './visitasDialog';

const MENU_DIALOG = 'MenuDialog';

export class MainDialog extends ComponentDialog {

    private conversationData: StatePropertyAccessor;
    private userProfile: StatePropertyAccessor;
    private logger: Logger;

    constructor(logger: Logger, conversationState: BotState, id?: string) {
        super(id || CONSTANTS.dialogNames.MAIN_DIALOG);

        if (!conversationState) { throw new Error('[DialogBot]: Missing parameter. conversationState is required'); }
        if (!logger) {
            logger = console as Logger;
            logger.log('[MainDialog]: logger not passed in, defaulting to console');
        }
        this.logger = logger;

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new TextPrompt(CONSTANTS.dialogNames.TEXT_PROMPT))
            .addDialog(new MenuDialog())
            .addDialog(new AperturaDialog())
            .addDialog(new ClienteDialog())
            .addDialog(new EditarClienteDialog())
            .addDialog(new VisitasDialog())
            .addDialog(new LoginDialog())
            .addDialog(new WaterfallDialog(CONSTANTS.dialogNames.MAIN_WATERFALL_DIALOG, [
                this.initStep.bind(this),
                // this.loginStep.bind(this),
                // this.actStep.bind(this),
                this.finalStep.bind(this),
            ]));

        this.initialDialogId = CONSTANTS.dialogNames.MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {TurnContext} context
     * @param accessor
     */
    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    public setState(conversationData: StatePropertyAccessor, userProfile: StatePropertyAccessor): void {
        this.conversationData = conversationData;
        this.userProfile = userProfile;
    }

    public async onBeginDialog(innerDc: DialogContext, options: any): Promise<DialogTurnResult> {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onBeginDialog(innerDc, options);
    }

    public async onContinueDialog(innerDc: DialogContext): Promise<DialogTurnResult> {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    public async interrupt(innerDc: DialogContext): Promise<DialogTurnResult|undefined> {
        const intencion = await LuisHelper.executeLuisQuery(console, innerDc.context);
        // console.log(`text= ${innerDc.context.activity.text} | intencion =${intencion}`);
        switch (intencion) {
            case EnumIntencion.Menu:
                // await innerDc.cancelAllDialogs();
                return await innerDc.replaceDialog('menuDialog');
            case EnumIntencion.Visitas:
                // await innerDc.cancelAllDialogs();
                return await innerDc.replaceDialog('visitasDialog');
            // case EnumIntencion.Apertura:
            //     // await innerDc.cancelAllDialogs();
            //     return await innerDc.replaceDialog('aperturaDialog');
            // // case EnumIntencion.None:
            default:
                // await innerDc.cancelAllDialogs();
                // return await innerDc.beginDialog('loginDialog');
                if (innerDc.context.activity.text === '?') {
                    return await innerDc.replaceDialog('clienteDialog');
                } else if (innerDc.context.activity.text === '+') {
                    return await innerDc.replaceDialog('editarClienteDialog');
                }
                // await innerDc.context.sendActivity('Gracias por usar nuestro servicio. "Freaky Solutions S.A."');
        }

        return;
    }

    private async initStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return await stepContext.beginDialog('menuDialog');
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */
    private async loginStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // this.logger.log('se ejecuta 1');
        if (!process.env.LuisAppId || !process.env.LuisAPIKey || !process.env.LuisAPIHostName) {
            await stepContext.context.sendActivity('NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.');
            // return await stepContext.next();
        }
        const userProfile = await this.userProfile.get(stepContext.context, {});

        this.logger.log(userProfile);
        if (!userProfile.token) {
            userProfile.token = stepContext.context.activity.text;
            const welcomeCard = CardFactory.adaptiveCard(CARDS.LOGIN);
            await stepContext.context.sendActivity({ attachments: [welcomeCard] });
        } else {
            // Acknowledge that we got their name.
            await stepContext.context.sendActivity(`Thanks ${ userProfile.token }.`);
        }
        return await stepContext.next(stepContext.context.activity.text);

        // return await stepContext.prompt(CONSTANTS.dialogNames.TEXT_PROMPT
        //     , { prompt: `What can I help you with today?\nSay something like "Book a flight from Paris to Berlin on March 22, 2020"` });
    }

    /**
     * Second step in the waterall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
     */
    private  async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        let intencion: EnumIntencion;
        this.logger.log(stepContext.context.activity.text);
        if (process.env.LuisAppId && process.env.LuisAPIKey && process.env.LuisAPIHostName) {
            intencion = await LuisHelper.executeLuisQuery(this.logger, stepContext.context);
        }
        if ( intencion === EnumIntencion.Menu) {

        } else {
            return await stepContext.prompt(CONSTANTS.dialogNames.TEXT_PROMPT
                , {prompt: `HOLA LA PASE BIN GRACIAS ${intencion} `});
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // this.logger.log('se ejecuta 3');
        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            // await stepContext.context.sendActivity('Gracias por usar nuestro servicio. "Freaky Solutions S.A."');
            // const result = stepContext.result as BookingDetails;
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            // const timeProperty = new TimexProperty(result.travelDate);
            // const travelDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));
            // const msg = `I have you booked to ${ result.destination } from ${ result.origin } on ${ travelDateMsg }.`;
            // await stepContext.context.sendActivity(msg);
        } else {
            // await stepContext.context.sendActivity('Gracias por usar nuestro servicio. "Freaky Solutions S.A."');
        }
        const userProfile = await this.userProfile.get(stepContext.context, {});
        if (userProfile.token) {
            userProfile.token = null;
        }
        return await stepContext.endDialog();
    }
}
