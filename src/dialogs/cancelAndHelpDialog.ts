import {ComponentDialog, DialogContext, DialogTurnResult, DialogTurnStatus, TextPrompt} from 'botbuilder-dialogs';

/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
export class CancelAndHelpDialog extends ComponentDialog {
    constructor(id?: string) {
        super(id);

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
        const text = innerDc.context.activity.text.toLowerCase();

        switch (text) {
            case 'ayuda':
                await innerDc.context.sendActivity(`
El sistema posee las siguientes palabras como opciones del menu:
actividades: ( Para saber las actividades planificadas del dia en curso )
?: ( Para saber el detalle de una actividad planificada)
                `);
                return { status: DialogTurnStatus.waiting };
            case '!':
                await innerDc.context.sendActivity(`
El sistema posee las siguientes palabras como opciones del menu:
actividades: ( Para saber las actividades planificadas del dia en curso )
?: ( Para saber el detalle de una actividad planificada)
                `);
                return { status: DialogTurnStatus.waiting };
            case 'cancelar':
                await innerDc.context.sendActivity('Cancelando chat.');
                return await innerDc.cancelAllDialogs();
            case 'salir':
                await innerDc.context.sendActivity('Cancelando chat.');
                return await innerDc.cancelAllDialogs();
        }

        return;
    }
}
