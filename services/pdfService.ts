import { Recipe } from '../types';

// These are loaded from the CDN in index.html
declare const PDFLib: any;
declare const download: any;

const { PDFDocument, rgb, StandardFonts } = PDFLib;

// Helper to fetch font data
const fetchFont = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }
  return response.arrayBuffer();
};

class PdfLayoutManager {
    doc: any;
    currentPage: any;
    y: number;
    margin: number;
    width: number;
    height: number;
    fonts: any;
    colors: any;

    constructor(doc: any, fonts: any, colors: any, margin = 50) {
        this.doc = doc;
        this.currentPage = doc.getPages()[0];
        const size = this.currentPage.getSize();
        this.width = size.width;
        this.height = size.height;
        this.y = this.height - 70; // Increased top margin to prevent header overlap
        this.margin = margin;
        this.fonts = fonts;
        this.colors = colors;
    }

    get drawableWidth() {
        return this.width - this.margin * 2;
    }
    
    moveDown(amount: number) {
        this.y -= amount;
    }

    checkPageBreak(neededHeight = 20) {
        if (this.y - neededHeight < this.margin) {
            this.currentPage = this.doc.addPage();
            const size = this.currentPage.getSize();
            this.width = size.width;
            this.height = size.height;
            this.y = this.height - 70; // Reset Y to the same top margin on new pages
            return true; // Page break occurred
        }
        return false;
    }

    drawWrappedText(text: string, options: { font: any; size: number; lineHeight: number; color: any; maxWidth: number; x?: number; }) {
        const { font, size, lineHeight, color, maxWidth } = options;
        const x = options.x || this.margin;
        
        const paragraphs = text.split('\n');
            
        for(const paragraph of paragraphs) {
            if (paragraph.trim() === '') {
                this.checkPageBreak(lineHeight);
                this.y -= lineHeight;
                continue;
            }
            const words = paragraph.split(' ');
            let line = '';
            for (const word of words) {
                const testLine = line + word + ' ';
                const testWidth = font.widthOfTextAtSize(testLine, size);
                if (testWidth > maxWidth && line.length > 0) {
                    this.checkPageBreak(lineHeight);
                    this.currentPage.drawText(line, { x, y: this.y, font, size, color });
                    this.y -= lineHeight;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            }
            this.checkPageBreak(lineHeight);
            this.currentPage.drawText(line, { x, y: this.y, font, size, color });
            this.y -= lineHeight;
        }
    }
}


export const generateRecipePdf = async (recipe: Recipe): Promise<void> => {
    try {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.addPage();
        
        // --- 1. FONTS & COLORS ---
        const cinzelBoldUrl = 'https://fonts.gstatic.com/s/cinzel/v19/8vIK7wI5COm0i-4GDBg.ttf';
        const poppinsUrl = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf';
        const poppinsBoldUrl = 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLBT5Z1xlFQ.ttf';

        const [cinzelBytes, poppinsBytes, poppinsBoldBytes] = await Promise.all([
             fetchFont(cinzelBoldUrl).catch(() => null), 
             fetchFont(poppinsUrl).catch(() => null),
             fetchFont(poppinsBoldUrl).catch(() => null)
        ]);
        
        const fonts = {
            cinzel: cinzelBytes ? await pdfDoc.embedFont(cinzelBytes) : await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
            poppins: poppinsBytes ? await pdfDoc.embedFont(poppinsBytes) : await pdfDoc.embedFont(StandardFonts.Helvetica),
            poppinsBold: poppinsBoldBytes ? await pdfDoc.embedFont(poppinsBoldBytes) : await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        };

        const colors = {
            dark: rgb(30 / 255, 30 / 255, 30 / 255),
            blue: rgb(76 / 255, 128 / 255, 194 / 255),
            red: rgb(217 / 255, 63 / 255, 61 / 255),
            yellow: rgb(245 / 255, 221 / 255, 42 / 255),
            white: rgb(1, 1, 1),
            gray: rgb(0.3, 0.3, 0.3),
        };

        const layout = new PdfLayoutManager(pdfDoc, fonts, colors);

        const drawSectionHeader = (title: string, options?: {x?: number, width?: number}) => {
            const x = options?.x ?? layout.margin;
            const width = options?.width ?? layout.drawableWidth;

            layout.moveDown(10);
            layout.checkPageBreak(50); // space for header + one line of content
            layout.currentPage.drawRectangle({
                x: x,
                y: layout.y - 18,
                width: width,
                height: 25,
                color: colors.blue,
                opacity: 0.08,
            });
            layout.currentPage.drawText(title, {
                x: x + 10,
                y: layout.y - 12,
                font: fonts.poppinsBold,
                size: 14,
                color: colors.dark
            });
            layout.moveDown(40);
        };
        
        // --- RENDER CONTENT ---
        // Title Section
        layout.checkPageBreak(120);
        const beverageType = recipe.beerStyle || recipe.wineType || recipe.spiritType;
        if (beverageType) {
            const typeWidth = fonts.poppinsBold.widthOfTextAtSize(beverageType.toUpperCase(), 10);
            layout.currentPage.drawRectangle({ x: layout.margin, y: layout.y, width: typeWidth + 16, height: 20, color: colors.yellow });
            layout.currentPage.drawText(beverageType.toUpperCase(), { x: layout.margin + 8, y: layout.y + 6, font: fonts.poppinsBold, size: 10, color: colors.dark });
        }
        layout.moveDown(10);
        
        layout.drawWrappedText(recipe.title, { font: fonts.cinzel, size: 28, lineHeight: 32, color: colors.dark, maxWidth: layout.drawableWidth });
        layout.moveDown(15);
        layout.drawWrappedText(recipe.description, { font: fonts.poppins, size: 11, lineHeight: 16, color: colors.gray, maxWidth: layout.drawableWidth });
        layout.moveDown(25);

        // Overview
        drawSectionHeader('Overview');
        const overviewDetails = [
            { label: 'Skill Level', value: recipe.skillLevel },
            { label: 'Prep Time', value: `${recipe.prepTimeMinutes} min` },
            { label: 'Fermentation', value: `${recipe.fermentationTimeDays} days` },
            { label: 'Yield', value: `${recipe.targetVolumeLiters} Liters` },
            { label: 'Final ABV', value: `~${recipe.finalABV}%` },
        ];
        if (recipe.ibu !== undefined && recipe.ibu !== null) overviewDetails.push({ label: 'IBU', value: String(recipe.ibu) });
        if (recipe.srm !== undefined && recipe.srm !== null) overviewDetails.push({ label: 'SRM', value: String(recipe.srm) });
        if (recipe.originalGravity) overviewDetails.push({ label: 'OG', value: String(recipe.originalGravity.toFixed(3))});
        if (recipe.finalGravity) overviewDetails.push({ label: 'FG', value: String(recipe.finalGravity.toFixed(3))});
        
        if (recipe.servingSizeMl) overviewDetails.push({ label: 'Serving Size', value: `${recipe.servingSizeMl} ml` });
        if (recipe.caloriesPerServing !== undefined && recipe.caloriesPerServing !== null) overviewDetails.push({ label: 'Calories', value: `~${recipe.caloriesPerServing} kcal` });
        if (recipe.sugarPerServingGrams !== undefined && recipe.sugarPerServingGrams !== null) overviewDetails.push({ label: 'Sugar', value: `~${recipe.sugarPerServingGrams} g` });

        const overviewStartY = layout.y;
        overviewDetails.forEach((detail, index) => {
            layout.checkPageBreak(20);
            const yOffset = Math.floor(index / 2) * 20;
            const currentY = overviewStartY - yOffset;
             if (currentY < layout.margin) return; // Should be handled by checkPageBreak, but as a safeguard

            const xPos = layout.margin + (index % 2) * (layout.drawableWidth / 2);
            layout.currentPage.drawText(`${detail.label}:`, { x: xPos, y: currentY, font: fonts.poppinsBold, size: 10, color: colors.dark });
            layout.currentPage.drawText(detail.value, { x: xPos + 100, y: currentY, font: fonts.poppins, size: 10, color: colors.gray });
        });
        layout.y = overviewStartY - Math.ceil(overviewDetails.length / 2) * 20;
        
        // Ingredients & Equipment (Side by Side)
        layout.checkPageBreak(100);
        const twoColStartY = layout.y;
        const colWidth = (layout.drawableWidth - 20) / 2;

        // --- Left Column: Ingredients ---
        drawSectionHeader('Ingredients', { width: colWidth });
        for (const ing of recipe.ingredients) {
            const text = `${ing.quantityValue} ${ing.quantityUnit} - ${ing.name}`;
            layout.drawWrappedText(text, { font: fonts.poppins, size: 10, lineHeight: 15, color: colors.gray, maxWidth: colWidth });
            layout.moveDown(4);
        }
        const leftColFinalY = layout.y;

        // --- Right Column: Equipment ---
        layout.y = twoColStartY; // Reset y to draw right column parallel to left
        const rightColX = layout.margin + colWidth + 20;
        drawSectionHeader('Equipment Needed', { x: rightColX, width: colWidth });
        if (recipe.equipmentUsed && recipe.equipmentUsed.length > 0) {
            for(const item of recipe.equipmentUsed) {
                layout.drawWrappedText(`• ${item}`, { x: rightColX, font: fonts.poppins, size: 10, lineHeight: 15, color: colors.gray, maxWidth: colWidth });
                 layout.moveDown(4);
            }
        }
        const rightColFinalY = layout.y;

        // Set cursor to the end of the longer column
        layout.y = Math.min(leftColFinalY, rightColFinalY);

        // Instructions
        drawSectionHeader('Instructions');
        for (const step of recipe.steps) {
            layout.checkPageBreak(40); // Check for step circle + one line of text
            layout.moveDown(10);
            const stepY = layout.y;
            
            layout.currentPage.drawCircle({ x: layout.margin + 12, y: stepY - 4, size: 12, color: colors.blue });
            layout.currentPage.drawText(`${step.stepNumber}`, {
                x: layout.margin + (step.stepNumber < 10 ? 9 : 6),
                y: stepY - 8,
                font: fonts.poppinsBold,
                size: 10,
                color: colors.white,
            });
            layout.drawWrappedText(step.instruction, {
                x: layout.margin + 35,
                font: fonts.poppins,
                size: 11,
                lineHeight: 16,
                color: colors.dark,
                maxWidth: layout.drawableWidth - 35,
            });
            layout.moveDown(10);
        }

        // Safety Precautions
        if (recipe.safetyPrecautions && recipe.safetyPrecautions.trim()) {
            layout.moveDown(20);
            let requiredHeight = 40;
            const lines = recipe.safetyPrecautions.split('\n');
            lines.forEach(line => {
                const textWidth = fonts.poppins.widthOfTextAtSize(line, 10);
                requiredHeight += Math.ceil(textWidth / (layout.drawableWidth - 20)) * 15;
            });

            layout.checkPageBreak(requiredHeight);
            layout.y -= requiredHeight - 30;
            
            layout.currentPage.drawRectangle({ x: layout.margin, y: layout.y, width: layout.drawableWidth, height: requiredHeight, color: colors.red });

            const textStartY = layout.y + requiredHeight - 25;
            layout.currentPage.drawText('Safety Precautions', { x: layout.margin + 10, y: textStartY, font: fonts.poppinsBold, size: 12, color: colors.white });
            layout.y = textStartY - 20; // Set Y for wrapped text
            layout.drawWrappedText(recipe.safetyPrecautions, { x: layout.margin + 10, font: fonts.poppins, size: 10, lineHeight: 15, color: colors.white, maxWidth: layout.drawableWidth - 20 });
        }

        // --- PAGE HEADERS & FOOTERS ---
        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
            const p = pages[i];
            const pSize = p.getSize();
            // Header
            p.drawText(`Nusa Elixir`, { x: layout.margin, y: pSize.height - 35, font: fonts.poppins, size: 9, color: colors.gray });
            p.drawLine({ start: { x: layout.margin, y: pSize.height - 45 }, end: { x: pSize.width - layout.margin, y: pSize.height - 45 }, thickness: 0.5, color: colors.gray });
            
            // Footer
            p.drawText(`Page ${i + 1} of ${pages.length}`, { x: pSize.width / 2 - 30, y: 30, font: fonts.poppins, size: 9, color: colors.gray });
        }

        // --- SAVE & DOWNLOAD ---
        const pdfBytes = await pdfDoc.save();
        const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        download(pdfBytes, fileName, 'application/pdf');

    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('Could not generate the PDF. Please check your connection or try again.');
    }
};