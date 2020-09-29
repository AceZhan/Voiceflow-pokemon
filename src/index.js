const express = require("express");
const { ExpressAdapter } = require("ask-sdk-express-adapter");
const { SkillBuilders } = require("ask-sdk-core");

const {
  LaunchRequestHandler,
  YesIntentHandler,
  NoIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  ErrorHandler,
} = require("./intentHandlers/generalIntents");

const {
  PokemonAllInfoHandler,
  PokemonTraitHandler,
} = require("./intentHandlers/pokemonIntents");

const app = express();
const PORT = process.env.PORT || 3000;

const skillBuilder = SkillBuilders.custom();
skillBuilder.addRequestHandlers(
  PokemonAllInfoHandler,
  PokemonTraitHandler,
  LaunchRequestHandler,
  YesIntentHandler,
  NoIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  ErrorHandler
);

skillBuilder.addErrorHandlers(ErrorHandler);

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, true, true);

app.post("/", adapter.getRequestHandlers());

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error on startup`);
  }
  console.info(`Server on port: ${PORT}`);
});
