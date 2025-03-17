export default {
  Users: await import("./users").then((m) => m.default)
};
