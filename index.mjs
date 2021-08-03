#!/usr/bin/env node

import chalk from 'chalk';
import { default as fs } from 'fs-extra';
import minimist from 'minimist';
import { chromium } from 'playwright';

const argv = minimist(process.argv.slice(2));

if (argv.h || argv.help || argv._[0] === 'help') {
  help();
} else {
  let browser;

  try {
    if (argv.url) {
      const url = argv.url.startsWith('http') ? argv.url : `https://${argv.url}`;

      browser = await chromium.launch({ headless: true });
      let page = await browser.newPage();
      await page.goto(url);
      const content = await page.content();

      if (argv.output) {
        await fs.writeFile(`${argv.output}`, content, { encoding: 'utf-8' });
      } else {
        console.log(content);
      }
    } else {
      help();
    }
  } catch (error) {
    throw error;
  } finally {
    browser && (await browser.close());
  }
}

function help() {
  const bin = 'pwpr';

  console.log(`
A small utility wrapper around ${chalk.bold('playwright')} [${chalk.dim.underline(
    'https://playwright.dev'
  )}] which makes it simple
to fetch, prerender, and return the html contents of javascript rendered pages.

${chalk.bold('USAGE')}
  $ npx ${bin} <options>

${chalk.bold('OPTIONS')}
  -h, --help    ${chalk.dim('show CLI help')}
  --url         [${chalk.bold(['required'])}] ${chalk.dim('the url to visit and prerender (must have an http or https')}
                ${chalk.dim('protocol; anything else will have an https protocol prepended to it)')}
  --output      [${chalk.italic('optional')}] ${chalk.dim(
    'a valid file path into which the page content should be saved'
  )}
                ${chalk.dim('(if omitted, page content will print to stdout)')}

${chalk.bold('EXAMPLES')}
    npx ${bin} --url=http://example.com  ${chalk.green('// prerenders http://example.com and prints to stdout')}
    npx ${bin} --url=example.com  ${chalk.green('// prerenders https://example.com and prints to stdout')}
    npx ${bin} --url=example.com --output=example.html  ${chalk.green(
    '// prerenders https://example.com and saves to ./example.html'
  )}
    npx ${bin} --url=file://somefile.txt --output=example.html  ${chalk.green(
    '// tries to prerender https://file://somefile.txt and blows up'
  )}
`);
}
