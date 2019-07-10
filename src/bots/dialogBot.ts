// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, BotState, ConversationState, StatePropertyAccessor, UserState } from 'botbuilder';
import { Dialog, DialogState} from 'botbuilder-dialogs';
import {MainDialog} from '../dialogs/mainDialog';

import { Logger } from '../util/logger';
// The accessor names for the conversation data and user profile state property accessors.
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

export class DialogBot extends ActivityHandler {
    private conversationState: BotState;
    private userState: BotState;
    private logger: Logger;
    private dialog: Dialog;
    private dialogState: StatePropertyAccessor<DialogState>;

    private conversationData: StatePropertyAccessor;
    private userProfile: StatePropertyAccessor;
    /**
     *
     * @param {BotState} conversationState
     * @param {BotState} userState
     * @param {Dialog} dialog
     * @param {Logger} logger object for logging events, defaults to console if none is provided
     */
    constructor(conversationState: BotState, userState: BotState, logger: Logger, dialog?: Dialog) {
        super();
        if (!conversationState) { throw new Error('[DialogBot]: Missing parameter. conversationState is required'); }
        if (!userState) { throw new Error('[DialogBot]: Missing parameter. userState is required'); }
        if (!dialog) { throw new Error('[DialogBot]: Missing parameter. dialog is required'); }
        if (!logger) {
            logger = console as Logger;
            logger.log('[DialogBot]: logger not passed in, defaulting to console');
        }

        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;
        this.dialog = dialog;
        this.logger = logger;
        this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');

        this.conversationData = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);

        (this.dialog as MainDialog).setState(this.conversationData, this.userProfile);

        this.onMessage(async (context, next) => {
            // this.logger.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            await (this.dialog as MainDialog).run(context, this.dialogState);
            // await context.sendActivity(`mensaje repetitivo '${ context.activity.text }'`);

            // const userProfile = await this.userProfile.get(context, {});
            //
            // if (!userProfile.token) {
            //     userProfile.token = context.activity.text;
            //     const welcomeCard: Attachment = CardFactory.adaptiveCard(CARDS.LOGIN);
            //     await context.sendActivity({ attachments: [welcomeCard] });
            // } else {
            //     // Acknowledge that we got their name.
            //     const intencion = await LuisHelper.executeLuisQuery(this.logger, context);
            //     this.logger.log(`intencion 1=${intencion}`);
            //     switch (intencion) {
            //         case EnumIntencion.Menu:
            //             //await context.;
            //             this.dialog =  new MenuDialog();
            //             await (this.dialog as MenuDialog).run(context, this.dialogState);
            //             break;
            //         case EnumIntencion.Visitas:
            //             this.dialog =  new VisitasDialog();
            //             await (this.dialog as VisitasDialog).run(context, this.dialogState);
            //             break;
            //         case EnumIntencion.Apertura:
            //             this.dialog =  new AperturaDialog();
            //             await (this.dialog as AperturaDialog).run(context, this.dialogState);
            //             break;
            //         case EnumIntencion.None:
            //             this.dialog =  new LoginDialog();
            //             await (this.dialog as LoginDialog).run(context, this.dialogState);
            //             break;
            //     }
            //     console.log('-----------------------------3');
            //     // await context.sendActivity(`Thanks ${ userProfile.token } intencion ${intencion}.`);
            // }

            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // esto simepre se repite al final de cualquier evento d ela actividad
        this.onDialog(async (context, next) => {
            // this.logger.log('final del evento');
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

}
