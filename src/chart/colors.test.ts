import { describe, expect, it } from 'vitest';
import { normalizePalette, withAlpha } from './colors';

describe('withAlpha', () => {
    it('adds the given opacity as an eight digit hex value', () => {
        expect(withAlpha(['#ff0000'], 0.5)).toEqual(['#ff000080']);
    });

    it('defaults to a quarter opacity', () => {
        expect(withAlpha(['rgb(255, 99, 132)'])).toEqual(['#ff638440']);
    });

    it('keeps one color per input color', () => {
        expect(withAlpha(['#000000', '#ffffff'], 1)).toHaveLength(2);
    });

    it('rejects a non numeric transparency', () => {
        expect(() => withAlpha(['#000000'], Number.NaN)).toThrow(TypeError);
    });
});

describe('normalizePalette', () => {
    it('converts rgba entries to hex', () => {
        expect(normalizePalette(['rgba(255, 99, 132, 1)'])).toEqual(['#ff6384']);
    });

    it('keeps entries it cannot parse', () => {
        expect(normalizePalette(['var(--brand)'])).toEqual(['var(--brand)']);
    });
});
