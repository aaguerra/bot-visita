// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler } from 'botbuilder';
import { BotState, CardFactory } from 'botbuilder-core';
// tslint:disable-next-line:no-var-requires
const reporteVisitaCard = require('../resources/reporteVisita.json');
// tslint:disable-next-line:no-var-requires
const welcomeCard = require('../resources/welcomeCard.json');

export class MyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // await context.sendActivity(`mensaje repetitivo '${ context.activity.text }'`);
            // By calling next() you ensure that the next BotHandler is run.
            console.log(`-----------    --`);
            // const CARD = CardFactory.adaptiveCard(reporteVisitaCard);
            // await context.sendActivity({ attachments: [CARD] });
           // await next();
        });
        // esto se ejecuta  cada vez q un mienbro nuevo es agregado a la conversacion
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity('Hola !');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}
