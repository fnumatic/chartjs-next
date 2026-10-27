import { describe, expect, it } from 'vitest';
import type { App, TFile } from 'obsidian';
import type { ChartBlock } from 'src/chart/types';
import { readTableBlock } from './tableSource';

const TABLE = '| Quarter | Revenue |\n| --- | --- |\n| Q1 | 10 |';
const block: ChartBlock = { type: 'bar', id: 'sales' };

function mockApp(options: { section?: boolean } = {}): App {
    const file = { path: 'note.md' } as TFile;

    return {
        workspace: { getActiveFile: () => null },
        vault: {
            getAbstractFileByPath: () => file,
            cachedRead: async () => TABLE,
        },
        metadataCache: {
            getFirstLinkpathDest: () => null,
            getFileCache: () => ({
                sections:
                    options.section === false
                        ? []
                        : [
                              {
                                  id: 'sales',
                                  position: { start: { offset: 0 }, end: { offset: 60 } },
                              },
                          ],
            }),
        },
    } as unknown as App;
}

describe('readTableBlock', () => {
    it('reads the section with the block id', async () => {
        const { labels, series } = await readTableBlock(mockApp(), block, 'note.md');

        expect(labels).toEqual(['Q1']);
        expect(series).toEqual([{ title: 'Revenue', data: ['10'] }]);
    });

    it('rejects an unknown section', async () => {
        await expect(readTableBlock(mockApp({ section: false }), block, 'note.md')).rejects.toThrow(
            'Invalid id and/or file',
        );
    });

    it('rejects a section that holds no table', async () => {
        const app = mockApp();
        app.vault.cachedRead = async () => 'just a paragraph';

        await expect(readTableBlock(app, block, 'note.md')).rejects.toThrow(
            'There is no table at that id',
        );
    });
});
