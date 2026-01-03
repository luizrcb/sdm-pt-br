Hooks.on("init", () => {
  if (typeof game.babele !== "undefined") {
   game.babele.register({
      module: "sdm-pt-br",
      lang: "pt-BR",
      dir: "compendium",
    });

    game.babele.registerConverters({
      "effectCollection": function (collection, translations) {
        for (const name in translations) {
          const effect = collection.find((element) => element.name === name || element._id === name);
          if (!effect) continue;
          for (const property in translations[name]) {
            effect[property] = translations[name][property];
          }
        }

        return collection;
      },
    });
  }
});
