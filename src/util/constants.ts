
const dialogNames = {
    Help: 'help',
    MAIN_WATERFALL_DIALOG: 'mainWaterfallDialog',
    // tslint:disable-next-line:object-literal-sort-keys
    MAIN_DIALOG: 'mainDialog',
    TEXT_PROMPT: 'TextPrompt',
    BOOKING_DIALOG: 'bookingDialog',
};

export const CONSTANTS = {
    dialogNames,
};

// Import AdaptiveCard content.
// tslint:disable-next-line:no-var-requires
// const FlightItineraryCard = require('../resources/FlightItineraryCard.json');
// // tslint:disable-next-line:no-var-requires
// const ImageGalleryCard = require('../resources/ImageGalleryCard.json');
// // tslint:disable-next-line:no-var-requires
// const LargeWeatherCard = require('../resources/LargeWeatherCard.json');
// // tslint:disable-next-line:no-var-requires
// const RestaurantCard = require('../resources/RestaurantCard.json');
// // tslint:disable-next-line:no-var-requires
// const SolitaireCard = require('../resources/SolitaireCard.json');
// tslint:disable-next-line:no-var-requires
const VISITAS_PROGRAMADA = require('../../resources/visitasProgramadas.json');
// tslint:disable-next-line:no-var-requires
const LOGIN  = require('../../resources/login.json');

// Create array of AdaptiveCard content, this will be used to send a random card to the user.
export const CARDS = {
    VISITAS_PROGRAMADA,
    // tslint:disable-next-line:object-literal-sort-keys
    LOGIN,
    // FlightItineraryCard,
    // ImageGalleryCard,
    // LargeWeatherCard,
    // RestaurantCard,
    // SolitaireCard,
};

export const INTENCIONES = {
    APERTURA: 'Apertura',
    MENU: 'Menu',
    VISITAS: 'Visitas',
    // tslint:disable-next-line:object-literal-sort-keys
    NONE: 'None',
};

export const CONFIG_ENV = {
    MicrosoftAppId: '1912766e-2fa2-4d53-9086-d2d6fc8f3d2e',
    MicrosoftAppPassword: 'PAoEG4CO0Adzao&eM7SUh}+v+T',
    LuisAppId: '8a7d117d-cbb0-40a7-a782-5fab86d56e8a',
    LuisAPIKey: '1fe92e9056394489a58ba1d9098497fd',
    LuisAPIHostName: 'westus.api.cognitive.microsoft.com',
}
