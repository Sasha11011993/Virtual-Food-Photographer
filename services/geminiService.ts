import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Dish, ImageStyle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseMenu(menuText: string): Promise<Dish[]> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Розпарси наступне меню ресторану в список страв з їхніми назвами та описами. Включай лише ті пункти, які є очевидними стравами або напоями. Меню:\n\n${menuText}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "The name of the dish."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A brief description of the dish."
                        }
                    },
                    required: ["name", "description"]
                }
            }
        }
    });

    try {
        const jsonString = response.text;
        const result = JSON.parse(jsonString);
        if (Array.isArray(result) && result.every(item => 'name' in item && 'description' in item)) {
            return result as Dish[];
        } else {
            throw new Error("Parsed data is not in the expected format.");
        }
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("Could not parse menu from AI response.");
    }
}

const getPromptForStyle = (dish: Dish, style: ImageStyle): string => {
    const basePrompt = `Високоякісна, реалістична фуд-фотографія страви "${dish.name}", яка є ${dish.description}. `;

    switch (style) {
        case 'Рустика/Темний':
            return basePrompt + "Стиль темний та атмосферний, з рустичними елементами, такими як старий дерев'яний стіл, темний льон та драматичне, низько-ключове освітлення к'яроскуро. Кінематографічно, атмосферно, глибокі тіні.";
        case 'Світлий/Сучасний':
            return basePrompt + "Стиль світлий, чистий та сучасний, з білим мармуровим або світлим фоном, мінімалістичним реквізитом та яскравим, природним, м'яким освітленням. Відчуття свіжості та простоти. Знято з малою глибиною різкості.";
        case 'Для соцмереж':
            return basePrompt + "Яскрава фотографія 'флет-лей' зверху вниз, стилізована для соціальних мереж. Страва красиво розміщена на чистій, цікавій поверхні, такій як сланець або кольоровий килимок, з доповнюючими інгредієнтами або реквізитом, художньо розкиданим навколо. Яскраво, кольорово та дуже привабливо.";
    }
};

export async function generateFoodImage(dish: Dish, style: ImageStyle): Promise<string> {
    const prompt = getPromptForStyle(dish, style);
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: style === 'Для соцмереж' ? '1:1' : '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed, no images returned.");
    }
}

export async function editImageWithPrompt(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("Failed to get edited image from response.");
}