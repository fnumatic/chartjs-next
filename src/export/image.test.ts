import { describe, expect, it } from 'vitest';
import { canvasToBlob, copyChartImage } from './image';

const canvasReturning = (blob: Blob | null): HTMLCanvasElement =>
    ({
        toBlob: (callback: (result: Blob | null) => void) => callback(blob),
    }) as unknown as HTMLCanvasElement;

describe('canvasToBlob', () => {
    it('resolves with the encoded image', async () => {
        const blob = new Blob(['image'], { type: 'image/png' });

        await expect(
            canvasToBlob(canvasReturning(blob), { format: 'image/png', quality: 1 }),
        ).resolves.toBe(blob);
    });

    it('rejects when the canvas cannot encode', async () => {
        await expect(
            canvasToBlob(canvasReturning(null), { format: 'image/png', quality: 1 }),
        ).rejects.toThrow('could not be encoded');
    });
});

describe('copyChartImage', () => {
    it('fails with a readable message where image clipboard is unavailable', async () => {
        if (typeof ClipboardItem !== 'undefined') {
            return;
        }

        await expect(
            copyChartImage(canvasReturning(new Blob(['x'])), {
                format: 'image/png',
                quality: 1,
            }),
        ).rejects.toThrow('not supported');
    });
});
