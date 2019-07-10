// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// import { BookingDetails } from './bookingDetails';

import { RecognizerResult, TurnContext } from 'botbuilder';

import { LuisRecognizer } from 'botbuilder-ai';
import {DialogTurnStatus} from 'botbuilder-dialogs';
import {EnumIntencion} from '../Models/enum/EnumIntencion';
import { Logger } from '../util/logger';
import {CONFIG_ENV, INTENCIONES} from './constants';

export class LuisHelper {
    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {Logger} logger
     * @param {TurnContext} context
     */
    // public static async executeLuisQuery(logger: Logger, context: TurnContext): Promise<BookingDetails> {
    public static async executeLuisQuery(logger: Logger, context: TurnContext): Promise<EnumIntencion> {
        // let intencion: EnumIntencion;
        try {
            const recognizer = new LuisRecognizer({
                applicationId: process.env.LuisAppId || CONFIG_ENV.LuisAppId,
                endpoint: `https://${ process.env.LuisAPIHostName || CONFIG_ENV.LuisAPIHostName }`,
                endpointKey: process.env.LuisAPIKey || CONFIG_ENV.LuisAPIKey,
            }, {}, true);

            const recognizerResult = await recognizer.recognize(context);

            const intent: string = LuisRecognizer.topIntent(recognizerResult);

            // logger.warn('intencion='+intent);
            // if (intent === 'Book_flight') {
            //     // We need to get the result from the LUIS JSON which at every level returns an array
            //
            //     bookingDetails.destination = LuisHelper.parseCompositeEntity(recognizerResult, 'To', 'Airport');
            //     bookingDetails.origin = LuisHelper.parseCompositeEntity(recognizerResult, 'From', 'Airport');
            //
            //     // This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
            //     // TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
            //     bookingDetails.travelDate = LuisHelper.parseDatetimeEntity(recognizerResult);
            // }
            switch (intent) {
                case INTENCIONES.APERTURA:
                    return EnumIntencion.Apertura;
                case INTENCIONES.VISITAS:
                    return EnumIntencion.Visitas;
                case INTENCIONES.MENU:
                    return EnumIntencion.Menu;
                case INTENCIONES.NONE:
                    return EnumIntencion.None;
            }
        } catch (err) {
            logger.warn(`LUIS Exception: ${ err } Check your LUIS configuration`);
            return EnumIntencion.None;
        }
    }

    public static parseCompositeEntity(result: RecognizerResult, compositeName: string, entityName: string): string {
        const compositeEntity = result.entities[compositeName];
        if (!compositeEntity || !compositeEntity[0]) { return undefined; }

        const entity = compositeEntity[0][entityName];
        if (!entity || !entity[0]) { return undefined; }

        const entityValue = entity[0][0];
        return entityValue;
    }

    public static parseDatetimeEntity(result: RecognizerResult): string {
        let key = 'datetime';
        const datetimeEntity = result.entities[key];
        if (!datetimeEntity || !datetimeEntity[0]) { return undefined; }

        key = 'timex';
        const timex = datetimeEntity[0][key];
        if (!timex || !timex[0]) { return undefined; }

        const datetime = timex[0].split('T')[0];
        return datetime;
    }
}
