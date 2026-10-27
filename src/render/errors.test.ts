// @vitest-environment happy-dom
import { beforeAll, describe, expect, it } from 'vitest';
import { installObsidianDom } from 'src/utils/test-utils';
import { renderError } from './errors';

describe('renderError', () => {
    beforeAll(() => installObsidianDom());

    it('shows the message of an Error', () => {
        const el = document.createElement('div');

        renderError(new Error('Missing type'), el);

        expect(el.querySelector('.chart-error')?.textContent).toContain('Missing type');
    });

    it('shows a thrown string as is', () => {
        const el = document.createElement('div');

        renderError('Invalid id and/or file', el);

        expect(el.querySelector('code')?.textContent).toBe('Invalid id and/or file');
    });
});
