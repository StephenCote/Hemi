Packaging and deploying the Hemi Framework is only necessary if:
   1) You want to make a custom installation that strips out unused portions, such as monitor configurations.
   2) You want to lazy-load Hemi modules at runtime, and want to only serve up the condensed versions.

Otherwise, the main source folder includes a merged and condensed version, hemi.comp.js.
