module.exports = {
  plugins: ["filenames"],
  rules: {
    "filenames/match-regex": ["error", ".*.(dev|prod)$"],
  },
};
