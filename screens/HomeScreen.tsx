
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { BEVERAGE_TYPES, SKILL_LEVELS, IBU_LEVELS, SRM_LEVELS, NATURAL_SODA_TYPES } from '../constants';
import { generateRecipe } from '../services/geminiService';
import { addRecipe } from '../services/dbService';
import type { Recipe, RecipeIngredient } from '../types';
import Spinner from '../components/Spinner';
import RecipeDetail from '../components/RecipeDetail';
import BeerForm from '../components/form/BeerForm';
import WineForm from '../components/form/WineForm';
import LiqueurForm from '../components/form/LiqueurForm';
import CustomIngredients from '../components/form/CustomIngredients';
import NaturalSodaForm from '../components/form/NaturalSodaForm';

const HomeScreen: React.FC = () => {
    const { t, language, translate } = useLocalization();
    
    const [beverageType, setBeverageType] = useState(BEVERAGE_TYPES[0].id);
    const [skillLevel, setSkillLevel] = useState(SKILL_LEVELS[0].id);
    const [targetVolumeLiters, setTargetVolumeLiters] = useState('10');
    const [customIngredients, setCustomIngredients] = useState<RecipeIngredient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

    // Liqueur state
    const [baseSpirit, setBaseSpirit] = useState('');
    const [desiredAbv, setDesiredAbv] = useState('25');

    // Beer state
    const [beerStyle, setBeerStyle] = useState('');
    const [targetIbu, setTargetIbu] = useState('moderate');
    const [targetSrm, setTargetSrm] = useState('golden');
    const [brewingMethod, setBrewingMethod] = useState('all_grain');

    // Wine state
    const [wineType, setWineType] = useState('fruit_wine');
    const [wineSweetness, setWineSweetness] = useState('dry');

    // Natural Soda state
    const [naturalSodaType, setNaturalSodaType] = useState(NATURAL_SODA_TYPES[0].id);

    const BASE_SPIRIT_TYPES = BEVERAGE_TYPES.filter(s => !['infused_liqueur', 'beer', 'wine', 'natural_soda'].includes(s.id));
    
    useEffect(() => {
      if (beverageType === 'infused_liqueur' && !baseSpirit) {
        setBaseSpirit(BASE_SPIRIT_TYPES[0].id);
      }
    }, [beverageType, baseSpirit, BASE_SPIRIT_TYPES]);

    const handleNonNegativeChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || parseFloat(value) >= 0) {
            setter(value);
        }
    };
    
    const handleGenerateRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setGeneratedRecipe(null);
        
        const filledIngredients = customIngredients.filter(ing => ing.name.trim() !== '' && ing.quantityValue > 0 && ing.quantityUnit.trim() !== '');

        const selectedIbuValue = IBU_LEVELS.find(level => level.id === targetIbu)?.value;
        const selectedSrmValue = SRM_LEVELS.find(level => level.id === targetSrm)?.value;

        try {
            const recipe = await generateRecipe({
                spiritType: beverageType,
                skillLevel,
                targetVolumeLiters: Number(targetVolumeLiters) || 10,
                customIngredients: filledIngredients.length > 0 ? filledIngredients : undefined,
                language,
                baseSpirit: beverageType === 'infused_liqueur' ? baseSpirit : undefined,
                desiredAbv: beverageType === 'infused_liqueur' ? Number(desiredAbv) : undefined,
                beerStyle: beverageType === 'beer' ? beerStyle : undefined,
                targetIbu: beverageType === 'beer' ? selectedIbuValue : undefined,
                targetSrm: beverageType === 'beer' ? selectedSrmValue : undefined,
                brewingMethod: beverageType === 'beer' ? brewingMethod : undefined,
                wineType: beverageType === 'wine' ? wineType : undefined,
                wineSweetness: beverageType === 'wine' ? wineSweetness : undefined,
                naturalSodaType: beverageType === 'natural_soda' ? naturalSodaType : undefined,
            });
            setGeneratedRecipe(recipe);
            await addRecipe(recipe); // Save to IndexedDB
        } catch (err) {
            setError(t('errorDescription'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    
    return (
        <div className="space-y-12">
            <section className="text-center py-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-bauhaus-dark uppercase tracking-wider">{t('discoverTitle')}</h1>
                <p className="mt-4 text-lg text-stone-700 max-w-2xl mx-auto">{t('discoverSubtitle')}</p>
            </section>
            
            <section className="max-w-4xl mx-auto">
                <form onSubmit={handleGenerateRecipe} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`${formSectionClasses} md:col-span-2`}>
                        <label htmlFor="beverageType" className={labelClasses}>{t('spiritTypeLabel')}</label>
                        <div className="relative">
                            <select id="beverageType" value={beverageType} onChange={(e) => setBeverageType(e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                                {BEVERAGE_TYPES.map(type => (
                                    <option className="bg-white text-bauhaus-dark" key={type.id} value={type.id}>{translate(type)}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-bauhaus-dark">
                                <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div className={`${formSectionClasses} md:col-span-2`}>
                        <label htmlFor="targetProduction" className={labelClasses}>{t('targetProductionLabel')}</label>
                        <input
                            type="number"
                            id="targetProduction"
                            value={targetVolumeLiters}
                            onChange={handleNonNegativeChange(setTargetVolumeLiters)}
                            placeholder={t('targetProductionPlaceholder')}
                            min="1"
                            className={inputBaseClasses}
                        />
                    </div>

                    <div className={`${formSectionClasses} md:col-span-4`}>
                        <label className={labelClasses}>{t('skillLevelLabel')}</label>
                        <div className="flex space-x-[-2px]">
                            {SKILL_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    type="button"
                                    onClick={() => setSkillLevel(level.id)}
                                    className={`flex-1 text-center px-3 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-dark transition-colors duration-200 ${skillLevel === level.id ? 'bg-bauhaus-dark text-white' : 'text-bauhaus-dark bg-white hover:bg-bauhaus-yellow'}`}
                                >
                                    {translate(level)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {beverageType === 'natural_soda' && (
                        <NaturalSodaForm
                            naturalSodaType={naturalSodaType}
                            setNaturalSodaType={setNaturalSodaType}
                        />
                    )}

                    {beverageType === 'infused_liqueur' && (
                        <LiqueurForm 
                            baseSpirit={baseSpirit}
                            setBaseSpirit={setBaseSpirit}
                            desiredAbv={desiredAbv}
                            setDesiredAbv={setDesiredAbv}
                            baseSpiritOptions={BASE_SPIRIT_TYPES}
                        />
                    )}

                    {beverageType === 'beer' && (
                       <BeerForm 
                           beerStyle={beerStyle}
                           setBeerStyle={setBeerStyle}
                           targetIbu={targetIbu}
                           setTargetIbu={setTargetIbu}
                           targetSrm={targetSrm}
                           setTargetSrm={setTargetSrm}
                           brewingMethod={brewingMethod}
                           setBrewingMethod={setBrewingMethod}
                       />
                    )}

                    {beverageType === 'wine' && (
                        <WineForm
                            wineType={wineType}
                            setWineType={setWineType}
                            wineSweetness={wineSweetness}
                            setWineSweetness={setWineSweetness}
                        />
                    )}
                    
                    <CustomIngredients 
                        ingredients={customIngredients}
                        setIngredients={setCustomIngredients}
                    />
                    
                    <button type="submit" disabled={isLoading} className="md:col-span-4 w-full flex justify-center py-4 px-4 text-base font-bold uppercase tracking-wider text-white bg-bauhaus-red border-2 border-bauhaus-dark hover:bg-bauhaus-dark transition-all duration-300 disabled:bg-stone-400 disabled:cursor-not-allowed">
                        {isLoading ? t('generatingRecipe') : t('generateRecipeBtn')}
                    </button>
                </form>
            </section>
            
            <section className="max-w-5xl mx-auto" id="recipe-section">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Spinner />
                        <p className="text-bauhaus-dark font-semibold uppercase tracking-widest">{t('generatingRecipe')}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-bauhaus-red border-2 border-bauhaus-dark text-white p-4" role="alert">
                        <p className="font-bold uppercase">{t('errorTitle')}</p>
                        <p>{error}</p>
                    </div>
                )}
                {generatedRecipe && (
                    <RecipeDetail recipe={generatedRecipe} />
                )}
            </section>
        </div>
    );
};

export default HomeScreen;