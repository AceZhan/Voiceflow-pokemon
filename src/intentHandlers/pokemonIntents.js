const { getRequestType, getIntentName, getSlot } = require("ask-sdk-core");
const {
  getSlotValues,
  timeGetPokemonInfo,
  capitalize,
} = require("../utils/helpers");

const PokemonAllInfoHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      getIntentName(handlerInput.requestEnvelope) === "pokemon_info"
    );
  },
  async handle(handlerInput) {
    const pokemonSlot = getSlot(handlerInput.requestEnvelope, "pokemon");
    let pokemonSlotObject = getSlotValues(pokemonSlot);

    if (pokemonSlotObject.resolved === "" && pokemonSlotObject.heardAs === "") {
      const say = "Could not resolve the phrase";

      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }

    const pokemonName =
      pokemonSlotObject.resolved !== ""
        ? pokemonSlotObject.resolved
        : pokemonSlotObject.heardAs;
    let pokemonInfo;
    let say;
    try {
      pokemonInfo = await timeGetPokemonInfo(pokemonName);
    } catch (err) {
      say = "Could not get pokemon data";
      console.error(err);
      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }

    if (!pokemonInfo) {
      sessionAttributes.unknownPokemon = pokemonName;
      say = `hmm, I'm not sure I know about ${pokemonName}, are you sure it is a pokemon?`;
    } else {
      let types = "";
      pokemonInfo.type.forEach((type, index) => {
        if (index !== 0) {
          types += ", ";
        }
        types += type;
      });
      say = `${capitalize(
        pokemonName
      )} is a pokemon of type ${types} with a height of ${
        pokemonInfo.height
      } units and a weight of ${pokemonInfo.weight} units`;
    }

    if (say) {
      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }
  },
};

const PokemonTraitHandler = {
  canHandle(handlerInput) {
    return (
      getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      getIntentName(handlerInput.requestEnvelope) === "pokemon_trait"
    );
  },
  async handle(handlerInput) {
    const pokemonNameSlot = getSlot(handlerInput.requestEnvelope, "pokemon");
    let pokemonNameSlotObject = getSlotValues(pokemonNameSlot);

    const pokemonTraitSlot = getSlot(handlerInput.requestEnvelope, "trait");
    let pokemonTraitSlotObject = getSlotValues(pokemonTraitSlot);

    if (
      (pokemonNameSlotObject.resolved === "" &&
        pokemonNameSlotObject.heardAs === "") ||
      (pokemonTraitSlotObject.resolved === "" &&
        pokemonTraitSlotObject.heardAs === "")
    ) {
      const say = "Could not resolve the phrase";

      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }

    const pokemonName =
      pokemonNameSlotObject.resolved !== ""
        ? pokemonNameSlotObject.resolved
        : pokemonNameSlotObject.heardAs;
    const pokemonTrait =
      pokemonTraitSlotObject.resolved !== ""
        ? pokemonTraitSlotObject.resolved
        : pokemonTraitSlotObject.heardAs;
    let pokemonInfo;
    let say;
    try {
      pokemonInfo = await timeGetPokemonInfo(pokemonName);
    } catch (err) {
      say = "Could not get pokemon data";
      console.error(err);
      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }

    if (!pokemonInfo) {
      sessionAttributes.unknownPokemon = pokemonName;
      say = `hmm, I'm not sure I know about ${pokemonName}, are you sure it is a pokemon?`;
    } else if (
      pokemonTrait === "type" ||
      pokemonTrait === "weight" ||
      pokemonTrait === "height"
    ) {
      if (pokemonTrait === "type") {
        let types = "";
        pokemonInfo.type.forEach((type, index) => {
          if (index !== 0) {
            types += ", ";
          }
          types += type;
        });
        say = `${capitalize(pokemonName)} ${
          pokemonInfo.type.length === 1 ? "is " : "are "
        } of
        ${pokemonInfo.type.length === 1 ? "type " : "types "} ${types}`;
      } else if (pokemonTrait === "height") {
        say = `${capitalize(pokemonName)} is ${pokemonInfo.height} units high`;
      } else {
        say = `${capitalize(pokemonName)}'s weight is ${
          pokemonInfo.weight
        } units`;
      }
    } else {
      say = `hmm, I'm not sure I know this ${pokemonTrait} about ${pokemonName}, are you sure it is correct trait?`;
    }

    if (say) {
      return handlerInput.responseBuilder
        .speak(say)
        .withShouldEndSession(false)
        .reprompt(say)
        .getResponse();
    }
  },
};

module.exports = {
  PokemonAllInfoHandler,
  PokemonTraitHandler,
};
