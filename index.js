const chalk = require('chalk');
const fs = require('fs-extra');
const minimist = require('minimist');
const { chromium } = require('playwright');

const argv = minimist(process.argv.slice(2));

const options = {
  help: argv.h || argv.help || argv._[0] === 'help',
  url: (argv.url || '').trim(),
  networkTimeout: Number(argv.network) || 30000,
  jsTimeout: Number(argv.js) || 5000,
  sleep: Number(argv.sleep) || 1000,
  domSelector: (argv.selector || '').trim(),
  outputPath: (argv.output || '').trim(),
  showBrowser: Boolean(argv.show),
  debug: Boolean(argv.debug),
};

if (options.debug) {
  console.log({ options });
}

main();

async function main() {
  if (options.help) {
    help();
  } else {
    let browser;

    try {
      if (options.url) {
        const url = options.url.startsWith('http') ? options.url : `https://${options.url}`;

        browser = await chromium.launch({ headless: !options.showBrowser });
        let page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: options.networkTimeout });

        if (options.domSelector) {
          await page.waitForSelector(options.domSelector, { timeout: options.jsTimeout });
        } else {
          await page.waitForTimeout(options.sleep);
        }

        const content = await page.content();

        if (options.outputPath) {
          await fs.writeFile(`${options.outputPath}`, content, { encoding: 'utf-8' });
        } else {
          console.log(content);
        }
      } else {
        console.log(`
${chalk.yellow('Missing required option --url. Run again with the --help option to see CLI help.')}`);
      }
    } catch (error) {
      throw error;
    } finally {
      browser && (await browser.close());
    }
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
