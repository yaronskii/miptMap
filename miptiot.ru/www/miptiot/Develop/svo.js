/**
 * 2011-07-01
 * (c) Art. Lebedev Studio | http://www.artlebedev.ru/
 * Author - Lev Rogozhin (lev@design.ru | lev@reijii.ru)
 */

if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
};

(function() {
  var a = navigator.userAgent,
      v = /(?:(?:Version\/|Chrome\/|Firefox\/|MSIE |Mozilla\/)([0-9.]+)(?:$|[^0-9.]))/i.exec(a)[1].split('.'),
      c = [(/iphone/i.test(a) ? ' m-iphone' : '') || (/ipad/i.test(a) ? ' m-ipad' : '')],
      b = 'm-' +
      (((!this.opera && /msie/i.test(a)) ? 'msie' : '')
          || (/firefox/i.test(a) ? 'firefox' : '')
          || (/opera/i.test(a) ? 'opera' : '')
          || (/chrome/i.test(a) ? 'chrome' : '')
          || (/webkit|safari/i.test(a) ? 'safari' : ''));
  c.push(b);
  for (var i = 0; i < v.length; i++) {
    b += '-' + v[i];
    c.push(b);
  }
  document.documentElement.className += c.join(' ');
})();

(function(window, undefined) {
  var getPlural = function(n) {
    return (n % 10 == 1 && n % 100 != 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  };

  var Template = function(tpl) {
    this._args = [];
    this._matches = {};
    this._tpl = tpl + '';
  };

  Template.prototype.CLEAR_RESULT = 0;
  Template.prototype.CLEAR_MATCHES = 1;
  Template.prototype.CLEAR_ATTR = 2;
  Template.prototype.CLEAR_ALL = 3;

  Template.prototype.getResult = function(anyway) {
    if (anyway || this._result == undefined) {
      this.compile();
    }
    return this._result;
  };

  Template.prototype.getDom = function(anyway) {
    if (anyway || this._result == undefined) {
      this.compile();
    }
    var div = document.createElement('div');
    div.innerHTML = this._result;
    return div.firstChild;
  };

  Template.prototype.compile = function() {
    this._applyAttributes();
    this._applyMatches();
  };

  Template.prototype.clear = function(mode) {
    this._result = undefined;
    switch (mode) {
      case this.CLEAR_ALL:
        this._args = [];
        this._matches = {};
        break;
      case this.CLEAR_ATTR:
        this._args = [];
        break;
      case this.CLEAR_MATCHES:
        this._matches = {};
        break;
    }
  }
  Template.prototype.set = function(data) {
    if (typeof data != 'object') {
      return false;
    }
    if (data instanceof Array) {
      for (var i = 0; i < data.length; i++) {
        this._args.push(data[i]);
      }
    } else {
      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          this._matches[i] = data[i];
        }
      }
    }
  }
  Template.prototype._applyMatches = function() {
    var self = this;
    var from = this._result == undefined ? this._tpl : this._result;
    this._result = from.replace(/#([a-zA-Z0-9\-_.])+#/g, function() {
      var match = arguments[0].toString().replace(/#/g, '');
      return self._matches[match] == undefined ? '' : self._matches[match];
    });
  }
  Template.prototype._applyAttributes = function() {
    var self = this;
    var i = -1;
    var from = this._result == undefined ? this._tpl : this._result;
    this._result = from.replace(/%%|%s|%p\(([^\(]+)\)/g, function() {
      var match = arguments[0];
      i++;
      switch (match.charAt(1)) {
        case '%':
          i++;
          return '%';
        case 's':
          return self._args[i] == undefined ? '' : self._args[i];
        case 'p':
          var plural = arguments[1].split('|'),
              n = self._args[i] >> 0;
          return plural[getPlural(n)].replace(/%n/g, n);
      }
    });
  }
  Template.sprintf = function() {
    var args = arguments,
        form = args[0],
        i = 0;
    return form.replace(/%%|%s|%p\(([^\(]+)\)/g, function() {
      var match = arguments[0];
      i++;
      switch (match.charAt(1)) {
        case '%':
          i--;
          return '%';
        case 's':
          return args[i] == undefined ? '' : args[i];
        case 'p':
          var plural = arguments[1].split('|'),
              n = args[i] >> 0;
          return plural[getPlural(n)].replace(/%n/g, n);
      }
    });
  }

  window.Template = Template;
})(window);

(function(window, jQuery, YMaps, undefined) {
  var document = window.document;
  var $ = YMaps.jQuery;

  var LngPack = function() {
    var self = this;
    $(document).ready(function() {
      self.init();
    });
    return function(id, def) {
      var ids = id.split('#');
      var string = def;
      if (!self._lngObj.length || ids.length < 1 || ids.length > 2) {
        return string;
      }
      if (ids.length == 1) {
        if (self._lngObj.find("div." + ids[0]).length) {
          string = this._lngObj.find("div." + ids[0]).html();
        }
      } else if (ids.length == 2) {
        if (self._lngObj.find("div." + ids[0] + ' .' + ids[1]).length) {
          string = self._lngObj.find("div." + ids[0] + ' .' + ids[1]).html();
        }
      }
      return string;
    }
  }
  LngPack.prototype.init = function() {
    this.do_on_car_load = function() {
    }
    this._lngObj = $('#map-information');
  }
  var l = new LngPack();

  var SvoMap = function() {
    this.showToShuttleRoute = false;

    if (document.location.hash === '#terminalC-floor1-to-shuttle') {
      this.showToShuttleRoute = true;
    }

    var self = this;
    this._isTouch = /iphone|ipad|ipod/i.test(navigator.userAgent);
    this._initMeassages();
    this._isReady = {script: false, dom: false};
    this._showed = {};
    this._routes = {};

    $.ajax({
      url: json_lang_path,
      dataType: 'json',
      cache: false,
      success: function(data) {
        self._initData = data;
        self._tryInit('script');
      }
    });

    $(document).ready(function() {
      self._tryInit('dom');
    });
  };

  /**
   * Return polylines array or undefined
   * @param {string} terminal
   * @param {string} floor
   * @return {Array|undefined}
   */
  SvoMap.prototype.getRoutesCollection = function(terminal, floor) {
    if (this._routes[terminal] !== undefined) {
      return this._routes[terminal][floor];
    }
  };

  /**
   * Return polylines array or undefined
   * @param {string} terminal
   * @param {string} floor
   * @return {Array|undefined}
   */
  SvoMap.prototype.getCurrentRoutesCollection = function() {
    return this.getRoutesCollection(this.getCurrentTerminal(),
        this.getCurrentFloor());
  };

  /**
   * Count of routes in geo collection on current terminal and floor
   * @return {Number}
   */
  SvoMap.prototype.getCurrentCollectionLength = function() {
    var collection = this.getCurrentRoutesCollection();

    if (collection instanceof YMaps.GeoObjectCollection) {
      return collection.length();
    } else {
      return 0;
    }
  };

  /**
   * Add route to geo collection. If collection don't defined
   * create it.
   * @param {string} terminal
   * @param {string} floor
   * @param {YMaps.Polyline} route
   * @returns {number} count of routes
   */
  SvoMap.prototype.addRoute = function(terminal, floor, route) {
    if (!this.hasCollection(terminal, floor)) {
      if (!(this._routes[terminal] instanceof Object &&
          !(this._routes[terminal] instanceof Array))) {
        this._routes[terminal] = {};
      }
      this._routes[terminal][floor] = new YMaps.GeoObjectCollection();
    }
    this._routes[terminal][floor].add(route);
  };

  /**
   * Add router to current terminal and floor
   * @param {YMaps.Polyline} route
   */
  SvoMap.prototype.addRouteToCurrentPlace = function(route, terminal, floor) {
    if (terminal === undefined) {
      var terminal = this.getCurrentTerminal();
    }

    if (floor === undefined) {
      var floor = this.getCurrentFloor();
    }
    this.addRoute(terminal, floor, route);
  };

  /**
   * Remove all routes of geo collections in map according floor and terminal
   *
   * @param {string} terminal
   * @param {string} floor
   */
  SvoMap.prototype.removeAllRoutesFromMap = function(terminal, floor) {
    var self = this;
    if (this._routes[terminal] !== undefined &&
        this._routes[terminal][floor] instanceof YMaps.GeoObjectCollection) {
      this._routes[terminal][floor].forEach(function(polyline) {
        self.schemas.schema.removeOverlay(polyline);
      });
    }
  };

  /**
   * Remove all routes of geo collections on current place(floor, terminal)
   * @param {string} terminal
   * @param {string} floor
   */
  SvoMap.prototype.removeAllRoutesFromCurrentMap = function() {
    this.removeAllRoutesFromMap(this.getCurrentTerminal(),
        this.getCurrentFloor());
  };

  /**
   * Remove routes from map and collections in according to floor and terminal
   * @param {string} terminal
   * @param {string} floor
   */
  SvoMap.prototype.removeAllRoutesFromCollection = function(terminal, floor) {
    this.removeAllRoutesFromMap(terminal, floor);
    if (this._routes[terminal] instanceof Object &&
        this._routes[terminal][floor] instanceof YMaps.GeoObjectCollection) {
      this._routes[terminal][floor].removeAll();
    }
  };

  /**
   * Remove routes from map and collections on current floor and terminal
   * @param {string} terminal
   * @param {string} floor
   */
  SvoMap.prototype.removeAllRoutesFromCurrentCollection = function(terminal, floor) {
    this.removeAllRoutesFromCollection(this.getCurrentTerminal(),
        this.getCurrentFloor());
  };

  /**
   * Remove all routes from collection and map
   */
  SvoMap.prototype.removeAllRoutes = function() {
    var self = this;
    for (var terminalName in this._routes) {
      for (var floorName in this._routes[terminalName]) {
        this._routes[terminalName][floorName].forEach(function(polyline) {
          self.schemas.schema.removeOverlay(polyline);
        });
        this._routes[terminalName][floorName].removeAll();
      }
    }
  };


  /**
   * Is geo collection created
   * @param {string} terminal
   * @param {string} floor
   * @return {boolean}
   */
  SvoMap.prototype.hasCollection = function(terminal, floor) {
    return this._routes[terminal] instanceof Object &&
        this._routes[terminal][floor] instanceof YMaps.GeoObjectCollection;
  };

  /**
   * Is geo collection on current terminal and floor created
   * @return {boolean}
   */
  SvoMap.prototype.hasCurrentCollection = function() {
    return this.hasCollection(this.getCurrentTerminal(),
        this.getCurrentFloor());
  };

  SvoMap.prototype._tryInit = function(what) {
    this._isReady[what] = true;
    if (this._isReady.script && this._isReady.dom) {
      this.init();
    }
  };

  SvoMap.prototype.init = function() {
    if ($.browser.msie) {
      document.documentElement.className += ' msie';
      if ($.browser.version < '8.0') {
        document.documentElement.className += ' msie-old';
        if ($.browser.version < '7.0') {
          document.documentElement.className += ' msie-6';
        }
      }
    }

    // init dom
    this._initDom();

    // init map
    this._initMap();

    // show map
    this._showMap();

    this._initSchemas();

    // init tab if hash in url present
    this._showByHash();
  };

  SvoMap.prototype._showByHash = function() {
    var hash = document.location.hash;
    if (!hash) {
      return;
    }
    var to = '';
    switch (hash) {
      case '#bus':
        to = 'on-bus';
        break;
      case '#car':
        to = 'on-car';
        break;
      case '#taxi':
        to = 'on-taxi';
        break;
      case '#between':
        to = 'on-between';
        break;
      case '#aeroekspress':
        to = 'on-aeroekspress';
        break;
      case '#vnukovo':
        to = 'on-vnukovo';
        break;
      case '#domodedovo':
        to = 'on-domodedovo';
        break;
    }
    if (to) {
      if (to == 'on-car') {
        this.do_on_car_load = function() {
          $(".map-filter ." + to).click();
        }
      } else {
        $(".map-filter ." + to).click();
      }
    }
    if (hash == '#parking') {
      this._objControll.parkingControll.find('input').attr('checked', true).change();
    }
  };

  SvoMap.prototype._showMap = function() {
    var self = this;
    this.map = new YMaps.Map(this.dom.mapPlace[0]);
    this.map.setMaxZoom(15);
    this.map.setMinZoom(10);
    //var startPoint = this._initData.points.misc[this._initData.misc.startWith];
    //this.map.setCenter(new YMaps.GeoPoint(startPoint.x, startPoint.y), startPoint.zoom);
    this.map.setBounds(this._initData.bounds.svo);
    this.map.addControl(new YMaps.Zoom({customTips: []}));
    //this.map.addControl(new YMaps.ToolBar());
    this.map.addControl(YMaps.Layers.get("controlls#object-navigator"));
    this._objectNavigatorShowed = true;
    if (!($.browser.msie && $.browser.version < '9.0')) {
      //this.map.enableScrollZoom();
    }
    this.map.addLayer(YMaps.Layers.get("layer#svo"));

    this.dom.mapPlace[0].className = this.dom.mapPlace[0].className.replace(/( zoom-[0-9]{1,2} )/, ' ') + ' zoom-' + this.map.getZoom() + ' ';

    YMaps.Events.observe(this.map, this.map.Events.Update, function(map) {
      var zoom = map.getZoom();
      self._toggleByZoom(zoom);
      if (zoom < 13 && self._objectNavigatorShowed) {
        $("#map .object-navigator").hide();
        self._objectNavigatorShowed = false;
      }
      if (zoom >= 13 && !self._objectNavigatorShowed) {
        $("#map .object-navigator").show();
        self._objectNavigatorShowed = true;
      }
      self.dom.mapPlace[0].className = self.dom.mapPlace[0].className.replace(/( zoom-[0-9]{1,2} )/, ' ') + ' zoom-' + zoom + ' ';
    });

    this._showMapFinal();

    // DEBUG {
    YMaps.Events.observe(this.map, this.map.Events.Click, function(map, mouseEvent) {
      self._dispatch('map-click', {map: map, mouseEvent: mouseEvent});
    });
    this._observe('map-click', function(data) {
      var map = data.map,
          mouseEvent = data.mouseEvent,
          point = mouseEvent.getGeoPoint();
//			console.log((point.getX())+', '+(point.getY()));
//			console.log((point.getX()-0.0005)+', '+(point.getY()+0.00002));
    });
    this.map.addCursor(YMaps.Cursor.ARROW);
    // DEBUG }
    //SVOMap.addOverlay(YMaps.Layers.get('poligon#svo'));
  }
  SvoMap.prototype._showMapFinal = function() {
    var self = this;
    this._show("collection#map-objects", {minZoom: 13, maxZoom: 17});
    //this._show("collection#taxi-zones", {minZoom:10, maxZoom:17});

    this.map.addOverlay(YMaps.Layers.get("mapObjBubble#permanent"));
    this.map.addOverlay(YMaps.Layers.get("mapObjBubble#temporary"));
  }
  SvoMap.prototype._initDom = function() {
    this.dom = {
      mapPlace: $("#map")
    }
    this._reposition();
    // path('M10,2 h80 s10,0,10,10 v40 s0,10,-10,10 h-20 l10,30 l-20,-30 h-49 s-10,0,-10,-10 v-40 s0,-10,10,-10 Z');
  }
  SvoMap.prototype._reposition = function() {
    $("#info-by-bus,#info-between-terminals").remove().insertBefore(this.dom.mapPlace);
    var sc = document.styleSheets;
//    for (var i = 0; i < sc.length; i++) {
//      if (sc[i].media.mediaText == 'print' && /main-print\.css/i.test(sc[i].href)) {
//        sc[i].disabled = true;
//      }
//    }
    this.addPrintCss();
  }
  SvoMap.prototype.addPrintCss = function() {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.href = '/f/1/global/css/svo.print.css';
    head.appendChild(style);
  }
  SvoMap.prototype._initMap = function() {
    this._initFilter();
    this._initControlls();
    this._initStyles();
    this._initIcons();
    this._initPoligons();
    this._initLayers();
    this._initRoutes();
    this._initPoints();
    this._initTaxiSearch();
    this._initBetween();
    this._initWayToPort();
    this._initPrint();
  }
  SvoMap.prototype._initControlls = function() {
    this._objControll = new ObjectNavigator();
    YMaps.Layers.add('controlls#object-navigator', this._objControll);
  }
  SvoMap.prototype._initStyles = function() {
    var pStyle = new YMaps.Style();
    pStyle.polygonStyle = new YMaps.PolygonStyle();
    pStyle.polygonStyle.fill = true;
    pStyle.polygonStyle.outline = true;
    pStyle.polygonStyle.strokeWidth = 3;
    //pStyle.polygonStyle.strokeColor = "ffffffcc";
    //pStyle.polygonStyle.fillColor = "edead055";
    pStyle.polygonStyle.fillColor = "f7952d00";
    pStyle.polygonStyle.strokeColor = "ffffff00";
    pStyle.hasBalloon = false;
    YMaps.Styles.add("poligons#default", pStyle);


    // TODO styles from data!
    var _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "ede17a99";
    YMaps.Styles.add("poligons#taxiZone1", _pStyle);
    _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "f4be6599";
    YMaps.Styles.add("poligons#taxiZone2", _pStyle);
    _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "fa827099";
    YMaps.Styles.add("poligons#taxiZone3", _pStyle);

    _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "ffffff00";
    YMaps.Styles.add("poligons#svo", _pStyle);

    _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "f7952d00";
    _pStyle.polygonStyle.strokeColor = "ffffff00";
    YMaps.Styles.add("poligons#map-object", _pStyle);

    _pStyle = YMaps.Style.copy(pStyle);
    _pStyle.polygonStyle.fillColor = "f7952d55";
    YMaps.Styles.add("poligons#map-object-hover", _pStyle);
  }
  SvoMap.prototype._initIcons = function() {
    // TODO: icons from data
    var hintStyle = new YMaps.HintContentStyle(new YMaps.Template('<div class="popup">$[hintContent]</div>'));
    var icon = new YMaps.Style();
    icon.iconStyle = new YMaps.IconStyle();
    icon.hintContentStyle = hintStyle;

    var _icon = YMaps.Style.copy(icon);
    _icon.iconStyle = new YMaps.IconStyle(new YMaps.LayoutTemplate(iconTemplate({
      src: '/i/map/icons/icon-bus.png',
      offset: {y: -10, x: -10},
      size: {w: 20, h: 20}
    })));
    YMaps.Styles.add("icon#busstops", _icon);

    _icon = YMaps.Style.copy(icon);
    _icon.iconStyle = new YMaps.IconStyle(new YMaps.LayoutTemplate(iconTemplate({
      src: '/i/map/icons/icon-parking.png',
      offset: {y: -10, x: -10},
      size: {w: 20, h: 20}
    })));
    // _icon.iconStyle.shadow = new YMaps.IconShadowStyle();
    // _icon.iconStyle.shadow.href = "/i/map/icons/icon-parking-shadow.png";
    // _icon.iconStyle.shadow.size = new YMaps.Point(30, 17);
    // _icon.iconStyle.shadow.offset = new YMaps.Point(-11, -16);
    YMaps.Styles.add("icon#parking", _icon);


    // icon.iconStyle.shadow = new YMaps.IconShadowStyle();
    // icon.iconStyle.shadow.href = '/i/map/icons/icon-route-shadow.png';
    // icon.iconStyle.shadow.size = new YMaps.Point(46,35);
    // icon.iconStyle.shadow.offset = new YMaps.Point(-11, -16);

    _icon = YMaps.Style.copy(icon);
    _icon.iconStyle = new YMaps.IconStyle(new YMaps.LayoutTemplate(iconTemplate({
      src: '/i/map/icons/icon-route-begin.png',
      offset: {y: -35, x: -10},
      size: {w: 36, h: 35}
    })));

    _icon.iconStyle.shadow = new YMaps.IconShadowStyle();
    _icon.iconStyle.shadow.href = '/i/map/icons/icon-route-shadow.png';
    _icon.iconStyle.shadow.size = new YMaps.Point(46, 35);
    _icon.iconStyle.shadow.offset = new YMaps.Point(-8, -35);

    YMaps.Styles.add("icon#route-start", _icon);

    _icon = YMaps.Style.copy(icon);
    _icon.iconStyle = new YMaps.IconStyle(new YMaps.LayoutTemplate(iconTemplate({
      src: '/i/map/icons/icon-route-end.png',
      offset: {y: -35, x: -10},
      size: {w: 36, h: 35}
    })));
    _icon.iconStyle.shadow = new YMaps.IconShadowStyle();
    _icon.iconStyle.shadow.href = '/i/map/icons/icon-route-shadow.png';
    _icon.iconStyle.shadow.size = new YMaps.Point(46, 35);
    _icon.iconStyle.shadow.offset = new YMaps.Point(-8, -35);
    YMaps.Styles.add("icon#route-finish", _icon);


  }
  SvoMap.prototype._toggleByZoom = function(zoom) {
    for (var i in this._showed) {
      if (this._showed.hasOwnProperty(i) && this._showed[i] != undefined) {
        var o = this._showed[i];
        if ((o.minZoom > zoom || o.maxZoom < zoom) && o.showed) {
          this._showed[i].showed = false;
          this.map.removeOverlay(YMaps.Layers.get(i));
        }
        if ((o.minZoom <= zoom && o.maxZoom >= zoom) && !o.showed) {
          this._showed[i].showed = true;
          this.map.addOverlay(YMaps.Layers.get(i));
        }
      }
    }
  };

  SvoMap.prototype._show = function(what, params) {
    params = params || {};

    var obj = typeof what == 'string' ? YMaps.Layers.get(what) : what;

    this.map.addOverlay(obj);

    if (typeof what == 'string') {
      this._showed[what] = {
        minZoom: params.minZoom,
        maxZoom: params.maxZoom,
        showed: true
      };
    }
  };

  SvoMap.prototype._hide = function(what) {
    if (typeof what == 'string') {
      this.map.removeOverlay(YMaps.Layers.get(what));
      this._showed[what] = undefined;
    } else {
      this.map.removeOverlay(what);
    }
  };

  SvoMap.prototype._initPoints = function() {
    var busCollection = new YMaps.GeoObjectCollection(YMaps.Styles.get("icon#busstops")),
        parkingCollection = new YMaps.GeoObjectCollection(YMaps.Styles.get("icon#parking")),
        busstops = this._initData.points.busstops,
        parkings = this._initData.points.parkings;

    for (var i in busstops) {
      if (busstops.hasOwnProperty(i)) {
        var point = new YMaps.GeoPoint(busstops[i].x, busstops[i].y);
        var placemark = new YMaps.Placemark(point, {
          hasHint: true,
          hasBalloon: this._isTouch,
          hintOptions: {
            showTimeout: 200,
            offset: new YMaps.Point(5, 5)
          }
        });
        var txt = l("busstops#" + i, busstops[i].title);
        placemark.metaDataProperty = {title: txt, id: i};
        placemark.name = txt;
        placemark.hintContent = txt;
        placemark.name = txt;
        busCollection.add(placemark);
      }
    }

    YMaps.Layers.add('points#busstops', busCollection);

    for (var i in parkings) {
      if (parkings.hasOwnProperty(i)) {
        var points = [];
        if (parkings[i].points instanceof Array) {
          for (var k = 0; k < parkings[i].points.length; k++) {
            points.push({x: parkings[i].points[k].x, y: parkings[i].points[k].y});
          }
        } else {
          points.push({x: parkings[i].x, y: parkings[i].y});
        }
        for (var k = 0; k < points.length; k++) {
          var point = new YMaps.GeoPoint(points[k].x, points[k].y);
          var placemark = new YMaps.Placemark(point, {
            hasHint: true,
            hasBalloon: true,
            hintOptions: {
              showTimeout: 200,
              offset: new YMaps.Point(5, 5)
            },
            balloonOptions: {
              mapAutoPan: true,
              maxWidth: 300
            }
          });
          var _title = l("parkings#" + i, parkings[i].title),
              _descr = l("parkings#descr-" + i, parkings[i].description);
          placemark.metaDataProperty = {
            title: _title,
            description: _descr,
            id: '' + i + k
          }
          placemark.name = '<span class="parking-title">' + _title + '</span>';
          placemark.hintContent = _title;
          placemark.description = '<div class="parking-description">' + _descr + '</div>';
          parkingCollection.add(placemark);
        }
      }
    }
    YMaps.Layers.add("points#parkings", parkingCollection);
  }
  function iconTemplate(img) {
    var foo = function(context, map, owner) {
      img = img || {};
      img.src = img.src || '/i/map/icons/icon-default.png';
      img.offset = img.offset || {};
      img.offset.x = img.offset.x || -15;
      img.offset.y = img.offset.y || -15;
      img.size = img.size || {};
      img.size.w = img.size.w || 29;
      img.size.h = img.size.h || 29;

      var meta = context.metaDataProperty;
      this.element = YMaps.jQuery('<img class="map-icons" style="height:' + img.size.h + 'px;width:' + img.size.w + 'px;" src="' + img.src + '" />');
      this.img = img;
    };

    foo.prototype = IconTemplate.prototype;

    return foo;
  }

  function IconTemplate() {
  }
  IconTemplate.prototype.onAddToParent = function(parentNode) {
    this.element.appendTo(parentNode)
  };
  IconTemplate.prototype.onRemoveFromParent = function() {
    this.element.remove()
  }
  IconTemplate.prototype.update = function() {
  }
  IconTemplate.prototype.getOffset = function() {
    return new YMaps.Point(this.img.offset.x, this.img.offset.y)
  }
  IconTemplate.prototype.getRootNodes = function() {
    return this.element
  }

  function BubbleTemplate() {
  }
  BubbleTemplate.prototype.onAddToParent = function(parentNode) {
    this.element.appendTo(parentNode)
  };
  BubbleTemplate.prototype.onRemoveFromParent = function() {
    this.element.remove()
  }
  BubbleTemplate.prototype.update = function() {
  }
  BubbleTemplate.prototype.getOffset = function() {
    return new YMaps.Point(this.offset.x, this.offset.y)
  }
  BubbleTemplate.prototype.getRootNodes = function() {
    return this.element
  }

  function bubbleTemplate(params) {
    params = params || {};
    params.bubbleClass = params.bubbleClass || 'simple';
    params.content = params.content || '';
    params.position = params.position || {};

    var containerStyle = '';
    var bubbleStyle = '';
    var bubbleClass = '';
    var bubbleStyle2 = '';
    var bubblePinClass2 = '';
    var bubblePinClass = '';
    switch (params.type) {
      case 'permanent':
      case 'temporary':
      case 'taxi':
        bubbleClass = 'map-bubble-' + params.type;
        if (params.showOnHover) {
          bubbleClass = 'map-bubble-onhover ' + bubbleClass;
        }
        if (params.marker) {
          bubbleStyle = skew(params.markerAngle);
          if (params.markerSize) {
            bubbleStyle += 'height:' + params.markerSize + ';';
          }
          bubblePinClass = 'map-bubble-pin-' + params.markerPosition.split(' ').join(' map-bubble-pin-');
          if (params.marker2) {
            bubbleStyle2 = 'display:block;' + skew(params.markerAngle2);
            bubblePinClass2 = 'map-bubble-pin-' + params.markerPosition2.split(' ').join(' map-bubble-pin-');
            if (params.markerSize2) {
              bubbleStyle2 += 'height:' + params.markerSize2 + ';';
            }
          }
        } else {
          bubbleStyle = 'display:none;'
        }
        if (params.borderColor) {
          containerStyle += 'border-color:' + params.borderColor + ';';
        }
        if (params.boxShadow) {
          containerStyle += boxShadow();
        }
        for (var j in params.position) {
          if (params.position.hasOwnProperty(j)) {
            containerStyle += j + ':' + params.position[j] + ';';
          }
        }
        break;
    }
    var tpl = new Template(SVOMap._templates.bubble);
    tpl.set({
      bubbleStyle: containerStyle,
      bubbleClass: bubbleClass,
      bubblePinStyle: bubbleStyle,
      bubblePinClass: bubblePinClass,
      bubblePin2Style: bubbleStyle2,
      bubblePin2Class: bubblePinClass2,
      bubbleContent: params.content
    });
    return tpl.getResult();

    var foo = function(context, map, owner) {
      this.element = YMaps.jQuery(tpl.getResult());
    }

    foo.prototype = BubbleTemplate.prototype;
    return foo;
  }

  function ObjectNavigator() {
  }
  ObjectNavigator.prototype.onAddToMap = function(map, position) {
    this.superContainer = jQuery('<div class="object-navigator"></div>');
    this.container = YMaps.jQuery('<div class="object-filter"></div>');
    this.map = map;
    this.position = position || new YMaps.ControlPosition(YMaps.ControlPosition.TOP_RIGHT, new YMaps.Size(10, 10));
    this.position.apply(this.superContainer);
    this.superContainer.css({
      zIndex: YMaps.ZIndex.CONTROL
    });



    this.printContainer = YMaps.jQuery('<div class="print-object-navigator"></div>');

    this._generateControll();

    this.superContainer.append(this.container);
    this.superContainer.append(this.printContainer);
    this.superContainer.appendTo(this.map.getContainer());


  }
  ObjectNavigator.prototype.onRemoveFromMap = function() {
    if (this.container.parent()) {
      this.container.remove();
      this.container = null;
    }
    this.map = null;
  }
  ObjectNavigator.prototype._generateControll = function() {
    var toggleDiv = YMaps.jQuery('<div class="object-navigator-toggler"><span>' + l('controls#toggler', 'Показать на карте') + '</span><i class="icon icon-drop"></i></div>');
    toggleDiv.appendTo(this.container);

    var controllDiv = YMaps.jQuery('<div class="object-navigator-controlls" />');
    this.busstopControll = YMaps.jQuery('<div class="controll"><label><input type="checkbox" name="object-navigator-controll-busstops"/>' + l('controls#busstops', 'Остановки') + '</label></div>');
    this.parkingControll = YMaps.jQuery('<div class="controll"><label><input type="checkbox" name="object-navigator-controll-busstops"/>' + l('controls#parkings', 'Парковки') + '</label></div>');

    function _controll(code) {
      return function(sel) {
        var $this = YMaps.jQuery(this);
        if ($this.attr('checked')) {
          SVOMap.map.setBounds(SVOMap._initData.bounds.svo);
          SVOMap._show(code, {minZoom: 13, maxZoom: 17});
          //self.map.addOverlay(YMaps.Layers.get(code));
        } else {
          SVOMap._hide(code);
          //self.map.removeOverlay(YMaps.Layers.get(code));
        }
      }
    }
    var self = this;

    this.busstopControll
        .find('input')
        .bind($.browser.msie && $.browser.version < '9.0' ? 'propertychange' : 'change', _controll('points#busstops'));
    this.parkingControll
        .find('input')
        .bind($.browser.msie && $.browser.version < '9.0' ? 'propertychange' : 'change', _controll('points#parkings'));

    this.busstopControll.appendTo(controllDiv);
    this.parkingControll.appendTo(controllDiv);
    toggleDiv.click(function() {
      controllDiv.slideToggle('fast');
      YMaps.jQuery(this).toggleClass('object-navigator-toggler-active');
    });
    controllDiv.slideToggle('fast');

    controllDiv.appendTo(this.container);
  }

  SvoMap.prototype._initRoutes = function() {
    var self = this;

    var _tos = {};
    for (var i in this._initData.routes.from) {
      if (this._initData.routes.from.hasOwnProperty(i) && i == 'moscow') {
        var from = new YMaps.GeoPoint(this._initData.routes.from[i].x, this._initData.routes.from[i].y);
        from.metaDataProperty = {title: this._initData.routes.from[i].title, id: i};
        for (var j in this._initData.points.terminals) {
          if (this._initData.points.terminals.hasOwnProperty(j) && j == 'terminalC') {
            if (_tos[j] == undefined) {
              _tos[j] = new YMaps.GeoPoint(this._initData.points.terminals[j].x, this._initData.points.terminals[j].y);
              _tos[j].metaDataProperty = {title: this._initData.points.terminals[j].title, id: j};
            }
            var to = _tos[j];
            var route = new YMaps.Router([from, to]);

            YMaps.Events.observe(route, route.Events.Success, this._rebuildRoute);
          }
        }
      }
    }
  }
  SvoMap.prototype._rebuildRoute = function(route) {
    if (SVOMap.__showRoute == undefined) {
      SVOMap.__showRoute = false;
    }
    if (SVOMap.__showRoute) {
      SVOMap.map.removeOverlay(YMaps.Layers.get("route#editable"));
    }

    var start = route.getWayPoint(0),
        finish = route.getWayPoint(1);
    start.setStyle(YMaps.Styles.get('icon#route-start'));
    start.setOptions({hasBalloon: false, draggable: true});

    finish.setStyle(YMaps.Styles.get('icon#route-finish'));
    finish.setOptions({hasBalloon: false, draggable: true});

    var l1 = YMaps.Events.observe(start, start.Events.DragStart, function() {
      SVOMap.map.addOverlay(YMaps.Layers.get('poligon#svo'));
    });
    var l2 = YMaps.Events.observe(finish, finish.Events.DragStart, function() {
      SVOMap.map.addOverlay(YMaps.Layers.get('poligon#svo'));
    });

    var l3 = YMaps.Events.observe(start, start.Events.DragEnd, function() {
      SVOMap.map.removeOverlay(YMaps.Layers.get('poligon#svo'));
      start.setOptions({draggable: false});
      var _route = new YMaps.Router([start.getGeoPoint(), finish.getGeoPoint()]);
      YMaps.Events.observe(_route, _route.Events.Success, SVOMap._rebuildRoute);
      l1.cleanup();
      l2.cleanup();
      l3.cleanup();
      l4.cleanup();
      l5.cleanup();
    });
    var l4 = YMaps.Events.observe(finish, finish.Events.DragEnd, function() {
      SVOMap.map.removeOverlay(YMaps.Layers.get('poligon#svo'));
      finish.setOptions({draggable: false});
      var _route = new YMaps.Router([start.getGeoPoint(), finish.getGeoPoint()]);
      YMaps.Events.observe(_route, _route.Events.Success, SVOMap._rebuildRoute);
      l1.cleanup();
      l2.cleanup();
      l3.cleanup();
      l4.cleanup();
      l5.cleanup();
    });
    var l5 = YMaps.Events.observe(finish, finish.Events.Drag, function() {
      if (!YMaps.Layers.get("poligon#svo").contains(finish.getGeoPoint())) {
        YMaps.Events.notify(finish, finish.Events.DragEnd);
      }
    });

    YMaps.Layers.remove("route#editable", route);
    YMaps.Layers.add("route#editable", route);
    if (SVOMap.__showRoute) {
      SVOMap.map.addOverlay(YMaps.Layers.get("route#editable"));
    }
    if (typeof SVOMap.do_on_car_load == 'function') {
      SVOMap.do_on_car_load();
    }
    SVOMap.do_on_car_load = function() {
    }
  }
  SvoMap.prototype._initPoligons = function() {
    var mapObjectsCollection = new YMaps.GeoObjectCollection(YMaps.Styles.get("poligon#terminal"));
    var taxiCollection = new YMaps.GeoObjectCollection();
    var mapObjectsCollectionBabbles = {};

    for (var i in this._initData.regions) {
      if (this._initData.regions.hasOwnProperty(i) && this._initData.regions[i] instanceof Array) {
        var _points = [],
            _data = this._initData.regions[i];
        for (var j = 0; j < _data.length; j++) {
          _points.push(new YMaps.GeoPoint(_data[j][0], _data[j][1]));
        }
        var poligon = new YMaps.Polygon(_points);

        var style = YMaps.Styles.get("poligons#" + i);
        if (!style) {
          style = YMaps.Styles.get("poligons#default");
        }
        poligon.setStyle(style);

        if (this._initData.regionsSettings[i] != undefined) {
          poligon.metaDataProperty = this._initData.regionsSettings[i];
          if (this._initData.regionsSettings[i].zIndex) {
            poligon.setOptions({zIndex: this._initData.regionsSettings[i].zIndex});
          }
        }
        poligon.metaDataProperty = {
          id: i
        };
        if (/^mapobject/i.test(i)) {
          var pD = null;
          if (this._initData.regionsBubbles[i]) {
            var b = this._initData.regionsBubbles[i];
            if (mapObjectsCollectionBabbles[b.type] == undefined) {
              mapObjectsCollectionBabbles[b.type] = new YMaps.GeoObjectCollection();
            }
            var style = new YMaps.Style();
            style.iconStyle = new YMaps.IconStyle(new YMaps.Template(bubbleTemplate({
              type: b.type,
              marker: b.marker,
              markerAngle: b.markerAngle,
              markerPosition: b.markerPosition,
              markerSize: b.markerSize,
              marker2: b.marker2,
              markerAngle2: b.markerAngle2,
              markerPosition2: b.markerPosition2,
              markerSize2: b.markerSize2,
              content: l('object-bubbles#' + i, b.content),
              position: b.position,
              showOnHover: b.showOnHover
            })));

            var point = new YMaps.GeoPoint(b.x, b.y);
            var placemark = new YMaps.Placemark(point, {
              hasHint: false,
              hasBalloon: false,
              style: style
            });

            mapObjectsCollectionBabbles[b.type].add(placemark);
            this._initHoverStyleOnMark(placemark, "poligons#map-object", poligon);
            if (b.showOnHover) {
              this._initShowOnHover(poligon, placemark);
            }
            pD = placemark._$iconContainer || null;
            //placemark._$iconContainer.addClass('a-hover');
            // var pl = new YMaps.Placemark(point);
            // mapObjectsCollectionBabbles[b.type].add(pl);


            //editing of bubble position
            /*
             if(typeof poligon.startEditing != 'undefined' &&  poligon.metaDataProperty.id == 'mapobject_terminalE'){
             xxxxx2 = placemark;
             console.log(xxxxx2)
             }
             */
          }

          poligon.href = this._initData.regionsBubbles[i].content;

          var element = document.createElement('div');
          element.innerHTML = this._initData.regionsBubbles[i].content;
          poligon.href = $(element.getElementsByTagName('a')).attr('href');

          YMaps.Events.observe(poligon, poligon.Events.Click,
              function(poligon, event) {
                this.href && (document.location.href = this.href);
              }
          );

          mapObjectsCollection.add(poligon);
          this._initHoverStyle(poligon, 'poligons#map-object', pD);

        } else if (/^taxizone/i.test(i)) {
          if (this._initData.regionsBubbles[i]) {
            var b = this._initData.regionsBubbles[i];
            if (mapObjectsCollectionBabbles[b.type] == undefined) {
              mapObjectsCollectionBabbles[b.type] = new YMaps.GeoObjectCollection();
            }
            var style = new YMaps.Style();
            style.iconStyle = new YMaps.IconStyle(new YMaps.Template(bubbleTemplate({
              type: b.type,
              content: l('object-bubbles#' + i, b.content || ''),
              position: b.position,
              borderColor: b.borderColor,
              boxShadow: b.boxShadow
            })));

            var point = new YMaps.GeoPoint(b.x, b.y);
            var placemark = new YMaps.Placemark(point, {
              hasHint: false,
              hasBalloon: false,
              style: style
            });

            mapObjectsCollectionBabbles[b.type].add(placemark);
            // var pl = new YMaps.Placemark(point);
            // mapObjectsCollectionBabbles[b.type].add(pl);
          }
          taxiCollection.add(poligon);
        } else {
          YMaps.Layers.add("poligon#" + i, poligon);
        }

        //editing of poligon shape
        /*
         if(typeof poligon.startEditing != 'undefined' &&  poligon.metaDataProperty.id == 'mapobject_terminalD'){
         xxxxx = poligon;
         console.log(xxxxx);
         }
         */
      }
    }
    YMaps.Layers.add('collection#map-objects', mapObjectsCollection);
    YMaps.Layers.add('collection#taxi-zones', taxiCollection);
    for (var j in mapObjectsCollectionBabbles) {
      if (mapObjectsCollectionBabbles.hasOwnProperty(j)) {
        YMaps.Layers.add("mapObjBubble#" + j, mapObjectsCollectionBabbles[j]);
      }
    }
  }
  SvoMap.prototype._initHoverStyle = function(obj, style, pD) {
    YMaps.Events.observe(obj, obj.Events.MouseEnter, function(point) {
      point.setStyle(YMaps.Styles.get(style + '-hover'));
      if (pD) {
        pD.addClass('a-hover');
      }
    });
    YMaps.Events.observe(obj, obj.Events.MouseLeave, function(point) {
      point.setStyle(YMaps.Styles.get(style));
      if (pD) {
        pD.removeClass('a-hover');
      }
    });
  }
  SvoMap.prototype._initHoverStyleOnMark = function(obj, style, point) {
    YMaps.Events.observe(obj, obj.Events.MouseEnter, function() {
      point.setStyle(YMaps.Styles.get(style + '-hover'));
      //console.log($(".bubble-content:contains('Ангар')").parent().attr("class"));
    });
    YMaps.Events.observe(obj, obj.Events.MouseLeave, function() {
      point.setStyle(YMaps.Styles.get(style));
    });
  }
  SvoMap.prototype._initShowOnHover = function(obj, point) {
    var self = this;
    YMaps.Events.observe(obj, obj.Events.MouseEnter, function() {
      point._icon._$elements.removeClass("map-bubble-onhover");
      //console.log(point);
      //self.map.addOverlay(point);
      //point.setStyle(YMaps.Styles.get(style + '-show-hover'));
    });
    YMaps.Events.observe(obj, obj.Events.MouseLeave, function() {
      point._icon._$elements.addClass("map-bubble-onhover");
//      self.map.removeOverlay(point);
//      point.setStyle(YMaps.Styles.get(style));
    });
  };
  SvoMap.prototype._initLayers = function() {
    var replace = function(where, from, to) {
      if (from instanceof Array && from.length) {
        for (var i = 0; i < from.length; i++) {
          where = where.replace(new RegExp(from[i], 'g'), to[i] ? to[i] : '');
        }
      }
      return where;
    }
    for (var i in this._initData.layers) {
      if (this._initData.layers.hasOwnProperty(i)) {
        var layer = new YMaps.TileDataSource("", true, true);
        layer.getTileUrl = (function(layerProp, defImg) {
          return function(tile, zoom) {
            if (zoom < layerProp.zoomMin || zoom > layerProp.zoomMax) {
              return defImg;
            } else {
              return replace(layerProp.tilesSource, ['%z', '%x', '%y'], [zoom, tile.x, tile.y]);
            }
          }
        })(this._initData.layers[i], this._initData.misc.noTileImg);
        var options = {};
        if (this._initData.layers[i].zIndex) {
          options.zIndex = this._initData.layers[i].zIndex;
        }
        YMaps.Layers.add("layer#" + i, new YMaps.Layer(layer, options));
      }
    }
  }

  SvoMap.prototype._initFilter = function() {
    this._filter = {
      dom: $(".map-filter")
    };

    this._filter.filters = this._filter.dom.find('li span');
    this._filter.filtersLi = this._filter.filters.parents('li');
    this._filter.all = this._filter.filters.filter('.on-full').parents('li');

    var self = this;
    this._filter.filters.click(function() {
      var $this = $(this);
      var selected = $this.parents('li').hasClass('selected');

      if (!self.schemas.isSchema || !selected) {
        self._filter.filtersLi.removeClass('selected');
        if (selected) {
          self._filter.all.addClass('selected');
        } else {
          $this.parents('li').addClass('selected');
        }
      }
      self._doFilter();
    });
  }
  SvoMap.prototype._doFilter = function() {
    var on = this._filter.filtersLi.filter('.selected').find('span')[0].className;
    if ($.browser.msie && $.browser.version == '9.0') {
      var f = $(".map-filter .on-full").parent();
      f.css("display", 'inline');
      setTimeout(function() {
        f.css("display", 'block');
      }, 50);
    }
    if (this.schemas.isSchema) {
      this.schemas.switchTo('map');
    }
    switch (on) {
      case 'on-full':
        this._switchViewTo("map");
        // this.dom.mapPlace.show();
        // $('#info-aeroexpress').hide();
        this.map.removeControl(this.searchTaxi);
        this.map.setCenter(new YMaps.GeoPoint(this._initData.points.misc.svo.x, this._initData.points.misc.svo.y));
        this._objControll.busstopControll.find('input').attr('checked', false).change();
        this._objControll.parkingControll.find('input').attr('checked', false).change();
        this._hideRouteControll();
        this._hideTaxi();
        this.map.setBounds(this._initData.bounds.svo);
        break;
      case 'on-taxi':
        this._switchViewTo("info-taxi,#map");
        // this.dom.mapPlace.show();
        // $('#info-aeroexpress').hide();
        this.map.addControl(this.searchTaxi);
        // console.log(this.dom.mapPlace
        // 	.find('div.YMaps-btn div.YMaps-h-search table.YMaps-l-search tr').length);
        this.dom.mapPlace
            .find('div.YMaps-btn div.YMaps-h-search table.YMaps-l-search tr')
            .prepend('<td style="padding:0.8em 0;white-space:nowrap">' + l('controls#search-label', '&nbsp;Стоимость поездки из&nbsp;аэропорта&nbsp;до&nbsp;') + '</td>')
            .append('<td><div id="search-taxi-result">&nbsp;</div><div id="search-taxi-result-time"></div></td>');
        this.dom.mapPlace.find('div.YMaps-btn div.YMaps-h-search table.YMaps-l-search .YMaps-b-hint-input').text(l('controls#search-hint', 'найти на карте'));
        this.dom.mapPlace.find('div.YMaps-btn div.YMaps-h-search table.YMaps-l-search .YMaps-search-control-submit i').text(l('controls#search-sumbit', 'найти'));
        this.map.setCenter(new YMaps.GeoPoint(this._initData.points.misc.moscow.x, this._initData.points.misc.moscow.y));
        this._objControll.busstopControll.find('input').attr('checked', false).change();
        this._objControll.parkingControll.find('input').attr('checked', false).change();
        this._hideRouteControll();
        this._showTaxi();
        this.map.setBounds(this._initData.bounds.taxi);
        this.dom.mapPlace.hide();

        break;
      case 'on-car':
        this._switchViewTo("map");
        // this.dom.mapPlace.show();
        // $('#info-aeroexpress').hide();
        this.map.removeControl(this.searchTaxi);
        this.map.setCenter(new YMaps.GeoPoint(this._initData.points.misc.svo.x, this._initData.points.misc.svo.y));
        this._objControll.parkingControll.find('input').attr('checked', true).change();
        this._objControll.busstopControll.find('input').attr('checked', false).change();
        this._showRouteControll();
        this._hideTaxi();
        this.map.setBounds(this._initData.bounds.routes);
        break;
      case 'on-bus':
        this._switchViewTo("info-by-bus,#map");
        // this.dom.mapPlace.show();
        // $('#info-aeroexpress').hide();
        this.map.removeControl(this.searchTaxi);
        this.map.setCenter(new YMaps.GeoPoint(this._initData.points.misc.svo.x, this._initData.points.misc.svo.y));
        this._objControll.parkingControll.find('input').attr('checked', false).change();
        this._objControll.busstopControll.find('input').attr('checked', true).change();
        this._hideRouteControll();
        this._hideTaxi();
        this.map.setBounds(this._initData.bounds.bus);
        break;
      case 'on-aeroekspress':
        this.map.removeControl(this.searchTaxi);
        this._switchViewTo("info-aeroexpress");
        break;
      case 'on-domodedovo':
        this.map.removeControl(this.searchTaxi);
        this._switchViewTo('way-to-airport-domodedovo');
        //$("#way-to-airport-domodedovo div.options span.fastest").click();
        break;
      case 'on-vnukovo':
        this.map.removeControl(this.searchTaxi);
        this._switchViewTo('way-to-airport-vnukovo');
        //$("#way-to-airport-vnukovo div.options span.fastest").click();
        break;
      case 'on-between':
        this.map.removeControl(this.searchTaxi);
        this._switchViewTo('info-between-terminals,#map');
        break;
    }
    var hash = '';
    if (on != 'on-full') {
      hash = on.replace('on-', '#');
    }
    var reFindLinkHash = /#.+/gi;
    $('#languages a').attr('href', function() {
      var stripHash = this.href.replace(reFindLinkHash, '');
      return stripHash + hash;
    });
    document.location.hash = hash;
  };

  SvoMap.prototype._switchViewTo = function(to) {
    $("#map,#info-taxi,#info-between-terminals,#info-by-bus,#info-aeroexpress,#way-to-airport-domodedovo,#way-to-airport-vnukovo,#info-by-bus,#info-between-terminals").filter(":not(#" + to + ")").hide();
    // Temp hack to hide "taxi" map.
    if (to == 'info-taxi') {
      $("#" + to).hide();
    } else {
      $("#" + to).show();
    }
  };

  SvoMap.prototype._showTaxi = function() {
    this._show("collection#taxi-zones", {minZoom: 10, maxZoom: 17});
    this.map.addOverlay(YMaps.Layers.get("mapObjBubble#taxi"));
  }
  SvoMap.prototype._hideTaxi = function() {
    this._hide("collection#taxi-zones");
    this.map.removeOverlay(YMaps.Layers.get("mapObjBubble#taxi"));
  }
  SvoMap.prototype._hideRouteControll = function() {
    //this._hide('route#moscow-terminalC');
    this._hide('route#editable');
    this.__showRoute = false;
  }
  SvoMap.prototype._showRouteControll = function() {
    //this._show("route#moscow-terminalC");
    this._show('route#editable');
    this.__showRoute = true;
  }
  SvoMap.prototype._initWayToPort = function() {
    $("div.way-to-airport div.options span").click(function() {
      var $this = $(this),
          parent = $this.parents('div.way-to-airport');
      $this.siblings().removeClass('selected');
      $this.addClass('selected');
      var o = parent.find("div.way-scheme div.place,div.way-scheme div.place div.point");
      if ($this.hasClass('all')) {
        o.slideDown('fast');
        //parent.find('h3,div.to').show();
      }
      if ($this.hasClass('chipest')) {
        o.filter('.way-chip').slideDown('fast');
        o.filter(':not(.way-chip)').slideUp('fast');
        // parent.find('h3,div.to').filter(':not(.chip-way)').hide();
        // parent.find('div.chip-way').show();
      }
      if ($this.hasClass('fastest')) {
        o.filter('.way-fast').slideDown('fast');
        o.filter(':not(.way-fast)').slideUp('fast');

        // parent.find('h3,div.to').filter(':not(.fast-way)').hide();
        // parent.find('div.fast-way').show();
      }
      SVOMap._repositionWayClasses(parent);
      // parent.find("div.way-scheme .place:first").addClass('place-first');
      // parent.find("div.way-scheme .place .point:visible:first-child").addClass('point-first');
      // parent
      // 	.find('div.to')
      // 	.removeClass('to-odd')
      // 	.filter(':visible:even')
      // 	.addClass('to-odd');
    });
  }
  SvoMap.prototype._repositionWayClasses = function(where) {
    if (where.find('div.way-scheme div.place:animated,div.way-scheme div.place div.point:animated').length) {
      setTimeout((function(where) {
        return function() {
          SVOMap._repositionWayClasses(where);
        }
      })(where), 20);
      return;
    }
    where.find('div.place,div.place div.point').removeClass('place-first place-last point-first point-last');
    where.find("div.way-scheme div.left,div.way-scheme div.right").each(function() {
      $(this).find("div.place:visible:first").addClass('place-first');
      $(this).find("div.place:visible:last").addClass('place-last');
    });
    where.find("div.way-scheme div.place:visible").each(function() {
      $(this).find("div.point:visible:first").addClass('point-first');
      $(this).find("div.point:visible:last").addClass('point-last');
    });

  }

  SvoMap.prototype._dispatch = function(message, data) {
    if (this._msgObservers[message] != undefined) {
      for (var i = 0; i < this._msgObservers[message].length; i++) {
        if (this._msgObservers[message][i] != undefined) {
          this._msgObservers[message][i].call(this, data);
        }
      }
    }
  }
  SvoMap.prototype._observe = function(message, target) {
    if (this._msgObservers[message] == undefined) {
      this._msgObservers[message] = [];
    }
    this._msgObservers[message].push(target);
    return this._msgObservers[message].length - 1;
  }
  SvoMap.prototype._unsubscribe = function(message, id) {
    if (this._msgObservers[message] != undefined && this._msgObservers[message][id] != undefined) {
      this._msgObservers[message][id] = undefined;
    }
  }
  SvoMap.prototype._initMeassages = function() {
    this._msgQueue = [];
    this._msgObservers = {};
  }


  // taxi functions
  SvoMap.prototype._initTaxiSearch = function() {
    var self = this;
    this.searchTaxi = new YMaps.SearchControl({
      useMapBounds: true,
      noCentering: true,
      noPlacemark: true,
      width: 550
    });
    YMaps.Events.observe(this.searchTaxi, this.searchTaxi.Events.Select, function(searcgControll, searchResult) {
      self._findTaxiByPoint(searchResult.getGeoPoint());
    });
    $('#map table.YMaps-l-search .YMaps-l-search-r span.YMaps-search-control-clean')
        .live('click', function() {
          $("#search-taxi-result").html('&nbsp;');
          $("#search-taxi-result-time").html('');
        });
  }
  SvoMap.prototype._findTaxiByPoint = function(point) {
    var from = new YMaps.GeoPoint(37.414424, 55.971234);
    var onZones = this._getTaxiAreaByPoint(point);
    var route = new YMaps.Router([from, point], [], {avoidTrafficJams: true});
    YMaps.Events.observe(route, route.Events.Success, (function(route, isFree) {
      var getPlural = function(n) {
        return (n % 10 == 1 && n % 100 != 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
      }
      var secondsToTime = function(seconds) {
        var minutes = (seconds / 60) >> 0;
        var hours = (minutes / 60) >> 0;
        minutes -= hours * 60;
        return (hours ? hours + ' ' + l('common#hours' + getPlural(hours), '') : '')
            + (minutes ? ' ' + minutes + ' ' + l('common#minutes' + getPlural(minutes), '') : '');
      }
      var distanceToMoney = function(distance) {
        var money = (distance * 39 / 1000) >> 0;
        return money >= 500 ? money : 500;
      }
      return function() {
        $("#search-taxi-result-time").html('<i><nobr>\u2248 ' + secondsToTime(route.getDuration()) + '</nobr></i>');
        if (isFree) {
          $('#search-taxi-result').html(
              '<div class="search-taxi-result-wrapper" style="border-color:gray">'
              + '<nobr>\u2248 ' + distanceToMoney(route.getDistance()) + ' <span class="rur">P<span>уб.</span></span></nobr>'
              + '</div>'
              );
        }
      }
    })(route, !onZones.length));

    if (onZones.length) {
      var zoneId = onZones[0].metaDataProperty.id;
      var zone = this._initData.regionsBubbles[zoneId];
      $('#search-taxi-result').html(
          '<div class="search-taxi-result-wrapper" style="border-color:' + zone.borderColor + '">'
          + l("object-search#" + zoneId, zone.contentSearch || zone.content)
          + '</div>'
          );
    }
  }
  SvoMap.prototype._getTaxiAreaByPoint = function(point) {
    var zones = YMaps.Layers.get('collection#taxi-zones');
    return zones.filter(function(zone) {
      return zone.contains(point);
    });
  }
  SvoMap.prototype._initExpress = function() {
    var self = this;
    $('#info-aeroexpress span.popup').click(function() {

    });
  }
  SvoMap.prototype._initBetween = function() {
    var self = this;
    $(document).keydown(function(event) {
      if (event.keyCode == '27') {
        $("#info-between-terminals span.list-drop span.list").hide();
        $("#popup-beet-back,#popup-beet").hide();
      }
      return true;
    });
    $("#info-between-terminals span.list-drop").click(function() {
      var $this = $(this),
          drop = $this.find("span.list");
      if ($.browser.msie || $.browser.mozilla) {
        drop.css('display', drop.css('display') == 'inline' ? 'none' : 'inline');
      } else {
        drop.toggle();
      }
      $this.siblings().find("span.list").hide();
    });
    $("#info-between-terminals span.list-drop span.list span").click(function() {
      var letter = $(this).attr('data-letter'),
          parent = $(this).parents('span.list-drop'),
          next = parent.siblings();
      parent.find('span.letter').attr('data-letter', letter);
      // next.find("span.list span").show();
      // if (letter == 'B' || letter == 'C') {
      // 	next.find("span.list").find("span:contains('B'),span:contains('C')").hide();
      // } else {
      // 	next.find("span.list span:contains('"+letter+"')").hide();
      // }
      self.toggleBetweenBus();
    });
    $("#info-between-terminals span.popup,#info-aeroexpress span.popup").click(function() {
      var $this = $(this),
          offset = $this.offset();
      $("#popup-beet div.popup-content").empty();
      $("#" + this.id + "-desc>*").clone(true, true).appendTo($("#popup-beet div.popup-content"));
      //$("#popup-beet div.popup-content").html($("#"+this.id+"-desc").html());
      $("#popup-beet-back,#popup-beet").show();
      $("#popup-beet").css({left: offset.left, top: offset.top});
      if ($.browser.msie && $.browser.version <= '6.0') {
        $("#popup-beet-back").height($("body").height())
      }
    });
    $('<div id="popup-beet-back"></div><div id="popup-beet" class="content"><i class="close"></i><div class="popup-content">&nbsp;</div></div>')
        .appendTo("body").hide();
    $("#popup-beet-back,#popup-beet i.close").click(function() {
      $("#popup-beet-back,#popup-beet").hide();
    });
    this.toggleBetweenBus();
  };

  SvoMap.prototype.toggleBetweenBus = function() {
    var from = $("#info-between-terminals span.list-drop-from span.letter").attr('data-letter'),
        to = $("#info-between-terminals span.list-drop-to span.letter").attr('data-letter');
    $("#info-between-terminals .between-way:not(.between-way-" + from + '-' + to + ")").hide();
    $("#info-between-terminals .between-way-" + from + '-' + to).show();
    $("#info-between-terminals .destination-note-between-way:not(.destination-note-between-way-" + from + '-' + to + ")").css("display", "none");
    $("#info-between-terminals .destination-note-between-way-" + from + '-' + to).css("display", "block");
  };

  SvoMap.prototype._initPrint = function() {
    var self = this;
    $("#print-button a:not(.print-pdf),.print-button-popup a").click(function() {
      var map = self.map;
      $("body").addClass('printing');
      map.redraw(false);
      self.schemas.schema.redraw(false);
      window.print();
      $("body").removeClass('printing');
      setTimeout(function() {
        map.redraw(false);
        self.schemas.schema.redraw(false);
      }, 20);


      return false;
    });
    this._initPrintPdf();
  };

  SvoMap.prototype._initPrintPdf = function() {
    this._currentHash = '';
    var self = this;

    setInterval(function() {
      self._chkPrintPdf();
    }, 50);
  }
  SvoMap.prototype._chkPrintPdf = function() {
    var hash = document.location.hash.replace('#', '');
    if (!hash) {
      hash = 'main';
    }
    if (hash && hash != this._currentHash) {
      this._currentHash = hash;
      if ($("#print-button a.pdf-" + hash).length) {
        $("#print-button span:has(a)").hide();
        $("#print-button span:has(a.pdf-" + hash + ")").show();
      } else {
        $("#print-button span:has(a.print-pdf)").hide();
        $("#print-button span:has(a:not(.print-pdf))").show();
      }
    }
  }

  var skew = function(deg) {
    var grad = deg * (Math.PI / 180);
    return '-moz-transform: skew(' + deg + 'deg,0);'
        + '-o-transform: skew(' + deg + 'deg,0);'
        + '-webkit-transform: skew(' + deg + 'deg,0);'
        + 'transform: skew(' + deg + 'deg,0);'
        + '-ms-filter:progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=' + Math.tan(grad) + ", M21=0, M22=1, SizingMethod='auto expand');"
        + "filter:progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=" + Math.tan(grad) + ", M21=0, M22=1, SizingMethod='auto expand');"
  };

  var boxShadow = function() {
    return '-webkit-box-shadow: -1px 1px 10px gray;'
        + '-moz-box-shadow: -1px 1px 10px gray;'
        + 'box-shadow: -1px 1px 10px gray;'
        + '//background-color:white;'
        + "-ms-filter: progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa', Direction=45, Strength=1) "
        + "progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa', Direction=135, Strength=3) "
        + "progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa', Direction=225, Strength=1) "
        + "progid:DXImageTransform.Microsoft.Shadow(color='#aaaaaa', Direction=315, Strength=3);";
  };

  SvoMap.prototype._initSchemas = function() {
    this.filters = new SvoFilters(window.schemasFilters, this._initData, this);
    this.routes = new SvoRoutes(this);

    this.schemas = new SvoSchemas({
      map: this.dom.mapPlace,
      data: this._initData.schemas,
      box: $("#schemas"),
      switcher: $("#schema-toggler"),
      mapObj: this
    });

    if (window.schemasFilters === undefined) {
      console.error('Filters are not obtained');
    }

    this.filters.sidebar.find('a[href="important"]').click();
  };

  /**
   * Get current floor on map
   * @return {string}
   */
  SvoMap.prototype.getCurrentFloor = function() {
    reg = /^#/;
    var hash = document.location.hash.replace(reg, '');
    return hash.substr(hash.indexOf('-') + 1, hash.length);
  };

  /**
   * Get current terminal on map
   * @return {string}
   */
  SvoMap.prototype.getCurrentTerminal = function() {
    reg = /^#/;
    var hash = document.location.hash.replace(reg, '');
    return hash.substr(0, hash.indexOf('-'));
  };

  var SvoSchemas = function(initData) {
    initData = initData || {};

    var that = this;
    this.map = initData.map;
    this.data = initData.data;
    this.box = initData.box;
    this.switcher = initData.switcher;
    this.mapObj = initData.mapObj;

    this._initToggler();
    this._initSchemasBox();

    this.map.after('<div id="map-schema" style="display:none"></div>');
    this.schemaDom = $("#map-schema");
    this.schema = new YMaps.Map(this.schemaDom[0]);

    $(document).keyup(function(e) {
      that.schema.closeBalloon();
      if (e.keyCode == 27) {
        that.schema.closeBalloon();
      }
    });

    this.schema.disableDblClickZoom();
    YMaps.Events.observe(this.schema, this.schema.Events.Click, function(map, mouseEvent) {
      var point = mouseEvent.getGeoPoint();
      //console.log((point.getX())+', '+(point.getY()));
    });

    var h = new YMaps.TypeControl();
    var b = h.getTypes();
    for (j = 0; j < b.length; j++) {
      h.removeType(b[j]);
    }

    this.typeControl = new YMaps.TypeControl();
    this.schemas = {};

    this.zoomControl = new YMaps.Zoom({noTips: true, smooth: false});

    this.isSchema = false;
    this.visibleElm = {};

    this.points = new SchemasPoints(this.schema, initData.mapObj);

    this._initFilter();
    this.tryShow();

    this._initHashWatcher();

    var self = this;
    YMaps.Events.observe(this.schema, this.schema.Events.Update, function(map) {

      var zoom = map.getZoom(),
          zooms = {
            min: map.getMinZoom(),
            max: map.getMaxZoom()
          };
      self.points.remove();
      if (zooms.min == zooms.max || zoom != zooms.min) {
        self._typesFilter.show();
        self._filterClick(self.box.find("div.schema-filter li.selected span"));
      } else {
        self._typesFilter.hide();
      }

      self.mapObj.routes.getAndShowRoutes(true);
    });

    this._addMainMapLinkStyle();

    var printButton = $('<div class="print" />');
    printButton.click(function() {
      print();
    });

    $(this.transition).find('#transitions').parent().append(printButton);
  };

  /**
   * Добавляет и удаляет стиль перехода на главную карту
   * в переключателе "все карты" и "маршрут выхода на посадку"
   */
  SvoSchemas.prototype._addMainMapLinkStyle = function() {
    $('.map-filter .on-full').click(function() {
      $('.navigation-type-trigger a[href="all_schema"]').removeClass('to-main-map');
    });
  };

  SvoSchemas.prototype._initHashWatcher = function() {
    var self = this,
        reg = /^#/;
    this._hash = document.location.hash.replace(reg, '');
    this._hashWatcher = setInterval(function() {
      var hash = document.location.hash.replace(reg, '');
      if (self._hash != hash)
      {
        self._hash = hash;
        self.tryShow(hash);
      }
    }, 50);

    if (0 !== this._hash.length) {
      $('.navigation-type-trigger a[href="all_schema"]').addClass('to-main-map');
    }
  };

  SvoSchemas.prototype.tryShow = function(to) {
    if (undefined !== to && 0 !== to.length) {
      $('.navigation-type-trigger a[href="all_schema"]').addClass('to-main-map');
    }

    to = to || document.location.hash.replace(/^#/, '');


    if (to.length === 0) {
      this.mapObj.routes.markKeeper.addClass('main-map');
    } else {
      this.mapObj.routes.markKeeper.removeClass('main-map');
    }

    if (/terminal[A-F]/.test(to) || /^aeroexpress/.test(to)) {
      this.mapObj._switchViewTo(to);
      var code = to.split('-');

      if(code[1] !== undefined) {
        this.switcher.find('span[data-liter="' + code[0].replace(/terminal/, '') + '"]').click();
        $('span[schema-id="' + to + '"]').click(); 
      } else {
        this.switcher.find('span[data-liter="' + code[0].replace(/terminal/, '') + '"]').click();
      }
    }

    if (!this.mapObj.routes.formSubmited) {
      this.mapObj.routes.setFromTerminal(this.mapObj.getCurrentTerminal());
    }
  };

  SvoSchemas.prototype._initToggler = function() {
    var self = this;
    var title;

    for (var i in this.data) {
      if (this.data.hasOwnProperty(i)) {
        var liter = this.data[i].liter;
        //If length of liter is 1
        //get liter for title
        //else title is title
        //It's because liter uses in
        //in bubbles writes "Terminal X",
        //but in navigation writes simple "X"
        if (this.data[i].navigation_item_name !== undefined) {
          title = this.data[i].navigation_item_name;
        } else {
          title = this.data[i].liter;
        }

        $(Template.sprintf(tpls.schema.menu, title))
            .appendTo(this.switcher)
            .find("span")
            .click(function() {
              self._togglerClick($(this));
            })
            .attr('data-liter', liter);
      }
    }
  };

  SvoSchemas.prototype._togglerClick = function(obj) {
    obj.parents('tr').find('li').removeClass('selected');
    obj.parents('li').addClass('selected');

    var liter = obj.attr('data-liter').replace(/[^A-Za-zа-яА-Я]/g, '');

    this.box.find("div.schema-terminal-box").filter(":not(.schema-terminal-box-" + liter + ")").hide();

    var schema = this.box.find("div.schema-terminal-box-" + liter);

    //If floors more than one
    //render floor toggle
    if (schema.find("li").length > 1) {
      this.box.find("div.schema-terminal-box-" + liter).show();
    }

    schema.find('ul li.selected span')
        .click();
  };

  SvoSchemas.prototype._initSchemasBox = function() {
    var self = this;
    for (var i in this.data) {
      if (this.data.hasOwnProperty(i)) {
        var term = this.data[i],
            element = $(Template.sprintf(tpls.schema.terminal, term.liter, l("schemas#terminal" + term.liter, term.title)));
        for (var j in term.slices) {
          if (term.slices.hasOwnProperty(j)) {
            var floor = term.slices[j];
            $(Template.sprintf(tpls.schema.menu, l("schemas#terminal" + term.liter + "-" + j, floor.title)))
                .appendTo(element.find("ul"))
                .find("span")
                .attr("schema-id", i + "-" + j)
                .click((function(code) {
                  return function() {
                    self._schemaClick($(this));
                    self.switchTo(code);
                    var hash = "#" + code.replace(/#/g, '-');
                    document.location.hash = hash;

                    var reFindLinkHash = /#.+/gi;
                    $('#languages a').attr('href', function() {
                      var stripHash = this.href.replace(reFindLinkHash, '');
                      return stripHash + document.location.search + hash;
                    });
                  };
                })(i + "#" + j));
          }
        }
        if (term.liter === 'C') {
          element.find('ul li:first').addClass('selected');
        } else if (term.liter === 'D') {
          element.find('ul li:first + li + li').addClass('selected');
        } else if (term.liter === 'E' || term.liter === 'F' || term.liter === 'aeroexpress' || term.liter === 'Aeroexpress') {
          element.find('ul li:first + li').addClass('selected');
        }

        element.appendTo(this.box);
      }
    }
  };

  SvoSchemas.prototype._schemaClick = function(obj) {
    obj.parents('ul').find('li').removeClass('selected');
    obj.parents('li').addClass('selected');
  };

  SvoSchemas.prototype._initFilter = function() {
    var self = this;
    var element = $(Template.sprintf(tpls.schema.filter, l("schemas#filter-title", "show:")));
    for (var i in SchemasPoints.types) {
      if (SchemasPoints.types.hasOwnProperty(i)) {
        $(Template.sprintf(tpls.schema.menu, l("schemas#filter-" + i, i)))
            .appendTo(element.find("ul"))
            .find("span")
            .attr('filter-code', i)
            .click(function() {
              self._filterClick($(this));
            })
      }
    }
    element.find('ul li:first').addClass('selected');
    element.appendTo(this.box);
    this._typesFilter = element;
  };

  SvoSchemas.prototype._filterClick = function(obj) {
    var code = obj.attr('filter-code');
    obj.parents("ul").find('li.selected').removeClass('selected');
    obj.parents('li').addClass('selected');

    var schemaId = this.box.find('div.schema-terminal-box:visible li.selected span').attr('schema-id');

    var id = schemaId != undefined ? schemaId.split('-') : '';

    this.points.remove();
    this.mapObj.filters.addPoints(this.mapObj);
  };

  SvoSchemas.prototype.switchTo = function(to) {
    if (this.mapObj.schemas !== undefined) {
      this.mapObj.schemas.schema.removeAllOverlays();
    }
    if (this.mapObj.filters !== undefined) {

      if (to !== 'map') {
        this.mapObj.filters.showSidebar();
      } else {
        this.mapObj.filters.hideSidebar();
      }
    } else {
      console.warn('Filters disabled');
    }

    if (to == 'map') {
      if (this.isSchema) {
        //$("table.map-filter span.on-full").click();
        this.map.show();
        this.schemaDom.hide();
        this.isSchema = false;
        this.visibleElm.show();
        SVOMap.map.redraw();
        this.box.find('div.schema-terminal-box').hide();
        this.box.find('div.schema-filter').hide();
        this.switcher.find('li.selected').removeClass('selected');
        return;
      }
    }

    if (!this.isSchema) {
      this.map.hide();
      this.visibleElm = $("div.layout>div.main>*:visible")
          .filter(":not(.map-filter):not(#print-button):not(#schemas):not(.map-wrapper):not(.navigation-type-trigger)")
          .hide();
      this.schemaDom.show();
    }
    this.isSchema = true;

    this.box.find('div.schema-filter').show();
    var id = to.split("#");
    if (this.schemas[to] == undefined) {
      this.schemas[to] = new SvoSchema({terminal: id[0], floor: id[1], schema: this});
    }

    //this.schema.setType(YMaps.MapType.MAP);
    ///this.schema.setType(this.schemas[to].getSchema());
    var termData = this.data[id[0]].slices[id[1]];
    this.schema.setType(this.schemas[to].getSchema());
    this.schema.setMaxZoom(this.data[id[0]].slices[id[1]].zoom);
    if (termData.hasSmall) {
      this.schema.setMinZoom(termData.zoom - 1);
      this.schema.addControl(this.zoomControl);
    } else {
      this.schema.setMinZoom(termData.zoom);
      this.schema.removeControl(this.zoomControl);
    }
    var fz;
    if (termData.hasSmall) {
      fz = (function(schema, x, y, z) {
        return function() {
          schema.setCenter(new YMaps.GeoPoint(x, y), z);
          schema.redraw();
        }
      })(this.schema, termData.small.x, termData.small.y, termData.zoom - 1);
    } else {
      fz = (function(schema, x, y, z) {
        return function() {
          var center = schema.getCenter();
          /**
           * If coordinates not changed call event manually
           * for calling observer function to repaint all objects on map
           * else simple change coordinates of the center
           */
          if (center && center.equals(new YMaps.GeoPoint(x, y))) {
            YMaps.Events.notify(schema, schema.Events.Update, schema);
          } else {
            schema.setCenter(new YMaps.GeoPoint(x, y), z);
          }

          schema.redraw();
        }
      })(this.schema, termData.center.x, termData.center.y, termData.zoom);
    }
    setTimeout(fz, 30);

    ///this.schema.setCenter(new YMaps.GeoPoint(termData.center.x, termData.center.y), termData.zoom);
    ///this.schema.redraw();

    ///this.points.remove();
    ///this._filterClick(this.box.find("div.schema-filter li.selected span"));
    //this.points.place(id[0], id[1]);
    var importantLink = this.mapObj.filters.sidebar.find('a[href="important"]');
    if (!(importantLink.hasClass('selected'))) {
      importantLink.click();
    }
  };

  var SvoSchema = function(params) {
    params = params || {};
    params.terminal = params.terminal || "";
    params.floor = params.floor || "";
    this.params = params;
    this.schema = params.schema;

    var self = this;
    this.tileDataSource = new YMaps.TileDataSource("", true, true);
    this.tileDataSource.getTileUrl = function(tile, zoom) {
      var z = 0,
          zooms = {
            min: 0,
            max: 0
          };
      if (SVOMap.schemas != undefined && SVOMap.schemas.schema != undefined) {
        zooms.min = SVOMap.schemas.schema.getMinZoom();
        zooms.max = SVOMap.schemas.schema.getMaxZoom();
      }
      if (zooms.min != zooms.max && zoom == zooms.min) {
        z = 1;
      }

      return self.replace(
          self.settings().tilesSource,
          ['%terminal%', '%floor%', '%z', '%x', '%y'],
          [self.params.terminal, self.params.floor, z, tile.x, tile.y - 1]
          );
    }

    this.mapLayer = new YMaps.Layer(this.tileDataSource);
    this.mapLayer.getCopyright = function() {
      return l("schemas#copyright", self.settings().copyright);
    }

    this.mapType = new YMaps.MapType([this.mapLayer], this.params.terminal + '-' + this.params.floor);
  }
  
  SvoSchema.prototype.getSchema = function() {
    return this.mapType;
  }
  SvoSchema.prototype.settings = function() {
    return SVOMap._initData.schemasSettings
  };
  SvoSchema.prototype.replace = function(where, from, to) {
    if (from instanceof Array && from.length) {
      for (var i = 0; i < from.length; i++) {
        where = where.replace(new RegExp(from[i], 'g'), to[i] != undefined ? to[i] : '');
      }
    }
    return where;
  };

  var SchemasPoints = function(map, mapObj) {
    this.map = map;
    this.points = {};
    this.data = window.schemasObjects;
    this.mapObj = mapObj;
    this.selectedPlacemark;
    this.mapPlaceSetCount = 0;
  };

  
  SchemasPoints.prototype._initSchema = function(terminal, floor) {
    var selectedObjectId;
    var selectedObjectType;
    var match = document.location.search.match(/^\?(\w+(\-\w+)?)-(\d+)/);

    //console.log(match);

    if(match instanceof Array) {
      selectedObjectType = match[1]
      selectedObjectId = match[3];
	  if(selectedObjectType == 'aid-post'){
		  selectedObjectType = 'medical_aid'
	  }
    }
	


    this.points[terminal + "#" + floor] = {};

    if (this.data[terminal] == undefined || this.data[terminal][floor] == undefined) {
      return;
    }

    var schPoints = this.data[terminal][floor];

    var thisPoints = this.points[terminal + "#" + floor];

    for (var i = 0; i < schPoints.length; i++) {
      if (thisPoints[schPoints[i].type] == undefined) {
        thisPoints[schPoints[i].type] = new YMaps.GeoObjectCollection();
      }

      this._initStyle(schPoints[i].type);

      var point = new YMaps.Placemark(new YMaps.GeoPoint(schPoints[i].x, schPoints[i].y), {style: "schemas#" + schPoints[i].type});

      if (schPoints[i].image.length === 0) {
        point.description = '<div class="bubble-text-wrapper bubble-text-wrapper-with-padding">' + schPoints[i].text + '</div>';
      } else {
        point.description = '<div class="img-with-top-padding">' + schPoints[i].image + '</div>' + '<div class="bubble-text-wrapper">' + schPoints[i].text + '</div>';
      }

      if(schPoints[i].id === selectedObjectId &&
          schPoints[i].type === selectedObjectType) {
        this.selectedPlacemark = point;
      }

      thisPoints[schPoints[i].type].add(point);
    }

    for (var i in thisPoints) {
      if (thisPoints.hasOwnProperty(i)) {
        YMaps.Layers.add(terminal + "-" + floor + "#" + i, thisPoints[i]);
      }
    }
  };

  SchemasPoints.prototype._initStyle = function(type) {
    if (YMaps.Styles.get("schemas#" + type) === undefined) {
      var style = new YMaps.Style();
      style.iconStyle = new YMaps.IconStyle();
      style.iconStyle.offset = new YMaps.Point(-10, -10);
      //style.iconStyle.href = "/i/m/" + type + ".png";
      style.iconStyle.href = '/i/map/icons/sch-' + type + '.png';
      style.iconStyle.size = new YMaps.Point(20, 20);
      YMaps.Styles.add("schemas#" + type, style);
    }
  };

  SchemasPoints.prototype.place = function(terminal, floor, type, activeFilter) {
    var self = this;

    this.mapObj.filters.resetFilterElementsCount();
    this.mapObj.filters.resetFilterDataCount();

    if (this.data == undefined || !terminal || !floor) {
      return;
    }
    if (this.points[terminal + "#" + floor] === undefined) {
      this._initSchema(terminal, floor);
    }
    var thisPoints = this.points[terminal + "#" + floor];

    if (!type) {
      for (var i in thisPoints) {
        if (thisPoints.hasOwnProperty(i)) {
          this.map.addOverlay(YMaps.Layers.get(terminal + "-" + floor + "#" + i));
        }
      }
    } else {
      if (type instanceof Array && activeFilter) {
        for (var typeContent in SchemasPoints.types) {
          //If filter activated
          if (type.length > 0) {
            for (var i = 0, j = type.length; i < j; i++) {
              if (type[i] === typeContent) {
                for (var x = 0, y = SchemasPoints.types[typeContent].length; x < y; x++) {
                  if (thisPoints.hasOwnProperty(typeContent)) {
                    var overlay = YMaps.Layers.get(terminal + "-" + floor + "#" + SchemasPoints.types[typeContent]);
                    this.map.addOverlay(overlay);
                  }
                }
              }
            }
          }
          //If filter not activated
          else {
            for (var x = 0, y = SchemasPoints.types[typeContent].length; x < y; x++) {
              if (thisPoints.hasOwnProperty(typeContent)) {
                var overlay = YMaps.Layers.get(terminal + "-" + floor + "#" + SchemasPoints.types[typeContent]);
                this.map.addOverlay(overlay);
              }
            }
          }

          //Populate count elements in filters
          for (var x = 0, y = SchemasPoints.types[typeContent].length; x < y; x++) {
            var overlay = YMaps.Layers.get(terminal + "-" + floor + "#" + SchemasPoints.types[typeContent]);
            if (overlay != null) {
              this.mapObj.filters.showFilter(SchemasPoints.types[typeContent]);
              this.mapObj.filters.setFilterElementsCount(SchemasPoints.types[typeContent], overlay.length());
            } else {
              this.mapObj.filters.hideFilter(SchemasPoints.types[typeContent]);
            }
          }
        }
      } else if (type instanceof Array) { //maybe can removed
        for (var i = 0; i < type.length; i++) {
          if (thisPoints.hasOwnProperty(type[i])) {
            var overlay = YMaps.Layers.get(terminal + "-" + floor + "#" + type[i]);
            this.map.addOverlay(overlay);
          }
        }
      } else { //maybe can removed
        if (thisPoints.hasOwnProperty(type[i])) {
          var overlay = YMaps.Layers.get(terminal + "-" + floor + "#" + type);
          this.map.addOverlay(overlay);
        }
      }
    }

    this.mapObj.filters.setFilterGroupElementsCount();

    this.selectedPlacemark && (++this.mapPlaceSetCount === 3) && this.selectedPlacemark.openBalloon();

  };

  SchemasPoints.prototype.remove = function(terminal, floor, type) {
    if (terminal && floor && type) {
      this.map.removeOverlay(YMaps.Layers.get(terminal + "-" + floor + "#" + type));
    } else {
      this.map.removeAllOverlays();
    }
  };

  SchemasPoints.types = {
  };

  SvoMap.prototype._initData = {};
  var tpls = SvoMap.prototype._templates = {
    bubble: '<div class="map-bubble #bubbleClass#" style="#bubbleStyle#">'
        + '<div class="bubble-content #bubbleContentClass#" style="#bubbleContentStyle#">#bubbleContent#</div>'
        + '<div class="map-bubble-pin #bubblePinClass#" style="#bubblePinStyle#"></div>'
        + '<div class="map-bubble-pin #bubblePin2Class#" style="display:none; #bubblePin2Style#"></div>'
        + '</div>',
    schema: {
      menu: '<li><b><b><b><span>%s</span></b></b></b></li>',
      terminal: '<div class="schema-terminal-box schema-terminal-box-%s" style="display:none"><ul class="menu no-menu menu-lined"></ul></div>',
      filter: '<div class="schema-filter" style="display:none"><h3>%s</h3><ul class="menu no-menu menu-lined"></ul></div>'
    }
  };

  var SvoFilters = function(filters, groups, map) {
    var self = this;
    this.map = map;

    this.selectedFilters = [];

    this.SELECTED_CSS_CLASS = 'selected';
    this.CLEAR_NAME = 'clear';
    this.IMPORTANT_CSS_CLASS = "important";

    this.groupsArray = groups;

    this.mapWrapper = $('.map-wrapper');
    this.insertAfterIt = this.mapWrapper.find('.routes');

    this.sidebar = $('<div class="filter-sidebar" />');
    this.sidebar.prepend('<div class="mist" />');

    this.filtersContainer = $('<div class="map-filters" />');
    this.groupList = $('<ul></ul>');

    this.filtersContainer.append(this.groupList);

    this.sidebar.prepend(this.filtersContainer);
    this.sidebar.insertAfter(this.insertAfterIt);

    for (var filter in groups['filters']) {
      var groupFilters = $('<li><div class="first-child"></div><a href="' + filter +
          '"><span class="filter-text">' + groups['filters'][filter]['name'].replace(/&lt;/g, '<').replace(/&gt;/g, '<') + '</span>' +
          '<span class="count"></span></a><div class="last-child"></div></li>');
      if (groups['filters'][filter]['icon'] !== undefined) {
        groupFilters.css('background-image',
            'url(' + groups['filters'][filter]['icon'] + ')');
      }

      if (filter === 'important') {
        groupFilters.hide();
      }

      this.groupList.append(groupFilters);

      if (groups['filters'][filter]['children'] !== undefined &&
          Object.keys(groups['filters'][filter]['children']).length > 0) {
        var filterList = $('<ul></ul>');
        groupFilters.append(filterList);

        for (var child in groups['filters'][filter]['children']) {
          if (filters[child] === undefined) {
            continue;
          }
          var element = $('<li><span class="first-child"></span><a href="' + child +
              '"><span class="filter-text">' +
              filters[child].replace(/&lt;/g, '<').replace(/&gt;/g, '>') +
              '</span> <span class="count"></span></a><span class="last-child"></span></li>');
          if (groups['filters'][filter]['children'][child] &&
              groups['filters'][filter]['children'][child]['hidden']) {
            element.attr('data-hidden', 'true');
            element.hide();
          }

          filterList.append(element);
          SchemasPoints.types[child] = [child];
        }
      }
    }

    this.filterElementsCount = this.groupList.find('.count');

    this.groupList.find('li ul').each(function() {
      if ($(this).find('li[data-hidden]').length > 0) {
        $(this).attr('empty', 'true');
      }
    });

    $(function() {
      jQuery(self.filtersContainer).slimScroll({
        disableFadeOut: true,
        'height': 750,
        'color': '#C4C4C4'
      });
    });

    this.clearLink = this.filtersContainer.find('a[href="' + this.CLEAR_NAME + '"]');

    this.groups = this.groupList.find('> li a').not('[href="clear"]');
    this.filters = this.groupList.find('> li > ul > li a');

    this.attachEvents_();
    this.attachIcons_();
  };

  /**
   * If clicked on filter then element checked and elements
   * of filters type showed.
   * If clicked on group checked all elements in group.
   * If clicked on "All", reset all checking elements, collapsed all groups and
   * show all elements witout sockets.
   */
  SvoFilters.prototype.attachEvents_ = function() {
    var self = this;
    this.groups.click(function() {
      if (undefined === self.map.schemas) {
        return;
      }

      var groupName = $(this).attr('href');
      var group = self.groupsArray.filters[groupName]['children'];

      for (var filter in group) {
        self.map.schemas.points.remove(self.map.getCurrentTerminal(),
            self.map.getCurrentFloor(), filter);
      }


      var filterList = $(this).parent().find('ul');

      if (filterList.length !== 0 &&
          $(this).parent().find('ul[empty]').length == 0) {
        filterList.not(':animated').slideToggle('fast');
      } else if (filterList.length !== 0) {
        self.toggleActiveFilterByGroup(groupName, this);
      }

      self.addPoints(self.map);
      return false;
    });

    this.filters.click(function() {
      self.clearLink.removeClass(this.SELECTED_CSS_CLASS);
      self.clearLink.parent().removeClass(this.SELECTED_CSS_CLASS);
      var code = $(this).attr('href');

      //Remove all points from map
      self.map.schemas.points.remove(self.map.getCurrentTerminal(),
          self.map.getCurrentFloor(), code);

      //Add or remove current selected filters
      self.toggleActiveFilter(code);

      self.addPoints(self.map);

      return false;
    });

    this.clearLink.click(function() {
      self.clearActiveFilter();
      return false;
    });
  };

  /**
   * If filter exist remove it, else add it.
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.toggleActiveFilter = function(code) {
    if (arrayIndexOf(this.selectedFilters, code) === -1) {
      this.addActiveFilter(code);
    } else {
      this.removeActiveFilter(code);
    }
  };

  /**
   * If filter exist remove it from selectedFilters.
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.removeActiveFilter = function(code) {
    this.selectedFilters.splice(arrayIndexOf(this.selectedFilters, code), 1);
    this.mapWrapper.find('a[href="' + code + '"]')
        .removeClass(this.SELECTED_CSS_CLASS);
    this.mapWrapper.find('a[href="' + code + '"]').parent()
        .removeClass(this.SELECTED_CSS_CLASS);
  };

  /**
   * Show filter if objects exist
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.showFilter = function(code) {
    this.filtersContainer.find('ul ul li a[href="' + code + '"]')
        .parent()
        .show();
  };

  /**
   * Hide filter if objects exist
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.hideFilter = function(code) {
    this.filtersContainer.find('ul ul li a[href="' + code + '"]')
        .parent()
        .hide();
  };

  /**
   * Reset data-count attribute of all filters to 0
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.resetFilterDataCount = function(code, count) {
    this.filtersContainer.find('ul ul a[data-count]').attr('data-count', 0);
  };

  /**
   * Clear number of elements in filter
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.resetFilterElementsCount = function(code, count) {
    this.filterElementsCount.html('');
  };

  /**
   * Set number of elements in filter
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.setFilterElementsCount = function(code, count) {
    this.filtersContainer.find('ul ul a[href="' + code + '"]')
        .attr('data-count', count)
        .parent()
        .find('.count')
        //one element isn't show
        .html(count === 1 ? '' : count);
  };

  /**
   * Set number of elements for groups
   */
  SvoFilters.prototype.setFilterGroupElementsCount = function() {
    var self = this;
    this.groupList.find('> li').each(function() {
      if ($(this).find('a[href="' + self.CLEAR_NAME + '"]').length > 0) {
        return;
      }

      var amount = 0;

      $(this).find('li a[data-count]').each(function() {
        amount += parseInt($(this).attr('data-count'), 10);
      });

      if (amount > 0) {
        //one element isn't show
        amount = (amount === 1 ? '' : amount);

        $(this).find('> a .count').html(amount);

        if (!($(this).find('a[href="' + self.IMPORTANT_CSS_CLASS + '"]').length > 0)) {
          $(this).find('> a .count').html(amount);

          $(this).show();
        }
      } else {
        $(this).hide();
      }
    });
  };

  /**
   * Add filter to selectedFilters
   * @param {String} code Code of filter
   */
  SvoFilters.prototype.addActiveFilter = function(code) {
    this.selectedFilters.push(code);

    this.mapWrapper.find('a[href="' + code + '"]')
        .addClass(this.SELECTED_CSS_CLASS);
    this.mapWrapper.find('a[href="' + code + '"]').parent()
        .addClass(this.SELECTED_CSS_CLASS);
  };

  /**
   * Clear selectedFilters
   */
  SvoFilters.prototype.clearActiveFilter = function() {
    var self = this;
    
    this.sidebar.find('a').not('[href="clear"]').removeClass(this.SELECTED_CSS_CLASS)
        .parent().removeClass(this.SELECTED_CSS_CLASS);
    this.filtersContainer.find('ul > li > ul:visible').slideUp();

    this.selectedFilters = [];

    if (self.clearLink.hasClass(self.SELECTED_CSS_CLASS)) {
      self.clearLink.removeClass('selected');
      self.clearLink.parents('li').removeClass('selected');
      self.toggleActiveFilterByGroup('important');
    } else {
      self.clearLink.addClass('selected');
      self.clearLink.parents('li').addClass('selected');
    }

    if (self.map.schemas !== undefined) {
      self.map.schemas.points.remove(self.map.getCurrentTerminal(),
          self.map.getCurrentFloor());
    }

    self.addPoints(self.map);

  };

  /**
   * Show icons for routing mode
   */
  SvoFilters.prototype.showActiveFiltersForRouting = function() {
    var self = this;

    this.addActiveFilter('passport-control');
    this.addActiveFilter('baggage-control');
    this.addActiveFilter('special-control');
    this.addActiveFilter('first-class-hall');
    this.addActiveFilter('phyto-control');
    this.addActiveFilter('animals');
    this.addActiveFilter('quarantine');

    this.addPoints(this.map);

    return false;
  };

  /**
   * Add all groups filter or remove all of it to/from selectedFilters
   * @param {String} code Code of filter
   * @param {DOM} link Clicked link
   */
  SvoFilters.prototype.toggleActiveFilterByGroup = function(groupName, link) {
    if ($(link).hasClass(this.SELECTED_CSS_CLASS)) {
      this.removeActiveFilterByGroup(groupName, link);
    } else {
      this.addActiveFilterByGroup(groupName, link);
    }
  };

  /**
   * Remove all filters that exist in group from selectedFilters
   * @param {String} groupName
   */
  SvoFilters.prototype.removeActiveFilterByGroup = function(groupName, link) {
    for (var filter in this.groupsArray.filters[groupName]['children']) {
      this.removeActiveFilter(filter);
    }

    $(link).removeClass(this.SELECTED_CSS_CLASS);
    $(link).parent().removeClass(this.SELECTED_CSS_CLASS);
  };

  /**
   * Add all filters that exist in group to selectedFilters
   * @param {String} groupName
   */
  SvoFilters.prototype.addActiveFilterByGroup = function(groupName, link) {
	if(this.groupsArray.filters[groupName] && this.groupsArray.filters[groupName]['children']){
		for (var filter in this.groupsArray.filters[groupName]['children']) {
		  if (arrayIndexOf(this.selectedFilters, filter) === -1) {
			this.addActiveFilter(filter);
		  }
		}
	} else {
		for (var group_name in this.groupsArray.filters) {
			for (var filter in this.groupsArray.filters[group_name]['children']) {
			  if (arrayIndexOf(this.selectedFilters, filter) === -1 && groupName == filter) {
				this.addActiveFilter(filter);
			  }
			}
		}
		
	}
    $(link).addClass(this.SELECTED_CSS_CLASS);
    $(link).parent().addClass(this.SELECTED_CSS_CLASS);
	$(link).parents('ul').show();
  };

  /**
   * Add points to the map according this.selectedFilters array
   * @param {type} map
   */
  SvoFilters.prototype.addPoints = function(map) {
    var that = this;
	
    var selectedObjectId;
    var selectedObjectType;
    var match = document.location.search.match(/^\?(\w+(\-\w+)?)-(\d+)/);

    //console.log(match);

    if(match instanceof Array) {
      selectedObjectType = match[1]
      selectedObjectId = match[3];
	  if(selectedObjectType == 'aid-post'){
		  selectedObjectType = 'medical_aid'
	  }
    }
	
	//console.log(selectedObjectType, this.map.schemas.points.mapPlaceSetCount)

    if(typeof selectedObjectType != 'undefined' && this.map.schemas.points.mapPlaceSetCount < 3) {
		
		jQuery('.filter-sidebar a').each(function(){
			//console.log($(this).attr('href'), selectedObjectType)
			if($(this).attr('href').indexOf(selectedObjectType) != -1){
				that.addActiveFilterByGroup($(this).attr('href'), this);
			}
		})
		/*
      jQuery('.filter-sidebar a[href="shops_and_pharm"]').parent().find('ul a').each(function() {
        that.addActiveFilterByGroup('shops_and_pharm', this);
      });
      
      that.addActiveFilterByGroup('restaurants_and_cafe', jQuery('.filter-sidebar a[href="restaurants_and_cafe"]').get(0));
	  */
    }
    
    if (map.schemas === undefined) {
      return;
    }

    var schemaId = map.schemas.box.find('div.schema-terminal-box:visible li.selected span').attr('schema-id');
    var id = schemaId != undefined ? schemaId.split('-') : '';
    //Show points of current filters
    map.schemas.points.place(id[0], id[1], this.selectedFilters, true);
  };

  /**
   * Add icons to filter element.
   */
  SvoFilters.prototype.attachIcons_ = function() {
    this.filters.each(function() {
      $(this).parent()
          .css('background-image',
              'url(/i/map/icons/sch-' + $(this).attr('href') + '.png)');
    });
  };

  /**
   * Show sidebar with filters
   */
  SvoFilters.prototype.showSidebar = function() {
    this.sidebar.show();
  };

  /**
   * Hide sidebar with filters
   */
  SvoFilters.prototype.hideSidebar = function() {
    this.sidebar.hide();
  };

  /**
   * Route Class
   */
  var SvoRoutes = function(map) {
    var self = this;

    this.map = map;

    this.form = $('#route-search');

    this.registrationTypes = {
      'SIMPLE': 'simple',
      'SELF': 'self',
      'SELF_BARCODE': 'self-barcode',
      'SELF_GATE': 'self-gate'
    };

    this.registrationType = this.form.find('.registration_type');

    this.submitButton = this.form.find('.submit');

    this.transition = $('#transitions');

    this.transitionPlace = this.transition.find('.transitions-place');

    this.lastChild = this.transition.find('.transition-inner > *:last-child');

    this.fromTerminalSwitcher = new TerminalSwitcher();

    this.fromTerminal = this.form.find('.from_terminal');

    this.flight = this.form.find('input[name="flight"]');

    this.flightPattern = /^[A-Za-z]{1,3}\s{0,}\d{3,5}$/;

    this.notFoundError = this.form.parent().find('.not-found');

    this.selfRegistrationNotFoundError = this.form.parent().find('.not-found-self-registration');

    this.markKeeper = $('#layout');

    this.calendar = jQuery('.departure-date');

    this.prevNavigationData;

    this.formSubmited = false;

    this.attachEvents();

    this.currentGateItem;

    this.currentRegistrationItem;

    this.lastClickedItem;

    var sSimpleRoute = new YMaps.Style();
    sSimpleRoute.lineStyle = new YMaps.LineStyle();
    sSimpleRoute.lineStyle.strokeColor = '574594';
    sSimpleRoute.lineStyle.strokeWidth = '3';
    sSimpleRoute.polygonStyle = new YMaps.PolygonStyle();
    sSimpleRoute.polygonStyle.fillColor = "574594";
    sSimpleRoute.polygonStyle.outline = false;
    YMaps.Styles.add("path#simple", sSimpleRoute);
  };

  SvoRoutes.prototype.setFromTerminal = function(terminal) {
    return this.fromTerminal.val(terminal);
  };

  SvoRoutes.prototype.getFromTerminal = function(terminal) {
    return this.fromTerminal.val();
  };

  SvoRoutes.prototype.getFromTerminalLiter = function() {
    return this.getTerminalLiterByName(this.fromTerminal.val());
  };

  SvoRoutes.prototype.getTerminalLiterByName = function(name) {
    if (name !== 'aeroexpress') {
      return name
          .substr(name.length - 1);
    } else {
      return name;
    }
  };

  SvoRoutes.prototype.getFromTerminalFloor = function() {
    return this.fromTerminal.find('option:selected').attr('data-floor');
  };

  SvoRoutes.prototype.getFromTerminalName = function(terminal) {
    switch (this.getFromTerminal()) {
      case 'terminalC':
        return 'C';
        break;
      case 'terminalD':
        return 'D';
        break;
      case 'terminalE':
        return 'E';
        break;
      case 'terminalF':
        return 'F';
        break;
      case 'aeroexpress':
        return translate.aeroexpress;
        break;
    }
  };

  SvoRoutes.prototype.getRegistrationType = function() {
    return this.registrationType.val();
  };

  /**
   * @param {boolean} cache if true check cache
   */
  SvoRoutes.prototype.getAndShowRoutes = function(cache, formSubmit, callback) {
    this.fromTerminalSwitcher.init();
    var self = this;
    var terminal = this.map.getCurrentTerminal();
    var toFloor = this.map.getCurrentFloor();

    self.map.schemas.schema.removeOverlay(self.shuttleRoute);

    if (self.map.showToShuttleRoute) {
      self.map.showToShuttleRoute = false;
      self.shuttleRoute = new PolylineWithArrows(
          'Muns95ZriARbyfoARY7f_4uau_8ma-3_XSio_zpg9f-81OL_X_n__3W4XP8hld__');

      self.map.schemas.schema.addOverlay(self.shuttleRoute);
    }

    if (!this.formSubmited) {
      return;
    }

    self.map.schemas.schema.removeAllOverlays();

//    if (cache && this.map.getCurrentCollectionLength() > 0) {
    if (false) {
      this.map.removeAllRoutesFromCurrentMap();
      this.showCurrentRoutes();
      self.map.filters.showActiveFiltersForRouting();

      if ($('.route-icon.self-check-in').hasClass('active')) {
        self.selfPolyline &&
            self.selfPolyline.placemark &&
            self.selfPolyline.placemark.openBalloon();
      }
    } else {
      if (formSubmit) {
        self.clickTerminalItem(self.getFromTerminalLiter());
        self.clickFloorItem(self.getFromTerminalLiter(), self.getFromTerminalFloor());
        self.notFoundError.hide();
        self.selfRegistrationNotFoundError.hide();
      }

      $.get('/json_get_route/', self.form.serialize() +
          '&floor=' + self.map.getCurrentFloor() +
          '&terminal=' + self.map.getCurrentTerminal() +
          '&get_navigation=' + 'true',
          function(data, textStatus, jqXHR) {
			  
			  if( typeof console != 'undefined'){
				console.log(data)
			  }
			  
            if (textStatus !== 'success') {
              return false;
            }
            var jsonData = JSON.parse(data);

            if (jsonData.status === 'not_found') {
              self.clearForm();
              self.notFoundError.show();
              self.markKeeper.removeClass('route-builded');
              return false;
            }

            if (typeof jsonData.terminals_navigation === 'object'
                && jsonData.terminals_navigation[jsonData.terminals_navigation.length - 1] !== undefined
                && jsonData.terminals_navigation[jsonData.terminals_navigation.length - 1].to_next_terminal === 'terminalC'
                && (self.getRegistrationType() === self.registrationTypes.SELF)) {
              self.clearForm();
              self.selfRegistrationNotFoundError.show();
              return;
            }


            if (formSubmit) {
              self.markKeeper.addClass('route-builded');
              self.map.removeAllRoutes();
            } else {
              self.map.removeAllRoutesFromCurrentCollection();
            }

            if (jsonData.to_gate_routes instanceof Array) {
              for (var i = 0, j = jsonData.to_gate_routes.length; i < j; i++) {
                if (jsonData.to_gate_routes[i].to_floor &&
                    jsonData.to_gate_routes[i].to_floor.length > 0) {
                  var message = translate.to_next_floor;
                } else if (jsonData.to_gate_routes[i].gate_number === '30000') {
                  var message = translate.specify_flight_number;
                } else {
                  var message = translate.gate + ' ' + jsonData.to_gate_routes[i].gate_number;
                }

                var polyline = new PolylineWithArrows(
                    jsonData.to_gate_routes[i].polyline, message);
                self.map.addRouteToCurrentPlace(polyline, terminal, toFloor);

                var gateRouteLastPoint = polyline.getPoint(
                    polyline.getNumPoints() - 1);
                jsonData.gate_navigation.x = gateRouteLastPoint.getX();
                jsonData.gate_navigation.y = gateRouteLastPoint.getY();
              }
            }

            if (jsonData.to_registration_routes instanceof Array) {
              for (var i = 0, j = jsonData.to_registration_routes.length; i < j; i++) {
                var polyline = new PolylineWithArrows(jsonData.to_registration_routes[i].polyline);

                var registrationRouteLastPoint = polyline.getPoint(
                    polyline.getNumPoints() - 1);

                jsonData.check_in_navigation.x
                    = registrationRouteLastPoint.getX();
                jsonData.check_in_navigation.y
                    = registrationRouteLastPoint.getY();

                //40000 - CENTRAL_REGISTRATION
                if (jsonData.to_registration_routes[i]['reg_number_range_from'] === "40000") {
                  self.map.addRouteToCurrentPlace(new PolylineWithArrows(jsonData.to_registration_routes[i].polyline, translate.timetable), terminal, toFloor);
                  //10000 - SELF_REGISTRATION
                } else if (jsonData.to_registration_routes[i]['reg_number_range_from'] === "10000") {

                  self.selfPolyline = new PolylineWithArrows([
                    registrationRouteLastPoint,
                    registrationRouteLastPoint
                  ],
                      '<div>' + translate.self_check_in_top +
                      '<img src="/i/map/self_registration.jpg"/>' +
                      translate.self_check_in_middle +
                      '<a href="/departure/international/">drop off</a> ' +
                      translate.self_check_in_bottom +
                      '</div>',
                      self.registrationTypes.SELF);

                  self.map.addRouteToCurrentPlace(self.selfPolyline, terminal, toFloor);
                } else {
                  if (self.getRegistrationType() === self.registrationTypes.SELF) {
                    self.map.addRouteToCurrentPlace(new PolylineWithArrows([
                      registrationRouteLastPoint,
                      registrationRouteLastPoint
                    ],
                        translate.drop_off), terminal, toFloor);
                  } else {
                    self.map.addRouteToCurrentPlace(new PolylineWithArrows([
                      registrationRouteLastPoint,
                      registrationRouteLastPoint
                    ],
                        translate.check_in), terminal, toFloor);
                  }
                }
              }

            }

            if (jsonData.to_terminal_routes instanceof Array) {
              for (var i = 0, j = jsonData.to_terminal_routes.length; i < j; i++) {
                var note;
                if (jsonData.to_terminal_routes[i]['terminal'] ===
                    jsonData.to_terminal_routes[i]['to_next_terminal']) {
                  var note = translate.to_next_floor;
                }

                var polyline = new PolylineWithArrows(
                    jsonData.to_terminal_routes[i].polyline,
                    note);
                self.map.addRouteToCurrentPlace(polyline, terminal, toFloor);
              }
            }

            if (formSubmit) {
              self.transitionPlace.nextAll('div').remove();

              var liter = self.getFromTerminalLiter();

              if (liter === 'C') {
                var floor = 'floor1';
              } else if (liter === 'D') {
                var floor = 'departure';
              } else if (liter === 'E') {
                var floor = 'floor2';
              } else if (liter === 'F') {
                var floor = 'floor2';
              } else if (liter === 'aeroexpress') {
                var floor = 'floor3';
              }

              self.appendNavItem(self.getNavItemHtml({
                'description': translate.terminal,
                'value': self.getFromTerminalName(),
                'active': true,
                'liter': liter,
                'floor': floor
              }));

              /**
               * For setNavigationWayByData() logic support
               */
              self.markKeeper.removeClass('not-enough-route-data');
              self.prevNavigationData = {};
              self.prevNavigationData['to_next_terminal'] = 'terminal' + self.getFromTerminalLiter();
              self.setNavigationWayByData(jsonData['terminals_navigation'], jsonData['to_terminal_routes'][0]);
              self.setRegistrationNavigationByData(jsonData['check_in_navigation']);
              self.setGateNavigationByData(jsonData['gate_navigation']);
            }

            self.updateCenteredCoordinates(jsonData);
            self.showCurrentRoutes();
            self.map.filters.showActiveFiltersForRouting();
            callback && callback();
          });
    }
  };

  /**
   * @param {string} item
   */
  SvoRoutes.prototype.updateCenteredCoordinates = function(data) {
    if (data.check_in_navigation.x !== undefined &&
        data.check_in_navigation.y !== undefined &&
        this.currentRegistrationItem !== undefined) {
      this.currentRegistrationItem.attr('data-x', data.check_in_navigation.x);
      this.currentRegistrationItem.attr('data-y', data.check_in_navigation.y);
    }

    if (data.gate_navigation.x !== undefined &&
        data.gate_navigation.y !== undefined &&
        this.currentGateItem !== undefined) {
      this.currentGateItem.attr('data-x', data.gate_navigation.x);
      this.currentGateItem.attr('data-y', data.gate_navigation.y);
    }
  };

  SvoRoutes.prototype.closeSelfRegistrationBalloon = function() {
    this.selfPolyline &&
        this.selfPolyline.placemark &&
        this.selfPolyline.placemark.closeBalloon();
  };

  /**
   * Append navigation item in the and of route navigation panel
   * @param {string} item
   * @param {boolean} eventDisabled
   */
  SvoRoutes.prototype.appendNavItem = function(item, eventDisabled) {
    if (eventDisabled !== true) {
      this.addEventToNavigationItem(item);
    }
    this.lastChild = $(this.lastChild.selector);
    return this.lastChild.after(item);
  };

  SvoRoutes.prototype.isFormReady = function() {
    return this.flightPattern.test(this.flight.val()) &&
        this.calendar.val().length !== 0;
  };

  SvoRoutes.prototype.attachEvents = function() {
    var self = this;

    this.submitButton.click(function() {
      self.form.submit();
    });

    var toggleSubmitBlock = function() {
      if (self.isFormReady()) {
        self.submitButton.removeAttr('disabled', 'disabled');
      } else {
        self.submitButton.attr('disabled', 'disabled');
      }
    };

    this.calendar.change(function(event) {
      toggleSubmitBlock();
    });

    var submitFormDelegation = function(event) {
      if (self.isFormReady() && 13 === event.keyCode) {
        self.form.submit();
      }
    };

    this.calendar.keyup(submitFormDelegation);

    this.flight.keyup(submitFormDelegation);

    this.flight.keyup(function() {
      //console.log('x1')
      //console.log(self.markKeeper)
      toggleSubmitBlock();
      self.markKeeper.removeClass('route-builded');
      self.clearForm();
    });

    this.form.submit(function(event) {
      self.formSubmited = true;
      self.getAndShowRoutes(false, true);
      event.preventDefault();
    });
  };

  SvoRoutes.prototype.clearForm = function() {
    this.notFoundError.hide();
    this.selfRegistrationNotFoundError.hide();
    this.submitButton.nextAll('div').remove();
    this.map.removeAllRoutes();
  };

  SvoRoutes.prototype.doNavigationBaseActions = function(item, event) {
    this.closeSelfRegistrationBalloon();
    this.lastClickedItem = $(event.currentTarget);
    item.nextAll().removeClass('active');
    item.prevAll().removeClass('active');
    item.addClass('active');
    var liter = item.attr('data-liter');
    this.clickTerminalItem(liter);
    this.clickFloorItem(liter, item.attr('data-floor'));
  };

  /**
   * Add event to navigation event
   * @param {type} item
   */
  SvoRoutes.prototype.addEventToNavigationItem = function(item) {
    var self = this;
    item.click(function(event) {
      if ($(event.currentTarget).hasClass('active')) {
        return;
      }

      self.doNavigationBaseActions(item, event);
    });
  };

  /**
   * Add event to registration
   * @param {jQuery} item
   */
  SvoRoutes.prototype.addEventToRegistrationItem = function(item,
      checkInItem,
      selfCheckInItem) {
    var self = this;
    var checkInItem = checkInItem;
    var selfCheckInItem = selfCheckInItem;

    item.click(function(event) {
      if ($(event.currentTarget).hasClass('active')) {
        return;
      }

      self.doNavigationBaseActions(item, event);

      if (checkInItem && checkInItem.hasClass('disabled')) {
        selfCheckInItem.addClass('active');
        self.selfPolyline &&
            self.selfPolyline.placemark &&
            self.selfPolyline.placemark.openBalloon();
      } else {
        checkInItem && checkInItem.addClass('active');
        self.setCenterByItemData($(event.currentTarget));
      }

    });
  };

  /**
   * Add event to registration
   * @param {jQuery} item
   */
  SvoRoutes.prototype.addEventToRegistrationIcon = function(icon, checkIn) {
    var checkIn = checkIn;
    var self = this;
    icon.click(function(event) {
      if ($(event.currentTarget).hasClass('active')) {
        return;
      }


	  
      self.doNavigationBaseActions(icon, event);

      checkIn.addClass('active');
      self.setCenterByItemData($(event.currentTarget));

      if ($(event.currentTarget).hasClass('self-check-in')) {
        self.registrationType.val(self.registrationTypes.SELF);
        self.selfPolyline &&
            self.selfPolyline.placemark &&
            self.getAndShowRoutes(false, false, function() {
              self.selfPolyline.placemark.openBalloon();
            });
      } else {
        self.registrationType.val(self.registrationTypes.SIMPLE);
        self.getAndShowRoutes(false);
        self.closeSelfRegistrationBalloon();
      }
    });
  };

  /**
   * Set center by item data
   * @param {DOMElement} item
   */
  SvoRoutes.prototype.setCenterByItemData = function(item) {
    if (item !== undefined &&
        item.attr('data-x') !== undefined &&
        item.attr('data-y') !== undefined) {
      var point = new YMaps.GeoPoint(item.attr('data-x'),
          item.attr('data-y'));
      this.map.schemas.schema.setCenter(point);
    }
  };

  /**
   * Add event to gate
   * @param {type} item
   */
  SvoRoutes.prototype.addEventToGateItem = function(item) {
    var self = this;
    item.click(function(event) {
      self.setCenterByItemData($(event.currentTarget));
    });
  };

  /**
   * Click terminal item
   */
  SvoRoutes.prototype.clickTerminalItem = function(liter) {
    if (this.getTerminalLiterByName(this.map.getCurrentTerminal()) !== liter) {
      $('span[data-liter="' + liter + '"]').click();
    }
  };

  /**
   * Click floor item
   */
  SvoRoutes.prototype.clickFloorItem = function(terminalLiter, floor) {
    if (this.map.getCurrentFloor() !== floor || 'aeroexpress' === terminalLiter) {
      if (terminalLiter === 'D') {
        $('span[schema-id="terminalD-' + floor + '"]').click();
      } else if (terminalLiter === 'E') {
        $('span[schema-id="terminalE-' + floor + '"]').click();
      } else if (terminalLiter === 'F') {
        $('span[schema-id="terminalF-' + floor + '"]').click();
      } else if (terminalLiter === 'C') {
        if ('departure' === floor) {
          floor = 'floor3';
        }
        $('span[schema-id="terminalC-' + floor + '"]').click();
      } else if (terminalLiter === 'aeroexpress') {
        $('span[schema-id="aeroexpress-' + floor + '"]').click();
      }
    }
  };

  /**
   * Show routes on current map
   */
  SvoRoutes.prototype.showCurrentRoutes = function(refreshCentered) {
    var self = this;
    var collection = this.map.getCurrentRoutesCollection();

    if (collection instanceof YMaps.GeoObjectCollection) {
      collection.forEach(function(polyline) {
        self.map.schemas.schema.addOverlay(polyline);
      });
    }

    if (refreshCentered) {
      this.setCenterByItemData(self.lastClickedItem);
    }
  };

  /**
   * Set navigation way by data from database
   * @param {object} data
   */
  SvoRoutes.prototype.setNavigationWayByData = function(data, terminalRoutes) {
    if (data === null) {
      return;
    }

    for (var i = 0, j = data.length; i < j; i++) {

      var liter = data[i]['to_next_terminal']
          .substr(data[i]['to_next_terminal'].length - 1);
      if (this.prevNavigationData !== null &&
          this.prevNavigationData !== undefined &&
          this.prevNavigationData['to_next_terminal'] ===
          data[i]['to_next_terminal']) {
        var value = liter +
            ' (этаж ' +
            this.getFloorNumByName(data[i]['to_next_terminal_floor']) +
            ')';
      } else {
        var value = liter;
      }

      if (this.prevNavigationData !== null &&
          this.prevNavigationData !== undefined &&
          (this.prevNavigationData['to_next_terminal'] === 'terminalC' ||
              data['to_next_terminal'] === 'terminalC')) {
        var description = translate.on_shuttle;
      } else if (terminalRoutes['from_terminal'] === 'aeroexpress' &&
          terminalRoutes['to_terminal'] === 'terminalD' &&
          data[i]['to_next_terminal'] === 'terminalE') {
        var description = translate.transition_to_D;
        value = '';
      } else {
        var description = translate.terminal;
      }

      var item = this.getNavItemHtml({
        'description': description,
        'value': value,
        'floor': data[i]['to_next_terminal_floor'],
        'liter': liter
      });

      this.prevNavigationData = data[i];
      this.appendNavItem(item);
    }
  };

  /**
   * Get floor number by name
   * @param {string} name
   * @return {number}
   */
  SvoRoutes.prototype.getFloorNumByName = function(name) {
    switch (name) {
      case 'floor1':
        return 1;
        break;
      case 'floor2':
        return 2;
        break;
      case 'floor3':
        return 3;
        break;
      case 'floor4':
        return 4;
        break;
      case 'floor5':
        return 5;
        break;
      case 'arrival':
        return 1;
        break;
      case 'departure':
        return 3;
        break;
    }
  };

  SvoRoutes.prototype.setRegistrationNavigationByData = function(data) {
    var description;
    var checkIn;

    if (this.getRegistrationType() === this.registrationTypes.SELF_GATE) {
      return '';
    }

    if (data.check_in_range !== undefined &&
        data.check_in_range.length > 0) {

      if (this.getRegistrationType() === this.registrationTypes.SELF ||
          this.getRegistrationType() === this.registrationTypes.SELF_BARCODE) {
        description = translate.self_registration;
        checkIn = '';
      } else {
        description = translate.check_in;
        checkIn = data.check_in_range;
      }

      var item = this.getNavItemHtml({
        'description': description + ':',
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal'],
        'note': translate.information_can_be_change
      });

      item.addClass('registration');

      var checkInItem = this.getRegistrationCheckIn({
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal'],
        'checkIn': checkIn
      });

      var selfCheckInItem = this.getRegistrationSelfCheckIn({
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal']
      });

      this.currentRegistrationItem = item;
      this.appendNavItem(item, true);

      this.appendNavItem(checkInItem, true);

      this.appendNavItem(selfCheckInItem, true);

      this.addEventToRegistrationItem(item, checkInItem, selfCheckInItem);

      this.addEventToRegistrationIcon(checkInItem, item);

      this.addEventToRegistrationIcon(selfCheckInItem, item);
      var self = this;

      this.addEventToRegistrationItem(selfCheckInItem);

      return true;
    } else {
      this.markKeeper.addClass('not-enough-route-data');

      var item = this.getNavItemHtml({
        'description': translate.check_in + ':',
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal'],
        'note': translate.information_can_be_change
      });

      item.addClass('registration');

      var checkInItem = this.getRegistrationCheckIn({
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal']
      });

      var selfCheckInItem = this.getRegistrationSelfCheckIn({
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal']
      });

      this.appendNavItem(item, true);

      this.appendNavItem(checkInItem, true);

      this.appendNavItem(selfCheckInItem, true);

      this.addEventToRegistrationItem(item, checkInItem, selfCheckInItem);

      this.addEventToRegistrationIcon(selfCheckInItem, item);

      return false;
    }
  };

  SvoRoutes.prototype.setGateNavigationByData = function(data) {
    if (data.gate_number !== undefined &&
        data.gate_number.length > 0) {
      var item = this.getNavItemHtml({
        'description': translate.gate,
        'value': data.gate_number,
        'x': data.x,
        'y': data.y,
        'floor': data['to_floor'],
        'liter': data['to_terminal']
      });
      item.addClass('gate');
      this.addEventToGateItem(item);
      this.currentGateItem = item;
    } else {
      var item = this.getNavItemHtml({
        'description': translate.gate
      });
    }

    if (data.gate_number === undefined || data.gate_number.length === 0) {
      item.addClass('disabled');
      this.markKeeper.addClass('not-enough-route-data');
      this.appendNavItem(item, true);
    } else {
      this.appendNavItem(item);
    }

  };

  SvoRoutes.prototype.getRegistrationCheckIn = function(opt) {
    var element = $('<div class="transition route-icon check-in"><span class="left"></span><div class="check-in-numbers"><span class="value"></span></div><span class="right"></span></div>');
    if (opt.checkIn === undefined) {
      element.find('.check-in-numbers').parent().addClass('disabled');
    } else {
      element.find('.check-in-numbers .value').text(opt.checkIn);
    }


    this.addDataOptions(opt, element);
    return element;
  };

  SvoRoutes.prototype.getRegistrationSelfCheckIn = function(opt) {
	  //console.log(this.flight.val().replace(/^([A-Za-z]{1,3})\s{0,}\d{3,5}$/i, "$1"))
    var element = $('<div class="transition route-icon self-check-in"><span class="left"></span><span class="right"></span></div>');
    this.addDataOptions(opt, element);
    return element;
  };

  SvoRoutes.prototype.getNavItemHtml = function(opt) {
    var element = $('<div class="transition">\
        <div class="left"></div>\
        <div class="center"><span>' + opt.description + '</span></div>\
        <div class="right"></div>\
      </div>');

    this.addDataOptions(opt, element);

    $('#transitions').show();

    return element;
  };

  SvoRoutes.prototype.addDataOptions = function(opt, element) {
    if (opt.x) {
      element.attr('data-x', opt.x);
    }

    if (opt.y) {
      element.attr('data-y', opt.y);
    }

    if (opt.liter) {
      element.attr('data-liter', opt.liter.trim());
    }

    if (opt.active) {
      element.addClass('active');
    }

    if (opt.value !== undefined) {
      element.find('.center span:last-child').after(' <span>' + opt.value + '</span>');
    }

    if (opt.floor !== undefined) {
      element.attr('data-floor', opt.floor);
    }

    if (opt.note !== undefined) {
      element.prepend('<span class="note">' + opt.note + '</span>');
    }
  };

  var SVOMap = new SvoMap();
})(window, jQuery, YMaps);

var NavigationTypeTrigger = function() {
  this.trigger = jQuery('.navigation-type-trigger');

  this.links = this.trigger.find('a');

  this.allSchemaTriggerLink = this.links.find("a[href='all_schema']");

  this.allSchemaButton = $('.on-full');

  this.markKeeper = $('#layout');

  var self = this;

  setTimeout(function() {
    self.terminalTogglerLinks = $('#schema-toggler li');
  }, 1000);

  this.prevClass;

  this.attachEvents();
};

NavigationTypeTrigger.prototype.clearClasses = function() {
  this.links.each(function(index, element) {
    $(element).removeClass('selected');
    $(element).parent().removeClass('selected');
  });
};

NavigationTypeTrigger.prototype.attachEvents = function() {
  var self = this;

//  this.terminalTogglerLinks.click(function(event) {
//    console.log(self.allSchemaTriggerLink);
//    self.allSchemaTriggerLink.addClass('to-main-map');
//  });

  this.links.click(function(event) {
    self.clearClasses();
    self.markKeeper.removeClass(self.prevClass);

    var target = $(event.currentTarget);
    target.parent().addClass('selected');
    target.addClass('selected');

    var href = target.attr('href');

    if (href === 'all_schema' &&
        self.prevClass === 'all_schema' &&
        !self.allSchemaButton.parents('li').hasClass('selected')) {
      self.allSchemaButton.click();
    }

    self.prevClass = href;

    self.markKeeper.addClass(href);

    event.preventDefault();
  });

  this.links.each(function(index, element) {
    if ($(element).hasClass('selected')) {
      $(element).click();
    }
  });
};

var TerminalSwitcher = function() {
  this.switcher = $('#route-search .from');

  this.hiddenField = $('<input type="hidden" name="from_terminal" class="from_terminal" />');

  this.switcher.after(this.hiddenField);

  this.links = this.switcher.find('a');
  this.selected = this.switcher.find('a.selected');
  this.hiddenField.val(this.selected.attr('href'));

  this.links = this.switcher.find('a');
  this.init();

  this.attachEvents_();
};

TerminalSwitcher.prototype.init = function() {
  this.selected = this.switcher.find('a.selected');
  this.hiddenField.val(this.selected.attr('href'));
};

TerminalSwitcher.prototype.attachEvents_ = function() {
  var self = this;

  this.links.click(function(event) {
    var link = $(event.currentTarget);

    link.parent()
        .nextAll().removeClass('selected')
        .find('a').removeClass('selected');

    link.parent()
        .prevAll().removeClass('selected')
        .find('a').removeClass('selected');

    link.addClass('selected')
        .parent().addClass('selected');

    self.hiddenField.val(link.attr('href'));

    event.preventDefault();
  });
};

$(function() {
  var trigger = new NavigationTypeTrigger();
  var switcher = new TerminalSwitcher();
});

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

function YYYYMMDDHHMMSSToDate(dateString) {
  var regexp = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;
  var result = regexp.exec(dateString);

  var date = new Date();
  date.setYear(result[1]);
  date.setMonth(result[2] - 1);
  date.setDate(result[3]);
  date.setHours(result[4]);
  date.setMinutes(result[5]);
  date.setSeconds(result[6]);

  return date;
}

function getLocaleDateString(date, locale) {
  return date.getDate() +
      ' ' +
      getMonthByLocale(date.getMonth()) +
      ', ' +
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') + +
      date.getMinutes();
}

function getMonthByLocale(monthNum, day, locale) {

  switch (monthNum) {
    case 0:
      return translate.jan;
      break;
    case 1:
      return translate.feb;
      break;
    case 2:
      return translate.mar;
      break;
    case 3:
      return translate.apr;
      break;
    case 4:
      return translate.may;
      break;
    case 5:
      return translate.jun;
      break;
    case 6:
      return translate.jul;
      break;
    case 7:
      return translate.aug;
      break;
    case 8:
      return translate.sep;
      break;
    case 9:
      return translate.oct;
      break;
    case 10:
      return translate.nov;
      break;
    case 11:
      return translate.dec;
      break;
  }
}


function arrayIndexOf(myArray, searchTerm) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm)
      return i;
  }
  return -1;
}

function extend(child, parent) {
  var c = function() {
  };
  c.prototype = parent.prototype;
  c.prototype.constructor = parent;
  return child.prototype = new c();
}
;

function purplePlacemark(point) {
  var style = new YMaps.Style();
  style.iconStyle = new YMaps.IconStyle(new YMaps.Template(
      '<div class="check-in-icon"></div>'
      ));

  YMaps.Placemark.call(this,
      point,
      {
        hasHint: false,
        style: style
      });
}

var ptp = extend(purplePlacemark, YMaps.Placemark);

function orangePlacemark(point) {
  var style = new YMaps.Style();
  style.iconStyle = new YMaps.IconStyle(new YMaps.Template(
      '<img src="/i/map/icons/mark.png" />'
      ));

  YMaps.Placemark.call(this,
      point,
      {
        hasHint: false,
        style: style
      });
}

var ptp_orange = extend(orangePlacemark, YMaps.Placemark);

// Ломанная со стрелочками
// Наследуемся от YMaps.Polyline
function PolylineWithArrows(points, balloonContent, type) {
  if (typeof points === 'string') {
    points = YMaps.Polyline.fromEncodedPoints(points);
    points = points.getPoints();
  }
  ;

  YMaps.ZIndex.POLYGON = 30;
  // Вызов родительского конструктора
  YMaps.Polyline.call(this, points);

  // Группа, в которой содержатся стрелочки
  var arrows = new YMaps.GeoObjectCollection(this.getComputedStyle()),
      // Слушатель событий ломанной
      listener;

  this.setStyle('path#simple');
  arrows.setStyle('path#simple');

  this.setBalloonContent(new YMaps.GeoPoint(0, 0));

  // Вызывается при добавлении объекта на карту
  this.onAddToMap = function(map, mapContainer) {
    YMaps.Polyline.prototype.onAddToMap.call(this, map);

    // При изменении позиции точки ломанной перерисовываем стрелочки
    listener = YMaps.Events.observe(this, this.Events.PositionChange, function() {
      this.updateArrows();
    }, this);

    // Добавлении группы со стрелочками на карту
    map.addOverlay(arrows);

    // Добавление стрелочек на ломанную
    this.updateArrows();
  };

  // Вызывается при удалении объекта с карты
  this.onRemoveFromMap = function() {
    // Удаление стрелочек с карты
    this.getMap().removeOverlay(arrows);

    // Удаление ломанной с карты
    YMaps.Polyline.prototype.onRemoveFromMap.call(this);

    // Удаление обработчика событий
    listener.cleanup();
  };

  // Вызывается при обновлении карты
  this.onMapUpdate = function() {
    // Обновление ломанной на карте
    YMaps.Polyline.prototype.onMapUpdate.call(this);

    // Перерисовка стрелочек
    this.updateArrows();
  };

  // Добавляет стрелочки для ломанной
  this.updateArrows = function() {
    // Толщина ломанной
    var lineWidth = this.getComputedStyle().lineStyle.strokeWidth,
        // Длина стрелочки
        arrowWidth = lineWidth * 5;

    // Удаление стрелочек, если они были
    arrows.removeAll();

    for (var i = 0, prev, current, points = this.getPoints(); i < points.length; i++) {
      // Пиксельные кординаты
      current = this.getMap().converter.coordinatesToLocalPixels(points[i]);
      if (prev) {
        // Вектор
        var vector = current.diff(prev),
            // Длина вектора
            length = Math.sqrt(vector.getX() * vector.getX() + vector.getY() * vector.getY()),
            // Единичный вектор
            normal = vector.scale(1 / length);

        if (i === points.length - 1 && balloonContent !== undefined) {
          var placemark;

          if (type === 'self') {
            placemark = new purplePlacemark(this.getMap().converter.localPixelsToCoordinates(
                new YMaps.Point(current.getX() - 4, current.getY())
                ));
            this.placemark = placemark;
          } else {
            placemark = new orangePlacemark(this.getMap().converter.localPixelsToCoordinates(
                new YMaps.Point(current.getX() - 4, current.getY())
                ));
          }

          placemark.setBalloonContent('<div class="bubble-text-wrapper bubble-text-wrapper-with-padding">' + balloonContent + '</div>');

          this.getMap().addOverlay(placemark);
        }

        // Если длина вектора больше стрелочки в 2 раза, то рисуем стрелочку
        if (length > arrowWidth) {
          // Середина отрезка
          var middle = current;

          if (i === points.length - 1) {
            var k = 0;
            var scale = 0.3;
            // Отступ от сердины
            var offsetMiddle = normal.scale(-20);
          } else {
            var k = 0;
            var scale = 0.3;
            // Отступ от сердины
            var offsetMiddle = normal.scale(-20);
          }


          // Перпендикуляры к сегменту ломанной
          arrowPart1 = new YMaps.Point(-offsetMiddle.getY(), offsetMiddle.getX()).scale(scale),
              arrowPart2 = new YMaps.Point(offsetMiddle.getY(), 0 - offsetMiddle.getX()).scale(scale),
              // Точки для рисования стрелочки
              arrowPoint1 = middle.diff(offsetMiddle).diff(arrowPart1),
              arrowPoint2 = middle.diff(offsetMiddle).diff(arrowPart2);

          var startPoint = this.getMap().converter.localPixelsToCoordinates(
              new YMaps.Point(current.getX() +
                  normal.getX() * k, current.getY() +
                  normal.getY() * k));

          // Добавляем стрелочку
          var arrow = new YMaps.Polygon([
            startPoint,
            this.getMap().converter.localPixelsToCoordinates(arrowPoint1),
            this.getMap().converter.localPixelsToCoordinates(arrowPoint2)
          ]);

          arrow.setBalloonContent(new YMaps.GeoPoint(0, 0));

          arrows.add(arrow);
        }
      }
      prev = current;
    }
  };
}
var ptp = extend(PolylineWithArrows, YMaps.Polyline);