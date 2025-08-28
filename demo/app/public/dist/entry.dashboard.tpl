<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>{{ name }}</title><link href="/static/normalize.css" rel="stylesheet"/><link href="/static/logo.ico" rel="icon" type="image/x-icon"/><script defer="defer" src="/dist/prod/js/runtime~entry.dashboard_967ba6ba.bundle.js" crossorigin="anonymous"></script><script defer="defer" src="/dist/prod/js/vendor_c3f6f88c.bundle.js" crossorigin="anonymous"></script><script defer="defer" src="/dist/prod/js/common_cfa9c1ac.bundle.js" crossorigin="anonymous"></script><script defer="defer" src="/dist/prod/js/entry.dashboard_0b8c92f4.bundle.js" crossorigin="anonymous"></script><link href="/dist/prod/vendor.css" rel="stylesheet" crossorigin="anonymous"></head><body style="margin: 0"><div id="root"></div><input id="projKey" value="{{ projKey }}" style="display: none"/> <input id="env" value="{{ env }}" style="display: none"/> <input id="options" value="{{ options }}" style="display: none"/></body><script>try {
      window.projKey = document.getElementById("projKey").value;
      window.env = document.getElementById("env").value;
      const options = document.getElementById("options").value;
      window.options = JSON.parse(options);
    } catch (error) {
      console.log(error);
    }</script></html>