
import React, { useState, useEffect, useMemo } from 'react';
import { getAllRecipes } from '../services/dbService';
import type { Recipe } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import RecipeDetail from '../components/RecipeDetail';
import Spinner from '../components/Spinner';
import { generateRecipePdf } from '../services/pdfService';

// downloadjs is loaded from a script tag in index.html
declare const download: any;

const MyRecipesScreen: React.FC = () => {
    const { t } = useLocalization();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [exportingPdfId, setExportingPdfId] = useState<number | null>(null);
    const [exportingJsonId, setExportingJsonId] = useState<number | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const storedRecipes = await getAllRecipes();
                setRecipes(storedRecipes.reverse()); // Show newest first
            } catch (err) {
                console.error("Failed to fetch recipes from DB:", err);
                setError("Could not load recipes.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleExportPdf = async (e: React.MouseEvent, recipe: Recipe) => {
        e.stopPropagation(); // Prevent card click
        if (!recipe.id) return;
        setExportingPdfId(recipe.id);
        try {
            await generateRecipePdf(recipe);
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            setExportingPdfId(null);
        }
    };
    
    const handleExportJson = (e: React.MouseEvent, recipe: Recipe) => {
        e.stopPropagation(); // Prevent card click
        if (!recipe.id) return;
        setExportingJsonId(recipe.id);
        try {
            const jsonString = JSON.stringify(recipe, null, 2);
            const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            download(jsonString, fileName, 'application/json');
        } catch (error) {
            console.error("JSON export failed", error);
            alert('Could not export JSON.');
        } finally {
            setExportingJsonId(null);
        }
    };

    // FIX: Explicitly type the accumulator in the `reduce` function to prevent type inference issues.
    const groupedRecipes = useMemo(() => recipes.reduce((acc: Record<string, Recipe[]>, recipe) => {
        const category = recipe.spiritType || 'uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(recipe);
        return acc;
    }, {}), [recipes]);

    if (selectedRecipe) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedRecipe(null)}
                    className="mb-6 border-2 border-bauhaus-dark bg-white inline-flex items-center px-4 py-2 text-sm font-bold text-bauhaus-dark uppercase tracking-wider transition-all hover:bg-bauhaus-dark hover:text-white"
                >
                    &larr; {t('backToRecipeList')}
                </button>
                <RecipeDetail recipe={selectedRecipe} />
            </div>
        );
    }
    
    return (
        <div className="space-y-12 animate-fade-in">
            <section className="text-center py-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-bauhaus-dark uppercase tracking-widest">{t('myRecipesTitle')}</h2>
            </section>

            {isLoading && (
                <div className="flex justify-center p-8">
                    <Spinner />
                </div>
            )}

            {error && (
                <div className="bg-bauhaus-red border-2 border-bauhaus-dark text-white p-4 text-center" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && recipes.length === 0 && (
                <div className="text-center border-2 border-bauhaus-dark bg-white p-8">
                    <svg className="mx-auto h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-semibold text-bauhaus-dark">{t('noRecipesFound')}</h3>
                    <p className="mt-1 text-sm text-stone-600">{t('noRecipesDescription')}</p>
                </div>
            )}

            {!isLoading && !error && recipes.length > 0 && (
                <div className="space-y-10">
                    {Object.entries(groupedRecipes).map(([category, categoryRecipes]) => (
                        <section key={category}>
                            <h3 className="text-2xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider pb-2 mb-8 border-b-4 border-bauhaus-dark">
                                {category.replace(/_/g, ' ')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryRecipes.map((recipe) => (
                                    <div 
                                        key={recipe.id}
                                        className="border-2 border-bauhaus-dark bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div 
                                            onClick={() => setSelectedRecipe(recipe)}
                                            className="p-5 cursor-pointer flex-grow"
                                        >
                                            <h4 className="text-lg font-bold font-serif text-bauhaus-dark">{recipe.title}</h4>
                                            <p className="mt-1 text-sm text-stone-600">{recipe.description}</p>
                                        </div>
                                        <div className="p-4 border-t-2 border-bauhaus-dark flex items-center justify-between text-xs text-stone-600">
                                            <span className="font-bold bg-stone-200 text-stone-800 px-2 py-1 uppercase tracking-wider">{recipe.skillLevel}</span>
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={(e) => handleExportJson(e, recipe)}
                                                    disabled={exportingJsonId === recipe.id}
                                                    title={exportingJsonId === recipe.id ? t('exportingJson') : t('exportAsJson')}
                                                    className="border-2 border-bauhaus-dark bg-white p-2 disabled:opacity-50 disabled:cursor-wait hover:bg-bauhaus-blue"
                                                    aria-label={t('exportAsJson')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-bauhaus-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={(e) => handleExportPdf(e, recipe)}
                                                    disabled={exportingPdfId === recipe.id}
                                                    title={exportingPdfId === recipe.id ? t('savingPdf') : t('saveAsPdf')}
                                                    className="border-2 border-bauhaus-dark bg-white p-2 disabled:opacity-50 disabled:cursor-wait hover:bg-bauhaus-blue"
                                                    aria-label={t('saveAsPdf')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-bauhaus-dark" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipesScreen;