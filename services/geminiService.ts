
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, RecipeIngredient } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The creative and appealing title of the recipe." },
        description: { type: Type.STRING, description: "A brief, engaging description of the beverage and its flavor profile." },
        spiritType: { type: Type.STRING },
        skillLevel: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        prepTimeMinutes: { type: Type.INTEGER, description: "Total preparation time in minutes, excluding fermentation/aging." },
        fermentationTimeDays: { type: Type.INTEGER, description: "Total fermentation/infusion/aging time in days." },
        finalABV: { type: Type.INTEGER, description: "The estimated final Alcohol By Volume (ABV) of the finished beverage as a percentage." },
        targetVolumeLiters: { type: Type.NUMBER, description: "The target final volume of the beverage in liters, as specified by the user." },
        safetyPrecautions: { type: Type.STRING, description: "Crucial safety warnings and precautions for the process. Must be clear and comprehensive. If no specific risks, state 'Standard brewing/winemaking safety practices should be followed.'" },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    quantityValue: { type: Type.NUMBER },
                    quantityUnit: { type: Type.STRING, description: "A metric unit, e.g., 'grams', 'ml', 'kg', 'liter'." },
                },
                required: ["name", "quantityValue", "quantityUnit"]
            }
        },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    stepNumber: { type: Type.INTEGER },
                    instruction: { type: Type.STRING, description: "A single, clear, and concise instruction for this step." }
                },
                required: ["stepNumber", "instruction"]
            }
        },
        equipmentUsed: {
            type: Type.ARRAY,
            description: "A list of essential equipment needed for this recipe (e.g., 'Fermentation vessel', 'Airlock', 'Hydrometer').",
            items: {
                type: Type.STRING
            }
        },
        // Beer specific
        beerStyle: { type: Type.STRING, description: "The specific style of the beer (e.g., IPA, Stout)." },
        ibu: { type: Type.INTEGER, description: "International Bitterness Units for beer." },
        srm: { type: Type.INTEGER, description: "Standard Reference Method for beer color." },
        originalGravity: { type: Type.NUMBER, description: "The original gravity of the wort before fermentation." },
        finalGravity: { type: Type.NUMBER, description: "The final gravity of the beer after fermentation." },
        // Wine specific
        wineType: { type: Type.STRING, description: "The type of wine (e.g., Red, White, Fruit)." },
        // Nutritional Information
        caloriesPerServing: { type: Type.INTEGER, description: "Estimated calories per serving. A serving is typically 250-350ml." },
        sugarPerServingGrams: { type: Type.INTEGER, description: "Estimated grams of sugar per serving." },
        servingSizeMl: { type: Type.INTEGER, description: "The recommended serving size in milliliters." },
    },
    required: ["title", "description", "spiritType", "skillLevel", "prepTimeMinutes", "fermentationTimeDays", "finalABV", "targetVolumeLiters", "safetyPrecautions", "ingredients", "steps"]
};

interface GenerateRecipeParams {
    spiritType: string;
    skillLevel: string;
    targetVolumeLiters: number;
    customIngredients?: RecipeIngredient[];
    language: 'en' | 'id';
    // Liqueur
    baseSpirit?: string;
    desiredAbv?: number;
    // Beer
    beerStyle?: string;
    targetIbu?: number;
    targetSrm?: number;
    brewingMethod?: string;
    // Wine
    wineType?: string;
    wineSweetness?: string;
    // Natural Soda
    naturalSodaType?: string;
}

const getSpecificInstructions = (params: GenerateRecipeParams): string => {
    switch(params.spiritType) {
        case 'natural_soda':
            let sodaSpecifics = '';
            switch(params.naturalSodaType) {
                case 'ginger_bug':
                    sodaSpecifics = "The recipe must be based on a 'ginger bug' starter. Explain how to make and maintain the ginger bug if the user is a beginner.";
                    break;
                case 'water_kefir':
                    sodaSpecifics = "The recipe must use water kefir grains for fermentation. Mention the two-fermentation process (F1 and F2).";
                    break;
                case 'tepache':
                    sodaSpecifics = "This is a traditional Mexican beverage. The recipe must use pineapple peels and core as the primary fermentation source. Spices like cinnamon are common.";
                    break;
                case 'fruit_yeast_water':
                    sodaSpecifics = "The recipe should focus on creating a starter from wild yeast on fruits (like raisins or fresh berries) and then using that starter to carbonate a juice or tea.";
                    break;
                case 'kvass':
                    sodaSpecifics = "This is a traditional Eastern European drink. The recipe could be for a classic rye bread kvass or a more modern beet or fruit kvass. Specify which one you are generating.";
                    break;
            }

            return `
                You are an expert in creating natural, fermented sodas.
                The final product should be non-alcoholic or have a negligible ABV (less than 0.5%).
                The recipe MUST focus on natural carbonation through a short fermentation process.
                This specific soda type is: ${params.naturalSodaType}. ${sodaSpecifics}
                Instructions should be very clear for the target skill level, with an emphasis on safety regarding bottle carbonation (e.g., 'burping' the bottles to release pressure).
            `;
        case 'beer':
            return `
                You are a master brewer.
                Brewing Method: ${params.brewingMethod}.
                Target Beer Style: ${params.beerStyle}.
                Target IBU: approximately ${params.targetIbu}.
                Target SRM (Color): approximately ${params.targetSrm}.
                The recipe must include details on mashing, boiling, hop schedule, and fermentation.
                It must also estimate Original and Final Gravity.
            `;
        case 'wine':
            return `
                You are a master winemaker.
                Wine Type: ${params.wineType}.
                Desired Sweetness: ${params.wineSweetness}.
                The recipe must detail the process from fruit preparation/crushing to fermentation, clarification, and aging.
            `;
        case 'infused_liqueur':
            return `
                 You are a liqueur crafting expert.
                The base spirit for this liqueur must be ${params.baseSpirit}.
                The final product must have a target Alcohol By Volume (ABV) of approximately ${params.desiredAbv}%. 
                The recipe must include steps for dilution (e.g., with sugar syrup or water) to achieve this target ABV. 
                Assume the base spirit is a standard commercial proof (e.g., 40% ABV).
            `;
        default:
            return `
                You are a master distiller specializing in ${params.spiritType}.
                Instructions must be clear, step-by-step, and easy for the target skill level to follow.
                Safety precautions for distillation are mandatory and must be prominently included.
            `;
    }
};

export const generateRecipe = async (params: GenerateRecipeParams): Promise<Recipe> => {
    const { spiritType, skillLevel, targetVolumeLiters, customIngredients, language } = params;

    const languageInstruction = language === 'id' ? "All text output (titles, descriptions, instructions, etc.) must be in Bahasa Indonesia." : "All text output must be in English.";
    
    const specificInstructions = getSpecificInstructions(params);

    const customIngredientsInstruction = customIngredients && customIngredients.length > 0
        ? `You MUST use the following user-provided ingredients as the core of the recipe: ${customIngredients.map(ing => `${ing.quantityValue} ${ing.quantityUnit} of ${ing.name}`).join(', ')}. Build the rest of the recipe around these specific items.`
        : "Incorporate common Indonesian ingredients like palm sugar, tropical fruits, or local spices.";

    const prompt = `
        You are an expert in crafting alcoholic and non-alcoholic beverages. Your specialization varies based on the request.
        Your task is to generate a unique, detailed, and safe recipe.

        Recipe requirements:
        - Beverage Type: ${spiritType}
        - Skill Level: ${skillLevel}
        - Target Production Volume: The entire recipe (all ingredients, volumes, and instructions) MUST be scaled to produce a final yield of approximately ${targetVolumeLiters} liters.
        - Language: ${languageInstruction}
        ${specificInstructions}
        - Core Theme: Must use Indonesian ingredients. ${customIngredientsInstruction}
        - All measurements MUST be in the metric system (grams, ml, kg, liters).
        - List the essential equipment required for this recipe.
        - Safety precautions are mandatory and must be prominently included for any process involving distillation, high temperatures, or pressure. For non-distilled beverages, mention standard safety practices.
        - Nutritional Information: Provide a rough estimate for calories and sugar content per serving. Specify a reasonable serving size in ml. This is especially important for natural sodas, wines, and liqueurs. If it's a distilled spirit with no sugar, you can omit this or set values to 0.

        Generate the recipe now based on these requirements.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
                temperature: 0.8
            }
        });
        
        const jsonText = response.text.trim();
        const recipeData = JSON.parse(jsonText);

        const finalRecipe = Array.isArray(recipeData) ? recipeData[0] : recipeData;

        return finalRecipe as Recipe;
    } catch (error) {
        console.error("Error generating recipe with Gemini:", error);
        throw new Error("Failed to generate recipe from Gemini API.");
    }
};