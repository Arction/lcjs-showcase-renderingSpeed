!function(e){function t(t){for(var r,i,s=t[0],l=t[1],u=t[2],c=0,f=[];c<s.length;c++)i=s[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&f.push(o[i][0]),o[i]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(d&&d(t);f.length;)f.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,s=1;s<n.length;s++){var l=n[s];0!==o[l]&&(r=!1)}r&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},o={0:0},a=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var s=window.webpackJsonp=window.webpackJsonp||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var d=l;a.push([3,1]),n()}({3:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),o=n(6),a=new URLSearchParams(window.location.search),i=r.Themes[a.get("theme")]||r.Themes.darkGold,s="".concat(5e6/Math.pow(10,6),"M"),l=(0,r.lightningChart)().ChartXY({container:document.getElementById("chart-container"),theme:(0,r.disableThemeEffects)(i)}).setTitleFillStyle(r.emptyFill).setPadding({right:40}),u=l.getDefaultAxisX(),d=l.getDefaultAxisY(),c=l.addLineSeries({dataPattern:{pattern:"ProgressiveX",regularProgressiveStep:!0}}),f=l.addUIElement(r.UILayoutBuilders.Column,{x:u,y:d}).setOrigin(r.UIOrigins.LeftTop),m=function(){f.setPosition({x:u.getInterval().start,y:d.getInterval().end})};m(),u.onIntervalChange(m),d.onIntervalChange(m);var p=f.addElement(r.UIElementBuilders.TextBox).setText("Generating ".concat(s," data points...")),x=f.addElement(r.UIElementBuilders.TextBox).setText("").setTextFont((function(e){return e.setWeight("bold").setSize(12)})),h=f.addElement(r.UIElementBuilders.TextBox).setText(""),T=f.addElement(r.UIElementBuilders.TextBox).setText("").setTextFont((function(e){return e.setWeight("bold").setSize(12)})),g=f.addElement(r.UIElementBuilders.TextBox).setText(""),w=f.addElement(r.UIElementBuilders.TextBox).setText("").setTextFont((function(e){return e.setWeight("bold").setSize(12)})),v=f.addElement(r.UIElementBuilders.TextBox).setText(""),b=f.addElement(r.UIElementBuilders.TextBox).setText("").setTextFont((function(e){return e.setWeight("bold").setSize(12)})),y=window.performance.now();(0,o.createProgressiveTraceGenerator)().setNumberOfPoints(5e6).generate().toPromise().then((function(e){var t=window.performance.now()-y;p.setText("Generate ".concat(s," data points")),x.setText("".concat(Math.round(t)," ms")),h.setText("Append ".concat(s," data points")),g.setText("Render first frame with data"),requestAnimationFrame((function(){var t=window.performance.now();c.add(e),u.fit(!1),d.fit(!1);var n=window.performance.now(),r=n-t;T.setText("".concat(Math.round(r)," ms")),requestAnimationFrame((function(){var e=window.performance.now(),t=e-n;w.setText("".concat(Math.round(t)," ms")),requestAnimationFrame((function(){var t=window.performance.now()-e;v.setText("Render subsequent frame"),b.setText("".concat(Math.round(t)," ms"))}))}))}))}))}});