!function(e){function t(t){for(var r,a,l=t[0],s=t[1],u=t[2],d=0,f=[];d<l.length;d++)a=l[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);for(c&&c(t);f.length;)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,l=1;l<n.length;l++){var s=n[l];0!==o[s]&&(r=!1)}r&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={0:0},i=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var l=window.webpackJsonp=window.webpackJsonp||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var c=s;i.push([0,1]),n()}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o,i,a=n(1),l=n(9);o=1e6,i=function(){g()},l.createProgressiveTraceGenerator().setNumberOfPoints(o+1).generate().toPromise().then((function(e){r=e,i()}));var s=a.lightningChart().ChartXY({containerId:"chart-container"}).setTitleFillStyle(a.emptyFill).setPadding({left:0,bottom:0,right:30,top:10}),u=document.getElementById("chart-container");u.style.width="0";var c=s.getDefaultAxisX().setAnimationScroll(void 0),d=s.getDefaultAxisY().setAnimationScroll(void 0),f=s.addLineSeries({dataPattern:a.DataPatterns.horizontalProgressive}),g=function(){requestAnimationFrame((function(){u.style.width="100%",h.setText("Rendering ...");var e=window.performance.now();f.add(r),requestAnimationFrame((function(){var t=window.performance.now()-e;h.setText("Rendering speed ("+1..toFixed(1)+"M data-points): "+t.toFixed(0)+" ms")}))}))},p=s.addUIElement(a.UILayoutBuilders.Column.setBackground(a.UIBackgrounds.Rectangle),{x:c.scale,y:d.scale}).setOrigin(a.UIOrigins.LeftTop).setDraggingMode(a.UIDraggingModes.notDraggable).setBackground((function(e){return e.setFillStyle(new a.SolidFill({color:a.ColorHEX("#000").setA(150)})).setStrokeStyle(a.emptyLine)})),y=function(){return p.setPosition({x:c.scale.getInnerStart(),y:d.scale.getInnerEnd()})};y(),c.onScaleChange(y),d.onScaleChange(y);var h=p.addElement(a.UIElementBuilders.TextBox).setText("Rendering ...").setFont((function(e){return e.setWeight("bold")}));p.addElement(a.UIElementBuilders.ButtonBox).setText("Render again").setMargin({left:10}).onSwitch((function(e,t){t&&(f.clear(),h.setText("Rendering ..."),g())}))}]);