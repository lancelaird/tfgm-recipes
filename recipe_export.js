// ServerEvents.recipes(event => {
//   event.forEachRecipe({}, r => {
//     console.log(JSON.stringify(r.json))
//   })
// })

ServerEvents.recipes(event => {
    let recipeList = [];

    // Iterate through all recipes known to the server
    event.forEachRecipe({}, recipe => {
        try {
            // Attempt to capture the recipe as a JSON object
            let recipeJson = recipe.json;
            if (recipeJson) {
                // Add the unique ID to the JSON for easier identification
                recipeJson.addProperty('recipe_id', recipe.id.toString());
                recipeList.push(recipeJson);
            }
        } catch (err) {
            console.error(`Failed to export recipe: ${recipe.id}`);
        }
    });

    // Write the compiled list to a file in the kubejs/export folder
    JsonIO.write('kubejs/export/all_recipes.json', { recipes: recipeList });
    console.log(`Successfully exported ${recipeList.length} recipes to kubejs/export/all_recipes.json`);

    let itemList = [];

    Item.getList().forEach(stack => {
        let id = stack.id.toString();
        let name = stack.name.string;

        // Extract tags for this item
        let tags = [];
        stack.tags.forEach(tag => {
            tags.push(tag.location.toString());
        });

        itemList.push({
            id: id,
            display_name: name,
            tags: tags
        });
    });

    JsonIO.write('kubejs/export/item_info.json', { items: itemList });
    console.log(`Exported info for ${itemList.length} items.`);
});
