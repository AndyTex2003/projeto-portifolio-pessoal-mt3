import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { getSuites, getTests } from '@vitest/runner/utils';

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatDuration = (duration) => `${Math.round(duration ?? 0)} ms`;

const createFailureMarkup = (tests) => {
  const failedTests = tests.filter((test) => test.result?.state === 'fail');

  if (failedTests.length === 0) {
    return '<p class="empty">No failed tests.</p>';
  }

  return failedTests
    .map((test) => {
      const errors = (test.result?.errors ?? [])
        .map((error) => `<pre>${escapeHtml(error?.stack ?? error?.message ?? 'Unknown error')}</pre>`)
        .join('');

      return `
        <article class="failure-card">
          <h3>${escapeHtml(test.name)}</h3>
          ${errors}
        </article>
      `;
    })
    .join('');
};

const createSuiteMarkup = (files) =>
  files
    .map((file) => {
      const tests = getTests([file]);
      const state = file.result?.state ?? 'unknown';

      return `
        <section class="suite-card">
          <div class="suite-header">
            <h3>${escapeHtml(file.name ?? file.filepath)}</h3>
            <span class="badge badge-${escapeHtml(state)}">${escapeHtml(state)}</span>
          </div>
          <ul class="test-list">
            ${tests
              .map(
                (test) => `
                  <li class="test-item">
                    <span>${escapeHtml(test.name)}</span>
                    <span>${escapeHtml(test.result?.state ?? test.mode ?? 'unknown')} • ${formatDuration(test.result?.duration)}</span>
                  </li>
                `
              )
              .join('')}
          </ul>
        </section>
      `;
    })
    .join('');

const createHtml = ({ files, durationMs }) => {
  const suites = getSuites(files);
  const tests = getTests(files);
  const passedTests = tests.filter((test) => test.result?.state === 'pass').length;
  const failedTests = tests.filter((test) => test.result?.state === 'fail').length;
  const skippedTests = tests.filter((test) => test.mode === 'skip' || test.result?.state === 'skip').length;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vitest HTML Report</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f4ec;
        --panel: #fffdf8;
        --ink: #1e1b16;
        --muted: #6a6257;
        --line: #ded6c8;
        --pass: #1f7a45;
        --fail: #b42318;
        --skip: #9a6700;
        --shadow: 0 18px 40px rgba(51, 39, 23, 0.08);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        background:
          radial-gradient(circle at top, rgba(220, 188, 122, 0.22), transparent 32%),
          linear-gradient(180deg, #f8f2e7 0%, var(--bg) 100%);
        color: var(--ink);
      }

      main {
        width: min(1100px, calc(100% - 32px));
        margin: 0 auto;
        padding: 40px 0 56px;
      }

      .hero {
        margin-bottom: 24px;
        padding: 28px;
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: var(--shadow);
      }

      .hero h1 {
        margin: 0 0 8px;
        font-size: clamp(2rem, 4vw, 3.5rem);
      }

      .hero p {
        margin: 0;
        color: var(--muted);
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 24px 0;
      }

      .stat-card,
      .suite-card,
      .failure-card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 20px;
        box-shadow: var(--shadow);
      }

      .stat-card {
        padding: 20px;
      }

      .stat-card strong {
        display: block;
        font-size: 2rem;
      }

      .section-title {
        margin: 28px 0 14px;
        font-size: 1.4rem;
      }

      .suite-card,
      .failure-card {
        padding: 20px;
        margin-bottom: 16px;
      }

      .suite-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .suite-header h3,
      .failure-card h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .badge-pass {
        color: var(--pass);
        background: rgba(31, 122, 69, 0.1);
      }

      .badge-fail {
        color: var(--fail);
        background: rgba(180, 35, 24, 0.1);
      }

      .badge-skip {
        color: var(--skip);
        background: rgba(154, 103, 0, 0.12);
      }

      .test-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .test-item {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 0;
        border-top: 1px solid var(--line);
        color: var(--muted);
      }

      .test-item:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .empty {
        color: var(--muted);
      }

      pre {
        overflow: auto;
        padding: 14px;
        border-radius: 16px;
        background: #211d18;
        color: #f7f1e7;
        font-size: 0.9rem;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <h1>Vitest HTML Report</h1>
        <p>${escapeHtml(new Date().toISOString())} • ${escapeHtml(formatDuration(durationMs))}</p>
      </section>

      <section class="stats">
        <article class="stat-card">
          <span>Test files</span>
          <strong>${files.length}</strong>
        </article>
        <article class="stat-card">
          <span>Suites</span>
          <strong>${suites.length}</strong>
        </article>
        <article class="stat-card">
          <span>Passed tests</span>
          <strong>${passedTests}</strong>
        </article>
        <article class="stat-card">
          <span>Failed tests</span>
          <strong>${failedTests}</strong>
        </article>
        <article class="stat-card">
          <span>Skipped tests</span>
          <strong>${skippedTests}</strong>
        </article>
      </section>

      <h2 class="section-title">Suites</h2>
      ${createSuiteMarkup(files)}

      <h2 class="section-title">Failures</h2>
      ${createFailureMarkup(tests)}
    </main>
  </body>
</html>`;
};

export default class HtmlReporter {
  constructor(options = {}) {
    this.options = options;
    this.startTime = Date.now();
  }

  onInit() {
    this.startTime = Date.now();
  }

  async onFinished(files = []) {
    const outputFile = this.options.outputFile ?? './reports/test-report.html';
    const reportFile = resolve(process.cwd(), outputFile);
    const reportDirectory = dirname(reportFile);

    if (!existsSync(reportDirectory)) {
      await mkdir(reportDirectory, { recursive: true });
    }

    const html = createHtml({
      files,
      durationMs: Date.now() - this.startTime
    });

    await writeFile(reportFile, html, 'utf-8');

    process.stdout.write(`\nHTML report written to ${reportFile}\n`);
  }
}
