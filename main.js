Hooks.on("init", () => {
  if (typeof Babele !== "undefined") {
    Babele.get().register({
      module: "sdm-pt-br",
      lang: "pt-BR",
      dir: "compendium",
    });

    Babele.get().registerConverters({
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
