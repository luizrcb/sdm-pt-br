Hooks.on("init", () => {
  if (typeof game.babele !== "undefined") {
    game.babele.register({
      module: "sdm-pt-br",
      lang: "pt-BR",
      dir: "compendium",
    });

    // TODO: workaround while babele is not updated
    game.babele.registerConverters({
      customTableResults: (results, translations) => {
        return results.map((data) => {
          if (translations) {
            const translation =
              translations[data._id] ||
              translations[`${data.range[0]}-${data.range[1]}`];
            if (translation) {
              if (typeof translation === "string") {
                data = foundry.utils.mergeObject(
                  data,
                  foundry.utils.mergeObject(
                    { description: translation },
                    { translated: true },
                  ),
                );
              } else {
                const range = translation.range ?? data.range;
                data = foundry.utils.mergeObject(data, {
                  name: translation.name ?? data.name,
                  img: translation.img ?? data.img,
                  weight: translation.weight ?? data.weight,
                  range: { 0: range[0], 1: range[1] },
                  description: translation.description ?? data.description,
                  translated: true,
                });
              }
            }
          }
          if (data.documentUuid) {
            const text = game.babele.translateField(
              "name",
              foundry.utils.parseUuid(data.documentUuid).collection.collection,
              { name: data.name },
            );
            if (text) {
              return foundry.utils.mergeObject(
                data,
                foundry.utils.mergeObject({ name: text }, { translated: true }),
              );
            } else {
              return data;
            }
          }
          return data;
        });
      },
    });

    game.babele.registerConverters({
      effectCollection: function (collection, translations) {
        for (const name in translations) {
          const effect = collection.find(
            (element) => element.name === name || element._id === name,
          );
          if (!effect) continue;
          for (const property in translations[name]) {
            effect[property] = translations[name][property];
          }
        }

        return collection;
      },
      activeEffectChanges: (originalChanges, translationChanges) => {
        return originalChanges.map((change) => {
          if (
            translationChanges &&
            translationChanges[change.key] !== undefined
          ) {
            return {
              ...change,
              value: translationChanges[change.key],
            };
          }
          return change;
        });
      },
    });
  }
});
