import type { App, TFile } from 'obsidian';
import { extractTableData } from 'src/chart/table';
import type { TableData } from 'src/chart/table';
import type { ChartBlock } from 'src/chart/types';

/** Resolves `file`, or the current note when the block names none. */
function resolveFile(app: App, block: ChartBlock, sourcePath: string): TFile {
    const linked = block.file
        ? app.metadataCache.getFirstLinkpathDest(
              block.file,
              app.workspace.getActiveFile()?.path ?? sourcePath,
          )
        : null;

    const target = linked ?? app.vault.getAbstractFileByPath(sourcePath);
    if (!target) {
        throw new Error('Invalid id and/or file');
    }

    return target as TFile;
}

/**
 * Reads the markdown table a block points at via `id`.
 *
 * The table is taken from the named section, which lets one note keep a table
 * and a chart block in sync.
 */
export async function readTableBlock(
    app: App,
    block: ChartBlock,
    sourcePath: string,
): Promise<TableData> {
    const file = resolveFile(app, block, sourcePath);
    const section = app.metadataCache
        .getFileCache(file)
        ?.sections?.find((entry) => entry.id === block.id)?.position;

    if (!section) {
        throw new Error('Invalid id and/or file');
    }

    const content = await app.vault.cachedRead(file);
    const markdown = content.substring(section.start.offset, section.end.offset);

    try {
        return extractTableData(markdown, block.layout ?? 'columns', block.select);
    } catch {
        throw new Error('There is no table at that id and/or file');
    }
}
