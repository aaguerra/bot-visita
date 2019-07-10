# bot-visita

Demonstrate the core capabilities of the Microsoft Bot Framework

This bot has been created using [Bot Framework](https://dev.botframework.com), it provides a minimal skeleton of a bot.


## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```

## To run the bot

- Install modules

    ```bash
    npm install
    ```

- Start the bot

    ```bash
    npm start
    ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.3.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Deploy the bot to Azure

This bot was generated using the Empty bot template.  Unmodified, it's not practical to deploy an empty bot to Azure, as it doesn't have any conversational behavior yet.
After making modifications to the bot and testing it locally, you can deploy it to Azure to make it accessible from anywhere.
To learn how, see[Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete set of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-handle-user-interrupt?view=azure-bot-service-4.0&tabs=javascript)
- https://docs.microsoft.com/en-us/healthbot/scenario-authoring/adding-cards
- https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/14.nlp-with-dispatch
