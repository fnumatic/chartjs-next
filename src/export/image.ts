import type { ImageOptions } from 'src/settings';

/** Encodes a chart canvas with the configured format and quality. */
export function canvasToBlob(canvas: HTMLCanvasElement, options: ImageOptions): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('The chart could not be encoded as an image'));
                }
            },
            options.format,
            options.quality,
        );
    });
}

/** Copies a rendered chart to the clipboard as an image. */
export async function copyChartImage(
    canvas: HTMLCanvasElement,
    options: ImageOptions,
): Promise<void> {
    if (typeof ClipboardItem === 'undefined') {
        throw new Error('Copying images is not supported on this platform');
    }

    const blob = await canvasToBlob(canvas, options);
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
