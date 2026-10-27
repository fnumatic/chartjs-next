import { describe, expect, it } from 'vitest';
import { _adapters } from 'chart.js';
import { registerMomentAdapter } from './chartjs-adapter-moment.esm.js';

describe('moment adapter', () => {
    it('provides the formats a time scale needs', () => {
        registerMomentAdapter();

        const adapter = new _adapters._date({});

        expect(() => adapter.formats()).not.toThrow();
        expect(adapter.formats().month).toBe('MMM YYYY');
    });
});
