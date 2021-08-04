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
  --output      a valid file path into which the page content should be saved
                (if omitted, page content will print to stdout)
  --network     the timeout in milliseconds to wait for the page to load (default 30000)
  --js          the timeout in milliseconds to wait for JS execution (default 5000)
                (only used if option --selector is provided)
  --selector    the css selector to wait for before capturing the page
  --sleep       the timeout in milliseconds to wait before capturing the page (default 1000)
                (only used if option --selector is *not* provided)
  --show        if provided and not empty, will cause the browser to be shown (default false)
  --debug       enable debug output (default false)
```

**EXAMPLES**
```bash
    npx pwpr --url=http://example.com
    # prerenders http://example.com and prints to stdout

    npx pwpr --url=example.com
    # prerenders https://example.com and prints to stdout

    npx pwpr --url=example.com --network=60000
    # prerenders https://example.com after allowing *up to* 60 seconds for the
    # document to fire the "load" event, and prints to stdout

    npx pwpr --url=example.com --output=example.html 
    # prerenders https://example.com and saves to ./example.html

    npx pwpr --url=example.com --sleep=5000
    # prerenders https://example.com after waiting for 5 seconds

    npx pwpr --url=example.com --js=10000 --selector='.js-loaded-class-name'
    # prerenders https://example.com after waiting for *up to* 10 seconds for the specified
    # selector to be matched in the page with "docment.querySelector()" and prints to stdout

    npx pwpr --url=example.com --js=10000 --selector='.js-loaded-class-name' --sleep=10000
    # prerenders https://example.com after waiting for *up to* 10 seconds for the specified
    # selector to be matched in the page with "docment.querySelector()" and prints to stdout
    # **note that the --sleep option is ignored because the --selector option was provided

    npx pwpr --url=file://somefile.txt --output=example.html
    # tries to prerender https://file://somefile.txt and blows up
```