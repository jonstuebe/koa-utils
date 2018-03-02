function stringToArray(input) {
  return typeof input === "string" ? input.split(",") : null;
}

module.exports = {
  stringToArray
};
