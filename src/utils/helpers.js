const Pokedex = require("pokedex-promise-v2");
const pokemonApi = new Pokedex();

function getSlotValues(slot) {
  let slotValues;

  if (
    slot &&
    slot.resolutions &&
    slot.resolutions.resolutionsPerAuthority[0] &&
    slot.resolutions.resolutionsPerAuthority[0].status &&
    slot.resolutions.resolutionsPerAuthority[0].status.code
  ) {
    switch (slot.resolutions.resolutionsPerAuthority[0].status.code) {
      case "ER_SUCCESS_MATCH":
        slotValues = {
          heardAs: slot.value,
          resolved:
            slot.resolutions.resolutionsPerAuthority[0].values[0].value.name,
          ERstatus: "ER_SUCCESS_MATCH",
        };
        break;
      case "ER_SUCCESS_NO_MATCH":
        slotValues = {
          heardAs: slot.value,
          resolved: "",
          ERstatus: "ER_SUCCESS_NO_MATCH",
        };
        break;
      default:
        break;
    }
  } else {
    slotValues = {
      heardAs: slot.value || "", // may be null
      resolved: "",
      ERstatus: "",
    };
  }

  return slotValues;
}

const getPokemonInfo = async (pokemonName) => {
  const pokemonInfo = await pokemonApi.getPokemonByName(pokemonName);

  let traits = {
    weight: pokemonInfo.weight,
    height: pokemonInfo.height,
    type: [],
  };
  pokemonInfo.types.forEach((typeObj) => {
    traits.type.push(typeObj.type.name);
  });
  return traits;
};

const timeGetPokemonInfo = async (pokemonName) => {
  return Promise.race([
    getPokemonInfo(pokemonName),
    new Promise((res, rej) => {
      setTimeout(rej, 8000);
    }),
  ]);
};

function capitalize(str) {
  return str.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function formatString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

module.exports = {
  getSlotValues,
  timeGetPokemonInfo,
  capitalize,
  formatString,
};
