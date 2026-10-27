// Mock obsidian API for testing (vitest aliases 'obsidian' to this module).
export class Plugin {
    app: any;
    manifest: any;
    commands: any[] = [];
    settingTabs: any[] = [];
    codeBlockProcessors: Record<string, any> = {};
    data: any = null;

    constructor(app: any, manifest: any) {
        this.app = app;
        this.manifest = manifest;
    }

    addCommand(command: any) {
        this.commands.push(command);
    }

    addSettingTab(tab: any) {
        this.settingTabs.push(tab);
    }

    registerMarkdownCodeBlockProcessor(language: string, handler: any) {
        this.codeBlockProcessors[language] = handler;
    }

    async loadData() {
        return this.data;
    }

    async saveData(data: any) {
        this.data = data;
    }

    async onload(this: void) {}
    onunload(this: void) {}
}

export class Modal {
    app: any;
    contentEl: HTMLElement;
    modalEl: HTMLElement;

    constructor(app: any) {
        this.app = app;
        this.contentEl = document.createElement('div');
        this.modalEl = document.createElement('div');
    }

    open(this: void) {}
    close(this: void) {}
    onOpen(this: void) {}
    onClose(this: void) {}
}

export class Notice {
    message: string;

    constructor(message: string, _duration?: number) {
        this.message = message;
    }

    setMessage(message: string) {
        this.message = message;
    }

    hide() {}
}

export class TFile {
    path = '';
    basename = '';
    extension = '';
    name = '';
    stat: { mtime: number; ctime: number; size: number } = { mtime: 0, ctime: 0, size: 0 };
}

export class App {
    vault: any = {};
    workspace: any = {};
    metadataCache: any = {};
}

export class MarkdownRenderChild {
    containerEl: HTMLElement;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
    }

    onload(this: void) {}
    onunload(this: void) {}
}

export class PluginSettingTab {
    app: App;
    plugin: any;
    containerEl: HTMLElement;

    constructor(app: App, plugin: any) {
        this.app = app;
        this.plugin = plugin;
        this.containerEl = document.createElement('div');
    }

    display(this: void) {}
}

export class Setting {
    constructor(_containerEl: HTMLElement) {}

    setName(_name: string) {
        return this;
    }
    setDesc(_desc: string) {
        return this;
    }
    addDropdown(_cb: any) {
        return this;
    }
    addToggle(_cb: any) {
        return this;
    }
    addSlider(_cb: any) {
        return this;
    }
    addButton(_cb: any) {
        return this;
    }
    addExtraButton(_cb: any) {
        return this;
    }
}

export function parseYaml(_yaml: string): any {
    return {};
}

// Minimal moment shim: the date adapter only checks for a function at runtime.
export const moment = () => null;

export default {};
