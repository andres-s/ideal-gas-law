Ideal gas law
=============

Toy implementation of gas molecules bouncing around in a box in your browser. Occasionally molecules will 'jump', which is likely an artefact of me not knowing how to easily create test cases for numerical algorithms when originally writing the code (if you're wondering, just use spreadsheets).

To install `npm` dependencies:
```bash
$ npm install
```

To run tests:
```bash
$ grunt qunit
# and to watch for changes
$ grunt watch
```

If you have python installed, you can view the page using:
```bash
$ python -m SimpleHTTPServer
```
in the project directory and then pointing your browser to http://0.0.0.0:8000/.

I tested it in Chrome and recently tried running it in Firefox, which hung. So, don't view it in Firefox.
