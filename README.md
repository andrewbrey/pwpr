# PWPR (**P**lay**w**right **P**re-**R**ender)

A small utility wrapper around playwright [https://playwright.dev] which makes it simple
to fetch, prerender, and return the html contents of javascript rendered pages.

[![Version](https://img.shields.io/npm/v/pwpr.svg)](https://npmjs.org/package/pwpr)
[![Downloads/week](https://img.shields.io/npm/dw/pwpr.svg)](https://npmjs.org/package/pwpr)
[![License](https://img.shields.io/npm/l/pwpr.svg)](https://github.com/andrewbrey/pwpr/blob/master/package.json)

**USAGE**
```bash
  $ npx pwpr <options>
```

**OPTIONS**
```
  -h, --help    show CLI help
  --url         [required] the url to visit and prerender (must have an http or https
                protocol; anything else will have an https protocol prepended to it)
  --output      [optional] a valid file path into which the page content should be saved
                (if omitted, page content will print to stdout)
```

**EXAMPLES**
```bash
    npx pwpr --url=http://example.com # prerenders http://example.com and prints to stdout

    npx pwpr --url=example.com # prerenders https://example.com and prints to stdout

    npx pwpr --url=example.com --output=example.html # prerenders https://example.com and saves to ./example.html

    npx pwpr --url=file://somefile.txt --output=example.html # tries to prerender https://file://somefile.txt and blows up
```