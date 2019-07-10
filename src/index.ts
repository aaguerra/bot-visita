// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { config } from 'dotenv';
import * as path from 'path';
const ENV_FILE = path.join(__dirname, '..', '.env');
config({ path: ENV_FILE });

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
// @ts-ignore
import { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } from 'botbuilder';
import * as restify from 'restify';
// @ts-ignore
import { DialogAndWelcomeBot } from './bots/dialogAndWelcomeBot';
// @ts-ignore
import { MainDialog } from './dialogs/mainDialog';

// This bot's main dialog.
import { MyBot } from './bot';
import { CONFIG_ENV, CONSTANTS} from './util/constants';

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppID || CONFIG_ENV.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword || CONFIG_ENV.MicrosoftAppPassword,
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Vaya. ¡Algo salió mal!, Comuniquese con soporte tecnico.`);
};

// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.
let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

// CAUTION: You must ensure your product environment has the NODE_ENV set
//          to use the Azure Blob storage or Azure Cosmos DB providers.

// Add botbuilder-azure when using any Azure services.
// import { BlobStorage } from 'botbuilder-azure';
// // Get service configuration
// const blobStorageConfig = botConfig.findServiceByNameOrId(STORAGE_CONFIGURATION_ID);
// const blobStorage = new BlobStorage({
//     containerName: (blobStorageConfig.container || DEFAULT_BOT_CONTAINER),
//     storageAccountOrConnectionString: blobStorageConfig.connectionString,
// });
// conversationState = new ConversationState(blobStorage);
// userState = new UserState(blobStorage);

// Create the main dialog.
// const myBot = new MyBot();
// Pass in a logger to the bot. For this sample, the logger is the console, but alternatives such as Application Insights and Event Hub exist for storing the logs of the bot.
const logger = console;

// Create the main dialog.
const dialog = new MainDialog(logger, conversationState, CONSTANTS.dialogNames.MAIN_DIALOG);
const bot = new DialogAndWelcomeBot(conversationState, userState, logger, dialog);
// const bot = new DialogAndWelcomeBot(conversationState, userState, logger);
// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.run(turnContext);
    });
});
