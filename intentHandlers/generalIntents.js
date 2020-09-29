const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const say =
      "Welcome to your personal PokeDex! What would you like to know about your favorite pokemon?";

    return handlerInput.responseBuilder
      .speak(say)
      .reprompt(say)
      .withSimpleCard("Hello World", say)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const say = "You said help. Do you want to continue?";

    sessionAttributes.afterHelp = true;

    return handlerInput.responseBuilder
      .speak(say)
      .reprompt(say)
      .withSimpleCard("Hello World", say)
      .getResponse();
  },
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.YesIntent"
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let say = "You said Yes";
    if (sessionAttributes.afterHelp) {
      say += ", What else do you want to know about Pokemon?";
    }

    return responseBuilder
      .speak(say)
      .reprompt("try again, " + say)
      .getResponse();
  },
};

const NoIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.NoIntent"
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let say = "You said No";
    if (sessionAttributes.afterHelp) {
      say += ", closing the Pokedex.";

      return responseBuilder
        .speak(say)
        .reprompt("try again, " + say)
        .withShouldEndSession(true)
        .getResponse();
    }

    return responseBuilder
      .speak(say)
      .reprompt("try again, " + say)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const say = "Goodbye!";

    return handlerInput.responseBuilder
      .speak(say)
      .withSimpleCard("Hello World", say)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  },
};

module.exports = {
  LaunchRequestHandler,
  YesIntentHandler,
  NoIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  ErrorHandler,
};
