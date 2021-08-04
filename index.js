const chalk = require('chalk');
const fs = require('fs-extra');
const minimist = require('minimist');
const { chromium } = require('playwright');

const argv = minimist(process.argv.slice(2));

const def = {
  networkTimeout: 30000,
  jsTimeout: 5000,
  sleep: 1000,
};

const options = {
  help: argv.h || argv.help || argv._[0] === 'help',
  url: (argv.url || '').trim(),
  outputPath: (argv.output || '').trim(),
  networkTimeout: Number(argv.network) || def.networkTimeout,
  jsTimeout: Number(argv.js) || def.jsTimeout,
  domSelector: (argv.selector || '').trim(),
  sleep: Number(argv.sleep) || def.sleep,
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

  console.log(`-----------------------------------
${chalk.green.bold(bin.toLocaleUpperCase())} - the Playwright Prerender CLI
-----------------------------------

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
  --output      ${chalk.dim('a valid file path into which the page content should be saved')}
                ${chalk.dim('(if omitted, page content will print to stdout)')}
  --network     ${chalk.dim(`the timeout in milliseconds to wait for the page to load (default ${def.networkTimeout})`)}
  --js          ${chalk.dim(`the timeout in milliseconds to wait for JS execution (default ${def.jsTimeout})`)}
                ${chalk.dim('(only used if option --selector is provided)')}
  --selector    ${chalk.dim('the css selector to wait for before capturing the page')}
  --sleep       ${chalk.dim(`the timeout in milliseconds to wait before capturing the page (default ${def.sleep})`)}
                ${chalk.dim('(only used if option --selector is *not* provided)')}
  --show        ${chalk.dim('if provided and not empty, will cause the browser to be shown (default false)')}
  --debug       ${chalk.dim('enable debug output (default false)')}


${chalk.bold('EXAMPLES')}
    npx ${bin} --url=http://example.com
    ${chalk.green('# prerenders http://example.com and prints to stdout')}

    npx ${bin} --url=example.com
    ${chalk.green('# prerenders https://example.com and prints to stdout')}

    npx ${bin} --url=example.com --network=60000
    ${chalk.green('# prerenders https://example.com after allowing *up to* 60 seconds for the')}
    ${chalk.green('# document to fire the "load" event, and prints to stdout')}

    npx ${bin} --url=example.com --output=example.html 
    ${chalk.green('# prerenders https://example.com and saves to ./example.html')}

    npx ${bin} --url=example.com --sleep=5000
    ${chalk.green('# prerenders https://example.com after waiting for 5 seconds')}

    npx ${bin} --url=example.com --js=10000 --selector='.js-loaded-class-name'
    ${chalk.green('# prerenders https://example.com after waiting for *up to* 10 seconds for the specified')}
    ${chalk.green('# selector to be matched in the page with "docment.querySelector()" and prints to stdout')}

    npx ${bin} --url=example.com --js=10000 --selector='.js-loaded-class-name' --sleep=10000
    ${chalk.green('# prerenders https://example.com after waiting for *up to* 10 seconds for the specified')}
    ${chalk.green('# selector to be matched in the page with "docment.querySelector()" and prints to stdout')}
    ${chalk.green('# **note that the --sleep option is ignored because the --selector option was provided')}

    npx ${bin} --url=file://somefile.txt --output=example.html
    ${chalk.green('# tries to prerender https://file://somefile.txt and blows up')}
`);
}
