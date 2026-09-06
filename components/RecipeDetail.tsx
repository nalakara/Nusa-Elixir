
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { generateRecipePdf } from '../services/pdfService';

interface RecipeDetailProps {
  recipe: Recipe;
}

// downloadjs is loaded from a script tag in index.html
declare const download: any;

const OverviewDetail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline pb-2">
        <span className="text-sm font-bold text-stone-600 uppercase tracking-wider">{label}</span>
        <span className="font-medium text-bauhaus-dark">{value}</span>
    </div>
);


const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
    const { t } = useLocalization();
    const [isSavingPdf, setIsSavingPdf] = useState(false);
    const [isExportingJson, setIsExportingJson] = useState(false);

    const handleSavePdf = async () => {
        setIsSavingPdf(true);
        try {
            await generateRecipePdf(recipe);
        } catch (error) {
            console.error("PDF generation failed from component", error);
        } finally {
            setIsSavingPdf(false);
        }
    };

    const handleExportJson = () => {
        setIsExportingJson(true);
        try {
            const jsonString = JSON.stringify(recipe, null, 2); // Pretty print
            const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            download(jsonString, fileName, 'application/json');
        } catch (error) {
            console.error("JSON export failed", error);
            alert('Could not export JSON.');
        } finally {
            setIsExportingJson(false);
        }
    };

    const beverageName = recipe.beerStyle || recipe.wineType || recipe.spiritType;
    const blockClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const buttonClasses = "border-2 border-bauhaus-dark inline-flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className={`lg:col-span-3 ${blockClasses}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <span className="bg-bauhaus-yellow text-bauhaus-dark px-3 py-1 font-bold text-sm inline-block uppercase tracking-wider border-2 border-bauhaus-dark">{beverageName}</span>
                        <h2 className="mt-4 text-2xl md:text-3xl font-serif font-bold text-bauhaus-dark">{recipe.title}</h2>
                    </div>
                    <div className="flex-shrink-0 ml-4 mt-1 flex items-center space-x-2">
                        <button
                            onClick={handleExportJson}
                            disabled={isExportingJson}
                            className={`${buttonClasses} bg-white text-bauhaus-dark hover:bg-bauhaus-blue hover:text-white`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            {isExportingJson ? t('exportingJson') : t('exportAsJson')}
                        </button>
                        <button
                            onClick={handleSavePdf}
                            disabled={isSavingPdf}
                            className={`${buttonClasses} bg-white text-bauhaus-dark hover:bg-bauhaus-blue hover:text-white`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {isSavingPdf ? t('savingPdf') : t('saveAsPdf')}
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-lg text-stone-700 leading-relaxed">{recipe.description}</p>
            </div>
            
            <div className={`lg:col-span-1 ${blockClasses}`}>
                <h3 className="text-xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider mb-4">{t('overview')}</h3>
                 <div className="space-y-3">
                    <OverviewDetail label={t('prepTime')} value={`${recipe.prepTimeMinutes} ${t('minutes')}`} />
                    <OverviewDetail label={t('fermentationTime')} value={`${recipe.fermentationTimeDays} ${t('days')}`} />
                    {recipe.targetVolumeLiters && <OverviewDetail label={t('targetProduction')} value={`${recipe.targetVolumeLiters} ${t('liters')}`} />}
                    <OverviewDetail label={t('skillLevelLabel')} value={recipe.skillLevel} />
                    <OverviewDetail label={t('abvLabel')} value={`~${recipe.finalABV}%`} />
                    {recipe.ibu !== undefined && recipe.ibu !== null && <OverviewDetail label={t('ibuLabel')} value={recipe.ibu} />}
                    {recipe.srm !== undefined && recipe.srm !== null &&  <OverviewDetail label={t('srmLabel')} value={recipe.srm} />}
                    {recipe.originalGravity !== undefined && recipe.originalGravity !== null && <OverviewDetail label={t('ogLabel')} value={recipe.originalGravity.toFixed(3)} />}
                    {recipe.finalGravity !== undefined && recipe.finalGravity !== null && <OverviewDetail label={t('fgLabel')} value={recipe.finalGravity.toFixed(3)} />}
                </div>

                {(recipe.caloriesPerServing !== undefined || recipe.sugarPerServingGrams !== undefined) && (
                    <div className="mt-6 pt-4 border-t-2 border-bauhaus-dark/10">
                        <h4 className="text-base font-bold text-bauhaus-dark uppercase tracking-wider mb-3">{t('nutritionalInfo')}</h4>
                        <div className="space-y-3">
                            {recipe.servingSizeMl !== undefined && recipe.servingSizeMl !== null && (
                                <OverviewDetail label={t('servingSize')} value={`${recipe.servingSizeMl} ml`} />
                            )}
                            {recipe.caloriesPerServing !== undefined && recipe.caloriesPerServing !== null && (
                                <OverviewDetail label={t('calories')} value={`~${recipe.caloriesPerServing} kcal`} />
                            )}
                            {recipe.sugarPerServingGrams !== undefined && recipe.sugarPerServingGrams !== null && (
                                <OverviewDetail label={t('sugar')} value={`~${recipe.sugarPerServingGrams} g`} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-2 space-y-6">
                {recipe.equipmentUsed && recipe.equipmentUsed.length > 0 && (
                    <div className={`${blockClasses}`}>
                        <h3 className="text-xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider mb-4">{t('equipmentNeeded')}</h3>
                        <ul className="columns-2 md:columns-3 list-disc list-inside space-y-1 text-stone-700">
                            {recipe.equipmentUsed.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className={`${blockClasses}`}>
                    <h3 className="text-xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider mb-4">{t('ingredients')}</h3>
                    <ul className="space-y-1">
                        {recipe.ingredients.map((ing, index) => (
                            <li key={index} className="flex justify-between items-start py-2 border-b border-stone-200 last:border-b-0">
                                <span className="text-bauhaus-dark pr-4">{ing.name}</span>
                                <div className="text-right flex-shrink-0">
                                    <span className="block font-medium text-bauhaus-dark">{ing.quantityValue} {ing.quantityUnit}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={`lg:col-span-3 ${blockClasses}`}>
                <h3 className="text-xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider mb-4">{t('instructions')}</h3>
                <ol className="space-y-6">
                    {recipe.steps.map((step) => (
                        <li key={step.stepNumber} className="flex items-start">
                            <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-bauhaus-blue text-white font-bold text-lg mr-4 mt-1 border-2 border-bauhaus-dark rounded-full">{step.stepNumber}</span>
                            <p className="text-stone-700 leading-relaxed pt-1">{step.instruction}</p>
                        </li>
                    ))}
                </ol>
            </div>
            
            {recipe.safetyPrecautions && recipe.safetyPrecautions.trim() && (
                 <div className="lg:col-span-3 bg-bauhaus-red border-2 border-bauhaus-dark p-6">
                     <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">{t('safetyPrecautions')}</h3>
                     <p className="text-white leading-relaxed whitespace-pre-wrap">{recipe.safetyPrecautions}</p>
                </div>
            )}
        </div>
    );
};

export default RecipeDetail;