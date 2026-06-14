const VALID_IMAGE_CARD_WIDTHS = ['regular', 'wide', 'full'] as const;
export type ImageCardWidth = typeof VALID_IMAGE_CARD_WIDTHS[number];

export function getAllowedImageCardWidths(configuredWidths: unknown): readonly string[] {
    if (!Array.isArray(configuredWidths)) {
        return VALID_IMAGE_CARD_WIDTHS;
    }

    const filteredWidths = [...new Set(configuredWidths.filter((width: string) => (VALID_IMAGE_CARD_WIDTHS as readonly string[]).includes(width)))];

    if (filteredWidths.length === 0) {
        return VALID_IMAGE_CARD_WIDTHS;
    }

    return filteredWidths;
}

export function getDefaultImageCardWidth(allowedWidths: readonly string[]): string {
    if (allowedWidths.includes('regular')) {
        return 'regular';
    }

    return allowedWidths[0];
}
