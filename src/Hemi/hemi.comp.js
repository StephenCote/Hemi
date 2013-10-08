
/*
	"Hemi" JavaScript Framework
	Engine for Web Applications 3.5
	Composite file "hemi.comp.js" release: 0.0.830
	Copyright 2002 - 2013. All Rights Reserved.
	Author: Stephen W. Cote
	Project: https://github.com/StephenCote/Hemi
	BSD License File: hemi.license.txt
*/
		


if (typeof window != "object") window = {};
(function () {
    
    if (window.Hemi) return;

    H = {
        LB: [],
        LM: [],
        NS: [],
        NM: [],
        ClassImports: [],
        Context: window,

        hemi_base: (location.protocol.match(/^file/i) ? "file://" + location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) : "/") + "Hemi/",
        uid_prefix: "hemi-",
        gc: 0
    };
    if(window.HemiConfig){
       if(window.HemiConfig.hemi_base) H.hemi_base = window.HemiConfig.hemi_base;
    }

    var D = {
        S: "string",
        TYPE_BOOLEAN: "boolean",
        O: "object",
        F: "function",
        U: "undefined",
        N: "number",
        T: function (v, t) { return (typeof v == t); },
        TS: function (v) { return D.T(v, D.S); },
        TO: function (v) { return D.T(v, D.O); },
        TB: function (v) { return D.T(v, D.TYPE_BOOLEAN); },
        TF: function (v) { return D.T(v, D.F); },
        TU: function (v) { return D.T(v, D.U); },
        TN: function (v) { return D.T(v, D.N); }

    };

    var data_undefined;

    D.X = (typeof XMLHttpRequest != D.U ? XMLHttpRequest : data_undefined);
    D.A = (typeof ActiveXObject != D.U ? ActiveXObject : data_undefined);

    if (typeof window.D != D.O) window.D = D;

    H.logError = function (s) {
        H.L(s, "100.5");
    };

    H.logWarning = function (s) {
        H.L(s, "100.4");
    };

    H.logDebug = function (s) {
        H.L(s, "100.1");
    };

    H.log = function (s) {
        H.L(s, "100.3");
    };
    H.L = function(s, l){
        H.message.service.S(s, l);
    };

    H.isImported = function (s) {
        var o = H.getLibrary(s);
        return (o && o.loaded);
    };
 H.dereference = function(n){
  var i;
  if (D.TN((i = H.LM[n]))) {
   delete H.LM[n];
   delete H.LB[i];
   delete H.NM[n.replace(/^hemi\./, "")];
   H.log("Dereference '" + n + "'");
  }
 };
    H.getLibrary = function(s){
        if(!D.TN(H.LM[s])) s = "hemi." + s;
        if(D.TN(H.LM[s])) return H.LB[H.LM[s]];
        return 0;
    };

    H.include = function (s, z, n) {
        if(H.isImported(s) || (!z && D.TN(H.NM[s.replace(/^hemi\./, "")]))){
   return H.getLibrary(s);
  }
        var v, l = H.LB.length, q, b = 0;
  
  
  
        var x = H.xml.getText((z && (!H.lookup("hemi.data.io.proxy") || !H.data.io.proxy.service.isProxyProtocol(z)) && !z.match(/^\//) ? H.hemi_base : "") + (z ? z : "Framework/") + s.toLowerCase() + ".js", 0, 0, s, 1);
  
            if (x) {
                x = x.replace(/^\s+/, "").replace(/\s+$/, "");
                if (!n) eval(x);
                b = 1;
            }
  
  
        q = {
            package: s,
            index: l,
            raw: x,
            loaded: b
        };

        H.LB[l] = q;
        H.LM[s] = l;

        return q;

    };
    H.namespace = function (c, o, v, b) {
        var a, i = 0, s, o, l, p;
        if (!o) o = H.Context;
        if (D.TS(c)) {
            if (!H.NM[c]) {
                l = H.NS.length;
                H.NM[c] = l;
                H.NS[l] = c;
            }
            a = c.split(".");
            p = o;
            for (; i < a.length; ) {
                s = a[i++];
                if (!D.TO(p[s])) p[s] = {};
                p = p[s];
            }
        }
        if (v) {
            for (i in v) p[i] = v[i];
            if (b && D.TF(p["serviceImpl"])) p.service = new p.serviceImpl();
        }
        return p;
    };
    H.lookup = function (c) {
        var a, i = 0, s, w = window, o, l;
        if (!D.TS(c)) return 0;
        a = c.split(".");
        o = w;
        if (a[0].match(/^hemi$/)) {
            o = H;
            i = 1;
        }
        l = a.length;
        for (; i < l; ) {
            s = a[i++];
            if (!D.TO(o[s])) return 0;
            o = o[s];
        }

        return o;
    };

    H.h = function (s) {
        var i = c = 0;
        for (; s && i < s.length; ++i) {
            c = (c + s.charCodeAt(i) * (i + 1)) & 0xFFFFFFFF;
        }
        return c.toString(16);
    },
 H.guid = function () {

     var d = new Date(), t, i = 4, r, l, x = 0;
     t = new String(d.getTime());
     r = new String(parseInt(Math.random() * (1000 * i)));
     l = r.length;
     for (; x < i - l; x++) r = "0" + r;
     return (H.uid_prefix + (++H.gc) + "-" + t + "-" + r);
 };

    H.newObject = function (n, v, r, d, h) {
        var o = {};
        
        if(D.TO(h)){
            for(i in h)
                o[i] = h[i];
        }
        
        H.prepareObject(n, v, r, o, d);
        if(D.TF(o.object_create)) o.object_create();
        return o;
    };

    H.prepareObject = function (n, v, r, o, d) {
        if (!o) o = {};
        if (!o.o) o.o = {};
        if (!o.p) o.p = {};
        if (!n) n = "custom_object";
        if (!v) v = "1.0";
        H.IM(o, "base_object", n, v);
        if (r)
            H.registry.service.addObject(o);
        
        if(d){
            
            H.object.addObjectDeconstructor(o);
        }
        if(D.TF(o.object_prepare))
            o.object_prepare();

        return o;
    };

    H.IM = function (o, s) {
        var v, a = arguments, i, n_a = [];

        for (i = 1; i < a.length; i++)
            n_a[n_a.length] = a[i];

        v = H.FN.apply(this.caller, n_a);

        if (
   D.TO(o)
   &&
   D.TO(v)
  ) {
            for (i in v)
                o[i] = v[i];

        }
    };

    H.FN = function (s) {
        var v, a = arguments;
        if (D.TS(H.ClassImports[s])) {
            eval("v=" + H.ClassImports[s]);
            return v;
        }
        switch (s) {
            case "base_object":
                return {
                    i: H.guid(),
                    getObjectId: function () { return this.i; },
                    setObjectId: function(i){ this.i = i;},
                    t: a[1],
                    getObjectType: function () { return this.t; },
                    v: a[2],
                    getObjectVersion: function () { return this.v; },
                    r: 0,
                    getReadyState: function () { return this.r; },
                    getProperties: function () { return this.p; },
                    getObjects: function () { return this.o; }
                };
                break;
        }
        return null;
    };

    H.GetSpecifiedAttribute = function (o, n) {
        return H.IsAttributeSet(o, n, 1);
    };

    H.IsAttributeSet = function (o, n, b) {
        if (o == null || !D.TO(o) || o.nodeType != 1) return 0;
        var s = o.getAttribute(n);
        if (!D.TS(s) || s.length == 0) return 0;
        return (b ? s : 1);
    };


    H.namespace("registry", H, {
        getEvalStatement : function(o){
            if(!H.registry.service.isRegistered(o)) return 0;
            return "H.registry.service.getObject('" + o.i + "')";
        },
        getApplyStatement : function(o, f){
            var a = H.registry.getEvalStatement(o);
            if(!a) return 0;
            return  a + "." + f + ".apply(" + a + ")";
        },
        service: null,
        serviceImpl: function () {
            var t = this;
            t.p = {
                rt: 0
            };
            t.o = {
                o: [],
                om: []
            };

            t.canRegister = function (o) {
                if (
     !D.TO(o)
     ||
     (
      !D.TS(o.i)
      ||
      !D.TS(o.t)
      ||
      !D.TS(o.v)
      ||
      !D.TN(o.r)
     )
    ) {
                    return 0;
                }
                return 1;

            };

            t.addObject = function (o) {
                var i, m, p;
                if (!t.canRegister(o)) 
                {
                    H.L("Invalid Object Structure", "540.4", 1);
                    return 0;
                }
                if (t.isRegistered(o)) {
                    H.L("Object '" + o.i + "' is already registered", "540.4");
                    return 0;
                }
                p = t.o;
                i = o.i;

                if (!D.TN(p.om[i])) {

                    m = p.o.length;
                    p.o[m] = o;
                    p.om[i] = m;
                    if (
      t.p.rt
      &&
      H.isImported("hemi.transaction")
     ) {
                        H.transaction.service.register(o);
                    }

                    return 1;
                }
                return 0;
            };

            t.removeObject = function (o, b) {

                var i = o.i, m, p;
                p = t.o;

                if (D.TN(p.om[i])) {
                    m = p.om[i];

                    p.o[m] = 0;
                    p.om[i] = null;
                    if (!b) H.message.service.publish("onremoveobject", i);
                    return 1;
                }
                return 0;
            };
            t.getObjectsArray = function () {
                return t.o.o;
            };

            t.getObjectsMap = function () {
                return t.o.om;
            };

            t.getObject = function (i) {
                var p = t.o;
                if (
     D.TN(p.om[i])
     &&
     D.TO(p.o[p.om[i]])
    ) {
                    return p.o[p.om[i]];
                }
                return null;
            };

            t.isRegistered = function (i) {

                if (D.TO(i)) {
                    if (D.TU(i.i)) return 0;
                    i = i.i;
                }

                if (D.TN(t.o.om[i])) {
                    return 1;
                }
                return 0;
            };

            t.sendSigterm = function () {
                var o, i, p = t.o;

                for (i = p.o.length - 1; i >= 0; ) {
                    o = p.o[i--];

                    if (o != null && o.r == 4 && D.TF(o.sigterm)) {
                        o.sigterm();
                    }
                }

                for (i = 0; i < p.o.length; ) {
                    o = p.o[i++];
                    if (t.isRegistered(o))
                        t.removeObject(o, 1);
                }

            };

            t.sendDestroyTo = function (o) {
                if (
     t.isRegistered(o)
     &&
     D.TF(o.destroy)
    ) {
                    o.destroy();
                    return 1;
                }
                return 0;
            };
            H.prepareObject("registry_service", "3.5.1", 0, t);
            t.addObject(t);

        }

    }, 1);

    H.namespace("message", H, {
        service: null,
        serviceImpl: function () {
            var t = this;
            t.o = {
                s: [],
                dd: [],
                e: []
            };
            t.p = {
                dd: 0,
                me: 500,
                rt: 3
            };
            t.data = {
                l: ["ALL", "DEBUG", "ADVISORY", "NORMAL", "WARNING", "ERROR", "FATAL", "NONE"],
                lm: { ALL: 0, DEBUG: 1, ADVISORY: 2, NORMAL: 3, WARNING: 4, ERROR: 5, FATAL: 6, NONE: 7 },
                dm: [],
                ed: [
                
    ]
            };
            t.getReportThreshold = function () {
                return t.p.rt;
            };
            t.getLevelMap = function () {
                return this.data.lm;
            };
            t.getLevels = function () {
                return this.data.l;
            };
            t.setReportThreshold = function (i) {
                if (D.TN(i)) i = t.data.l[i];
                if (D.TN(t.data.lm[i])) {
                    t.p.rt = t.data.lm[i];
                }
            };

            t.getEntries = function () {
                return t.o.e;
            };

            t.clearEntries = function () {
                t.o.e = [];
            };

            t.getDeliveryDelay = function () {
                return t.p.dd;
            };

            t.setDeliveryDelay = function (i) {
                if (D.TN(i) && i >= 0)
                    t.p.dd = i;

            };

            t.newSubscriptionObject = function (o, n, h, g) {
                return {
                    object: o,
                    subscription_name: n,
                    handler: h,
                    target: g
                };
            };

            t.subscribe = function (o, e, f, v) {

                var l, a = arguments, t = this;

                if (a.length == 4) {
                    if (!o) o = window;
                    if (!v) v = null;
                }
                if (a.length == 2) {

                    var t1 = a[0], t2 = a[1];
                    o = window;
                    e = t1;
                    f = t2;
                }

                if (!D.TO(t.o.s[e])) t.o.s[e] = [];
                l = t.o.s[e].length;
                t.o.s[e][l] = t.newSubscriptionObject(o, e, f, v);


                return 0;
            };

            t.unsubscribe = function (o, e, f) {


                var t = this, a = [], l, i = 0, z, g = arguments;

                if (g.length == 2) {
                    var t1 = g[0], t2 = g[1];
                    o = window;
                    e = t1;
                    f = t2;
                }
                if (!D.TO(t.o.s[e])) return 0;

                l = t.o.s[e].length;
                for (; i < l; i++) {
                    z = t.o.s[e][i];
                    if (
      z.object != o
      || z.handler != f
     ) {
                        a[a.length] = z;
                    }
                }
                t.o.s[e] = a;
                return 1;
            };

            t.sigterm = function () {
                var t = this;
                t.r = 5;
                t.p.dd = 0;
                t.o.dd = [];
                t.o.e = [];
            };

            t.flush = function () {
                t.o.dd = [];
            };

            t._P = function (i) {

                var t = this, d;
                if (t.r != 4) return;
                if (D.TS(i) && D.TO(t.o.dd[i])) {
                    d = t.o.dd[i];
                    t.P(d.event, d.data);
                    t.o.dd[i] = 0;
                }
            };

            t.publish = function (e, o) {
                var t = this, c, x, d;
                c = t.object_config;


                if (t.p.dd) {
                    d = t.o.dd;
                    x = H.guid();
                    d[x] = { data: o, event: e };
                    setTimeout("try{if(Hemi.registry.service.isRegistered('" + t.i + "')) Hemi.registry.service.getObject('" + t.i + "')._P('" + x + "');}catch(er){alert('Publish Error In " + e + " To " + t.t + "'\n + (er.message || er.description));}", t.p.dd);
                }
                else {
                    t.P(e, o);
                }
            };

            t.P = function (e, o) {
                var t = this, c, j, l, i, z, x, d;
                if (t.r != 4) return;
                c = t.object_config;
                if (!D.TO(t.o.s[e])) return;

                l = t.o.s[e].length;

                for (i = l - 1; i >= 0; ) {
                    z = t.o.s[e][i--];
                    if (
       !z.target || z.target == o
     ) {

                        try {

                            if (D.TS(z.handler))
                                z.object[z.handler](e, o);

                            else if (D.TF(z.handler))
                                z.handler(e, o);

                        }
                        catch (e) {
                            alert("Publish Error: " + e.message + "\n" + z.subscription_name + " : " + z.handler + "\n" + H.error.traceRoute(z.object[z.handler]));
                        }


                    }
                }
            };




            t.sendMessage = function (d, s, p) {
                return t.S(d, s, p);
            };
            t.S = function (d, s, p) {

                var o = null, v, t = this, ms;

                if (t.r != 4) return;
                if (!D.TS(s)) s = "200";
                v = t.I(s);
                if (v.t < t.p.rt) {
                    return o;
                }
                if (!D.TN(p)) p = 0;

                if (p) o = t.R(s, d, v);
                o = t.C(s, d, v);
                ms = t.parseMessage(o);
                if (ms == null) ms = "[message error]";
                t.publish("onsendmessage", { message: ms, level: v.t, description: o.d });

                return o;
            };
            t.R = function (s, d, v) {
                var t = this, o;

                o = t.C(s, d, v);

                alert(t.parseMessage(o));
                return o;
            };
            t.newBasicMessage = function (e, d) {
                return {
                    entry: e,
                    index: -1,
                    data: d,
                    time: new Date(),
                    id: H.guid()
                };
            };
            t.C = function (s, d, v) {
                var o, i, c, t = this;
                o = t.newBasicMessage(v, d);
                c = t.object_config;
                i = t.o.e.length;

                if (i >= t.p.me && t.p.me > 0) {
                    t.o.e.shift();
                    i--;
                }

                o.index = i;
                t.o.e[i] = o;
                return o;
            };

            t.parseMessage = function (o) {
                var v = "[error]", a, l, d, c, t = this;
                c = t.object_config;
                if (D.TO(o)) {
                    a = t.D(o);
                    d = o.time;

                    var m = "" + d.getMinutes(),
      s = "" + d.getSeconds(),
      ms = "" + d.getMilliseconds()
     ;
                    if (s.length == 1) s = "0" + s;
                    if (m.length == 1) m = "0" + m;
                    if (ms.length == 1) ms = "0" + ms;
                    if (ms.length == 2) ms = "0" + ms;


                    v = d.getHours() + ":" + m + ":" + s + ":" + ms + "::";
                    v += t.G(o.entry.t) + ": ";

                    v += (a != null ? a[0] : ":");
                    v += " (" + o.entry.m + ").";
                    o.d = (a != null ? a[1] : "");
                    if (o.data)
                        v += " " + o.data;

                    else
                        v += " " + o.d;

                }

                return v;
            };
            t.G = function (i) {
                return this.data.l[i];
            };

            t._blc = function(){
                this.data.ed.sort(function(a,b){
                    return (a[2] < b[2] ? -1 : 1);
                });
            };
            t.D = function (o) {
                var v = null, f = 100, l, m, n, i = 0, a, d, t = this;

                if (D.TO(o)) {
                    l = t.data.ed.length;
                    m = o.entry.mc;

                    n = o.entry.nc;
                    for (; i < l; i++) {
                        a = t.data.ed[i];
                        if (a.length >= 2) {
                            d = a[2];

                            if (m >= d && m < (d + f))
                                v = a;

                            if (v != null && m > (d + f)) {

                                break;
                            }
                        }
                    }
                }
                return v;
            };
            t.I = function (s) {
                var a = [], c, i = 100, o, m = 0, n, x = 999, d, p, y;
                o = i;
                if (s) a = s.split(".");


                c = (a[0]) ? parseInt(a[0]) : 200;

                for (y = i; y <= x; y += 100) {
                    if (c >= i && c < (y + i))
                        m = i;

                    if (m > 0 && m <= (y + 100)) break;
                }

                if (m < 0 || m > x || c < 0 || c > x) {
                    m = 200;
                    c = 200;
                }

                n = c - m;
                d = (a[1]) ? parseInt(a[1]) : 3;
                if (d > 7 || d < 0) d = 3;
                l = (a[2]) ? parseInt(a[2]) : 0;
                p = (a[3]) ? parseInt(a[3]) : 0;
                return {
                    mc: c,
                    mb: m,
                    nc: n,
                    t: d,
                    l: l,
                    id: p,
                    d: "",
                    m: c + "." + d + "." + l + "." + p
                };
            };

            H.prepareObject("message_service", "3.5.1", 1, t);


            t.r = 4;
        }
    }, 1);










    H.namespace("xml", H, {
        v: "3.5.1",

        xml_content_type: "text/xml",

        text_content_type: "text/plain",
        
        json_content_type: "application/json",

        auto_content_type: 1,

        form_content_type: "application/x-www-form-urlencoded",
        r: [],
        rm: [],

        ax_http_control: "MSXML2.XMLHTTP",
  

        ax_dom_control: "MSXML.DOMDocument",

        gadget_mode: 0,

        gadget_xml_control: "Core.Gadget.GadgetXmlHttp",

        gadget_base_path: 0,

        ce: 1,

        setCacheEnabled: function (b) {
            H.xml.clearCache();
            H.xml.ce = b;
        },

        getCacheEnabled: function () {
            return H.xml.ce;
        },


        nr: [
   ["soapenc", "http://schemas.xmlsoap.org/soap/encoding/"],
   ["wsdl", "http://schemas.xmlsoap.org/wsdl/"],
   ["soap", "http://schemas.xmlsoap.org/wsdl/soap/"],
   ["SOAP-ENV", "http://schemas.xmlsoap.org/soap/envelope/"]
  ],
        nl: {},
        nu: {},
        nh: 0,


        ho: [],
        hu: 0,
        hc: 0,
        hs: 5,
        hm: 20,


        hp: 0,

        he: 1,


        si: 0,

        setPoolEnabled: function (b) {
            H.xml.he = b;
        },

        getPoolEnabled: function () {
            return H.xml.he;
        },

        parseXmlDocument: function (s) {


            var r = 0, e;
            if (!s) return 0;
            if (typeof DOMParser != D.U) {
                e = new DOMParser();
                r = e.parseFromString(s, "text/xml");
            }
            else if (typeof D.A != D.U) {
                r = new D.A(H.xml.ax_dom_control);
                r.async = false;
                r.loadXML(s);
            }
            else {
            }
            return r;
        },

        newXmlDocument: function (n) {


            var r = 0, e;
            if (!n) return 0;
            if (typeof document.implementation != D.U && typeof document.implementation.createDocument != D.U) {
                r = document.implementation.createDocument("", n, null);

                if (r != null && r.documentElement == null) {
                    r.appendChild(r.createElement(n));
                }
            }
            else if (typeof D.A != D.U) {
                r = new D.A(H.xml.ax_dom_control);
                e = r.createElement(n);
                r.appendChild(e);
            }
            else {
            }
            return r;
        },
        getRequestArray: function () {
            return H.xml.r;
        },

        clear: function () {
            var _x = H.xml;

            _x.clearCache();



            _x.R();


            _x.r = [];
            rm = [];

            return 1;
        },

        clearCache: function () {
            var _x = H.xml, i = 0, o;
            for (; i < _x.r.length; i++) {
                o = _x.r[i];
                if (o.c && typeof o.cd == D.O) {

                    o.cd = 0;
                }
                o.obj = null;
                o.ih = null;
                o.h = null;
            }
            _x.r = [];
            _x.rm = [];
        },


        getXmlHttpArray: function () {
            return H.xml.ho;
        },

        R: function () {
            var _x = H.xml, i = 0, o;
            _x.hp = 1;
            _x.hu = 0;
            _x.ho = [];
            _x.hc = _x.hs;
            for (; i < _x.hs; i++)
                o = _x.ho[i] = _x.newXmlHttpObject(1, i);

        },

        testXmlHttpObject: function () {
            return H.xml.newXmlHttpObject(null, null, 1);
        },

        newXmlHttpObject: function (b, i, z) {

            var o = null, v, f, _m = H.message.service, a = (typeof D.A != D.U);
            if ((!a || !H.hemi_base.match(/^file/gi)) && typeof D.X != D.U) {
                o = new D.X();
                if (z) return 1;
            }
            else if (a) {
                try {

                    o = new D.A(H.xml.ax_http_control);
                    if (z) return 1;

                }
                catch (e) {
                    _m.S("XMLError: " + (e.description ? e.description : e.message), "512.4", (z ? 1 : 0));
                }

                if (z) return 0;
            }

            if (b && typeof i == D.N) {
                v = {
                    o: o,
                    u: 0,
                    i: i,

                    v: -1,
                    h: 0
                };
                return v;
            }
            else {

                return o;

            }

        },

        P: function (i, y) {
            var _x = H.xml, b = 0, o, a;
            a = _x.ho;
            if (typeof a[i] == D.O) {
                o = a[i];
                if (o.i >= _x.hs)


                    a[i] = 0;



                try {

                    if (!y) {




                        if (typeof D.X != D.U) {
                            if (typeof o.o.removeEventListener == D.F)
                                o.o.removeEventListener("load", o.h, false);
                            else
                                o.o.onreadystatechange = _x.B;
                        }
                        else if (typeof D.A != D.U && o.o instanceof D.A)
                            o.o.onreadystatechange = _x.B;

                        o.h = 0;
                    }

                }
                catch (e) {
                    H.message.service.S("Error in P: " + (e.description ? e.description : e.message), "512.4", 1);
                }

                o.o.abort();
                o.u = 0;
                o.v = -1;


                _x.hu--;
            }

            return 1;
        },

        G: function (y) {
            var _x = H.xml, i = 0, b = 0, o, a, _m = H.message.service, n = -1, z = 0;
            if (!_x.hp) _x.R();
            a = _x.ho;
            for (; i < a.length; i++) {
                if (typeof a[i] == D.O && typeof a[i].u == D.N && !a[i].u) {
                    a[i].u = 1;
                    b = i;

                    z = 1;
                    break;
                }

                if (n == -1 && !a[i])
                    n = i;

            }
            if (!z) {
                b = (n > -1) ? n : a.length;
                if (b < _x.hm) {
                    a[b] = _x.newXmlHttpObject(1, b);
                    a[b].u = 1;

                }
                else {
                    _m.S("Max pool size reached!", "200.4");
                    return null;
                }
            }
            if (b > -1) {
                _x.hu++;
                o = a[b];

                try {

                    if (!y) {





                        if (typeof D.X != D.U) {
                            if (typeof o.o.addEventListener == D.F) {
                                o.h = function () { H.xml.L(b); };
                                o.o.addEventListener("load", o.h, false);
                            }
                            else {
                                o.h = function () { H.xml.S(b); };
                                o.o.onreadystatechange = o.h;
                            }
                        }
                        else if (typeof D.A != D.U && o.o instanceof D.A) {
                            o.h = function () { H.xml.S(b); };

                            o.o.onreadystatechange = o.h;
                        }
                    }

                }
                catch (e) {
                    _m.S("Error in G: " + (e.description ? e.description : e.message), "512.4", 1);
                }


                return o;
            }

            return null;
        },


        L: function (i) {

            var _x = H.xml, o, v, _m = H.message.service, z;

            try {


                if (_x.he && typeof _x.ho[i] == D.O) {
                    z = _x.ho[i].v;
                    if (z == -1) {
                        _m.S("Invalid pool index for " + i, "200.4", 1);
                        return 0;
                    }
                    i = z;
                }


                if (typeof _x.rm[i] == D.N) {
                    o = _x.r[_x.rm[i]];
                    v = { text: null, xdom: null, json: null, id: (o.bi ? o.bi : i) };

                    if (
      o.u.match(/^file:/i)
      &&
      typeof D.A == "function"
      &&
      o.o instanceof D.A
     ) {
                        var mp = new D.A(H.xml.ax_dom_control);
                        mp.loadXML(o.o.responseText);
                        v.xdom = mp;
                    } else if (o.o != null) {
                        if (o.t) {
                            v.text = o.o.responseText;
                            if (o.t == 2 && typeof JSON != D.U) {
                                try {
                                    v.json = JSON.parse(v.text, _x.JSONReviver);
                                }
                                catch (e) {
                                    v.json = null;
                                    v.error = e.message;
                                    Hemi.logError(e.message);
                                }
                            }
                        }
                        else {
                            v.xdom = o.o.responseXML;
                            if (o.o.responseXML == null || o.o.responseXML.documentElement == null && o.o.responseText != null) {
                                v.xdom = _x.parseXmlDocument(o.o.responseText);
                                v.text = o.o.responseText;
                            }
                        }
                    }
                    if (!o.t && v.xdom == null) {
                        _m.S("Error loading '" + o.u + "'. Response text is: " + o.o.responseText + ".   Async is " + o.a + "; Pool Index is " + o.pi, "540.4", 1);
                    }
                    else if (o.t == 2 && v.json == null) {
                        _m.S("Error loading '" + o.u + "'. The internal JSON object reference is null.  Async is " + o.a + "; Pool Index is " + o.pi, "540.4");
                    }


                    o.r = 1;

                    if (o.ih) {
                        o.ih = 0;
                    }


                    if (_x.ce && o.c) {
                        if(!o.t) o.cd = v.xdom;
      else o.ct = v.text;
                    }


                    H.message.service.publish("onloadxml", v);
                    if (typeof o.h == D.F) o.h("onloadxml", v);



                    if (o.pi > -1)
                        _x.P(o.pi, !o.a);


                    o.o = 0;

                }
                else {
                    _m.S("Invalid id reference: " + i, "200.4", 1);
                }

            }
            catch (e) {
                _m.S("Error in handle_xml_request_load: " + (e.description ? e.description : e.message), "512.4", 1);
            }

        },
        S: function (i) {
            var _x = H.xml, o;


            if (_x.he && typeof _x.ho[i] == D.O) {
                o = _x.ho[i];
                if (o != null && typeof o.o == D.O && o.o.readyState == 4) {
                    _x.L(i);
                }
            }
            else if (typeof _x.rm[i] == D.N) {
                o = _x.r[_x.rm[i]];
                if (typeof o.o == D.O && o.o.readyState == 4) {
                    _x.L(i);
                }
            }
        },
        getJSON: function (p, h, a, i, c) {

            return H.xml.X(p, h, a, i, 0, null, c, 2);
        },

        getText: function (p, h, a, i, c) {

            return H.xml.X(p, h, a, i, 0, null, c, 1);
        },

        getXml: function (p, h, a, i, c) {

            return H.xml.X(p, h, a, i, 0, null, c);
        },

        postJSON: function (p, d, h, a, i) {

            if (typeof JSON == "undefined") {
                H.logError("Missing JSON interpreter");
                return 0;
            }
            return H.xml.X(p, h, a, i, 1, JSON.stringify(d), 0, 2);
        },

        postText: function (p, d, h, a, i) {

            return H.xml.X(p, h, a, i, 1, d, 0, 1);
        },

        postXml: function (p, d, h, a, i) {

            return H.xml.X(p, h, a, i, 1, d, 0);
        },


        X: function (p, h, a, i, x, d, c, t) {

            var _x = H.xml, f, o = null, v, _m = H.message.service, y, z, r, b, b_ia, g, bi = 0;

            if (!_x.si) _x.StaticInitialize();
            if (typeof p != D.S || p.length == 0) {
                _m.S("Invalid path parameter '" + p + "' in X", "512.4", 1);
                return 0;
            }
   
            if (typeof c == D.U) c = 0;
            if (typeof x == D.U) x = 0;
            if (typeof d == D.U) d = null;
            z = (x ? "POST" : "GET");
            if (typeof i != D.S) i = H.guid();


   if( H.lookup("hemi.data.io.proxy")){
    if(H.data.io.proxy.service.isProxied(p)){
     return H.data.io.proxy.service.proxyXml(p, h, a, i, x, d, c, t);
     
    }
    p = H.data.io.proxy.service.stripProxyProtocol(p);
   }

            if (
    _x.ce
    &&
    typeof _x.rm[i] == D.N
    &&
    (r = _x.r[_x.rm[i]])
   ) {

                if (r.c && (typeof r.cd == D.O || typeof r.ct == D.S)) {
                    if (!t)
                        b = { xdom: r.cd, id: i };
                    else {
                        b = { text: r.ct, id: i };
                        if (t == 2 && typeof JSON != D.U){
                            try {
                                b.json = JSON.parse(r.ct, _x.JSONReviver);
                            }
                            catch (e) {
                                b.json = null;
                                b.error = e.message;
                                Hemi.logError(e.message);
                            }
                        }

                    }
                    if (b) {
                        _m.publish("onloadxml", b);
                        if (typeof h == D.F) h("onloadxml", b);

                        return (t ? (t==2 ? b.json : b.text) : b.xdom);
                    }
                }




                else if (!r.r) {

                    c = 0;

                    bi = i;

                    i = H.guid();

                }

            }



            b = _x.he;
            if (_x.gadget_mode) {
                a = 0;
                b = 0;
                p = _x.gadget_base_path + p;
                r = new ActiveXObject(_x.gadget_xml_control);
            }
            else if (b) {

                r = _x.G(!a);

            }
            else {

                r = _x.newXmlHttpObject();

            }


            if (!(b ? (r && r.o) : r)) {
                _m.S("Null XML object in in X.", "512.4");

                b = { text: null, xdom: null, error: "Null XML object in X", id: i };
                if (typeof h == D.F) h("onloadxml", b);
                return 0;
            }


            if (b) r.v = i;


            y = _x.r.length;
            _x.r[y] = {
                u: p,
                i: i,
                bi: bi,
                a: a,
                o: (b ? r.o : r),
                ih: 0,
                h: h,


                pi: (b ? r.i : -1),


                c: c,
                cd: 0,

                r: 0,
                t: t
            };

            _x.rm[i] = y;
            o = _x.r[y].o;
            if (!p.match(/:\/\//)) {
                var m, e = new RegExp("^/");
                if (!p.match(e)) {
                    if (H.hemi_base) {
                        p = H.hemi_base + p;
                    }
                    else {
                        m = location.pathname;
                        if (m.match(/\\/)) m = m.replace(/\\/g, "/");
                        m = m.substring(0, m.lastIndexOf("/") + 1);
                        p = m + p;
                    }
                }
                if(!p.match(/:\/\//)){
                    if (!location.protocol.match(/^file:$/i))
                        p = location.protocol + "//" + location.host + p;

                    else
                        p = location.protocol + "//" + p;
                }
            }

            _x.r[y].u = p;

            b_ia = (typeof D.A != D.U && o instanceof D.A) ? 1 : 0;

            if (b_ia && typeof XMLHttpRequest != D.U && p.match(/^file/i)) {

                _x.P(_x.r[y].pi, !a);
                o = new D.A(H.xml.ax_http_control);
                if (bi) i = bi;

                o.open(z, p, false);
                o.send(null);
                var rt = (t ? o.responseText : o.responseXML);
                b = { xdom: null, text: null, json: null, id: i };
                if (t) {
                    b.text = rt;
                    if (t == 2 && typeof JSON != D.U) {
                        try {
                            b.json = JSON.parse(b.text, _x.JSONReviver);
                        }
                        catch (e) {
                            b.json = null;
                            b.error = e.message;
                            Hemi.logError(e.message);
                        }
                    }
                }
                else {
                    if (rt == null || rt.documentElement == null) {
                        rt = _x.parseXmlDocument(o.responseText);
                    }
                    b.xdom = rt;
                }
                _m.publish("onloadxml", b);
                if (typeof h == D.F) h("onloadxml", b);

                return rt;
            }

            try {




                if (!b && a && typeof D.X != D.U) {
                    if (typeof o.addEventListener == D.F) {
                        _x.r[y].ih = function () { H.xml.L(i); };
                        o.addEventListener("load", _x.r[y].ih, false);
                    }
                    else {
                        _x.r[y].ih = function () { H.xml.S(i); };
                        o.onreadystatechange = _x.r[y].ih;
                    }
                }
                else if (!b && a && b_ia) {
                    _x.r[y].ih = function () { H.xml.S(i); };

                    o.onreadystatechange = _x.r[y].ih;
                }

            }
            catch (e) {
                _m.S("Error in X: " + (e.description ? e.description : e.message), "512.4", 1);
            }




            if (b && !a) {
                _x.ho[_x.r[y].pi] = 0;
            }

            g = (a ? true : false);
            o.open(z, p, g);
            if (typeof o.setRequestHeader != D.U) {
                z = (t ? (t==2?_x.json_content_type : _x.text_content_type) : _x.xml_content_type);
                if (_x.auto_content_type && !t && typeof d == D.S) z = H.xml.form_content_type;
                o.setRequestHeader("Content-Type", z);
            }

            o.send(d);
            if (!a) {

                z = (t ? o.responseText : o.responseXML);
                 if (t == 2 && typeof JSON != D.U){
                  
                        try {
                            z = JSON.parse(z, _x.JSONReviver);
                        }
                        catch (e) {
                            z = null;
                            Hemi.logError(e.message);
                        }
                 }
                if (
     !t
     &&
     p.match(/^file:/i)
     &&
     b_ia
    ) {
                    var mp = new D.A(H.xml.ax_dom_control);
                    mp.loadXML(o.responseText);
                    z = mp;
                }
                else if (!t && (o.responseXML == null || o.responseXML.documentElement == null)) {

                    z = _x.parseXmlDocument(o.responseText);
                }

                if (b) {

                    _x.ho[_x.r[y].pi] = r;
                    _x.L(_x.r[y].pi);
                }
                else {

                    _x.L(i);


                }


                _x.r[y].o = null;

                if (!b && _x.r[y].pi > -1)
                    _x.P(_x.r[y].pi, !a);


                return z;
            }
            return 1;
        },

        transformNode: function (x, s, n, i, j, p, t) {

            var xp, o = null, _m = H.message.service, _x = H.xml, v, a, b, c, d;
            if (typeof x == D.S && x.length > 0) {
                if (p && !i) p = 0;
                v = x;
                x = _x.getXml(x, 0, 0, i, p);
                if (v.match(/\?(\S*)$/)) {
                    v = v.match(/\?(\S*)/)[1];
                    a = v.split("&");
                    for (b = 0; b < a.length; b++) {
                        c = a[b].split("=");
                        x.documentElement.setAttribute(c[0], c[1]);
                    }
                }
            }
            if (typeof s == D.S && s.length > 0) {
                if (p && !j) p = 0;
                s = _x.getXml(s, 0, 0, j, p);
            }
            if (typeof x != D.O || x == null || typeof s != D.O || s == null) {
                _m.S("Invalid parameters in transformNode. Xml Node = " + x + ", xsl document = " + s, "512.4", 1);
                return o;
            }
            if (typeof n != D.O) n = x;

            try {
                if (typeof XSLTProcessor != D.U) {
                    xp = new XSLTProcessor();
                    xp.importStylesheet(s);
                    o = xp.transformToFragment(n, document);
                    if (o && o != null) {
                        if (t) o = H.xml.serialize(o);
                        else o = o.firstChild;

                    }
                }

    
                else if (typeof D.A != D.U) {
                    o = new D.A(H.xml.ax_dom_control);
                    xp = n.transformNode(s);
                    if (t) o = xp;
                    else {
                        o.loadXML(xp);
                        o = o.documentElement;
                    }

                }
                else {
                    _m.S("Error in transformNode: " + (e.description ? e.description : e.message), "512.4", 1);
                }
            }
            catch (e) {
                _m.S("Error in transformNode: " + (e.description ? e.description : e.message), "512.4", 1);
            }

            return o;
        },


        HN: function () {
            var _x = H.xml, a, i = 0, o;
            _x.nu = {};
            _x.nl = {};
            for (; i < _x.nr.length; i++) {
                o = _x.nr[i];
                _x.nu[o[0]] = o[1];
                _x.nl[o[1]] = o[0];
            }
            _x.nh = 1;
        },
        getURIForURL: function (u) {
            var _x = H.xml, q;
            if (!_x.nh) _x.HN();
            q = _x.nl[u];
            return (q ? q : "");
        },
        getURLForURI: function (i) {
            var _x = H.xml, q;
            if (!_x.nh) _x.HN();
            q = _x.nu[i];
            return (q ? q : "");
        },

        lookupNamespaceURI: function (n) {

            var _x = H.xml;
            if (!_x.nh) _x.HN();
            if (_x.nu[n])

                return _x.nu[n];


            return "";
        },


        selectSingleNode: function (d, x, c) {

            var s, i, n;
            if (typeof d.evaluate != D.U) {
                c = (c ? c : d.documentElement);
                s = d.evaluate(x, c, H.xml, 0, null);
                return s.iterateNext();
            }
            else if (typeof d.selectNodes != D.U) {
                return (c ? c : d).selectSingleNode(x);
            }
            return 0;

        },

        selectNodes: function (d, x, c) {

            var s, a = [], i, n;
            if (typeof d.evaluate != D.U) {
                c = (c ? c : d.documentElement);
                s = d.evaluate(x, c, H.xml, 0, null);
                n = s.iterateNext();
                while (typeof n == D.O && n != null) {
                    a[a.length] = n;
                    n = s.iterateNext();
                }
                return a;
            }
            else if (typeof d.selectNodes != D.U) {
                return (c ? c : d).selectNodes(x);
            }
            return a;

        },




        queryNodes: function (x, p, n, a, v) {
            return H.xml.Q(x, p, n, a, v, 1);
        },

        queryNode: function (x, p, n, a, v) {
            return H.xml.Q(x, p, n, a, v, 0);
        },
        Q: function (x, p, n, a, v, z) {

            var i = 0, b, e, c, r = [];
            if (!z) r = null;

            c = x.getElementsByTagName(p);

            if (typeof n == D.S) {
                if (!c.length) {
                    if (!z) return null;
                    else return r;
                }
                c = c[0];
                e = c.getElementsByTagName(n);
            }
            else e = c;

            for (; i < e.length; i++) {
                b = e[i];
                if ((!a && !v) || (b.getAttribute(a) == v)) {

                    if (!z) {
                        r = b;
                        break;
                    }
                    else r[r.length] = b;

                }
            }
            return r;
        },


        serialize: function (n) {
            var v;
            if (typeof n.xml == D.S) {
                return n.xml;
            }
            else if (typeof XMLSerializer != D.U) {
                return (new XMLSerializer()).serializeToString(n);
            }

        },

        getCDATAValue: function (n) {
            var c, d = "", i = 0, e;
            if (n == null) return d;
            c = n.childNodes;
            for (; i < c.length; i++) {
                e = c[i];
                if (e.nodeName == "#cdata-section") d += e.nodeValue;
            }
            return d;
        },

        getInnerText: function (s, b) {
            var r = "", a, i, e;
            if (typeof s == D.S) return s;
            if (s == null) return r;
            if (typeof s == D.O && s.nodeType == 3) return s.nodeValue;
            if (s.hasChildNodes()) {
                a = s.childNodes;
                for (i = 0; i < a.length; i++) {
                    e = a[i];
                    if (e.nodeType == 3 || e.nodeType == 4){
                        r += e.nodeValue;
                    }
                    if(b && r.length) break;
                    if (e.nodeType == 1 && e.hasChildNodes()) {
                        r += H.xml.getInnerText(e);
                    }
                }
            }
            return r;
        },

        removeChild : function(n, o, b){
         var p;
         if(!n || !o) return;
            if(b && n.nodeType == 1 && H.IsAttributeSet(n,"hemi-id") && (p = H.registry.service.getObject(n.getAttribute("hemi-id")))){
                H.xml.removeChildren(n,b);
                H.registry.service.sendDestroyTo(p);
                o.removeChild(n);
            }
            else o.removeChild(n);
        },
        
        removeChildren: function (o, b) {
            if(!o) return;
            var i,a=o.childNodes,n,p;
            for (i = a.length - 1; i >= 0; i--){
                n = a[i];
                H.xml.removeChild(n,o,b);
            }

        },

        swapNode: function (n, c) {
            if (!n || !c) return;
            if (typeof n.swapNode != D.U) n.swapNode(c);
            else {
                
                n.parentNode.insertBefore(c, n);
                n.parentNode.removeChild(n);
                
            }
        },


        setInnerXHTML: function (t, s, p, d, z, c, h, ch) {

            var y, e, a, l, x, n, v, r = 0, b, f;


            if (!d) d = document;

            b = (d == document ? 1 : 0);

            if (!p)
                H.xml.removeChildren(t);

            y = (s && typeof s == D.O) ? s.nodeType : (typeof s == D.S) ? 33 : -1;

            try {

                switch (y) {
                    case 1:
                        if (h) {
                            e = s.cloneNode(false);
                        }
                        else {
                            f = s.nodeName;
                            if (typeof ch == D.F) f = ch(y, f);
                            if (!f) return 0;
                            e = d.createElement(f);
                            a = s.attributes;
                            l = a.length;
                            for (x = 0; x < l; x++) {
                                n = a[x].nodeName;
                                v = a[x].nodeValue;
                                if (typeof ch == D.F) {
                                    n = ch(2, n);
                                    v = ch(2, v);
                                }



                                if (b && n == "style") {
                                    e.style.cssText = v;
                                }

                                else if (b && n == "id") {
                                    e.id = v;
                                }



                                else if (b && n == "class") {
                                    e.className = v;
                                }


                                else if (b && n.match(/^on/i)) {
                                    eval("e." + n + "=function(){" + v + "}");
                                }
                                else {
                                    e.setAttribute(n, v);
                                }
                            }
                        }
                        if (!z && s.hasChildNodes()) {
                            a = s.childNodes;
                            l = a.length;
                            for (x = 0; x < l; x++)
                                H.xml.setInnerXHTML(e, a[x], 1, d, z, c, h, ch);

                        }

                        if (b && s.nodeName.match(/input/i) && H.IsAttributeSet(s,"checked")) {
                            e.checked = true;
                        }
                        t.appendChild(e);
                        r = e;
                        break;
                    case 3:
                        e = s.nodeValue;
                        if (typeof ch == D.F) e = ch(y, e);
                        if (e) {
                            e = e.replace(/\s+/g, " ");
                            t.appendChild(d.createTextNode(e));
                            r = e;
                        }
                        break;

                    case 4:
                        e = s.nodeValue;
                        if (typeof ch == D.F) e = ch(y, e);
                        t.appendChild(d.createCDATASection(e));
                        break;
                    case 8:

                        break;
                    case 33:
                        e = s;
                        if (typeof ch == D.F) e = ch(y, e);
                        if (e) {
                            if (!c) {
                                e = e.replace(/^\s*/, "");
                                e = e.replace(/\s*$/, "");
                                e = e.replace(/\s+/g, " ");
                            }
                            t.appendChild(d.createTextNode(e));
                            r = e;
                        }
                        break;
                    default:

                        break;
                }

            }
            catch (e) {
                H.message.service.S((e.message ? e.message : e.description) + " in type " + y + " : " + H.error.traceRoute(H.xml.setInnerXHTML), "200.4");
            }

            return r;
        },


        B: function () {

        },

        StaticInitialize: function () {
            H.message.service.subscribe(H.xml, "destroy", "_handle_destroy");
            H.xml.si = 1;
        },

        _handle_destroy: function (s, v) {

            var _x = H.xml;

            H.message.service.unsubscribe(H.xml, "destroy", "_handle_destroy");

            _x.clearCache();





            _x.r = [];
            rm = [];
            _x.hp = 0;
            _x.hu = 0;
            _x.ho = [];
        },

        JSONReviver: function (k, v) {
            var a;
            if (typeof v == "string" && (a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(v)))
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            if(typeof v == "number" && k.match(/(date|time)/gi))
             return new Date(v);
            
            return v;
        }
    });

    H.namespace("error", H, {
  traceDepth:20,
        traceRoute: function (v) {

            var r = "", a = [], i = 0, n, q, g, t, l,d=0;
            if (v != null) {
                while (v && v != null && d < H.error.traceDepth) {
                    n = H.error.G(v.toString());
                    if (n == null) {
                        v = null;
                        break;
                    }
                    n += "(";
                    g = v.arguments;
                    for (i = 0; g && i < g.length; i++) {
                        if (i > 0) n += ", ";
                        q = "";

                        t = typeof g[i];
                        l = v;
                        if (t == D.S) {
                            q = "\"";
                            if (l.length > 25) l = l.substring(0, 22) + "...";
                        }
                        else if (t == D.O) l = "obj";
                        else if (t == D.F) l = "func";

                        n += q + (t == D.O ? "obj" : l) + q + " {as " + t + "}";
                    }
                    n += ")";
                    v = v.caller;
     d++;
                }
                r = a.reverse().join("->");
            }
            else {
                r = "null";
            }
            return r;

        },

        G: function (s) {

            var a = s.match(/function\s([A-Za-z0-9_]*)\(/gi), r = null;
            if (s == r) return r;

            if (a != null && a.length) {
                s = a[0];
                s = s.replace(/^function\s+/, "");
                s = s.replace(/^\s*/, "");
                s = s.replace(/\s*$/, "");
                s = s.replace(/\($/, "");
                return s;
            }
            return r;
        }
    });


    if (!window.Hemi) window.Hemi = H;
})();
if(typeof window.Hemi == "object" && typeof Hemi != "object") Hemi = window.Hemi;
if(window.HemiConfig){
   if(D.TF(window.HemiConfig.frameworkLoad)) window.HemiConfig.frameworkLoad(H);
}


(function(){
 H.namespace("css", H,{
  toggleStyleSheet : function(s, b){
   var a = document.documentElement.getElementsByTagName("link"),i=0;
   for(; i < a.length; i++)
    if(a[i].getAttribute("title") == s) a[i].disabled = (!b);
   
  },
  StyleSheetMap : [],
  loadStyleSheet : function(u, n){
   var _s = H.css.StyleSheetMap, o, s, l;
   if(!n) n = u;
   if (_s[n]) return;
   
   if(!u.match(/^\//)) u = H.hemi_base + u;
   if(typeof document.createStyleSheet != D.U){
    o = document.createStyleSheet(u);
    if(o)
     _s[n] = o;
    
   }
   else{
    var s = "@import url(" + u + ");";
    l = document.createElement("link");
    l.setAttribute("href",u);
    l.setAttribute("rel","stylesheet");
    document.getElementsByTagName("head")[0].appendChild(l);

   }
  },
  getAbsoluteTop:
function(o,r){
   return H.css.getAbsolutePosition(o,r,1);
  },

  getAbsoluteLeft:
function(o,r){
   return H.css.getAbsolutePosition(o,r,0);
  },
  
  getAbsolutePosition:
function(o,r,b){
   var c=o,i=0;

   while(c != null && (!r || r != c) && c.nodeName && !c.nodeName.match(/body/i)){
    i += (b?(c.offsetTop?c.offsetTop:0):(c.offsetLeft?c.offsetLeft:0));
    c = c.offsetParent;
   }
   return i;
  },
  decodeJSON : function(s) {
            var r = /\{#HF_([A-Za-z0-9_]+){/,
            rf = /{#HF_[A-Za-z0-9_]*/,
   a,n,o;
            a = s.match(r);
            if (!a || a.length < 2) return 0;
            n = s.replace(rf, "").replace(/\}$/, "");
            try {
             eval("o={" + a[1] + ":" + n + "};");
            }
            catch (e) {
             alert(e.message ? e.message : e.description);
             o = 0;
            }
            return o;
        }
 
 });
}());




(function(){
 H.namespace("data.stack", H, {
  service:null,
  serviceImpl:
function(){
   var t=this;



   
   

   t.p = {
    
    e:0
   };
   t.o = {
    t:[],
    tn:[]
   };
   

   t.add = function(o, n, v, b){
    
    
    var _p = t.o,
     _r = H.registry.service,
     _m = H.message.service,
     l,
     nl
    ;
    if(!_r.isRegistered(o)) return 0;
    
    if(!D.TS(n)) return 0;
    l = _p.t.length;
    
    if(!t.p.e && t.CO(o, n)){
     if(!b){
      _m.S("Overstacked " + n + " for " + o.i,"200.4");
      return 0;
     }

     
     t.remove(o,n);
    }
    
    if(D.TU(_p.tn[n])) _p.tn[n] = [];
    nl = _p.tn[n].length;
    _p.tn[n][nl] = l;
    _p.t[l] = {owner_id:o.i,index:l,token_name:n,token_value:v};

    return 1;

   };

   t.getAll = function(n){
    var _p = t.o;
    if(!D.TO(_p.tn[n])) return [];
    return _p.tn[n];
   };
   
   t.getValue = function(n, z){
    var v = t.get(n,z);
    return (v ? v.token_value : 0);
   };

   t.get = function(n,z){
    
    var _p = t.o, a, v;
    if(!D.TO(_p.tn[n])) return 0;
    a = _p.tn[n];
    if(!D.TN(z)) z = 0;
    if(z < 0 || z >= a.length) return 0;

    for(;z < a.length; z++){
     if(D.TN(a[z]) && a[z] >= 0)
      return _p.t[a[z]];

    }

    return 0;
    
   };

   t.getValueByOwner = function(o, n){
    var o = t.getByOwner(o, n);
    if(!o) return 0;
    return o.token_value;
   };
   t.getByOwner = function(o, n){
    var _p = t.o,
     a,
     i = 0,
     z,
     y,
     _r = H.registry.service
    ;
    if(!_r.isRegistered(o)) return 0;
    if(!D.TO(_p.tn[n])) return 0;
    a = _p.tn[n];
    for(; i < a.length;i++){
     z = a[i];
     if(!D.TN(z) || z < 0 || z > _p.t.length  || D.TU(_p.t[z])){
      H.message.service.S("Invalid reference for " + n + " with " + o.i + " at " + i,"200.4");
      continue;
     }
     y = _p.t[z];
     if(y.owner_id == o.i) return y;
    }
    return 0;

   };

   t.getAllByOwner = function(o){
    var _p = t.o,
     a,
     i = 0,
     z,
     y,
     r = [],
     _r = H.registry.service,
     _m = H.message.service
    ;
    if(!_r.isRegistered(o)){
     _m.S("Unregistered object","200.4");
     return r;
    }
    for(;i < _p.t.length;i++){
     if(!D.TO(_p.t[i]))
      continue;

     y = _p.t[i];
     if(y.owner_id == o.i)
      r[r.length] = y;

    }
    
    return r;
    
   };
   
   t.clear = function(o){
    var a = t.getAllByOwner(o), i = 0;
    for(;i < a.length;i++){
     this.remove(o,a[i].token_name);
    }
   };

   t.remove = function(o, n){
    var a,i=0,_p = t.o,ti,_r = H.registry.service;
    if(!_r.isRegistered(o)){
     H.message.service.S("Owner object is not registered","200.4");
     return 0;
    }
    if(!D.TO(_p.tn[n])){
     a = [];
     H.message.service.S("Token Reference does not exist in remove for " + n,"200.1");
    }
    else{
     a = _p.tn[n];
    }
    for(;i < a.length;i++){
     z = a[i];
     if(!D.TN(z) || z < 0 || z > _p.t.length || !D.TO(_p.t[z])){
      continue;
     }
     y = _p.t[z];
     if(y.owner_id == o.i){
      ti = y.index;
      _p.tn[n][i] = -1;
      break;
     }
    }
    if(D.TO(_p.t[ti])) _p.t[ti] = 0;

   };
   
   t.CO = function(o, n){
    return (D.TO(this.getByOwner(o, n)) ? 1 : 0);
   };

   H.IM(t,"base_object","token_ring","3.5.1");
   H.registry.service.addObject(t);
  }
 }, 1);
}());


(function(){
 H.namespace("data.validator.definitions",H,{
  service : null,

  serviceImpl : function(){
   var t = this;
   t.o = {
    patterns : []
   };
   t.addNewPattern = function(i, t, c, m, r, n, e, a){
    var v = this.newPattern(i, t, c, m, r, n, e);
    if(D.TO(a)) v.include = a;
    this.o.patterns[i] = v;
    return v;
   };
            t.newPattern = function (i, t, c, m, r, n, e) {
    var v = {
     id:i,
     type:t,
     comp:(c)?true:false,
     allow_null:(n)?true:false,
     match:m,
     replace:r,
     error:e,
     include:[]
    };
    return v;
   };
   t.addNewPattern("not-empty", "bool", "true", "\\S", 0, 0,"Value cannot be an empty string.",["trim-ends"]);
   t.addNewPattern("email-address", "bool", "true", "^([a-zA-Z0-9._\\-\\+]+@[a-zA-Z0-9._\\-]+\\.[a-zA-Z0-9._\\-]+)", 0, 0,"Unexpected format of email address.",["trim-ends"]);
   t.addNewPattern("money", "bool", "true", "\\d\\.", 0, 0,"Expected format is: \"##\" or \"##.##\"  No spaces, parenthesis, letters, or hyphens.",["trim-ends","not-empty"]);
   t.addNewPattern("phone-number", "bool", "true", "\\d*", 0, 0,"Expected format is: \"##########\".  No spaces, parenthesis, or hyphens.",["trim-ends","not-empty"]);
   t.addNewPattern("numbers-only", "bool", "true", "[\\.\\d]+", 0, 0,"Invalid characters.  Numbers only.",["trim-ends","not-empty"]);
   t.addNewPattern("web-safe", "bool", "false", "[^a-zA-Z0-9._\\-\\+'\\(\\)\\]\\[\\)\\(\\/\\{\\}\\s,\\?!:~#@&;%]", 0, 0,"Invalid characters.  Use only standard (not extended) ASCII characters.");
   t.addNewPattern("web-url", "bool", "true", "^(http|https)(:\\/{2}[\\w]+)([\\/|\\.]?)([\\S]*)", 0, 1,"Expected format is (http | https)://[domain]([path/] | [file]).",["trim-ends"]);
   t.addNewPattern("trim-begin", "replace", 0, "^\\s*", "", 0,0);
   t.addNewPattern("trim-end", "replace", 0, "\\s*$", "", 0,0);
   t.addNewPattern("trim-ends", "none", 0, 0, "", 0,0,["trim-begin","trim-end"]);

  }
 },1);
}());

(function(){
 H.namespace("event",H,{
  getEvent:
function(o){
   return (typeof event == D.O)?event:o;
  },
  cancelEvent:
function(o){
   (typeof o.preventDefault != D.F)?(o.returnValue=false):o.preventDefault();
   o.cancelBubble = true;
  },
  
  getEventDestination:
function(e){
   return (e.relatedTarget)?e.relatedTarget:e.toElement; 
  },
  getEventOrigination:
function(e){
   return (e.relatedTarget)?e.relatedTarget:e.fromElement; 
  },
  
  getEventSource:
function(o){
   var s=H.event.getEvent(o);
   if(s==null){
    H.message.service.S("Bad event reference","515.3",1);
    return o;
   }
   return (s.target)?s.target:s.srcElement;
  },





  addScopeBuffer:
function(o){
   var e = "scopeHandler";
   try{
    o[e]=function(s,r,x,l){
     var b = (typeof r == D.O && r!=null?1:0),t=this,e,h,f;
     r = (b)?r:t;
     
     e = "_prehandle_" + s;
     b = (l?1:0);
     h = 
      "f=function(){\n"
      + "try{\n"
      + "var o="+ (b?'Hemi.registry.service.getObject(\"' + r.i + '\")':"this") + ";\n"
      + "if(typeof o!=\"object\" || o == null){H.logDebug('Object " + r.i + " is invalid for event " + s + "');return;}\nreturn o." + (!x ? "_handle_" : "") + s + ".apply(o,arguments);"
      + "}\ncatch(e){ alert(r.i + \"::\" + s + \"::\" + (e.description?e.description:e.message) + \"\\n\" + Hemi.error.traceRoute(f.caller));}\n"
      + "}"
     ;
     eval(h);
     if(!x) t[e] = f;
     return f;
    };
    o["getScopeHandler"] = function(s){
     return "Hemi.registry.service.getObject(\"" + this.i + "\")._prehandle_" + s + "()";
    };
   
   }
   catch(e){
    alert("Error: " + e.description);
   }
   
  },
  disableMotionCapture:
function(o){
   var f;
   if(typeof document.removeEventListener == D.F){
    document.removeEventListener("mousemove",o.onmousemove,true);
    document.removeEventListener("mouseup",o.onmouseup,true);
   }
   else if(typeof (f = o.releaseCapture) != D.U)
    f();
   
  },

  enableMotionCapture:
function(o){
   var f;
   if(typeof document.addEventListener == D.F){
    document.addEventListener("mousemove",o.onmousemove,true);
    document.addEventListener("mouseup",o.onmouseup,true);
   }
   
   else if(typeof (f = o.setCapture) != D.U)
    f();
   
   
  },

  addEventListener:
function(o,e,f,b){

   
   if(typeof o.addEventListener != D.U)
    o.addEventListener(e,f,b);
   
   else if(typeof o.attachEvent != D.U)
    o.attachEvent("on" + e,f);
   

  },

  removeEventListener:
function(o,e,f,b){
   if(typeof o.removeEventListener != D.U)
    o.removeEventListener(e,f,b);
   
   else if(typeof o.detachEvent != D.U)
    o.detachEvent("on" + e,f);
   
  }
 
 });
})();




 



 
 
 





(function () {
    H.namespace("object", H, {
        addObjectDeconstructor: function (o) {
            if (!H.registry.service.isRegistered(o)) return 0;

            o.sigterm = function () {
                this.destroy();
            };
            o.destroy = function () {
                var t = this, i;
                if (t.r < 5) {
                    if (typeof t.object_destroy == D.F) t.object_destroy();
                    t.r = 5;
                    
                    H.registry.service.removeObject(t);

                    
                    for (i in t.o) t.o[i] = null;
                    
                    for (i in t.p) t.p[i] = null;
                }
            };
        },
        addObjectAccessor: function (o, s) {

            if (!D.TO(o)) {
                alert("Invalid object reference");
                return 0;
            }
            if (!D.TO(o.o)) o.o = {};

            o.o[s + "s"] = [];
            o.o[s + "Names"] = [];
            o.o[s + "Index"] = [];
            var 
    s_name = s.substring(0, 1).toUpperCase() + s.substring(1, s.length),
    f
   ;

            o["get" + s_name + "ByName"] = eval(
    'f = function(s){'
    + ' var c=this.o;'
    + ' if(typeof c.' + s + 'Names[s]==D.N) return c.' + s + 's[c.' + s + 'Names[s]];'
    + ' return 0;'
    + ' }'
   );
            o["clear" + s_name + "s"] = eval(
    'f = function(){var _p = this.o;_p.' + s + 's = [];_p.' + s + 'Names = [];_p.' + s + 'Index = [];return 1;}'
   );
            o["remove" + s_name] = eval(
    'f = function(o){var _p = this.o,i; if(!D.TO(o) || !D.TN(o.access_index)) return 0; delete _p.' + s + 's[o.access_index];delete _p.' + s + 'Index[o.i];delete _p.' + s + 'Names[o.access_name];return 1;}'
   );
            o["addNew" + s_name] = eval(
    'f = function(o, n, i){var _p = this.o,l; if(!i){ if(!o.i) o.i = H.guid(); i = o.i;}if(this.is' + s_name + '(n)) return 0;l = _p.' + s + 's.length;_p.' + s + 's[l] = o;_p.' + s + 'Index[i] = l;_p.' + s + 'Names[n] = l;o.access_index = l;o.access_name = n;return 1;}'
   );

            o["get" + s_name] = eval(
    'f = function(i){var _p = this.o;if(typeof _p.' + s + 'Index[i] == D.N && typeof _p.' + s + 's[_p.' + s + 'Index[i]] == D.O){return _p.' + s + 's[_p.' + s + 'Index[i]];}return 0;};'
   );
            o["get" + s_name + "s"] = eval(
    'f = function(){return this.o.' + s + 's;};'
   );

            o["is" + s_name] = eval(
    'f = function(o){var _p = this.o;if(typeof o == D.S){if(this.get' + s_name + 'ByName(o)) return 1;return 0;}if(typeof o==D.O&&o!=null&&typeof _p.' + s + 'Index[o.' + s + '_id] == D.N&&typeof _p.' + s + 's[_p.' + s + 'Index[o.' + s + '_id]] == D.O){return 1;}return 0;};'
   );
            return 1;
        }
    });
} ());





(function () {
    H.namespace("object.xhtml", H, {
        bind: function (o) {
            return H.object.xhtml.newInstance(o.parentNode, o);
        },
        newInstance: function (hp, xn, cid, rid, cc, cn, cp, cf) {
            








            
            if (!xn) return null;
            if (!hp && D.TO(xn)) hp = document;
            if (!cid) {
                
                
                if (xn.nodeType == 1 && typeof xn.getAttribute != D.U) {
                    cid = xn.getAttribute("id");

                    if (cid == null || cid.length == 0) cid = xn.getAttribute("name");
                    if (cid == null || cid.length == 0) cid = 0;
                }
                else
                    cid = 0;
            }

            if (!cc) cc = 0;
            if (D.TS(cc)) cc = H.lookup(cc);


            var n = H.FN("base_object", "xhtml_component", "3.5.1");
            
            n.o = {
                
                c: 0,
                
                r: hp,
                
                cc: cc,
                
                a: 0
            };
            n.p = {
                rid: rid,
                cid: cid,
                
                cn: cn,
                
                cp: cp,
                
                cf: cf,
                
                lcp: 0,
                
                qt: 0,
                
                mp: 0
            };

            n.getComponentCollection = function () {
                return this.o.cc;
            };
            n.getIsComponentLinked = function () {
                return this.p.lcp;
            };
            
            n.getContainer = function () {
                return this.o.c;
            };

            n.getComponentId = function () {
                return this.p.cid;
            };

            n.getReferenceId = function () {
                return this.p.rid;
            };

            n.getApplicationComponent = function () {
                var _p = this.o;
                if (_p.a) return _p.a;
                return 0;
            };

            n.setApplicationComponent = function (a) {
                var _p = this.o;
                if (!_p.a) _p.a = a;
            };

            n.sigterm = function () {
                this.destroy();
            };

            n.destroy = function () {
                var _p, t = this, _s;
                _p = t.o;
                _s = t.p;

                if (t.r != 5) {

                    if (_p.cc && _s.cid)
                        _p.cc.synchronizeComponent(t);


                    if (_p.a) _p.a.destroy();

                    if (_p.c && _p.r && _p.c.parentNode == _p.r && (!_s.cf || _s.cf != "self"))
                        _p.r.removeChild(_p.c);

                    H.registry.service.removeObject(t);

                    
                    _p.c = 0;
                    _p.r = 0;
                    _p.cc = 0;
                    _p.a = 0;

                    t.r = 5;
                }

            };

            n.init_component = function () {
                var t = this,
     o,
     p,
     _s = t.p,
     _p = t.o,
     _ac = H.lookup("hemi.app.comp"),
     _am = H.lookup("hemi.app.module"),
     i,
     d,
     a,
     dc,
     dp,
     _dw = H.lookup("hemi.app.dwac")
    ;
                if (D.TO(hp) && D.TO(xn) && (!_s.cf || _s.cf != "self"))
                    o = H.xml.setInnerXHTML(hp, xn, 1, 0, 1);

                else if (D.TO(xn))
                    o = xn;

                else
                    o = hp;

                if (!H.IsAttributeSet(o, "hemi-id")) o.setAttribute("hemi-id", n.i);
                if (_s.rid && o && !o.getAttribute("space-id")) o.setAttribute("space-id", _s.rid);

                t.o.c = o;

                i = (_s.cn ? _s.cn : (_ac ? (o.getAttribute(_ac.p.x) ? o.getAttribute(_ac.p.x) : o.getAttribute(_ac.p.c)) : 0));

                if (i) {
                    if (_s.cp) {
                        dp = _s.cp;
                    }
                    else if (_ac && H.IsAttributeSet(o, _ac.p.x)) {
                        if (i.match(/\.xml/)) {
                            dp = i;
                            i = i.match(/(component\.)?([\S][^\.\/]*)\.xml/)[2];
                        }
                        else {
                            dp = H.hemi_base + "Components/component." + i.toLowerCase() + ".xml";
                        }
                    }
                    else if (_ac && (a = o.getAttribute(_ac.p.q)) && a.length > 0) {
                        dp = a;
                    }
                    else {
                        a = o.getAttribute(_ac.p.g);
                        if (!a || a.length == 0) a = _ac.p.k;

                        
                    }
                    if (dp && _ac) {
                        _p.a = _ac.bindComponent(t.i, i, dp, 0, 1);

                    }
                    else {
                        H.message.service.S("Component binding to " + dp + " for " + i + " using " + a + " failed.", "200.4");
                    }

                }
                
                else if (_ac && (dp = o.getAttribute(_ac.p.t))) {
                    _p.a = _ac.newInstance(0, 0, this.getObjectId(), 0, 0, 1);
                    _p.a.setTemplateIsSpace(1);
                    if (!dp.match(/\.xml$/) && !dp.match(/\//))
                        _s.qt = "Templates/" + dp + ".xml";
                    else _s.qt = dp;
                    _p.a.importComponentDefinition("", 0, _s.rid);
                }
                

                else if (_am && (p = H.GetSpecifiedAttribute(o, "module")) && p != null)
                    _s.mp = p;

                else if (_dw && (i = o.getAttribute(_dw.atkey)) != null && i.length > 0) {
                    _p.a = _dw.newInstance(t, o.getAttribute(_dw.aturi), o.getAttribute(_dw.attid), o.getAttribute(_dw.attk));
                }

                t.r = 4;

            };

            
            n.post_init = function () {
                var _s = this.p, _p = this.o;

                if (_p.cc && D.TF(_p.cc.addComponent) && _p.cc.addComponent(this, _s.rid)) _s.lcp = 1;
                
                else _p.cc = 0;

                if (_p.a) {
                    if (_s.qt)
                        _p.a.loadTemplate(_s.qt);

                    if (D.TF(_p.a.post_init)) _p.a.post_init(this, _s.rid);
                }
                else if (_s.mp)
                    H.app.module.service.NewModule(_s.mp, this);

            };

            H.registry.service.addObject(n);
            n.init_component();

            return n;
        }
    });
} ());






(function () {
    
    H.namespace("storage.dom", H, {

        st: "DOMStorage",
        ss: 0 ,
        ls: (window.localStorage ? window.localStorage : 0),
        
        ps: 0,
        cs: 0,
        getPreferredStorage: function () {
            return H.storage.dom.gP();
        },
        gP: function () {
            var s = H.storage.dom;
            if (!s.cs) s.init();
            return s.ps;
        },
        init: function () {
            var s = H.storage.dom;
            try {
                s.ss = (window.sessionStorage ? window.sessionStorage : 0);
            }
            catch (e) {
                H.logWarning(e.message ? e.message : e.description);
            }
            if (s.ls) s.ps = s.ls;
            
            else if (s.ss) s.ps = s.ss;

            s.cs = 1;
        },
        iS: function (o) {
            return (typeof globalStorage == D.U || o != globalStorage);
        },
        getLength: function () {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.length;
            return o[document.domain].length;
        },
        getItem: function (n) {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.getItem(n);
            return o[document.domain].getItem(n);
        },
        setItem: function (n, v) {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.setItem(n, v);
            return o[document.domain].setItem(n, v);
        },
        removeItem: function (n) {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.removeItem(n);
            return o[document.domain].removeItem(n);
        },
        key: function (i) {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            if (s.iS(o)) return o.key(i);
            return o[document.domain].key(i);
        },
        clear: function (i) {
            var o, s = H.storage.dom;
            o = s.gP();
            if (!o) return 0;
            var i, l = s.getLength();
            for (i = l - 1; i >= 0; i--) {
                s.removeItem(s.key(i));
            }
        }

    });
} ());

(function(){
 H.namespace("util",H,{
  getDate : function(i){
   var d = new Date();
   return i?d:d.getTime();
  },
  EH:
function(e,h){
   
   if(D.TO(e)&& typeof e.getAttribute != D.U && D.TS(e.getAttribute(h))){
    try{
     eval(e.getAttribute(h));
    }
    catch(z){
     H.logError("Error evaluating [element]." + h + ": " + (z.description?z.description:z.message));
    }
   } 
  },
  merge:
function(o,n,s){
   
   H.ClassImports[n] = s;
   H.IM(o,n);
  },

  absorb : function(a,b){
   var i = 0, l = a.length;
   for(;i<l;)
    b[b.length] = a[i++];
   
   
  }
 })
}());


(function () {
    H.namespace("util.logger", H, {
        addLogger: function (o, s, d, i) {
            i = parseInt(i);
            if (isNaN(i)) return 0;
            if (!H.message.service.data.dm[i]) {
                H.message.service.data.dm[i] = 1;
                H.message.service.data.ed.push([s, d, i]);
                H.message.service._blc();
            }
            var a = ["Debug", "Advisory", "Normal", "Warning", "Error", "Fatal"], x = 0, f;
            for (; x < a.length; x++) {
                eval("f = function(m, i){H.message.service.S(m, \"" + i + "." + (x + 1) + "\" + (i > 0 ? \".\" + i: \"\"));}");
                o["log" + (x != 2 ? a[x] : "")] = f;
            }
        }
    });
} ());




(function () {
    H.namespace("util.config", H, {

        newInstance: function (s, h, a) {
            var n = {
                o: {
                    config: [],
                    cm: [],
                    clh: 0
                },
                p: {
                    cp: 0,
                    
                    l: 0,
                    la: 0,
                    rn: 0,
                    epn: "config",
                    en: "param",
                    ann: "name",
                    avn: "value"
                }
            };








            n.setElementParentName = function (s) {
                this.p.epn = s;
            };

            n.setElementName = function (s) {
                this.p.param_child_name = s;
            };

            n.setAttrNameName = function (s) {
                this.p.ann = s;
            };


            n.setAttrValueName = function (s) {
                this.p.avn = s;
            };

            n.clearConfig = function () {
                var t = this, _p;
                _p = t.o;

                _p.config = [];
                _p.cm = [];

            };

            n.destroy = function () {
                var t = this;
                if (t.r != 5) {
                    H.message.service.unsubscribe(t, "onloadxml", "HLX");
                    t.clearConfig();
                    t.o.clh = 0;
                }
            };

            n.sigterm = function () {
                this.destroy();
            };

            n.reload = function () {
                var t = this, _s, _p;
                t.clearConfig();
                _s = t.p;
                _p = t.o;
                if (_s.cp) {
                    t.load(_s.cp, _p.clh, _s.la);
                }
            };
            n.init = function () {
                var t = this;
                t.r = 4;
                t.p.l = 1;
                t.p.rn = "web-application";
            };

            n.load = function (s, h, a) {
                
                var t = this, o, c;
                t.o.clh = (D.TF(h) ? h : 0);
                t.p.cp = s;
                t.p.la = a;

                o = H.xml.getXml(s, null, a, t.i);

                
                if (!a)
                    t._parse_config(o);



            };

            n.HLX = function (s, v) {
                var t = this;

                
                if (v.id == t.i && t.p.la) {
                    this._parse_config(v.xdom);
                }
            };

            n.getParams = function () {
                return this.o.config;
            };

            n.serialize = function (x) {
                var t = this, c, o, l, i = 0, x, p;
                l = t.o.config.length;
                if (!t.p.rn) return null;
                if (!x) x = H.xml.newXmlDocument(t.p.rn);

                p = x.createElement(t.p.epn);
                x.documentElement.appendChild(p);
                for (; i < l; i++) {
                    if (t.o.config[i].value == null || D.TU(t.o.config[i].value)) continue;
                    o = x.createElement(t.p.en);
                    p.appendChild(o);
                    o.setAttribute(t.p.ann, t.o.config[i].name);
                    o.setAttribute(t.p.avn, "#cdata");
                    o.appendChild(x.createCDATASection(t.o.config[i].value));

                }
                return x;
            };

            n.writeParam = function (o, x, v) {
                var t = this, c, p, n, b = (v == null || D.TU(v));
                p = o.documentElement.getElementsByTagName(t.p.epn);
                if (p.length) p = p[0];
                else {
                    p = o.createElement(t.p.epn);
                    o.documentElement.appendChild(p);
                }
                n = H.xml.selectSingleNode(o, t.p.en + "[@" + t.p.ann + " = '" + x + "']", p);
                if (n && b)
                    p.removeChild(n);
                else if (!b) {
                    if (!n) {
                        n = o.createElement(t.p.en);
                        n.setAttribute(t.p.ann, x);
                        p.appendChild(n);
                    }
                    else H.xml.removeChildren(n);

                    n.setAttribute(t.p.avn, "#cdata");
                    n.appendChild(o.createCDATASection(v));
                }
                return t.setParam(x, v);
            };

            n.setParam = function (x, v) {
                var t = this, c, o, l;
                if (!t.p.l) return null;

                if (D.TN(t.o.cm[x]))
                    if (t.o.config[t.o.cm[x]]) {
                        if (v == null || D.TU(v)) {
                            H.logWarning("Nullify object ref for " + x + " with value " + v);
                            delete t.o.cm[x];
                            t.o.cm[x] = null;
                        }
                        else {
                            t.o.config[t.o.cm[x]].value = v;
                        }
                    }
                    else return 0;
                else if (v != null && !D.TU(v)) {
                    H.log("Set param: " + x + "=" + v + " at " + t.o.config.length);
                    t.o.cm[x] = t.o.config.length;
                    t.o.config[t.o.config.length] = { "name": x, "value": v };
                }

                return 1;
            };

            n.getParam = function (x) {
                var t = this, c, o;
                if (!t.p.l) return null;
                H.log("Lookup param " + x + " :: " + t.o.cm[x]);
                if (D.TS(x))
                    x = t.o.cm[x];

                if (D.TN(x) && D.TO(t.o.config[x]))
                    return t.o.config[x].value;
                H.logWarning("Param " + x + " not found");
                return null;
            };


            n.parseConfig = function (o) {
                return this._parse_config(o);
            };

            n._parse_config = function (o) {
                var t = this, c, p, i = 0, a, n, v;
                t.r = 3;
                if (D.TO(o) && o.documentElement != null) {
                    t.p.l = 1;
                    if (!t.p.rn) t.p.rn = o.documentElement.nodeName;

                    a = H.xml.queryNodes(o.documentElement, t.p.epn, t.p.en, 0, 0); 

                    for (; i < a.length; i++) {
                        p = a[i];
                        n = p.getAttribute(t.p.ann);
                        if (D.TS(n) && n.length > 0) {
                            v = p.getAttribute(t.p.avn);
                            if (!D.TS(v)) v = "";

                            t.o.cm[n] = t.o.config.length;

                            if (v == "#cdata" && p.hasChildNodes())
                                v = H.xml.getCDATAValue(p);

                            t.o.config[t.o.config.length] = { "name": n, "value": v };
                        }
                    }

                    t.r = 4;
                }
                else {
                    H.logError("Null document element");
                }

                if (D.TF(t.o.clh)) {
                    t.o.clh("onconfigload", this);
                }

            };

            H.IM(n, "base_object", "config_utility", "3.5.1");
            H.registry.service.addObject(n);



            

            H.message.service.subscribe(n, "onloadxml", "HLX");

            if (D.TS(h) && D.TF(window[h])) {
                h = window[h];
            }

            if (D.TS(s)) {
                if (!a) a = 0;
                n.load(s, h, a);
            }

            else if (D.TO(s) && s != null) {
                n._parse_config(s);
            }

            else if (D.TU(s)) {
                
            }

            return n;

        }
    });
} ());


(function(){
 H.namespace("text",H,{
  trim : function(s){
   if(typeof s != "string") return "";
   s = s.replace(/^\s*/gi,"");
   s = s.replace(/\s*$/gi,"");
   return s;
  },
   pad : function(v,l){
      var s = "" + v, a=[],i;
      var a = [];
      for(i = s.length; i < l;i++) a.push("0");
      a.push(s);
      return a.join("");
  }
 })
}());






(function(){
 H.namespace("util.thread", H, {
  newInstance:
function(o){

   
   
   if(!H.registry.service.isRegistered(o)){
    H.message.service.S("Object must be registered to use a thread.","200.4",1);
    return 0;
   }

   var n = H.FN("base_object","thread","3.5.1");
   


   
   
   
   n.p = {
    r:"handle_thread_run",
    s:"handle_thread_start",
    t:"handle_thread_stop",
    d:1000,

    
    u:0,
    i:0,
    m:0,

    
    z:o.i,

    
    y:0
   };
    
   n.o = {
    o:o
   };
  
   

   n.restart = function(){
    if(!this.stop(1) || !this.run(this.p.u, 1)) return 0;
    return 1;
   };

   n.getLastInterval = function(){
    return this.p.u;
   };

   n.run = function(d,b){
    var t = this, _s;
    _s = t.p;
    if(!t.getIsRunnable() || _s.i) return 0;
    
    if(!D.TN(d) || d < 0) d = _s.d;
    _s.u = d;
    
    
    _s.m = 1;
    
    if(!b && D.TF(t.o.o[_s.s])) t.o.o[_s.s](t);
    
    _s.i = window.setInterval("H.registry.service.getObject('" + t.i + "').R()",d);
    return 1;
   };
  
   n.R = function(){
    var t = this, _s, _p;
    _s = t.p;
    _p = t.o;

    
    if(!_s.i || _s.y) return 0;
    
    if(D.TO(_p.o) && _p.o.r > 4){
        
     if(!t.stop())
      _s.y = 1;
     
     return 0;
    }
    
    try{
     _p.o[_s.r](t);
     if(_s.m == 2){
      _s.i = 0;
      _s.m = 0
     }
    }
    catch(e){
     
     if(_s.m == 1)
      window.clearInterval(_s.i);
     
     _s.i = 0;
    }
    
    return 1;
   };

   n.allStop = function(){
    this.p.y = 1;
    this.stop();
   };

   n.stop = function(b){
    var t = this, _s;

    _s = t.p;
    if(!_s.i) return 0;
    
    if(_s.m == 2){
     window.clearTimeout(_s.i);
    }
    else if(_s.m == 1){
     window.clearInterval(_s.i);
    }
    else{
     
     return 0;
    }

    if(!b && D.TF(t.o.o[_s.t])) t.o.o[_s.t](t);
    
    _s.m = 0;
    _s.i = 0;
    return 1;
   };

   n.getIsRunning = function(){
    if(this.p.i) return 1;
    return 0;
   };

   n.getIsRunnable = function(){
    var o = this.o.o;
    if(
     D.TO(o)
     &&
     typeof D.TF(o[this.p.r])
    ) return 1;
    
    return 0;
  
   };

   n.destroy = function(){
    var t = this;
    
    if(t.r < 5){

     t.stop();
     t.r = 5;

     H.message.service.unsubscribe(t,"onremoveobject","H");

     
     H.registry.service.removeObject(t);

    }
   };

   n.H = function(s,i){

    if(i == this.p.z){
     this.destroy();
    }
   };
   

   H.registry.service.addObject(n);
   H.message.service.subscribe(n,"onremoveobject","H");
   
   o = 0;
   
   return n;
  }
 });
}());





(function(){
 H.namespace("wires.primitive",H,{
  service:null,
  serviceImpl:
function(){


   
   
   

   var t = this;
   t.o = {
    
    w:[]
   };
   t.p = {
    
    c:0
   };
   
   t.getWires = function(){
    return this.o.w;
   };
   
   t.sigterm = function(){
    if(this.r != 5){
     var _p = this.o;
     _p.w = [];
     this.r =5;
    }  
   };
   
   t.invoke=function(i,args,b,z,p,o,m){
    
    var h,a,d,r=0;
    h = t.o.w[i];

    if(!D.TO(args)) args = [];


    if(D.TO(h)){

     a = (D.TO(h.ap) && D.TS(h.a))?1:0;
 
     if(
      (
       o
       ||
       (!h.i && (r = ( a ? h.ap[h.a].apply(h.ap,args) : h.a.apply(window,args) )) )
      )
      ||
      b
     ){
      if(!m) h.i = 1;
      if(z) return r;

      a = (D.TO(h.hp) && D.TS(h.h))?1:0;
      if(!h.r){
       
       if(a){
        if(D.TF(h.hp[h.h])) h.hp[h.h].apply(h.hp,args);
       }
       else{
        if(D.TF(h.h)) h.h.apply(window,args);
       }
       if(!m) h.r=1;

       
       if(!p) t.o.w[i] = 0;
       return r;
      }
     }
    }
    else{
     alert("hemi.wires.primitive::invoke Error = Invalid wire reference with " + i);
    }
    return 0;
   };

   t.getWire=function(i){
    var h = t.o.w[i];
    if(D.TO(h)){
     return h;
    }
    return 0;
   };
   t.fireWire=function(i){
    var h = t.o.w[i];
    if(D.TO(h)){
     
     h.i=1;
     t.invoke(i,0,1);
    }
   };
   
   
   t.wire=function(xp,x,yp,y,ep,e,tl){
    
    
    if(!D.TS(tl)) tl = "swc.ocjw.primitive";

    try{
     if(D.TS(xp)) xp = eval(xp);
     if(D.TS(yp)) yp = eval(yp);
     if(D.TS(ep)) ep = eval(ep);
    }
    catch(e){
     alert("hemi.wire.Error: " + e.toString());
     return 0;
    }

    var i = tl + "." + (++t.p.c);
    if(!xp) xp=window;
    if(!yp) yp=window;
    if(!ep) ep=window;
    t.o.w[i] = {ap:xp,a:x,hp:yp,h:y,ep:ep,e:e,i:0,r:0};
    return i;
   };

   H.IM(t,"base_object","primitive_wire","3.5.1");
   H.registry.service.addObject(t);
   t.r = 4;
  }
 }, 1);
}());






(function(){
 H.namespace("util.url", H, {
  qualifyToHost:
function(u){
   var _u = H.util.url.newInstance(document.URL,0);
   return _u.qualify(u);
  },
  newInstance:
function(v,b){



   

   


   var n = H.FN("base_object","url_composite","3.5.1");
   
   if(b) v = H.util.url.qualifyToHost(v);
   
   n.p = {
    
    ov:0,
    
    r:0,
    
    d:0,
    
    p:0,
    
    f:0,
    
    q:0,
    
    x:(b?1:0)
   };

   n.getFile=function(){
    return this.p.f;
   };

   n.getQuery=function(){
    return this.p.q;
   };

   n.getDomain=function(){
    return this.p.d;
   };

   n.getPath=function(){
    return this.p.p;
   };

   n.getProtocol=function(){
    return this.p.r;
   };
   
   n.qualify=function(u){
    
    var f = u,_s,t=this;
    _s = t.p;


    
    if(!u.match(/\/\//)){
  
     
     if(!u.match(/^\//) || u.match(/^\.\//)){
      if(u.match(/^\.\//)) u=u.substring(2,u.length);
      f = _s.r + "://" + _s.d + _s.p + u;
     }
     else{
      
      if(u.match(/^\//)){
       f = _s.r + "://" + _s.d + u;
      }
      else{
       

      }
     }
    }
  
    return f;
   };
   
   n._init = function(o){
    
    var _s,t=this,u,v,m;
    _s = t.p;
    u = _s.ov = o;

    if(u.match(/\?/)){
     i=u.indexOf("?");
     _s.q=u.substring(i+1,u.length);
     u=u.substring(0,i);
    }
    if(u.match(/\/\//)){
     i=u.indexOf("//");
     v=u.substring(0,i + 2);
     u=u.substring(i+2,u.length);
     if(v.match(/:/)){
      m=v.indexOf(":");
      _s.r=v.substring(0,m);
     }
     else{
      _s.r="http";
     }
    }
    if(!u.match(/\//)){
     if(!_s.r) _s.r="http";
     _s.d=u;
     u="";
    }

    i=u.indexOf("/");
    if(i > -1){
     _s.d=u.substring(0,i);
     u=u.substring(i,u.length);
    }
    if(!_s.r) _s.r="http";

    if(u.length){
     i=u.lastIndexOf("/");
     if(i > -1){
      v=u.substring(0,i + 1);
      _s.p=v;
      u=u.substring(i + 1,u.length);
     }
    }
    if(u.length){
     _s.f=u;
    }
    
   };

   n._init(v);
   return n;
  }
 });
}());




(function () {

 
 
 
 H.namespace("transaction", H, {
  service: null,

  addServiceAPI: function (o) {


   if (!D.TO(o) || !D.TO(o.p)) {
    H.logWarning("Object is null or does not define a.p hash");
    return 0;
   }




   if (!D.TF(o.getPacket))
    o.getPacket = function (n) {
     var _t = H.transaction.service;
     if (n) return _t.getPacketByName(n);
     else return _t.getPacket(this.p.PacketId);
    };
   if (!D.TF(o.startTransaction))
    o.startTransaction = function (s, p) {
     
     var 
      _m = H.message.service,
      t = this;

     if (typeof t._handle_begin_transaction == D.F) t._handle_begin_transaction(s, p);


     _m.S("Start transaction " + p.packet_name + " for " + t.t, "200.1");


     return 1;
    };
   if (!D.TF(o.endTransaction))
    o.endTransaction = function (s, p) {
     
     var t = this;
     if (typeof t._handle_end_transaction == D.F) t._handle_end_transaction(s, p);
     H.message.service.S("End transaction " + p.packet_name + " for " + t.t, "200.1");
     return 1;
    };
   if (!D.TF(o.doTransaction))
    o.doTransaction = function (s, p) {
     
     var t = this, q, qh, x = 0, y = 0;

     if (typeof t._handle_transaction == D.F) x = t._handle_transaction(s, p);
     q = p.data.type;
     qh = '_handle_' + q;
     if (q && typeof t[qh] == D.F) y = t[qh](s, p);
     (t.logDebug ? t : H).logDebug("Do Transaction for " + t.i + " on target " + qh);
     return y;
    };

   if (!D.TF(o.serveTransaction))
    o.serveTransaction = function (v, r, b, n) {
     
     var _t = H.transaction.service, p, t = this;
     p = t.getPacket(n);
     if (p) {
      if (p.data.type && p.data.type != v) {
       (t.logError ? t : H).logWarning("Packet type override: " + p.data.type + " -> " + v);
      }
      p.data.type = v;
      p.data.src = r;
      
      _t.serveTransaction(p, t.i, (!b));
      return 1;
     }
     return 0;
    };
   if (!D.TF(o.joinTransactionPacket))
    o.joinTransactionPacket = function (n) {
     var _t = H.transaction.service, p, t = this, i, b = 1;
     if (!n && t.p) n = t.p.TransactionName;
     if (!n) {
      H.logWarning('Invalid packet name: ' + n);
      return 0;
     }
     
     p = _t.getPacketByName(n);
     if (p) {
      i = p.packet_id;
      p.setBlockStartTransaction(false);
      b = _t.addTransactionParticipant(t, p);
     }
     else {
      i = _t.openTransaction(n, t, { type: 0, src: 0, data: 0 });
     }
     if (t.p.PacketId) {
      (t.logWarning ? t : H).logWarning("Packet identifier is being overwritten: " + t.p.PacketId + " to " + i);
     }
     t.p.PacketId = i;

     return (!b ? 0 : i);
    };
   if (!D.TF(o.removeFromTransactionPacket))
    o.removeFromTransactionPacket = function (n) {
     var _t = H.transaction.service, p, t = this, i, b = 1;
     p = this.getPacket(n);
     if (!p)
      return b;
     else
      b = _t.removeTransactionParticipant(t, p);
     return b;
    };
   return 1;
  },
  serviceImpl: function () {
   var t = this;

   t.o = {
    r: [],
    rm: []
   };
   t.p = {
    a: 0,
    c: 0,
    l: "hemi.transaction"
   };
   t.sigterm = function () {
    var t = this, _p, a, i=0;
    _p = t.o;
    if (t.r != 5) {
     _p.r = [];
     _p.rm = [];

     a = _p.packets;
     for (;i < a.length; i++){
      if(a[i]) t.closeTransaction(a[i].packet_id);
     }
     t.clearPackets();

    }
   };
   t.getRegisteredObjects = function () {
    return this.o.r;
   };

   t.getRegisteredObjectsMap = function () {
    return this.o.rm;
   };

   t.canRegister = function (o) {
    var _o = H.registry.service;
    if (

     !_o.isRegistered(o.i)
     ||

     !D.TF(o.doTransaction)
     ||
     !D.TF(o.startTransaction)
     ||
     !D.TF(o.endTransaction)

    ) {
     return 0;
    }
    return 1;
   };

   t.isRegistered = function (o) {
    var _p = t.o;
    if (
     D.TO(o) && o != null
     &&
     D.TN(_p.rm[o.i])
     &&
     _p.r[_p.rm[o.i]]
    ) {
     return 1;
    }
    return 0;
   };

   t.register = function (o, b) {
    
    var _p = t.o, _m = H.message.service;
    if (t.isRegistered(o)) {
     _m.S("Object " + o.t + " is already registered with transaction service", "511.4");
     return 0;
    }
    if (b) H.transaction.addServiceAPI(o);
    if (
     !t.canRegister(o)
     ||
     o.t == "transaction_service"
    ) {
     _m.S("Unable to register object " + o.t + " with transaction service", "511.4");
     return 0;
    }
    _p.rm[o.i] = _p.r.length;
    _p.r[_p.r.length] = o.i;


    return 1;
   };

   t.unregister = function (o) {
    var _p = t.o, _m = H.message.service;
    if (!t.isRegistered(o))
     return 0;

    t.removeTransactionParticipants(o);

    _p.r[_p.rm[o.i]] = 0;
    delete _p.rm[o.i];


    return 1;
   };

   t.removeTransactionParticipants = function (o) {

    p = t.o.packets, i = 0;
    for (; i < p.length; ) t.removeTransactionParticipant(o, p);

   };

   t.addTransactionParticipant = function (o, p) {

    var _m = H.message.service;
    if (

     t.isRegistered(o)
     &&

     t.isPacket(p)
     &&

     !p.participants[o.i]
    ) {
     p.participants[o.i] = 1;
     p.participant_count++;

     if (!p.bst) o.startTransaction(t, p);

     return 1;
    }
    return 0;
   };

   t.removeTransactionParticipant = function (o, p) {

    var _m = H.message.service;

    if (

     t.isRegistered(o)
     &&

     t.isPacket(p)
     &&

     p.participants[o.i]
    ) {
     delete p.participants[o.i];
     p.participant_count--;

     return 1;
    }
    return 0;
   };

   t.serveTransaction = function (p, x, b) {

    var _m = H.message.service,
     _o = H.registry.service,
     o, a, i, d, r
    ;

    if (t.isPacket(p)) {

     if (!p.is_open || !p.participant_count) return 0;

     if (D.TU(x)) x = p.owner_id;
     a = p.participants;

     if (
      x
      &&
      _o.isRegistered(x)
      &&
      !b
      &&
      (
       (p.serve_type == 1 && a[x] != 2)
       ||
       (p.serve_type == 2 && !a[x])
      )
     ) {

      o = _o.getObject(x);
      if (t.isRegistered(o) && a[o.i]) {
       r = (o.doTransaction(t, p) ? 1 : 0);
       if (r && p.serve_type == 1) a[x] = 2;
      }
     }
     if (!x || !p.btt) {
      for (i in a) {
       d = a[i];

       if (
        d
        &&
        (
         (p.serve_type == 1 && d != 2)
         ||
         (p.serve_type == 2 && !d)
        )
        &&
        _o.isRegistered(i)
        &&
        i != x
       ) {
        o = _o.getObject(i);
        if (t.isRegistered(o)) {
         r = (o.doTransaction(t, p) ? 1 : 0);
         if (r && p.serve_type == 1) a[i] = 2;
        }
        
       }
       
      }
     }
     
     r = 1;


     for (i in a) {
      if (
       (p.serve_type == 1 && a[i] != 2)
       ||
       (p.serve_type == 2 && !a[i])
      ) {
       r = 0;
       break;
      }
     }
     if (r) t.XT(p);

     return 1;
    }
    else {
     _m.S("Invalid transaction packet.", "511.4");
    }
    return 0;
   };

   t.XT = function (p) {
    var _m = H.message.service,
     _o = H.registry.service,
     a, i, o
    ;
    if (t.isPacket(p)) {
     if (p.is_open) {
      a = p.participants;
      p.is_open = 0;
      if (
       p.owner_id
       &&
       _o.isRegistered(p.owner_id)
      ) {
       o = _o.getObject(p.owner_id);
       o.endTransaction(t, p);
      }
      if (!p.owner_id || !p.bet) {
       for (i in a) {
        if (p.owner_id != i) {
         o = _o.getObject(i);
         if (o != null) {
          o.endTransaction(t, p);
         }
         else {
          _m.S("Null object reference " + i, "540.4");
         }
        }

        a[i] = 0;

       }
      }

      p.sp = H.util.getDate();
      p.is_finalized = 1;

      if (D.TF(p.handler))
       p.handler(t, p);


     }
     else {
      _m.S("Transaction packet is not open.", "200.4");
     }



    }
    else {
     _m.S("Invalid transaction packet.", "200.4");
    }

   };

   t.ST = function (p, o) {

    var n, a = t.o.r, c;

    if (D.TO(p)) {

     o.bst = 1;
     v =
      o.participants[p.i] =
       (p.startTransaction(t, o) ? 1 : 0);

     o.participant_count += v;

    }

    if (o.participant_count) {
     o.st = H.util.getDate();
     o.is_open = 1;
     return 1;

    }

    return 0;

   };

   t.closeTransaction = function (i) {

    var _p = t.o, o, _m = H.message.service;
    o = t.getPacket(i);
    if (t.isPacket(o)) {
     t.removePacket(o);
    }
    else {
     _m.S("Invalid packet id " + i, "200.4");
    }
   };

   t.newTransactionPacket = function (i, n, o, v, f) {
    var p = {
     service_id: t.i,
     packet_id: i,
     packet_name: n,
     participants: [],
     participant_count: 0,
     packet_state: 0,

     bst: 0,
     btt: 0,
     bet: 0,

     serve_type: 1,
     setBlockStartTransaction: function (b) { this.bst = (b ? 1 : 0); },
     setBlockServeTransaction: function (b) { this.btt = (b ? 1 : 0); },
     setBlockEndTransaction: function (b) { this.bet = (b ? 1 : 0); },
     setServeType: function (i) { this.btt = (!isNaN(i) ? i : 0); },

     st: 0,

     sp: 0,

     is_open: 0,
     is_finalized: 0,
     errors: 0,
     owner_id: o,
     data: v,
     handler: f
    };
    H.prepareObject("transaction_packet", "3.5.1", 1, p);
    return p;
   };

   t.openTransaction = function (n, p, d, f) {

    var i,
     o,
     c,
     _p = t.o,
     _s = t.p,
     _m = H.message.service
    ;


    i = _s.l + ":" + (++_s.c);

    if (D.TU(n)) n = i;
    if (D.TU(d)) d = 0;
    if (D.TU(f)) f = 0;

    if (D.TO(p)) {
     if (!t.isRegistered(p)) {
      _m.S("Invalid transaction owner.", "200.4");
      return 0;
     }
    }
    else
     p = 0;



    if (
     D.TO(t.getPacketByName(n))
     &&
     t.getPacketByName(n).is_open
    ) {
     _m.S("Transaction " + n + " is already open.", "200.4");
     return 0;
    }

    o = t.newTransactionPacket(i, n, p.i, d, f);

    t.addNewPacket(o, n, i);

    if (t.ST(p, o)) {

     if (_s.a) t.serveTransaction(o);
    }

    else
     _m.S("Transaction " + n + " was not opened.", "200.4");


    return i;

   };
   H.object.addObjectAccessor(t, "packet");
   H.prepareObject("transaction_service", "3.5.1", 1, t);
   H.util.logger.addLogger(t, "Transaction Service", "Transaction Service", "500");
   t.r = 4;
  }
 }, 1);
} ());



(function(){
 
 H.namespace("driver",H,{
  service:null,
  serviceImpl:
function(){
   var t = this,_x = H.xml,_m = H.message.service;
   
   t.p = {
    l:0,

    
    wl:0,
    
    wu:0,
    gc:0
   };
   t.o = {
    application_config:0
   };
   t._terminate = function(){
    _m.setDeliveryDelay(0);
    _m.publish("destroy",window);
   };
   
   t.getConfig = function(){
    return t.o.a;
   };
   
   t.setConfig = function(o,b){
    

    t.p.l = 1;
    t.o.a = o;
    if(b) _m.publish("application_config_loaded",o);
   };

   t._handle_window_unload = function(){

    this.destroy();
   };
   
   
   t.sigterm = function(){
    this.destroy(1);
   };

   t.destroy = function(b){
    var t = this;
    if(!t.p.wu){
     t.p.wu = 1;
     t.o.a = 0;
     if(!b) H.registry.service.sendSigterm();

     this._terminate();

     t.r = 5;

     H.event.removeEventListener(window,"unbeforeload",t._prehandle_window_unload);
     H.event.removeEventListener(window,"unload",t._prehandle_window_unload);
     H.event.removeEventListener(window,"load",t._prehandle_window_load);

    }
   };


   t._handle_window_load=function(){
    t.p.wl=1;
    _m.publish("dom_event_window_load",this);
   };

   

   H.event.addScopeBuffer(t);

   H.IM(t,"base_object","driver_utility","3.5.1");
   H.registry.service.addObject(t);

   t.scopeHandler("window_load",0,0,1);
   t.scopeHandler("window_unload",0,0,1);

   H.event.addEventListener(window,"unbeforeload",t._prehandle_window_unload);
   H.event.addEventListener(window,"unload",t._prehandle_window_unload);
   H.event.addEventListener(window,"load",t._prehandle_window_load);
   
   t.r = 4;

  }

 },1);

}());

(function () {
 
 
 H.namespace("app.module", H, {

  service: null,

  serviceImpl: function () {
   var t = this;
   H.prepareObject("module_service", "3.5.1", 0, t);

   H.util.logger.addLogger(t, "Module Service", "Application Module Service", "620");
   H.object.addObjectAccessor(t, "module");

   t.NewModule = function (n, x, p, d, b, q) {
    var m = this.LoadModule(n, p, d, b, q), v;
    if (!m) return null;
    var v = new m.impl();
    if (x) {
     v.Container = x;
     if (D.TF(x.getObjectType) && x.getObjectType().match(/xhtml_component/)) {
      v.Container = x.getContainer();
      v.Component = x;
     }
    }
    if (D.TF(v.Initialize)) v.Initialize();
    return v;
   };
   t.UnloadModuleImplementations = function (v) {
    var o = t.getModuleByName(v), i = 0, m;
    if (!o) return 0;
    for (var i = 0; i < o.Impls.length; i++) {
     if (!o.Impls[i]) continue;
     m = H.registry.service.getObject(o.Impls[i]);
     if (m)
      m.destroy();
    }
    o.Impls = [];
    return 1;
   };
   t.UnloadModule = function (v) {
    var o = t.getModuleByName(v), b = 0, i, m;
    if (!o) return b;
    t.UnloadModuleImplementations(v);
    H.dereference(v);
    
    return t.removeModule(o);
   };
   t.LoadModule = function (n, p, d, b, q) {
    var m = this.getModuleByName(n), o, s = "", r, x;
    if (m)
     return m;
    if (b) x = p;
    else {
     o = H.include(n, (p ? p : "Modules/"), 1);
     if (!o || !o.raw) {
      H.logError("Failed to load module: " + n);
      return 0;
     }
     x = o.raw;
    }

    if (d && D.TF(d.DecorateModuleContent))
     s = d.DecorateModuleContent(n, p, x);

    r = "(function(){" + (d && d.DecorateModuleHeader ? d.DecorateModuleHeader(n, p, x) : "") + "\nH.app.module.service.Register(\"" + n + "\",{ impl : func" + "tion(){"
    + (s ? s + "\n" : "")
    + x
    + "\nthis.Component = null;"
    + "this.Container = null;"
                + "var Module = null;"
                + "this.name = \"" + n + "\";"
                + "this.object_prepare = function(){ Module = this; H.app.module.service.AddImpl(\"" + n + "\",this.i);};"
                + "this.object_destroy = function(){if(D.TF(this.Unload)){this.Unload();}};"
                + "H.prepareObject(\"" + (q ? q : "module") + "\",\"3.5.1\",1,this,1);"
                + "this.r = 4;"
    + "},"
                + "Impls : [],"
                + "name : \"" + n + "\""
                + "});}());";

    r = r.replace(/^\s+/, "").replace(/\s+$/, "");
    
    try {
     eval(r);
    }
    catch (e) {
     H.logError("Error loading module '" + n + "'\n\n" + (e.message ? e.message : e.description));
     return 0;
    }

    m = this.getModuleByName(n);
    if (!m) {
     H.logError("Module could not be retrieved");
     return 0;
    }
    return m;

   };
   t.Register = function (n, c) {
    this.addNewModule(c, n);
   };
   t.AddImpl = function (n, i) {
    var o = t.getModuleByName(n);
    if (o) o.Impls[o.Impls.length] = i;

   };
   H.registry.service.addObject(t);
   t.r = 4;
  }
 }, 1);
} ());



(function () {

    
    
    
    H.namespace("task", H, {
        service: null,
        serviceImpl: function () {
            var t = this,
   _x = H.xml,
   _m = H.message.service,
   _t = H.transaction.service
  ;

            t.o = {
                rd: []
            };
            t.p = {
                etn: 0,
                etl: 0,
                wl: 0,
                til: "task_trans_",
                sd: 0
            };
            t.data = {
                a: 0,
                b: 1,
                c: 2,
                d: 3,
                e: 4,
                f: 5,

                g: 99,

                h: "xml",
                i: "task",
                j: "import-task",
                k: D.F,
                l: "event",
                m: "script",
                TASK_EXEC_COMPONENT: "component",

                n: ""
            };

            t.newTaskObject = function (n, at, a, ht, h, k, i, r, p) {
                var o = {
                    service_id: t.i,
                    task_state: 0,
                    handled: 0,
                    task_name: n,
                    action_type: at,
                    action: a,
                    handler_type: ht,
                    handler: h,
                    task_id: k,
                    index: i,
                    transaction_id: r,
                    processor: p,
                    data: 0,
                    depends: [],
                    executed: 0,
                    busy: 0,
                    ad: 0,
                    parent_id: 0,
                    parameters: [],
                    module: 0,
                    moduleName: 0,
                    component: 0,
                    setAutoDestroy: function (b) { this.ad = (b ? 1 : 0); }


                };
                H.prepareObject("task_object", "3.5.1", 1, o);
                return o;
            };

            t.endTask = function (i, b) {
                var o;
                if (D.TS(i)) o = t.getTask(i);
                else if (D.TO(i)) o = i;
                if (!t.isTask(o)) return 0;
                for (var d = 0; d < o.depends.length; d++) {
                    t.returnDependency(o.depends[d]);
                    if (b) delete t.o.rd[o.depends[d]];
                }
                t.clearTask(i);
            };

            t.clearTask = function (i) {
                var _p = t.o, o, l;
                if (D.TS(i)) o = t.getTask(i);
                else if (D.TO(i)) o = i;
                if (t.isTask(o)) {

                    if (o.task_state < t.data.f) {

                        o.setAutoDestroy(1);
                        return 1;
                    }
                    if (o.module) {
                        o.module = 0;
                        Hemi.app.module.service.UnloadModule(o.moduleName);
                    }
                    if (o.component) {
                        if (D.TF(o.component.destroy)) o.component.destroy();
                        o.component = 0;
                    }

                    t.removeTask(o);

                    _t.closeTransaction(o.transaction_id);

                    return 1;
                }
                else {
                    _m.S("Invalid task id " + i, "200.4", 1);
                }
                return 0;
            };

            t.clearAllTasks = function () {
                var _p = t.o, _s = t.p, a, i, o;
                a = _p.tasks;
                t.clearTasks();
                _p.rd = [];
                _s.etn = 0;
                _s.etl = 0;



                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    if (!o) continue;
                    _t.closeTransaction(o.transaction_id);
                }

                if (_s.wl) {
                    t.returnDependency("dom_event_window_load");
                }

            };

            t.destroy = function () {
                var t = this;
                if (t.r != 5) {
                    t.r = 5;
                    H.message.service.unsubscribe(t, "dom_event_window_load", "_handle_window_load");
                    H.message.service.unsubscribe(t, "destroy", "HWD", window);
                    t.clearAllTasks();
                    t.o.rd = [];
                    H.registry.service.removeObject(this);
                }
            };

            t.sigterm = function () {
                this.destroy();
            };
            t.HWD = function (s, v) {
                this.destroy();
            };

            t.isExternalLoaded = function () {
                return t.p.etl;
            };

            t.addTaskDependency = function (o, d) {

                if (t.isTask(o) && !t.o.rd[d]) {
                    o.depends[o.depends.length] = d;

                    return 1;
                }
                return 0;

            };

            t.getTaskDepends = function (o) {
                var h, m, r = [];

                if (!t.isTask(o)) return r;

                if (!o.depends.length) return r;
                for (h = 0; h < o.depends.length; h++)
                    r[h] = o.depends[h];
                return r;
            };

            t.returnDependency = function (v) {

                var o, _p = t.o;

                if (D.TO(v) && t.isTask(v)) {
                    o = v;
                    v = v.task_name;
                }
                else {
                    o = t.getTaskByName(v);
                }


                if (
        t.isTask(o)
        &&
        o.task_state < t.data.e
       ) {

                    o.task_state = t.data.e;
                }
                if (!_p.rd[v]) {
                    _p.rd[v] = 1;

                    t.UT(v);
                }

                return 1;
            };

            t.clearDependency = function (v) {

                var o, _p = t.o;

                if (t.isTask(v)) {
                    o = v;
                    v = v.task_name;
                }
                else {
                    o = t.getTaskByName(v);
                }
                if (_p.rd[v]) {
                    
                    delete _p.rd[v];

                    t.UT(v);
                }
                return 1;
            };

            t.UT = function (s) {
                var a, o, i, h, m, _d = t.data;
                a = t.o.tasks;

                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    if (
     !D.TO(o)
     ||
     o.task_state == _d.f


    ) {
                        continue;
                    }
                    m = 0;
                    for (h = 0; h < o.depends.length; h++) {
                        if (o.depends[h] == s) {
                            o.depends[h] = 0;
                        }
                        else if (o.depends[h] != 0) {
                            m = 1;
                        }
                    }
                    if (!m) {
                        o.depends = [];
                        t.serveTaskTransaction(o);
                    }
                }
            };

            t.HP = function (s, o, n, v) {
                var r = v, f = "replace", q = H.registry.getEvalStatement(s);
                r = r[f](/\$\{task\}/g, q + ".getTaskByName('" + n + "')");
                r = r[f](/\$\{task\.name\}/g, n);
                r = r[f](/\$\{taskservice}/g, q);
                r = r[f](/\$\{taskservice\.id}/g, s.i);

                return r;
            };

            t.isTaskComplete = function (o) {
                if (
    t.isTask(o)
    &&
    o.task_state == t.data.f
   ) {
                    return 1;
                }
                return 0;
            };

            t.serveTaskTransaction = function (o) {
                var t = this;
                if (t.isTask(o) && t.p.sd) {
                    setTimeout("Hemi.registry.service.getObject('" + t.i + "').ST('" + o.task_id + "')", t.p.sd);
                }
                else {
                    t.ST(o);
                }
            };
            t.ST = function (o) {
                if (D.TS(o)) o = t.getTask(o);
                if (t.isTask(o)) {
                    var z = _t.getPacket(o.transaction_id), _d = t.data;
                    if (z) {

                        _t.serveTransaction(z, t.i);
                        return 1;
                    }
                    else {
                        _m.S("Task could not be executed as a transaction.", "200.4");
                        return 0;
                    }
                }
                else {
                    _m.S("Tasks: object is not a task.  Auto-Destroyed tasks may also cause this message.", "511.4");
                }
            };

            t.executeTaskHandler = function (o) {
                var _d = t.data, b = 0;
                if (t.isTask(o)) {
                    if (o.task_state == _d.c && o.executed && !o.handled) {
                        o.task_state = _d.d;


                        t.serveTaskTransaction(o);
                        b = 1;
                    }
                    else {
                        _m.S("Task handler " + o.task_name + " (" + o.task_state + " / " + o.executed + " / " + o.handled + ") cannot be served at this time.", "511.4");
                    }
                }
                else {
                    _m.S("Task object handler cannot be executed.", "511.4");
                }
                return b;
            };

            t.executeTaskHandlerByName = function (n) {
                return t.executeTaskHandler(t.getTaskByName(n));
            };

            t.executeTaskByName = function (n) {
                return t.executeTask(t.getTaskByName(n));
            };

            t.executeTask = function (o) {

                var _d = t.data, b = 0;

                if (t.isTask(o)) {
                    if (o.task_state != _d.b) {
                        _m.S("executeTask: Task is not initialized.", "511.4");
                        return b;
                    }
                    o.task_state = _d.c;
                    t.serveTaskTransaction(o);
                    b = 1;

                }
                else {
                    _m.S("executeTask: Task object '" + (D.TO(o) ? o.task_name : o) + "' does not exist.", "511.4");
                }
                return b;
            };

            t.importTaskFromXml = function (n, p, d, b) {

                var r, i, a, at, h, ht, z, x, pi, v;

                if (
    !D.TO(d)
   ) {
                    if (p && p.action_type.match(/xml/) && D.TO(p.data)) {
                        d = p.data;
                        pi = p.task_id;
                    }
                    else if (t.p.etl) {
                        z = t.getTaskByName(t.p.etn);
                        if (z) d = z.data;
                    }
                }

                if (!pi && p) pi = (p.parent_id ? p.parent_id : p.task_id);

                if (!D.TO(d) || d == null) {

                    return 0;
                }

                if (D.TS(n)) {
                    z = _x.queryNode(d.documentElement, "task", 0, "id", n);
                    if (D.TO(z) && z != null)
                        return t.importTaskFromXml(z, p, d, b);

                    else
                        _m.S("Task '" + n + "' does not exist", "200.4");

                }
                if (
     D.TO(n)
     && n != null
     && D.TO(d)
     && d != null
    ) {
                    r = H.GetSpecifiedAttribute(n, "rid");
                    i = H.GetSpecifiedAttribute(n, "id");
                    if (r) {
                        z = _x.queryNode(d.documentElement, "task", 0, "id", r);
                        if (D.TO(z) && z != null) {

                            if (n.getAttribute("auto-execute") == "1") b = 1;
                            t.importTaskFromXml(z, p, 0, b);
                            return 1;
                        }
                        else {
                            _m.S("Task id " + r + " does not exist", "200.4");
                        }
                    }
                    else if (i) {
                        a = t.HP(t, p, i, n.getAttribute("action"));
                        at = t.HP(t, p, i, n.getAttribute("action-type"));
                        h = t.HP(t, p, i, n.getAttribute("handler"));
                        ht = t.HP(t, p, i, n.getAttribute("handler-type"));

                        if (D.TO(p)) {
                            if (D.TF(p.processor)) {
                                a = p.processor(t, p, n, a);
                                at = p.processor(t, p, n, at);
                                h = p.processor(t, p, n, h);
                                ht = p.processor(t, p, n, ht);
                            }
                            t.addTaskDependency(p, i);
                        }

                        r = t.addTask(i, at, a, ht, h, (p ? p.processor : 0));
                        z = n.getElementsByTagName("param");
                        for (x = 0; x < z.length; x++) {
                            a = t.HP(t, p, i, _x.getCDATAValue(z[x]));
                            if (z[x].getAttribute("eval") == "1") {
                                eval("a = (" + a + ")");
                            }
                            else if (D.TO(p) && D.TF(p.processor))
                                a = p.processor(t, r, z[x], a);
                            r.parameters.push(a);
                        }




                        if (!t.isTask(r)) return 0;
                        if (pi) r.parent_id = pi;

                        z = n.getElementsByTagName("task");

                        for (x = 0; x < z.length; x++)
                            t.importTaskFromXml(z[x], r);


                        z = n.getElementsByTagName("depends");
                        for (x = 0; x < z.length; x++) {
                            if (H.IsAttributeSet(z[x], "rid")) {
                                t.addTaskDependency(p, z[x].getAttribute("rid"));
                            }
                        }

                        if (b) {

                            t.executeTask(r);
                        }

                        return 1;

                    }
                    else {
                        _m.S("Task does not define an id or reference-id", "200.4");
                    }
                }
                return 0;
            };

            t.executeTaskLoader = function (n, at, a, ht, h, f) {
                var i = t.addTaskLoader(n, at, a, ht, h, f);
                t.executeTask(i);
            };

            t.addTaskLoader = function (n, at, a, ht, h, f) {
                t.p.etl = 0;
                t.p.etn = n;
                return t.addTask(n, at, a, ht, h, f);
            };

            t.addTask = function (n, at, a, ht, h, f) {

                var v, i, l;

                i = t.p.til + (++H.driver.service.p.gc);
                if (t.isTask(n)) {

                    return 0;
                }

                l = t.o.tasks.length;
                if (!D.TS(h) && !D.TF(h)) h = 0;
                if (!h) ht = 0;
                v = t.newTaskObject(n, at, a, ht, h, i, l, 0, f);

                t.addNewTask(v, n, i);

                v.transaction_id = _t.openTransaction(i, t, { id: i, name: n });
                return v;
            };

            t.doTransaction = function (s, p) {

                var v, _d = t.data, _s = t.p;
                v = t.getTask(p.data.id);
                if (v) {
                    _m.S("Processing " + v.task_name + ": D/S/E=" + v.depends.length + "/" + v.task_state + "/" + v.executed, "511.1");
                    switch (v.task_state) {
                        case _d.b:

                            break;
                        case _d.c:
                            if (!v.executed) {
                                v.executed = 1;

                                t.EA(v, 0);
                            }
                            break;
                        case _d.d:
                            if (!v.handled) {
                                if (v.task_name == _s.etn) {
                                    _s.etl = 1;
                                }
                                if (!v.depends.length) {
                                    v.handled = 1;

                                    t.EA(v, 1);
                                }
                                else {

                                }
                            }
                            break;
                        case _d.e:

                            if (!v.depends.length) {
                                v.task_state = _d.f;
                                t.serveTaskTransaction(v);
                            }
                            break;
                        case _d.f:
                            if (
       !v.depends.length
       &&
       v.executed
       &&
       v.handled
      ) {
                                _m.S("Return " + v.task_name, "200.1");
                                t.returnDependency(v.task_name);
                            }
                            else {
                                _m.S("Task " + v.task_name + " was completed without an action, handler, or with dependencies", "200.4");
                            }

                            return 1;
                            break;
                        case _d.g:
                            return 1;
                            break;
                        default:
                            _m.S("Task " + v.task_name + " in state " + v.task_state + " will not be handled.", "200.4");
                            break;
                    }
                }
                else {
                    _m.S("Invalid task reference for " + p.data.id, "200.4");
                }
                return 0;
            };

            t.EA = function (o, z) {


                var x, y, _d = t.data, _s = t.p, d, n, z, r, i, v;
                x = (z ? o.handler : o.action);
                y = (z ? o.handler_type : o.action_type);
                _m.S("Executing task " + o.task_name + " " + y + " " + x, "511.1");
                if (t.isTask(o)) {
                    switch (y) {
                        case _d.l:
                            t.advance(o, 1);
                            _m.publish(x, { service: t, task: o });
                            t.serveTaskTransaction(o);
                            break;
                        case _d.h:
                            _x.getXml(x, t.HLX, 1, o.task_id);
                            break;
                        case _d.i:
                            r = t.executeTaskByName(x);
                            
                            t.advance(o, r);
                            t.serveTaskTransaction(o);

                            break;
                        case _d.j:

                            t.importTaskFromXml(x, o);

                            t.advance(o, 1);
                            t.executeTaskByName(x);
                            t.serveTaskTransaction(o);



                            break;
                        case _d.m:


                            try {
                                if (x == "#cdata") {
                                    v = (o.parent_id ? t.getTask(o.parent_id) : 0);
                                    if (!v || !t.isTask(v)) v = (_s.etl ? t.getTaskByName(_s.etn) : 0);
                                    if (v) {
                                        d = v.data;
                                        z = _x.queryNode(d.documentElement, "task", 0, "id", o.task_name);
                                        if (D.TO(z) && z != null) {
                                            n = _x.getCDATAValue(z);
                                        }
                                        else {
                                            _m.S("Null task id pointer", "200.4");
                                            return;
                                        }
                                    }
                                    else {
                                        _m.S("Cannot execute #cdata task action without xml document", "200.4");
                                        return;
                                    }

                                }
                                else {
                                    n = x;
                                }
                                if (n) {
                                    n = t.HP(t, v, o.task_name, n);
                                    if (o.processor) n = o.processor(o, v, z, n);
                                    
                                    o.moduleName = o.task_id + "-script";
                                    d = H.app.module.service.NewModule(o.moduleName, 0, n, this, 1, "task_module");
                                    o.module = d;
                                    r = d._exec(o);
                                    t.advance(o, r);

                                    t.serveTaskTransaction(o);
                                }
                                else {
                                    _m.S("Invalid script value '" + n + "'", "200.4");
                                }

                            }
                            catch (e) {
                                _m.S("Error executing script action: " + (e.description ? e.description : e.message), "200.4");
                            }


                            break;
                        case _d.TASK_EXEC_COMPONENT:
                        case _d.k:

                            try {
                                if (D.TS(x)) z = eval(x);
                                else z = x;
                                if (D.TF(z))
                                    r = z.apply(o, (o.parameters.length ? o.parameters : [o.task_name, t]));
                                else r = 1;
                                if (y == _d.TASK_EXEC_COMPONENT) {
                                    o.component = r;
                                    r = 1;
                                }
                                t.advance(o, r);
                                t.serveTaskTransaction(o);

                            }
                            catch (e) {
                                _m.S("Error executing function action: " + (e.description ? e.description : e.message), "200.4");
                            }

                            break;
                        default:
                            t.advance(o, 1);
                            t.serveTaskTransaction(o);
                            break;
                    }
                }
                else {
                    _m.S("Invalid task reference", "200.4");
                }
            };
            t.advance = function (o, b, s) {
                _d = this.data;
                if (b) {
                    if (o.task_state == _d.d) o.task_state = _d.e;
                    if (o.task_state <= _d.c) o.task_state = _d.d;
                }
                if (s) this.serveTaskTransaction(o);
            };
            t.DecorateModuleContent = function (n, p, r) {
                return "this._exec = function(o){var b = 0;if(typeof RunTaskScript == 'function'){b = RunTaskScript(o);}return b;};";
            };
            t.startTransaction = function (s, p) {

                var v, _d = t.data;
                v = t.getTask(p.data.id);
                if (v)
                    v.task_state = _d.b;
                else
                    _m.S("Invalid task id " + p.data.id, "200.4");

                return 1;
            };

            t.endTransaction = function (s, p) {

                var v = t.getTask(p.data.id);
                if (v.ad) {
                    v.task_state = t.data.g;
                    t.clearTask(v);
                }

                return 1;
            };
            t.HLX = function (n, x) {
                var i = x.id, c = t, b, _d, a, z;
                _d = c.data;

                b = t.getTask(i);

                if (b) {
                    if (
     !D.TU(x.xdom)
    ) {
                        b.data = x.xdom;
                    }
                    else {
                        _m.S("Null XML Response", "512.5", 1);
                    }
                    b.task_state = _d.d;

                    t.serveTaskTransaction(b);
                }
                else {
                    _m.S("Invalid task identifier in xml handler", "200.4")
                }
            };

            t._handle_window_load = function () {
                t.p.wl = 1;
                t.returnDependency("dom_event_window_load");
            };

            H.prepareObject("task_service", "3.5.1", 1, t);

            H.object.addObjectAccessor(t, "task");


            _t.register(t);
            _m.subscribe(t, "dom_event_window_load", "_handle_window_load");
            _m.subscribe(t, "destroy", "HWD", window);

            t.r = 4;
        }

    }, 1);
} ());

      





(function () {
    
    H.namespace("data.form", H, {
        service: 0,
        serviceImpl: function () {









            var t = this,
    _x = H.xml,
    _m = H.message.service
   ;
            t.o = {
                fn: ["hidden", "text", "password", "textarea", "select-multiple", "select-one", "checkbox"]
            };
            t.p = {
                a: 1,
                l: "hemi.data.form"
            };

            t.isFieldNode = function (n) {
                var y = 0;
                if (D.TO(n)) {
                    y = n.type;
                    n = n.nodeName;
                }
                var b = 0;
                for (var i = 0; i < this.o.fn.length; i++) {
                    if ((y && this.o.fn[i] == y.toLowerCase()) || this.o.fn[i] == n.toLowerCase()) {
                        b = 1;
                        break;
                    }
                }
                return b;
            };
            
            t.getElements = function (fi) {
                if (D.TU(fi)) fi = t.p.l;

                var f = t.getFormByName(fi), a, r = [], c = 0, i;
                if (!f) {
                    _m.S("Invalid form reference '" + fi + "'", "200.4");


                    return 0;

                }


                a = f.getElements();
                for (i = 0; i < a.length; i++) {
                    if (a[i] && a[i].r) r[c++] = a[i];
                }

                return r;
            };

            t.resetAll = function () {
                this.clearForms();
            };

            t.resetDataForm = function (fi, q) {
                
                return t.clearDataForm(fi, 1, q);
            };

            t.clearDataForm = function (fi, b, q) {
                
                var _p = t.o, f, o, i, a, y, z;

                
                if (D.TU(fi)) fi = t.p.l;

                f = t.getFormByName(fi);
                if (!f) {
                    _m.S("Invalid form reference '" + fi + "'", "200.4");


                    return 0;

                }


                a = f.getElements();
                for (i = 0; i < a.length; i++) {
                    o = a[i];
                    
                    if (o.e && b) {
                        z = H.registry.service.getObject(o.i);
                        if (z)
                            t.synchronizeComponent(z, 1, 0, q);

                    }
                    
                    else if (o.e) {
                        switch (o.t) {
                            case "hidden":
                            case "text":
                            case "password":

                            case "textarea":
                                o.e.value = "";
                                break;
                            case "select-multiple":
                                o.e.selectedIndex = -1;
                                break;
                            case "select-one":
                                o.e.selectedIndex = -1;
                                break;
                            case "checkbox":
                                o.e.checked = false;
                                break;
                        }
                    }
                }
                return 1;
            };

            t.getElement = function (n, fi) {
                var o = t.getXElement(n, fi);
                
                if (!o || !o.r) return 0;
                return o.e;

            };

            t.getXElement = function (n, fi) {
                var _p = t.o, f;

                if (D.TU(fi == D.U)) fi = t.p.l;
                f = t.getFormByName(fi);

                if (f) return f.getElementByName(n);


                _m.S("Invalid form reference '" + fi + "' for '" + n + "'", "200.4");


                return 0;
            };


            t.getValue = function (n, fi) {
                var o = t.getXElement(n, fi), a = [], i = 0;
                if (o) {

                    
                    if (o.r) t.synchronizeComponent(H.registry.service.getObject(o.i), 0, 1);
                    if (!D.TO(o.v))
                        return o.v;

                    else if (o.v instanceof Array) {
                        for (; i < o.v.length; ) a.push(o.v[i++].value);
                        return a.join(",");
                    }
                    else
                        return o.v.value;

                }


                _m.S("Invalid element reference '" + n + "'", "200.4");


                return 0;
            };

            t.setValue = function (n, v, fi) {
                var o = t.getXElement(n, fi);
                if (o) {
                    o.v = v;
                    if (o.r) t.synchronizeComponent(H.registry.service.getObject(o.i), 1, 1);
                    return 1;
                };
                return 0;
            };

            t.synchronizeComponent = function (x, b, l, q, s) {
                
                if (!x) {
                    _m.S("Invalid Component reference", "200.4");
                    return 0;
                }

                var o, fi, f, _s = t.p, z, y, i, a, c, e, j = x.p.cid, w, v;
                
                if (!(fi = x.p.rid)) fi = _s.l;

                if (!(f = t.getFormByName(fi))) {
                    _m.S("Invalid form reference '" + fi + "' in synchronizeComponent", "200.4");
                    return 0;
                }
                c = x.getContainer();
                o = f.getElementByName(j);
                if (!o) {
                    _m.S("Object is not registered with the XHTMLFormComponent.", "200.1");
                    return;
                }


                if (o.b){
                 w = H.registry.service.getObject(o.b);
                 if(w.bind) w = w.bind;
                }
     

                
                if (b && q) o.v = o.d;

                switch (o.t) {
                    case "checkbox":
                        if (!b) {
                            if (w) w[j] = c.checked;
                            o.v = c.checked;
                        }
                        else c.checked = (w ? w[j] : o.v);
                        break;
                    case "hidden":
                    case "password":
                    case "date":
                    case "text":
                    case "textarea":
                        if (!b) {
                            o.v = c.value;
                            if (w){
                             if(w[j] instanceof Date){
                              w[j] = new Date(c.value);
                             }
                             else{

                              w[j] = c.value;
                             }
                            }
                        }

                        else{
                         if(w && (w[j] instanceof Date)){
                          c.value = (w[j].getMonth() + 1) + "/" + w[j].getDate() + "/" + w[j].getFullYear();
                         }
                         else{
                          c.value = (w ? w[j] : o.v);
                         }
                        }
                        
                        break;
                    case "select-multiple":
                        if (!b) {
                            o.v = [];
                            if (w) w[j] = [];
                            a = c.options;
                            for (i = 0; i < a.length; i++) {
                                if (a[i].selected) {
                                    v = (a[i].value ? a[i].value : a[i].text);
                                    o.v.push({ 'i': i, 'value': v, 'text': a[i].text });
                                    if (w) w[j].push(v);
                                }
                            }
                        }
                        else {
                            if (D.TO(o.v) && D.TN(o.v.length) && c.options.length >= o.v.length) {
                                a = c.options;
                                for (i = 0; i < o.v.length; i++)
                                    a[o.v[i].i].selected = 1;

                            }
                        }
                        break;
                    case "select-one":
                        if (!b) {
                            z = c.selectedIndex;
                            if (z > -1) {
                                y = c.options[z];
                                o.v = { i: z, value: (y.value ? y.value : y.text), text: y.text };
                                if (w) w[j] = o.v.value;
                            }
                        }
                        else {
                            if (D.TO(o.v) && D.TN(o.v.i) && c.options.length > o.v.i)
                                c.value = o.v.value;
                           if(w) c.value = w[j];

                        }
                        break;
                    case "wideselect":
                        if (!b) {
                            y = x.getApplicationComponent();
                            z = y.getSelectedIndex();
                            if (z > -1) {
                                o.v = { i: z, value: y.getSelectedValue(), text: y.getSelectedText() };
                            }
                            else {
                                if (D.TO(o.v) && D.TN(o.v.i) && y.getItemSize() > o.v.i) {
                                    y.selectItem(o.v.i);
                                }
                            }
                        }
                        break;

                    default:

                        _m.S("Unhandled form field type '" + o.t + "'", "200.1");

                        break;
                } 

                if (!b && !l) {
                    if (_s.a) t.validate(o.n, 0, fi);

                    o.e = 0;
                    o.i = 0;
                    o.r = 0;
                }
                else {
                    o.e = x.getContainer();
                    o.i = x.i;
                    o.r = 1;
                }


                _m.S("Synchronize " + (b ? "in" : "out") + " '" + o.n + "'", "200.1");
                Hemi.message.service.publish("onsynchronizevalue", x);

            };

            t.removeDataForm = function (v) {
                var o, _p = this.o, i = 0, e, _f;
                if (D.TO(v)) o = v;
                else if (D.TS(v)) o = t.getFormByName(v);
                if (!o) return 0;
                _f = o.o;
                this.removeForm(o);


                for (; i < _f.elements.length; ) {
                    e = _f.elements[i++];
                    if(!e) continue;
                    
                    e.v = 0;
                    e.d = 0;
                    e.e = 0;

                }

                o.clearElements();

                return 1;

            };

            t.addComponent = function (o, ri, bi) {
                
                var _p = t.o, i, v, tp = 0, e, l, p, _s = this.p, f, _f, b = 0;
                if (o && o.t && o.t.match(/xhtml_component/) && o.p.cid) {
                    if (!this.isFieldNode(o.getContainer())) {
                        _m.S("Skip non-field node '" + o.getContainer().nodeName + "'", "200.1");
                        return 0;
                    }

                    if (!D.TS(ri)) ri = _s.l;
                    if (!(f = t.getFormByName(ri))) {
                        f = {
                            i: ri,
                            x: 0,
                            n: 0
                        };

                        H.object.addObjectAccessor(f, "element");
                        l = _p.forms.length;
                        this.addNewForm(f, ri, _s.l + "-" + l);
                        f.x = l;
                        f.n = _s.l + "-" + l;

                    }

                    i = o.p.cid;
                    if (!f.getElementByName(i)) {
                        e = o.getContainer();
                        if (!(p = e.getAttribute("pattern-id"))) {
                            p = 0;
                        }
                        if (e.type) tp = e.type;
                        if (!bi) bi = H.GetSpecifiedAttribute(e, "bind");

                        l = f.o.elements.length;
                        v = {
                            t: tp,
                            
                            v: 0,
                            
                            d: 0,
                            n: i,
                            i: l,
                            i: o.i,
                            vp: p,
                            e: e,
                            vd: 0,
                            f: ri,
                            
                            r: 1,
                            b: bi, 
                            getBindingId: function () { return this.b; },
                            getType: function () { return this.t },
                            getIsRendered: function () { return this.r },
                            getName: function () { return this.n },
                            getValue: function () { return this.v },
                            getObjectId: function () { return this.i },
                            getElement: function () { return this.e },
                            getReferenceId: function () { return this.f }
                        };
                           f.addNewElement(v, i, o.i);
      
      p = 0;
      if (bi)
       p = H.registry.service.getObject(bi);

                        t.synchronizeComponent(o, (p ? 1 : 0), 1, 0, 1);

                        v.d = v.v;
                        _m.S("Add " + i + " (" + tp + ") with pattern " + p, "200.1");

                    }
                    else
                        t.synchronizeComponent(o, 1);

                    b = 1;
                }


                else {
                }

                return b;
            };

            t.validateForm = function (fi, b) {
                
                var a = t.getElements(fi), i = 0, r = 1, o;

                for (; i < a.length; i++) {
                    r = t.validate(a[i]);
                    if (!r) {
                        if (b) {
                            H.message.service.S(
        (H.lookup("hemi.data.validator") ? H.data.validator.service.getValidationErrorText(a[i].e) : "Validator not loaded"),
        "200.4",
        1
       );
                            a[i].e.focus();
                        }

                        return r;
                    }
                }
                return r;
            };
            t.validate = function (n, w, fi) {
                
                
                var _s = this.p, v, _m = H.message.service, r, o;
                if (D.TO(n)) {
                    o = n;
                    if (!D.TU(o.getAttribute)) o = t.getXElement(o.getAttribute("rid"),o.getAttribute("space-id"));
                }
                else o = t.getXElement(n, fi);
                if (!o) {
                    _m.S("Invalid XElement reference '" + n + "'", "200.4", 1);
                    return 0;
                }

                if (!o.r) {


                    _m.S("Unlinked XElement in XHTMLFormComponent for '" + n + "'.  Returning previously validated value.", "200.2");


                    return o.vd;

                }

                if ((!w && !o.vp) || !H.lookup("hemi.data.validator")) {


                    _m.S("Pattern '" + o.vp + "'/'" + w + "' not defined or validator not implemented in XHTMLFormComponent.validate", "200.1");


                    return 1;
                }

                
                if (!D.TS(w)) w = o.vp;

                v = H.data.validator.service;

                r = v.validateField(o.e, w);
                if (!r) {
                    _m.S("Validation Error: " + n + " : " + w + ":" + v.getValidationErrorText(w), "200.4");
                }


                else {
                    _m.S("Validated '" + n + "' with '" + w + "'", "200.1");
                }


                o.vd = r;
                return r;

            };

            H.IM(t, "base_object", "xhtml_form", "3.5.1");
            H.registry.service.addObject(t);
            t.r = 4;

            
            H.object.addObjectAccessor(t, "form");
            
        }
    }, 1);
} ());


(function () {
    
    H.namespace("app.space.definitions", H, {
        service: null,
        serviceImpl: function () {
            var t = this;
            H.util.logger.addLogger(t, "Space Definitions", "Application Space Definitions", "610");
            t.o = {
                d: [],
                dm: []
            };

            t.clearDefinitions = function () {
                this.o.d.length = 0;
                this.o.dm.length = 0;
            };
            t.newDefinition = function (a, n, c, p, b, s, w) {
                if (!a || a.length == 0) return null;

                var o = {
                    id: a[0],
                    match_ids: a,
                    namespace: (n != "abstract" ? n : 0),
                    is_abstract: (n == "abstract" ? 1 : 0),
                    constructor: c,
                    constructor_params: p,
                    context_switch: (b ? 1 : 0),
                    context_path: s,
                    swap_name: w,
                    use_parent: 0,
                    no_recursion: 0,
                    method_reference: 0,
                    method_reference_parameter: 0
                };
                return o;
            };
            t.addDefinition = function (a) {
                var _I = this.o.d, _M = this.o.dm, i = 0, b = 0, l;
                if (!a) {
                    t.logWarning("Invalid definition implementation");
                    return 0;
                }

                for (; i < a.match_ids.length; ) {
                    if (D.TN(_M[a.match_ids[++i]])) {
                        b = a.match_ids[i];
                        break;
                    }
                }
                if (b) {
                    t.logWarning("Duplicate definition implementation '" + b + "'");
                    return;
                }
                l = _I.length;
                _I.push(a);
                for (i = 0; i < a.match_ids.length; i++) {

                    _M[a.match_ids[i]] = l;
                }
                return a;
            };
            t.getDefinition = function (n) {
                n = n.toLowerCase();
                var _I = this.o.d, _M = this.o.dm;
                if (!n || !D.TN(_M[n])) return 0;
                return _I[_M[n]];
            };
            t.addDefinition(
    t.newDefinition(
     ["html-fragment", "template", "fragment"],
     "abstract",
     0,
     1
    )
   );

            t.addDefinition(
    t.newDefinition(
     ["import-dxml"],
     "Hemi.xml",
     "getXml",
     ["ora:src_attr", "ora:integer_0", "ora:integer_0", "ora:id_attr", "ora:integer_1"],
     1,
     "ora:context-path_attr",
     "span"
    )
   );

            t.addDefinition(
    t.newDefinition(
     ["import-xml"],
     "Hemi.xml",
     "getXml",
     ["ora:src_attr", "ora:integer_0", "ora:integer_0", "ora:id_attr", "ora:integer_1"],
     1,
     "/html-fragment",
     "span"
    )
   );
            t.addDefinition(
    t.newDefinition(
     ["import-style"],
     "Hemi.css",
     "loadStyleSheet",
     ["ora:src_attr", "ora:id_attr"]
    )
   );
            t.addDefinition(
    t.newDefinition(
     ["p", "span", "div", "body", "form", "input", "textarea", "select", "table", "tr", "td", "tbody", "thead", "th", "img", "ul", "ol", "li", "a", "iframe", "h1", "h2", "h3", "h4", "h5", "h6", "dl", "dd", "dt"],
     "hemi.object.xhtml",
     "newInstance",
     ["ora:parent_element", "ora:node_context", "ora:rid_attr", "ora:space_id", "hemi.data.form.service", "ora:integer_0", "ora:integer_0", "ora:space_config"],
     0,
     0,
     0
    )
   );
        }
    }, 1);

} ());

(function () {
    
    
    
    
    
    
    
    


    H.namespace("app.space", H, {
        service: null,


        serviceImpl: function () {
            var t = this, _m = H.message.service, _x = H.xml;
            H.util.logger.addLogger(t, "Space", "Application Space", "600");

            t.p = {
                pn: "space_loader",
                pa: "[nothing]",
                pat: "default",
                ph: "space_service_initialized",
                pht: "event",

                dn: "space",
                da: "[nothing]",
                dat: "default",
                dh: "space_initialized",
                dht: "event",

                eac: 0,
                space_id_counter: 0,
                space_id_label: "hemi.space",
                al: 1
            };

            t.o = {
                ts: new H.task.serviceImpl()
            };
            t.getPrimarySpace = function () {
                return t.getSpaceByName(t.p.pn);
            };
            t.clearAppSpace = function (i) {


                var _p = t.o, o, b, h;

                if (typeof i == D.S) o = t.getSpace(i);
                if (typeof i == D.O) o = i;

                if (t.isSpace(o)) {

                    b = o.eo;
                    for (h = b.length - 1; h >= 0; h--) {
                        H.registry.service.sendDestroyTo(b[h].object);
                    }

                    H.data.form.service.removeDataForm(o.space_id);

                    o.eo = [];
                    o.en = [];
                    o.ei = [];
                    o.space_css_map = [];

                    o.space_implementations = [];


                    if (o.space_element) {
                        _x.removeChildren(o.space_element);
                        if (o.space_element.parentNode) o.space_element.parentNode.removeChild(o.space_element);
                    }

                    this.removeSpace(o);
                }
                else {
                    _m.S("Invalid space reference '" + i + "'", "200.4");
                }
            };

            t.clearAppSpaces = function () {

                var _p = t.o, a, i, o, h, b, _t;
                a = _p.spaces;
                _t = _p.ts;

                
                for (i = a.length - 1; i >= 0; i--) {
                    t.clearAppSpace(a[i]);
                }
                this.clearSpaces();
                _t.clearTasks();

            };


            t.loadSpaces = function (b, d, pr, xr) {
                

                var _p = t.o, m = [], i, p;


                if (document.body == null) {
                    this.logError("Space unable to initialize due to unexpected DOM.");
                    return 0;
                }


                p = _x.queryNodes((d ? d : document.body), "div", null, "is-space", "1");
                H.util.absorb(p, m);
                p = _x.queryNodes((d ? d : document.body), "span", null, "is-space", "1");
                H.util.absorb(p, m);
                p = _x.queryNodes((d ? d : document.body), "form", null, "is-space", "1");
                H.util.absorb(p, m);
                this.logDebug("Loading Spaces " + (b ? 1 : 0) + " : " + m.length);
                
                if (!b && !m.length && !_p.spaces.length) {
                    m.push(document.body);
                    document.body.setAttribute("is-space", "1");
                }

                if (b) {
                    this.logDebug("Force load a primary space", "1.2");
                    m = [1];
                }

                for (i = 0; i < m.length; i++) {
                    if (!b) e = m[i];
                    t.createSpace(e, b, pr, xr);

                }
            };
            t.createSpace = function (e, b, pr, xr, fCallBack) {
                var _p = t.o, o, m = [], i, v, _s = t.p, s = "p", x, _t, a, at, h, ht, l, n, z, c, p, q, pn;

                _t = _p.ts;
                x = _t.addTaskLoader;

                c = ++_s.space_id_counter;

                if (_p.spaces.length > 0) {
                    s = "d";
                    x = _t.addTask;
                    n = _s[s + "n"] + "_" + c;
                }
                else {
                    n = _s[s + "n"];
                }

                z = _s.space_id_label + "_" + c;

                
                if (!b) {
                    if (H.IsAttributeSet(e, "space-name")) {
                        n = e.getAttribute("space-name");
                    }
                    else {
                        e.setAttribute("space-name", n);
                    }
                    if (H.IsAttributeSet(e, "space-id")) {
                        z = e.getAttribute("space-id");
                    }
                    else {
                        e.setAttribute("space-id", z);
                    }
                }

                if (t.getSpaceByName(n)) {
                    this.logDebug("Space " + n + " (" + z + ") is already loaded.", "1.3");
                    return null;
                }

                if (!b && H.IsAttributeSet(e, "space-action"))
                    a = e.getAttribute("space-action");

                else
                    a = _s[s + "a"];

                if (!b && H.IsAttributeSet(e, "space-action-type"))
                    at = e.getAttribute("space-action-type");

                else
                    at = _s[s + "at"];

                if (!b && H.IsAttributeSet(e, "space-handler"))
                    h = e.getAttribute("space-handler");

                else
                    h = _s[s + "h"];

                if (!b && H.IsAttributeSet(e, "space-handler-type"))
                    ht = e.getAttribute("space-handler-type");

                else
                    ht = _s[s + "ht"];


                if (!b && H.IsAttributeSet(e, "space-config-task"))
                    _s.pt = e.getAttribute("space-config-task");

                this.logDebug("Tasking space service: " + n + " / " + at + " / " + a + " / " + ht + " / " + h);
                o = x(
      n,
      at,
      a,
      ht,
      h
     );

                l = _p.spaces.length;

                v = t.newSpaceObject((b ? 0 : e), z, n, o, l, fCallBack);
                if (pr) v.Processor = pr;
                if (xr) v.XhtmlHandler = xr;

                
                if (!l) v.is_primary = 1;
                
                else {
                    _t.addTaskDependency(o, _s.pn);
                    if (_s.pt) _t.addTaskDependency(o, _s.pt);
                }
                t.addNewSpace(v, n, z);
                v.space_state = 1;
                _t.executeTask(o);

                return v;
            };

            t.configureSpace = function (o, c) {
                
                var v, _s = t.p, s, _t = t.o.ts, _p = t.o, i, a, sf = 0;
                s = _s.pd;


                v = _t.getTaskByName(_s.pt);
                if (typeof o == D.S) o = t.getSpace(o);
                if (!c && !H.IsAttributeSet(o.space_element, "space-config")) c = "self";
                if (t.isSpace(o)) {

                    o.space_state = 3;

                    a = o.eo;
                    for (i = a.length - 1; i >= 0; i--)
                        H.registry.service.sendDestroyTo(a[i].object);

                    o.eo = [];
                    o.en = [];
                    o.ei = [];
                    o.space_css_map = [];
                    o.space_implementations = [];

                    
                    if (typeof c == D.S && c == "self" && o.space_element)
                        s = sf = 1;


                    if (!sf && o.space_element && o.space_element.getAttribute("space-config") != "self")
                        _x.removeChildren(o.space_element);
                    o.config_name = 0;

                    if (!v || (_t.isTask(v) && v.handled && typeof v.data == D.O)) {

                        if (!sf && (o.space_element && H.IsAttributeSet(o.space_element, "space-config")) || D.TS(c)) {
                            s = (D.TS(c)) ? c : o.space_element.getAttribute("space-config");
                            if (s && s == "self") {
                                
                                o.space_element.removeAttribute("space-config");
                                sf = 1;
                            }
                        }

                        if (!s) {
                            this.logDebug("Page config not specified.");
                            return 0;
                        }
                        o.config_name = s;

                        this.logDebug("Process configuration '" + s + "' for " + o.space_name);

                        t.parseConfiguration(o, v, s);

                        o.space_implementations = [];
                        o.space_state = 4;
                        _m.publish("onspaceconfigload", o);

                    }
                    else {
                        this.logDebug("Space config not present.");
                    }
                }
                else {
                    this.logWarning("Invalid space reference for configureSpace", "200.4");
                }

            };


            t.parseConfiguration = function (o, v, s, p, x, b) {
                

                var a, i, n, q, r, m, u, g, j, def, f, b, c, h, k, l, e = 0, w, br, cx, cxv, cxp, ab, nr, sf = 0, ck, nl, ci;

                
                if (s == "self" && typeof p == D.U) p = o.space_element;
                else if (typeof p == D.U && v && v.data)
                    p = _x.queryNode(v.data.documentElement, "configuration", 0, "id", s);

                if (!p) {
                    this.logWarning("Page config for " + s + " not found.", "200.4");
                    return;
                }

                try {


                    a = p.childNodes;
                    nl = a.length;
                    for (i = 0; i < nl; i++) {
                        n = a[i];
                        br = 1;

                        
                        
                        

                        def = ci = k = g = ab = cx = ck = 0;
                        j = [];
                        cs = s;

                        if (s == "self") sf = 1;

                        if (n.nodeType == 1) {
                            
                            if (n.getAttribute("avoid") == "1" || n.getAttribute("is-space") == "1") continue;
                            
                            q = n.nodeName.toLowerCase();

                            
                            w = o.space_implementations[q];

                            if (w) {
                                k = w.p;
                                cx = w.cs;
                                cxp = w.cp;
                                ab = w.ab;
                                br = w.nr;
                                sf = w.sf;
                                ck = w.ck;
                                g = w.g;
                                f = w.f;
                                def = w.def;
                                cn = w.cn;
                                ci = 1;
                            }
                            else if ((def = H.app.space.definitions.service.getDefinition(q))) {
                                k = def.use_parent;
                                cx = def.context_switch;
                                cxp = def.context_path;
                                cn = def.swap_name;

                                ab = def.is_abstract;
                                br = (def.no_recursion ? 0 : 1);

                                
                                if (cx && cs == "self") {
                                    sf = 0;
                                    ck = 1;
                                }

                                if (cxp) cxp = t.PO(o, v, cxp, n, x, b, p, cs);

                                if ((u = def.namespace) && (g = H.lookup(def.namespace))) {
                                    if (g && (u = def.method_reference)) {
                                        if (D.TF(g[u])) g = g[u](t.PO(o, v, def.method_reference_parameter, n, x, b, p, cs));
                                    }

                                }

                                w = {};
                                w.p = k;
                                w.cs = cx;
                                w.cp = cxp;
                                w.ab = ab;
                                w.nr = br;
                                w.sf = sf;
                                w.ck = ck;
                                w.g = g;
                                w.def = def;
                                w.cn = cn;
                                if (o.space_implementations[q]) alert('overwrite ' + q + ' / ' + def);
                                o.space_implementations[q] = w;
                            } 

                            if (def || ci) {

                                if (ci) {
                                    def = w.def;
                                }
                                

                                if (def) {
                                    z = def.constructor_params;
                                    if (!ci) {
                                        f = t.PO(o, v, def.constructor, n, x, b, p, cs);
                                        w.f = f;
                                    }
                                    else if (!f) {
                                        var s1 = [];
                                        for (var s2 in w) s1.push(s2);

                                    }
                                    w = z.length;

                                    for (h = 0; h < w; ) {
                                        m = z[h++];
                                        u = 0;
                                        if (D.TS(m) && m.match(/^ora:/i))
                                            u = t.PO(o, v, m, n, x, b, p, cs);
                                        else
                                            u = m;

                                        j[j.length] = u;
                                    }
                                } 

                                
                                nr = H.GetSpecifiedAttribute(n, "aid");

                                if (nr)
                                    n.setAttribute("id", nr + (++t.p.eac));

                                try {

                                    if (!ab) {
                                        if (typeof g == D.O && g != null && typeof g[f] == D.F) {
                                            w = g[f].apply(0, j);
                                        }
                                        else if (k && typeof x[f] == D.F) {

                                            w = x[f].apply(x, j);
                                        }
                                        else {
                                            this.logError("Unexpected implementation for " + q + " with g=" + g + " and f=" + f, "200.4");
                                        }
                                    } 
                                    else {
                                        
                                        _m.S("apply #3 " + q + " abstracted", "200.1");
                                        w = x;
                                    } 

                                }
                                catch (e) {
                                    this.logError("Parse Configuration:" + (e.description ? e.description : e.message) + " from q = " + q + " and f = " + f + " and k = " + k + " and x = " + x + " and g = " + g, "12.1");
                                }

                                
                                if (k) {
                                    e = w;
                                    w = x;
                                } 
                                
                                o.addSpaceObject(w, w && w.p && w.p.cid ? w.p.cid : H.GetSpecifiedAttribute(n, "rid"));
                                if (cx && w) {
                                    if (ck && cn) {
                                        k = document.createElement(cn);
                                        n.parentNode.insertBefore(k, n);
                                        n.parentNode.removeChild(n);
                                        n = k;
                                    }
                                    if (!w.documentElement) {
                                        o.Processor(o, w);
                                        if (!sf) _x.setInnerXHTML(n, w, 0, (!ck ? v.data : 0), 0, 0, 0, o.XhtmlHandler);

                                    }
                                    else {
                                        if (o.dp) cxp = o.dp;

                                        

                                        nr = (cxp ? _x.selectSingleNode(w, cxp, w.documentElement) : w.documentElement);
                                        if (!nr) nr = w.documentElement;
                                        o.Processor(o, nr);
                                        if (!sf) _x.setInnerXHTML(n, nr, 0, (!ck ? v.data : 0), 0, 0, 0, o.XhtmlHandler);

                                    }
                                    
                                    w = x;
                                }

                                if (br) t.parseConfiguration(o, v, cs, n, w, e);

                                if (w && w.t && w.t.match(/^xhtml_component$/)) {
                                    w.post_init();
                                }

                            } 
                            else {
                                

                                if (typeof x == D.U) x = o;
                                if (typeof x == D.O && x != null && typeof x.getContainer == D.F) {
                                    o.Processor(o, n);
                                    if (!sf) _x.setInnerXHTML(x.getContainer(), n, true, 0, 0, 0, 0, o.XhtmlHandler);
                                }
                                else {
                                    _m.S("No object definition for " + n.nodeName + " (1); treating as HTML", "200.1");
                                }
                            }
                        }
                        else if (n.nodeType == 3) {
                            if (n.nodeValue.replace(/\s/g, "").length && typeof x == D.O && typeof x.getContainer == D.F) {
                                o.Processor(o, n);
                                if (!sf) _x.setInnerXHTML(x.getContainer(), n, 1, 0, 0, 0, 0, o.XhtmlHandler);
                            }

                        }

                    } 

                }
                catch (e) {
                    this.logError("parseConfiguration Error: " + (e.message ? e.message : e.description), "200.4");
                    this.logError("parseConfiguration Error: n = " + n + " / q = " + q, "200.4");
                }

            };

            
            t.PO = function (o, v, r, e, x, b, q, s) {
                
                var z = 0, a, n, p, d, f, c, up, i;
                if (typeof r != D.S) return;
                r = r.replace(/^ora:/i, "");

                if (r.match(/(\S*)_parent$/i)) {
                    r = r.match(/(\S*)_parent$/i)[1];
                    up = 1;
                }

                if (r.match(/(\S*)_attr$/i)) {
                    a = r.match(/(\S*)_attr$/i)[1];
                    r = "attr";
                }
                if (r.match(/integer_(\S*)$/i)) {
                    a = r.match(/integer_(\S*)$/i)[1];
                    r = "integer";
                }
                if (r.match(/xpath-node-value:(\S*)/i)) {
                    a = r.match(/xpath-node-value:(\S*)/i)[1];
                    r = "xpath-node-value";
                }
                if (r.match(/xpath-node-value-list:(\S*)/i)) {
                    a = r.match(/xpath-node-value-list:(\S*)/i)[1];
                    r = "xpath-node-value-list";
                }

                switch (r) {
                    case "node_context":
                        z = e;
                        break;
                    case "element_context":
                        z = q;
                        break;
                    case "bool_true":
                        z = 1;
                        break;
                    case "data_source":
                        z = o.ds;
                        break;
                    case "parent_reference":
                        z = b;
                        break;
                    case "xml_document":
                        z = v.data;
                        break;
                    case "xpath-node-value-list":
                        f = _x.selectNodes(v.data, a, e);
                        p = [];
                        for (c = 0; c < f.length; c++) {
                            d = f[c];
                            if (H.IsAttributeSet(d, "value")) {
                                p[p.length] = t.PO(o, v, d.getAttribute("value"), e, x, b, q, s);
                            }
                        }
                        z = p;
                        break;
                    case "xpath-node-value":
                        n = _x.selectSingleNode(v.data, a, e);
                        if (n) {
                            z = n.nodeValue;
                        }
                        break;
                    case "params_array":
                        a = e.getElementsByTagName("param");
                        p = [];
                        for (c = 0; c < a.length; c++) {
                            d = a[c];
                            if (H.IsAttributeSet(d, "value")) {
                                p[p.length] = d.getAttribute("value");
                            }
                        }
                        z = p;
                        break;
                    case "integer":
                        z = parseInt(a);
                        if (isNaN(z)) z = 0;
                        break;
                    case "node_name":
                        if (up) {
                            z = e.parentNode.nodeName;
                        }
                        else {
                            z = e.nodeName;
                        }
                        break;
                    case "attr":
                        if (a) {
                            if (up) {
                                z = e.parentNode.getAttribute(a);
                            }
                            else {
                                z = e.getAttribute(a);
                            }
                        }
                        break;
                    case "space_object":
                        z = o;
                        break;
                    case "space_config":
                        z = s;
                        break;
                    case "space_element":
                        z = o[r];
                        break;
                    case "parent_element":
                        if (typeof x == D.U) x = o;
                        if (typeof x.getContainer == D.F) {
                            z = x.getContainer();
                        }
                        break;
                    case "space_id":
                        z = o.space_id;
                        break;
                    default:
                        z = r;
                        break;
                }

                return z;
            };

            t.newSpaceObject = function (e, i, n, k, x, f) {

                var r = {
                    space_element: e,
                    space_id: i,
                    space_name: n,
                    space_index: x,
                    config_name: 0,
                    task: k,
                    is_primary: 0,
                    eo: [],
                    en: [],
                    ei: [],
                    space_css_map: [],
                    Processor: function (o, n) { },
                    XhtmlHandler: 0,
                    space_implementations: [],
                    space_state: 0,
                    space_callback: f,
                    removeSpaceObject: function (i) {
                        var o = this.eo, x = this.ei, m = this.en, s;
                        if (!D.TN(x[i]))
                            return;

                        s = o[x[i]];
                        if (s.rid) delete m[s.rid];
                        o[x[x]] = 0;
                        delete x[i];
                    },
                    addSpaceObject: function (w, q) {
                        var l = this.eo.length, n;

                        if (
       w != null
       &&
       typeof w == D.O
       &&
       H.registry.service.isRegistered(w)
       &&
       typeof this.ei[w.i] != D.N
      ) {
                            n = (w.getContainer ? w.getContainer() : 0);
                            this.eo[l] = { object: w, config: cs, rid: q };
                            this.ei[w.i] = l;

                            if (q && typeof this.en[q] != D.N)
                                this.en[q] = l;

                            var aC = (n && n.className ? n.className.split(" ") : []);

                            for (var c = 0; c < aC.length; c++) {
                                if (!D.TO(this.space_css_map[aC[c]])) this.space_css_map[aC[c]] = [];
                                this.space_css_map[aC[c]].push(l);
                            }
                        }
                    },
                    getSpaceObjectsByClass: function (cN) {
                        var a = [], o;
                        if (D.TO(this.space_css_map[cN])) {
                            for (var c = 0; c < this.space_css_map[cN].length; c++) {
                                o = this.eo[this.space_css_map[cN][c]];
                                if (o) a.push(o);
                            }
                        }
                        return a;
                    },
                    getContainer: function () { return this.space_element; },
                    getSpaceObjects: function () { return this.eo; },
                    getSpaceObject: function (i) { if (typeof this.ei[i] == D.N && typeof this.eo[this.ei[i]] == D.O) { return this.eo[this.ei[i]]; } return 0; },
                    isObject: function (n) { if (typeof n == D.S && typeof this.en[n] == D.N && typeof this.eo[this.en[n]] == D.O) { return 1; } return 0; },
                    getSpaceObjectByName: function (n) { if (typeof n == D.S && typeof this.en[n] == D.N && typeof this.eo[this.en[n]] == D.O) { return this.eo[this.en[n]]; } return 0; },
                    pw: [],
                    getPrimitiveWire: function (i) { if (typeof i == D.S && typeof this.pw[i] != D.U) return this.pw[i]; return 0; }
                };
                H.prepareObject("space_object", "3.5.1", 1, r);

                return r;

            };

            t.handle_window_load = function () {
                if (t.p.al) t.loadSpaces();
            };

            t.handle_space_initialized = function (s, v) {

                

                var e;

                this.logDebug("Starting space " + v.task.task_name, "11.1");

                if (typeof v == D.O && typeof v.task == D.O && (e = t.getSpaceByName(v.task.task_name))) {
                    e.space_state = 2;
                    if (e.is_primary) {
                        this.logWarning("Space " + e.space_id + " is the primary space and should not be handled by this event.", "11.2");
                    }
                    else {
                        this.logDebug("Space " + e.space_id + " initialized", "11.3");
                    }

                    t.configureSpace(e);
                    if (D.TF(e.space_callback)) e.space_callback(this, e);
                    H.util.EH(e.space_element, "space-onload");
                }
                else {
                    this.logError("Invalid space reference for space_initialized", "11.4");
                }

            };
            t.HEI = function () {
                var _p = t.o, e;

                this.logDebug("Starting space service", "10.1");
                _p.spaces[0].space_state = 2;
                if (_p.spaces.length) {
                    e = _p.spaces[0].space_element;
                    t.configureSpace(_p.spaces[0]);
                    if (D.TF(e.space_callback)) e.space_callback(this, e);
                    H.util.EH(e, "space-onload");
                }
                return 1;
            };

            t.destroy = function () {
                var _m = H.message.service;
                _m.unsubscribe(t, "onremoveobject", "H");
                _m.unsubscribe(t, "dom_event_window_load", "handle_window_load");
                _m.unsubscribe(t, "space_initialized", "handle_space_initialized");
                _m.unsubscribe(t, "space_service_initialized", "HEI");

            };
            t.H = function (s, i) {
                var s = t.o.spaces, h = 0, o;
                for (; h < s.length; ) {
                    o = s[h++];
                    if (!o) continue;
                    o.removeSpaceObject(i);
                }
            };

            H.IM(t, "base_object", "space_service", "3.5.1");
            H.object.addObjectAccessor(t, "space");

            _m.subscribe(t, "onremoveobject", "H");
            _m.subscribe(t, "dom_event_window_load", "handle_window_load");
            _m.subscribe(t, "space_initialized", "handle_space_initialized");
            _m.subscribe(t, "space_service_initialized", "HEI");

            H.registry.service.addObject(t);
            t.r = 4;

        }
    }, 1);
} ());






(function () {
 
 
 
 
 
 
 

 H.namespace("app.comp", H, {
  p: {
   
   c: "acid",
   
   g: "accfgid",
   
   k: "appcomp_path",
   
   r: "acrid",
   
   p: "participant-id",
   
   q: "appcomp_path",
   
   x: "component",
   
   t: "template"
  },

  bindComponent: function (o, i, c, p, a) {
   
   var _a = H.app.comp, z, q = o, r;
   r = _a.p.r;

   if (typeof q == D.S) {
    q = H.registry.service.getObject(o);
    if (q != null && typeof q.getContainer == D.F) q = q.getContainer();
   }
   if (typeof q != D.O || q == null) {
    H.message.service.S("Invalid ID reference '" + o + "' in bindComponent", "200.4");

    return 0;
   }


   if (typeof q[r] == D.S) {
    H.message.service.S("Object is already bound to '" + q[r] + "'", "200.4");


    return 0;

   }


   
   z = _a.newInstance(0, 0, o, 0, p, 1);
   z.setAsync(!a);

   

   z.loadComponent(i, c);
   if (typeof q.setAttribute == D.U)
    q[r] = z.i;

   else
    q.setAttribute(r, z.i);



   H.message.service.S("Bind to application component " + z.getObjectId(), "200.1");


   return z;
  },

  newInstance: function (i, o, c, f, p, b) {
   

   var n = H.newObject("application_component", "3.5.1");

   if (typeof o == D.F) f = o;
   if (typeof o != D.O) o = 0;
   if (typeof i != D.S) i = 0;
   if (typeof p != D.S) p = 0;
   if (typeof c == D.U) c = 0;
   else if (D.TO(c) && D.TF(c.getObjectId)) c = c.getObjectId();
   if (typeof b == D.U) b = 0;









   n.o = {
    
    
    tp: [],
    b: [],
    ts: H.data.stack.service
   };
   n.p = {
    eic: 1,
    edc: 1,
    te: 0,
    ei: 0,
    
    c: 0,
    
    n: 0,
    
    e: c,
    
    i: 1,
    
    p: "application-components",
    
    m: "application-component",

    
    a: 1,

    
    h: f,

    
    b: b,

    
    eb: "keydown,keyup,keypress,change,focus,blur,mouseover,mouseout,mouseup,mousedown,click",
    
    t: 1,
    
    TransactionName: p,
    
    TransactionId: 0
   };

   if (i && 1) n.i = i;

   

   n.sigterm = function () {
    this.destroy();
   };

   n.setLoadHandler = function (f) {
    this.p.h = f;
    if (this.r == 4) f("oncomponentload", this);
   };

   

   n._handle_xhtml_token = function (i, s) {
    var r = s, p = /\$\{property\.(\S+)\}/, g = /\$\{form\.(\S+)\}/, b = /\$\{bean\.(.[^\.]+)\}/, b2 = /\$\{bean\.(.[^\.]+)\.(.[^\.]+)\}/, m, f = "replace",v;

    if (i == 2 || i == 3) {
     if (!r || !r.length || !r.match(/\$/)) return r;

     r = r[f](/\$\{this\}/g, "H.registry.service.getObject('" + n.i + "')");
     r = r[f](/\$\{this\.id\}/g, n.i);
     r = r[f](/\$\{hemi\.hemi_base\}/g, H.hemi_base);
     while (n.p.te && (m = r.match(g)) && m.length > 1)
      r = r.replace(g, H.data.form.service.getValue(m[1], n.p.ei));
     while ((m = r.match(b)) && m.length > 1)
      r = r[f](b, n.i + "-" + m[1]);
     while ((m = r.match(p)) && m.length > 1)
      r = r[f](p, n.p[m[1]]);
     while ((m = r.match(b2)) && m.length > 2) {
      b = n.getBean(m[1]);

      if (n.p.ei && (g = H.data.form.service.getXElement(m[2], n.p.ei)) && (g = Hemi.registry.service.getObject(g.i))) {
       
       g.o.cc.synchronizeComponent(g);
      }

      
      if(b && (v = b[m[2]]) instanceof Date){
       r = r[f](b2, (v.getMonth()+1) + "-" + v.getDate() + "-" + v.getFullYear());
      }
      else{
       r = r[f](b2, b ? b[m[2]] : "");
      }
      Hemi.log("Resolve " + m[1] + "." + m[2] + "='" + b[m[2]] + "'");
     }

     if (typeof n.local_handle_xhtml_token == D.F) r = n.local_handle_xhtml_token(i, r);
    }
    else if (i == 1 && s.match(/^embedded-script$/i)) return 0;

    return r;
   };
   n.destroy = function () {
    var t = this, o, i;

    
    if (t.r < 5) {

     H.message.service.unsubscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");


     H.message.service.unsubscribe(t, "onloadxml", "HLX");


     if (typeof t.component_destroy == D.F) t.component_destroy();
     t.cleanTemplate();

     t.r = 5;

     if (typeof this.p.e == D.S && (o = H.registry.service.getObject(this.p.e)) && typeof o.destroy == D.F)
      o.destroy();

     var oE = this.getTemplateSpace();
     if (oE) {
      H.app.space.service.clearAppSpace(oE);
     }


     H.data.stack.service.clear(t);

     if (H.transaction.service.isRegistered(this))
      H.transaction.service.removeTransactionParticipant(t, t.getPacket());


     
     H.registry.service.removeObject(t);
     for (i in t.o.b) H.registry.service.removeObject(H.registry.service.getObject(t.o.b[i]));
     
     for (i in t.o) t.o[i] = null;

    }
   };

   n.sanitizeBean = function(s){

    for(i in o){
     o[i] = s[i];
    }
    return o;
   },
   n.clearBean = function(n){
    var t = this;
    if(!t.o.b[n]) return 0;
    
    var o = H.registry.service.getObject(t.o.b[n]);
    if(typeof o == D.O && o!=null){
     H.registry.service.removeObject(o);
     delete o.bind;
    }
    delete t.o.b[n];
    return 1;
   },
   
   n.setBean = function (o, n) {
    var v, i = this.i + "-" + n, _o = this.o;
    if (_o.b[n] || o.i) return 0;

    var b = {bind:o};
    Hemi.prepareObject("bean", "1.0", false, b, true);
    b.i = i;
    H.registry.service.addObject(b);
    _o.b[n] = b.i;
    return 0;
   };
   n.getBean = function (n) {
    var _o = this.o, b = 0;
    if (_o.b[n]){
     b = H.registry.service.getObject(_o.b[n]);
     if(b) b = b.bind;
    }
    return b;
   };
   n.getDataStack = function () {
    return this.o.ts;
   };



   n.setAsync = function (b) {
    this.p.a = b;
   };

   n.release = function () {
    
    this.r = 2;
   };


   n.post_init = function (o, i) {
    if (typeof this.component_post_init == D.F) this.component_post_init();
   };


   n.setTemplateIsSpace = function (b) {
    if (b) this.getContainer().removeAttribute("space-id");
    this.p.te = b;
   };

   n.getTemplateSpace = function () {
    var _s = this.p;
    if (!_s.te || !_s.ei) return 0;
    return H.app.space.service.getSpace(_s.ei);
   };

   n.setBindingEnabled = function (b) {
    this.p.b = b;
   };

   n.getBindingEnabled = function () {
    return this.p.b;
   };

   n.getDefinitionId = function () {
    return this.p.n;
   };

   n.setContainerId = function (s) {
    this.p.e = s;
   };

   n.getContainerId = function (s) {
    return this.p.e;
   };

   n.getComponentName = function () {
    return this.p.n;
   };

   n.getContainer = function () {
    var o = this.p.e;
    if (!o) return 0;
    if (typeof o == D.S) o = H.registry.service.getObject(o);
    if (o != null && typeof o.getContainer == D.F) o = o.getContainer();
    return o;

   };


   n.loadComponent = function (l, c) {
    

    var t = this, _s, _x = H.xml, _p;
    _s = t.p, _p = t.o;

    if (typeof c != D.S || typeof l != D.S) return 0;
    _s.c = c;
    _s.n = l;

    


    

    if (!_s.hx) {
     _s.hx = 1;
     H.message.service.subscribe(t, "onloadxml", "HLX");
    }

    

    _x.getXml(c, null, _s.a, (_s.a ? t.i : c), 1);
   };


   n.init = function (o) {
    var t = this, _s;
    
    _s = t.p;
    H.event.addScopeBuffer(t);
    this.scopeHandler("load_template", 0, 0, 1);



    t.r = 1;

    if (typeof o == D.O)
     t.importNodeDefinition(o);

   };

   n.HLX = function (s, v) {
    var t = this, o, _x = H.xml, x, _s;
    _s = t.p;

    

    if (v.id == (_s.a ? t.i : _s.c) && t.r < 4) {
     H.message.service.unsubscribe(t, "onloadxml", "HLX");
     _s.hx = 0;
     x = v.xdom;
     o = _x.queryNode(x.documentElement, _s.m, 0, "id", _s.n);
     
     if (o != null) t.importNodeDefinition(o);
     else {
      H.message.service.S("Invalid component definition for '" + _s.n + "' in '" + _s.m + "'", "200.4");
     }

    }

   };

   n.importNodeDefinition = function (x) {
    
    var i, t = this, _s, p;
    _s = t.p;

    t.r = 3;

    if (typeof x != D.O || x == null) {

     H.message.service.S("Invalid object in importNodeDefinition", "200.1");

     return 0;
    }

    i = x.getAttribute("id");
    p = x.getAttribute(H.app.comp.p.p);

    return n.importComponentDefinition(H.xml.getCDATAValue(x), i, p);


   };




   n.importComponentDefinition = function (s, i, pn) {
    

    var t = this, _s, p;
    _s = t.p;
    if (typeof s != D.S) return 0;

    
    if (typeof t.component_destroy == D.F) t.component_destroy();
    t.cleanTemplate();
    

    t.r = 3;

    if (i) _s.n = i;
    else _s.n = H.guid();

    if (pn) _s.TransactionName = pn;
    else if (!_s.TransactionName) {
     if (this.getReferenceId())
      _s.TransactionName = this.getReferenceId();
     else

      _s.TransactionName = _s.n;
    }

    s = '{' + s + '}';
    H.util.merge(t, _s.n, s);

    



    var a, l, h, o = _s.e, ph;

    if (_s.b && _s.eb && o) {



     if (typeof o == D.S) o = H.registry.service.getObject(o);

     if (o) {

      if (typeof o.getContainer == D.F) o = o.getContainer();
      a = _s.eb.split(",");
      for (l = 0; l < a.length; l++) {
       h = '_handle_' + a[l];
       ph = '_prehandle_' + a[l];
       
       if (typeof t[ph] == D.F) {
        H.event.removeEventListener(o, a[l], t[ph]);
        t[ph] = null;
       }

       if (typeof t[h] == D.F) {
        t.scopeHandler(a[l], 0, 0, 1);
        H.event.addEventListener(o, a[l], t[ph]);
       }
      }
     }
    }

    if (_s.t)
     t.joinTransactionPacket();


    if (typeof t.component_init == D.F) t.component_init();

    t.r = 4;


    if (typeof _s.h == D.F) _s.h("oncomponentload", t);
    H.message.service.publish("oncomponentload", t);

   };

   n._handle_template_processor = function (o, n) {
    if (typeof n == D.O && n.nodeType == 1) {
     this.importEmbeddedScript(n, 1);
    }
   };
   n.importEmbeddedScript = function (oX, b) {

    var j, j2, a = oX.getElementsByTagName("embedded-script"), _p = this.o, i, t, x;
    for (i = a.length - 1; i >= 0; i--) {
     t = H.xml.getInnerText(a[i]);
     if (!b) a[i].parentNode.removeChild(a[i]);

     try {

      eval("x={" + t + "}");
      for (j in x) {
       j2 = j;
       if (j2.match(/^embedded_init$/)) {
        j2 = "embedded_init_" + this.p.eic++;
       }
       else if (j2.match(/^embedded_destroy$/)) {
        j2 = "embedded_destroy_" + this.p.edc++;
       }
       _p.tp[_p.tp.length] = j2;
       this[j2] = x[j];
      }

     }
     catch (e) {
      alert("Error: " + (e.description ? e.description : e.message));
     }


    }

   };
   n._handle_spaceconfig_load = function (s, v) {
    if (v && v.space_element && v.space_element.getAttribute("acrid") == this.i) {
     this.p.ei = v.space_id;
     this.InitializeTemplate();
    }
   };
   n.InitializeTemplate = function () {


    for (var i = 1; i < this.p.eic; i++) {
     this["embedded_init_" + i]();
     this["embedded_init_" + i] = 0;
    }
    if (typeof this.template_init == D.F) this.template_init();
    this.template_init = 0;
    this.p.eic = 1;
    if (typeof this.local_template_init == D.F) this.local_template_init(this);
    H.message.service.publish("ontemplateload", this);
   };
   n._handle_load_template = function (s, v) {
    H.logDebug("Handle load template");
    if (v && v.xdom) this.loadTemplateFromNode(v.xdom.documentElement);
   };

   n.loadTemplateFromNode = function (oX) {
    var a, o = this.getContainer(), x, i, t, _p = this.o, b = this.p.te, q, z;
    if (!oX) return;
    q = oX;
    z = this.p.tid;
    if (q.nodeName.match(/^Template$/) != null) {
     if (z && q.getAttribute("id") != z) return;
    }
    else {
     a = oX.getElementsByTagName("Template");
     if (!a.length) return;
     if (!z) q = a[0];
     else {
      q = 0;
      for (i = 0; i < a.length; i++) {
       if (a[i].getAttribute("id") == z) {
        q = a[i];
        break;
       }
      }
      if (!q) return;
     }
    }

    this.p.tid = 0;

    if (typeof this.setTitle == D.F) this.setTitle(q.getAttribute("Title"));
    this.importEmbeddedScript(q);

    if (typeof this.getTemplateContainer == D.F) o = this.getTemplateContainer();
    H.xml.removeChildren(o);

    a = q.childNodes;
    for (i = 0; i < a.length; )
     H.xml.setInnerXHTML(o, a[i++], 1, 0, 0, 0, 0, this._handle_xhtml_token);

    if (b) {
     o.setAttribute("space-config", "self");
     if (!this.p.ei) {
      H.message.service.subscribe(this, "onspaceconfigload", "_handle_spaceconfig_load");
      o.setAttribute("acrid", this.i);
      o.setAttribute("is-space", "1");

      this.scopeHandler("template_processor", 0, 0, 1);
      var oSpace = H.app.space.service.createSpace(o, 0, this._prehandle_template_processor, this._handle_xhtml_token);
     }
     else {
      x = H.app.space.service.getSpace(this.p.ei);
      H.app.space.service.configureSpace(x, "self");
     }
    }
    else
     this.InitializeTemplate();
   };

   n.getTemplateObjectByName = function (i) {
    var e = this.getTemplateSpace(), o;
    if (!e) return 0;
    o = e.getSpaceObjectByName(i);
    if (!o || !o.object || !o.object.getContainer) return 0;
    return o.object.getContainer();
   };






   n.loadTemplate = function (s, i) {
    if (!s || !s.length) return;
    this.cleanTemplate();
    if (i) this.p.tid = i;
    H.xml.getXml(s, this._prehandle_load_template, 1);
   };
   n.cleanTemplate = function () {
    var _p = this.o, i;

    if (typeof this.template_destroy == D.F) this.template_destroy();
    this.template_destroy = 0;
    for (i = 1; i < this.p.edc; i++) {
     this["embedded_destroy_" + i]();
     this["embedded_destroy_" + i] = 0;
    }
    this.p.edc = 1;

    for (i = 0; i < _p.tp.length; ) {
     if (_p.tp[i++]) this[_p.tp[i++]] = null;
    }
    _p.tp = [];

   };




   


   n.getReferenceId = function () {
    var c = H.registry.service.getObject(this.p.e);
    
    if (!c || !D.TF(c.getReferenceId)) return 0;
    
    return c.getReferenceId();
   };

   n.getContainerComponentId = function () {
    var c = H.registry.service.getObject(this.p.e);
    
    if (!c || c.t != "xhtml_component") return 0;
    
    return c.getComponentId();
   };


   
   if (H.registry.service.addObject(n)) {


    if (n.p.t) H.transaction.service.register(n, 1);

    n.init(o);
   }
   else {
    H.message.service.S("Could not add application component to registry", "200.4");
   }

   return n;
  }
 });
} ());





(function(){
 
 
 
 H.namespace("app.dwac", H, {
  atkey : "is-dwac",
  aturi : "DWacControlUri",
  attk : "DWacControlTask",
  attid : "DWacTemplateId",

  newInstance : function(o, u, t, k,i){
   if(!o) return;
   
   var b = 0;
   if(!D.TF(o.getObjectType) || o.getObjectType() != "xhtml_component"){
    o = H.object.xhtml.newInstance(o,1);
    b = 1;
   }
   var r = H.app.comp.newInstance(0,0,o.getObjectId(),0,0,0);
   r.p.DWacControlUri = u;
   r.p.DWacControlTask = k;
   r.p.DWacTemplateId = t;
   
   r.component_init = function(){
    this.setTemplateIsSpace(1);
    this.o.task_service = new H.task.serviceImpl();
    this.scopeHandler("processor",0,0,1);
   };
   r._handle_processor = function(Service, ParentTask, TaskName, Value){
    return this._handle_xhtml_token(2,Value);
   };
   r.component_post_init = function(){
    var sU = this.p.DWacControlUri;
    var sT = this.p.DWacControlTask;
    var sTId = this.p.DWacTemplateId;
    if(typeof sTId != "string" || sTId.length == 0) sTId = 0;
    if(typeof sU == "string" && sU.length > 0){

     if(typeof sT == "string" && sT.length > 0){
      this.p.dwac_template_path = sU;
      this.o.dwac_task = this.o.task_service.executeTaskLoader(
       "dwac_loader",
       "xml",
       sU,
       "import-task",
       sT,
       this._prehandle_processor
      );
     }
     else{
      this.LoadDwacTemplate(sU, sTId);
     }
    }
    
   };
   r.handle_dwac_task = function(s, v){
    var sU = this.getContainer().getAttribute("DWacControlUri");
    var sTId = this.getContainer().getAttribute("DWacTemplateId");
    if(typeof sTId != "string" || sTId.length == 0) sTId = 0;
    if(typeof sU == "string" && sU.length > 0) this.LoadDwacTemplate(sU,sTId);
   };
   r.LoadDwacTemplate = function(sPath, sTemplateId){
    this.p.dwac_template_path = sPath;
    this.loadTemplate(sPath, sTemplateId);   
   };
   r.GetDwacTemplatePath = function(){
    return this.p.dwac_template_path;
   };
   r.local_handle_xhtml_token = function(iType, sTokenValue){
    sTokenValue = sTokenValue.replace(/\$\{dwac\.path\}/g,this.GetDwacTemplatePath());
    return sTokenValue;
   };
   
   if(!i) i = H.guid();
   r.importComponentDefinition("",i,0);
   if(b) r.component_post_init();

   return r;
   
  }
 });
}());

(function () {

    H.namespace("app", H, {
        createApplicationSpace: function (e, p, s, f) {
            
            
            if (!e) {
                e = document.createElement("div");
                e.className = "space";
                if (!p) p = document.body;
                if (s) p.insertBefore(e, s);
                else p.appendChild(e);
            }
            return H.app.space.service.createSpace(e, 0, 0, 0, f);
        },

        createComponent: function (o, s, r) {
            var x = 0;
            if (s && s.space_state != 4) {
                H.logError("Cannot dynamically create and bind a node to a component inside an initializing space");
                return;
            }

            
            
            r = (r ? r : H.GetSpecifiedAttribute(o, "rid"));

            x = H.object.xhtml.newInstance(o, 1, r, (s ? s.space_id : 0), H.data.form.service, 0, 0, 0);
            if (s) {
                s.addSpaceObject(x, r);
                x.post_init();
            }

            return x;
        },

        createApplicationComponent: function (s, o, p, r) {
            var x = 0, a = 0, _a;
            if (o && p && p.space_state != 4) {
                H.logError("Cannot dynamically create and bind a node to a component inside an initializing space");
                return;
            }
            
            
            
            _a = H.app.comp;
            var h = 0;
            if (s) {
                if (!s.match(/\.xml/)) h = H.hemi_base + "Components/component." + s.toLowerCase() + ".xml";
                else {
                    h = s;
                    s = h.match(/(component\.)?([\S][^\.]*)\.xml/)[2];
                }
            }
            if (o) {
                r = (r ? r : H.GetSpecifiedAttribute(o, "rid"));
                x = H.object.xhtml.newInstance(o, 1, r, (p ? p.space_id : 0), H.data.form.service, 0, 0, 0);
                a = _a.newInstance(0, 0, x.getObjectId(), 0, 0, 1);

            }
            else {
                a = _a.newInstance(r, 0, (p ? p.getObjectId() : 0));
            }
            a.setAsync(0);
            if (s)
                a.loadComponent(s, h);

            else a.importComponentDefinition("", 0, r);
            if (x && p) {
                p.addSpaceObject(x, (r ? r : H.GetSpecifiedAttribute(o, "rid")));
                x.post_init();
            }
            return a;
        },
        getWindowManager: function () {
            var o, m = "manager";
            o = H.registry.service.getObject(m);
            if (!o) {
                H.app.createApplicationComponent(m, 0, H.app.getPrimarySpace(), m);
                o = H.registry.service.getObject(m);
            }
            return o;
        },
        createWindow: function (t, l, n, v, b, a, f) {

            
            
            var o = (D.TO(v) ? v : H.app.space.service.getSpace(v)), m, c, b1, b2, u, d;
            if (!o) o = H.app.getPrimarySpace();
            if (!o) {
                H.logError("Invalid space");
                return;
            }

            m = H.app.getWindowManager();
            if (n) {
                c = m.GetWindowByName(n);
                if (c) {
                    if (c.getHideOnClose() && c.getIsClosed()) {
                        c.open();
                    }
                    b1 = c.getManageMaximize();
                    b2 = c.getManageMinimize();
                    c.setManageMaximize(0);
                    c.setManageMinimize(0);
                    c.restore();
                    c.getFocus();
                    c.setManageMaximize(b1);
                    c.setManageMinimize(b2);
                    m.CenterWindow(c);
                    return;
                }
            }


            u = H.guid();
            if (!n) n = u;
            if (!t) t = n;

            d = document.createElement("div");
            if (b)
                document.body.appendChild(d);
            else
                o.space_element.appendChild(d);

            c = H.app.createApplicationComponent("window", d, o, n);
            c.setTemplateIsSpace(1);
            if (typeof a == "object") {
                for (var i in a) {
                    c.p[i] = a[i];
                }
            }

            c.post_init();

            c.o.body.appendChild(document.createTextNode("[ ... loading ...]"));

            c.setCanResize(1);
            c.resizeTo(500, 300);
            c.setIsBound((b ? 0 : 1));
            c.local_template_init = f;
            c.setTitle(t);
            c.setStatus("");
            c.setHideOnClose(1);
            m.CenterWindow(c);
            c.getFocus();
            c.loadTemplate(l);


            return c;
        },
        getPrimarySpace: function () {
            
            var o, _s = H.app.space.service;
            o = _s.getPrimarySpace();
            if (!o) _s.loadSpaces();
            return _s.getPrimarySpace();
        }

    });
} ());

(function () {
    
    
    
    
    
    H.namespace("app.module.test", H, {

        service: null,

        serviceImpl: function () {
            var t = this;
            H.prepareObject("test_module_service", "3.5.1", 0, t);
            H.util.logger.addLogger(t, "Test Module Service", "Application Test Module Service", "621");


            Hemi.event.addScopeBuffer(t);


            t.UnloadTest = function (v) {
                var o, _m = H.app.module.service, i = 0, k, _t = H.task.service;
                o = _m.getModuleByName(v);
                if (!o) return 0;
                for (; i < o.Impls.length; ) {
                    k = _t.getTaskByName("TestSuite-" + o.Impls[i++]);
                    H.task.service.endTask(k.task_id);
                }
                return H.app.module.service.UnloadModule(v);
            };
            t.NewTest = function (n, x, ft, fs, p, b) {
                if (!n) return 0;
                if (!p) p = "Tests/";

                var m = H.app.module.service.NewModule(n, x, p, t, (b ? 1 : 0), "test_module");
                m.o.sh = fs;
                m.o.th = ft;

                m.ResetSuite = function () {
                    var a = m.TestMembers, k, h, i;
                    if ((i = m.p.ti)) {
                        m.p.ti = 0;
                        this.logDebug("Unset suite task: " + i);
                        H.task.service.returnDependency(H.task.service.getTask(i));
                        k = H.task.service.endTask(i, 1);
                        for (h=0; h < a.length; )
                            H.task.service.clearDependency(m.p.ts + "-" + a[h++]);
                    }
                    m.p.ts = "TestSuite-" + m.getObjectId();
                    k = H.task.service.addTask(
         m.p.ts,
         "default",
         "[nothing]",
         "function",
         Hemi.registry.getApplyStatement(m, "handle_testsuite_task")
     );
                    for (h =0; h < a.length; )
                        H.task.service.addTaskDependency(k, m.p.ts + "-" + a[h++]);

                    m.p.ti = k.task_id;
                    this.logDebug("Reset suite task: " + k.task_id + " / " + k.task_state);
                };


                m.handle_testsuite_task = function (s, v) {
                    if (!m.p.ti) {
                        this.log("Ignore completion of disengaged task");
                        return;
                    }
                    m.log("TestSuite " + m.name + " Completed");
                    if (D.TF(m.o.sh)) m.o.sh(m);
                };
                m.ResetSuite();
                return m;
            };
            t.handle_testsuite_task = function (o, v) {

            };
            t.DecorateModuleContent = function (n, p, r) {
                var s = [], b = [], a = r.match(/function\s*test\S*\(/gi), g;

                for (var m = 0; a != null && m < a.length; m++) {
                    g = a[m].match(/function\s*(test\S*)\(/i);
                    if (g && g.length > 1) {
                        s.push("\"" + g[1] + "\"");
                        b.push("this._X_" + g[1] + " = function(){var o = this._ST(\"" + g[1] + "\");var b = false;try{this._TS(o,1);b = " + g[1] + ".apply(this, [o]);this._TS(o,2);if(D.TU(b)) b = true;}catch(e){this._AM(o, e);o.error=1;}this._TS(o,3);if(b){End" + g[1] + "(b);};return o;};");
                        b.push("function Continue" + g[1] + "(){var b = true,o = Module.getTestByName(\"" + g[1] + "\");if(!o){Module.logWarning(\"Test " + g[1] + " result not found.\");return;} if(o.status == 4){Module.logWarning(\"Attempt made to complete test " + g[1] + ", which is already completed.\");return;} if(typeof HandleContinue" + g[1] + " == \"function\"){try{b = HandleContinue" + g[1] + ".apply(Module,[o]); if(D.TU(b)) b = true;}catch(e){ Module._AM(o, e); o.error=1;}} if(b){End" + g[1] + "(b);};return o;}");
                        b.push("\nfunction End" + g[1] + "(b){var o = Module.getTestByName(\"" + g[1] + "\");if(!o){Module.logWarning(\"Test " + g[1] + " result not found.\");return;}Module._SP(o,b);Module._TS(o,4);Hemi.task.service.returnDependency(\"TestSuite-\" + Module.getObjectId()+\"-" + g[1] + "\");}\n");
                    }
                }

                return "this.Assert = function(b,m){if(!b){throw m;}};"
     + "H.object.addObjectAccessor(this,\"test\");"
     + "H.util.logger.addLogger(this, \"Test Module\", \"Test Module Service\", \"621\");"
     + "this.TestMembers = [" + s.join(",") + "];"
                    + "this.getReport = function(){var a = [\"" + n + " Test Results\"],m = this.getTests(),i=0,r;for(;i < m.length;){r=m[i++];if(!r) continue;var rt=(r.stop_time && r.start_time ? parseInt((r.stop_time.getTime() - r.start_time.getTime())/1000) : 0);a.push('Test: ' + r.name + ' (' + rt + ' sec)\\n\\tErrors: ' + (r.error ? 'Yes':'No') + '\\n\\tMessages:');for(var p=0;p<r.messages.length;p++){a.push('\\n\\t\\t' + r.messages[p]);}} return a.join('\\n');};"
     + "this._ST = function(n){this.logDebug(\"Start Test \" + n);var o = this.getTestByName(n);if(o)o=this.removeTest(o); o={name:n,start_time:(new Date()),stop_time:0,messages:[],result:0,error:0,status:0,data:0};this.addNewTest(o,n);return o;};"
     + "this._SP = function(o, a){if(a==true)this.log(\"Test " + n + ".\" + o.name + \" Succeeded\"); else this.logWarning(\"Test " + n + ".\" + o.name + \" Failed\");this.logDebug(\"Stop Test " + n + "\");o.stop_time = (new Date());o.result=a;};"
     + "this._AM = function(o, a){this.logError(\"Test " + n + ": \" + a);o.messages.push(a);};"
                    + "this.RunTest = function(s){var e = \"" + n + "\",f=\"_X_\" + s;if(!this[f]){this.logError(\"Invalid test: \" + f);return false;} return this[f]();};"
     + "this.RunTests = function(){var o = H.task.service.getTask(this.p.ti); if(o.task_state > 1) this.ResetSuite();Hemi.task.service.executeTaskByName(this.getProperties().ts);var e = \"" + n + "\",i=0;for(; i < this.TestMembers.length;i++){this.RunTest(this.TestMembers[i]);}};"
                    + "this._TS = function(o, s){if(o.status >= s) return;o.status = s;if(D.TF(this.o.th)) this.o.th(this, o, s);};"
                    + "this.getTestTask = function(){ return Hemi.task.service.getTask(this.p.ti);};"
     + b.join("")
    ;
            };


            H.registry.service.addObject(t);
            t.r = 4;
        }
    }, 1);

} ());


(function () {

 
 
 

 H.namespace("data.io", H, {


  service: null,

  serviceImpl: function () {
   var t = this;

   H.prepareObject("io_service", "3.5.1", 1, t, 1);

   H.util.logger.addLogger(t, "IO Service", "Data IO Service", "661");

   H.object.addObjectAccessor(t, "provider");
   H.object.addObjectAccessor(t, "request");
   H.object.addObjectAccessor(t, "response");

   Hemi.transaction.service.register(t, 1);

   t.p.busType = {
    ANY: 1,
    LOCAL: 2,
    OFFLINE: 3,
    ONLINE: 4,
    STATIC: 5
   };
   
   t.getBusName = function (i) {
    var r = "NONE", c, b = t.p.busType;
    if (!D.TN(i)) return r;
    for (c in b) {
     if (b[c] == i) {
      r = c;
      break;
     }
    }
    return r;
   };
   t.getBusType = function () {
    return t.p.busType;
   };
   

   


   t.getList = function (b, l, x, c, r, a, h) {
    return t.createRequest(t.getSubject(), b, l, x, c, (r ? r : "List"), 0, 0, 1, 0, 0, 0, h);
   };


   t.object_destroy = function () {

    H.message.service.unsubscribe(t, "onremoveobject", "H");
    H.message.service.unsubscribe(t, "onsessionrefresh", "handle_session_refresh");
   };

   t.H = function (s, i) {
    var v, a = t.getProviders(), z = 0;
    for (; z < a.length; ) {
     v = a[z++];
     if (v && v.providerId == i) {
      t.unregister(v, 1);
      break;
     }
    }
   };

   t.handle_session_refresh = function (s, i) {
    t.mapSession(i);
   };

   t.mapSession = function (i) {
    if (!D.TO(i)) return;
    var o = t.getSubject();
    o.isAuthenticated = i.GetBoolParam("IsLoggedIn");
    o.name = i.GetParam("UserName");
    o.id = i.GetParam("RecordId");
    if (o.id && o.id == "0") o.id = 0;
    if (!o.isAuthenticated) o.name = "Anonymous";
    t.updateSubject();
   };
   t.updateSubject = function () {
    Hemi.message.service.publish("onupdatesubject", this);
   };




   t.getSubject = function () {
    var o = t.o.subject;
    if (!o) {
     o = { name: null, id: null, isAuthenticated: false };
     t.o.subject = o;
    }
    return o;
   };

   t.arrayToGroup = function (a, p, h) {
    var r = [], o;
    for (var i = 0; i < a.length; i++) {
     o = this.newGroup();
     o.name = a[i];
     if (p) o.policies.push(t.clonePolicy(p));
     o.path = (h ? h : "") + a[i];
     r.push(o);
    }
    return r;
   };
   t.newGroup = function () {
    return {
     provider: 0,
     name: 0,
     id: 0,
     parentId: 0,
     type: 0,
     detailsOnly: 0,
     path: 0,
     populated: 0,
     groups: [],
     data: [],
     namespace: 0,
     policies: [],
     bus: 0
    };
   };
   t.arrayToData = function (a, p) {
    var r = [], o;
    for (var i = 0; i < a.length; i++) {
     o = this.newData();
     o.value = o.name = a[i];
     o.mimeType = "text/plain";
     if (p) o.policies.push(t.clonePolicy(p));
     r.push(o);
    }
    return r;
   };
   t.newData = function () {
    return {
     provider: 0,
     value: 0,
     name: 0,
     description: 0,
     mimeType: 0,
     id: 0,
     createdDate: 0,
     modifiedDate: 0,
     size: 0,
     detailsOnly: 0,
     group: 0,
     namespace: 0,
     path: 0,
     policies: [],
     hash: 0,
     bus: 0,
     postData: 0
    };
   };

   t.clonePolicy = function (p) {
    var r = t.newPolicy();
    for (var i in p) r[i] = p[i];
    return r;
   };
   t.newPolicy = function () {
    return {
     subjectId: 0,
     subjectType: 0,
     read: 0,
     write: 0,
     change: 0,
     del: 0,
     statement: 0
    };
   };

   t.cloneInstruction = function (p) {
    var r = t.newIOInstruction();
    if (!p) return r;
    for (var i in p) r[i] = p[i];
    return r;
   };

   t.newIOInstruction = function (p, s, r, o, g) {
    return {
     paginate: (p ? p : 0),
     recordCount: (r ? r : 0),
     startRecord: (s ? s : 0),
     totalCount: 0,
     orderBy: o,
     groupBy: g
    };
   };
   t.newIOResponse = function (v, f) {
    return {
     authenticationRequired: 0,
     responseHandler: f,
     responseId: 0,
     responsePath: 0,
     status: 0,
     message: 0,
     serviceId: t.i,
     requestId: v.id,
     responseData: [],
     responseGroups: [],
     namespace: 0,
     providerResponded: {},
     bus: 0,
     id: Hemi.guid(),
     writeData: function (o, p, a, b) {
      if (p) o.provider = p.i;
      if (b) o.bus = b;
      (a ? a : this.responseData).push(o);
     },
     writeDataArray: function (a, p, r, b) {
      for (var i = 0; i < a.length; i++)
       this.writeData(a[i], p, r, b);
     },
     writeGroup: function (o, p, a, b) {
      if (p) o.provider = p.i;
      if (b) o.bus = b;
      (a ? a : this.responseGroups).push(o);
     },
     writeGroupArray: function (a, p, r, b) {
      for (var i = 0; i < a.length; i++)
       this.writeGroup(a[i], p, r, b);

     }
    };
   };

   t.newIORequest = function (b, l, x, h, o, i, n, d, a, c, u) {
    return {
     requestApplication: l,
     requestContext: x,
     async: a,
     serviceId: t.i,
     responseId: 0,
     requestId: i,
     requestAction: o,
     cache: c,
     requestName: n,
     requestCatalog: h,
     id: Hemi.guid(),
     namespace: 0,
     detailsOnly: d,
     bus: b,
     providerRequested: {},
     requestData: [],
     transactionId: 0,
     transactionName: 0,
     is_open: 0,
     instruction: u,
     mimeType: 0
    };
   };


   
   t.createRequest = function (j, b, l, x, h, o, i, n, d, a, c, p, f) {
    return t.openRequest(j, t.newIORequest(b, l, x, h, o, i, n, d, a, c, p), f);
   };

   t.openRequest = function (j, rq, f) {
    var rs = t.newIOResponse(rq, f),
                    k,
                    b = rq.bus,
                    z = t.o.providers,
                    y = 0,
                    w,
                    v,
                    u,
                    bt = t.p.busType
                ;

    if (!D.TN(b)) b = bt.ANY;
    if (!j) j = t.getSubject();

    u = "io.service.request-" + rq.id;
    k = Hemi.transaction.service.openTransaction(u, t, { type: 0, src: 0, data: 0 }, t.endRequest);

    t.addNewRequest(rq, rq.id);
    t.addNewResponse(rs, rs.id);
    rs.instruction = t.cloneInstruction(rq.instruction);
    rq.transactionName = u;
    rq.transactionId = k;
    rq.responseId = rs.id;
    rq.is_open = 1;
    t.getPacket(u).data = { serviceId: t.i, requestId: rq.id, responseId: rs.id, subject: j };

    for (; y < z.length; ) {
     w = z[y++];
     if (!w) continue;
     if (w.bus == bt.ANY || w.bus == b || b == bt.ANY) {
      v = H.registry.service.getObject(w.providerId);
      if (!v) {
       t.logWarning("Provider reference was not cleaned up.  Registry #:" + w.providerId + " on bus " + w.bus);
       continue;
      }
      rq.providerRequested[w.providerId] = 1;

      v.joinTransactionPacket(u);
      
      if (D.TF(v.handle_io_open_request)) v.handle_io_open_request(t, j, rq);
     }
    }

    t.serveTransaction(0, 0, 1, u);



    return rq;
   };

   t.endRequest = function (s, v) {
    var r = t.getRequestByName(v.data.requestId), q = t.getResponseByName(v.data.responseId), i;
    r.is_open = 0;
    
    i = q.instruction;
    if (i.paginate) {
     if (!i.recordCount) i = q.responseData.length;
     if (!i.totalCount) i = i.recordCount;
    }
    s.closeTransaction(r.transactionId);

    H.message.service.publish("oncloseiorequest", r.id);
    if (D.TF(q.responseHandler)) q.responseHandler(t, v.data.subject, r, q);

    
   };
   t.continueRequest = function (r, o, b) {
    if (D.TS(r)) r = t.getRequestByName(r);
    if (!r) return 0;
    var p = t.getPacket(r.transactionName);
    if (!p || p.is_finalized || !D.TN(p.participants[o.i]) || p.participants[o.i] == 2) return 0;

    if (b) p.participants[o.i] = 2;
    t.serveTransaction(0, 0, 1, r.transactionName);
    return 1;
   };

   t.startTransaction = function (s, o) {
    return 1;
   };
   t.endTransaction = function (s, o) {
    
    return 1;
   };
   t.doTransaction = function (s, o) {
    return 1;
   };


   t.register = function (p, b, n, x) {
    var h;
    if (!H.registry.service.isRegistered(p) || t.getProviderByName(p.i))
     return 0;

    if (x && !p.handle_proxy_xml) p.handle_proxy_xml = function () {
     throw "handle_proxy_xml not implemented";
    };
    p.p.apiRegister = {};

    p.implement = function (m, a) {
     var f = "request" + m + a;
     if (D.TF(this[f])) this.p.apiRegister[f] = 1;
    };

    p.invokeHandler = function (v, s, r, q) {
     var o = 0,
                        b = "request",
                        c = "Catalog",
                        u = "Request",
                        a = "Action",
                        g = this.p.apiRegister,
                        f = 0,
                        m
                    ;
     f = b + c + r.requestAction;
     Hemi.logDebug("Check Invoke Handler: " + f + " from " + r.requestCatalog + " / " + r.requestAction + " / " + r.requestName);

     if (!g[f]) {
      f = b + a + r.requestAction;
      Hemi.logDebug("Check Invoke Handler: " + f + " from " + r.requestCatalog + " / " + r.requestAction + " / " + r.requestName);
     }

     if (g[f]) o = this[f](v, s, r, q);
     else Hemi.logDebug("No Handler Defined: " + this.getObjectType() + ":" + f);
     return o;
    };

    if (!D.TF(p.doTransaction))
     p.doTransaction = function (s, p) {
      var v = H.registry.service.getObject(p.data.serviceId), r, q, o = 1;

      if (v && (r = v.getRequestByName(p.data.requestId)) && (q = v.getResponseByName(p.data.responseId))) {
       if (D.TF(this.handle_io_request)) o = this.handle_io_request(v, p.data.subject, r, q);
       if (!o && this.p.useRegisteredApi) {
        o = this.invokeHandler(v, p.data.subject, r, q);
       }

       if (o) q.providerResponded[this.i] = 1;
      }
      return o;
     };

    if (!D.TF(p.endTransaction))
     p.endTransaction = function (s, p) {
      var v = H.registry.service.getObject(p.data.serviceId), r, q, o = 1;
      if (v && (r = v.getRequestByName(p.data.requestId)) && (q = v.getResponseByName(p.data.responseId)) && D.TF(this.handle_io_close_request))
       o = this.handle_io_close_request(v, p.data.subject, r, q);
      return o;
     };

    if (!H.transaction.service.register(p, 1)) return 0;

    if (!D.TN(b)) b = t.p.busType.ANY;

    var r, v = { providerId: p.i, bus: b, proxy: 0 };

    if ((r = this.addNewProvider(v, (n ? n : p.i)))) {
     if (D.TF(p.handle_io_register)) p.handle_io_register(t);
     if (x && H.lookup("hemi.data.io.proxy")) H.data.io.proxy.service.register(v, x);
    }

    return r;
   };

   t.isRegistered = function (o) {

    if (!o || !t.getProviderByName(o.i))
     return 0;

    return 1;
   };
   t.unregister = function (o, b) {
    var r = t.o.requests, i = 0, q, p;
    if (b)
     o = Hemi.registry.service.getObject(o.providerId);

    if (!o || !t.isRegistered(o)) return 0;

    if (D.TF(o.handle_io_unregister)) o.handle_io_unregister(t);

    for (; i < r.length; ) {
     q = r[i++];
     if (!q || !q.is_open) continue;

     b = H.transaction.service.removeTransactionParticipant(o, t.getPacket(q.transactionName));
     t.serveTransaction(0, 0, 1, q.transactionName);
    }
    p = t.getProviderByName(o.i);
    if (p.proxy && H.lookup("hemi.data.io.proxy")) H.data.io.proxy.service.unregister(p);
    t.removeProvider(p);
   };

   H.message.service.subscribe(t, "onsessionrefresh", "handle_session_refresh");
   H.message.service.subscribe(t, "onremoveobject", "H");
   t.r = 4;
  }
 }, 1);
} ());


(function () {

 
 
 
 

 H.namespace("data.io.proxy", H, {
  service: null,

  serviceImpl: function () {
   var t = this;
   t.p = {
    re: /^(none:)/,
    busType: 0,
    autoChangeBus: 1
   };
   t.o = {
    proxies: [],
    requests: []
   };
   H.prepareObject("io_proxy_service", "3.5.1", 1, t, 1);
   H.event.addScopeBuffer(t);

   t.buildMatcher = function () {
    var a = [], i;
    for (i in this.o.proxies) {
     if (D.TS(i)) a.push(i);
    }
    this.p.re = new RegExp("^(" + a.join("|") + ")");

   };
   t.unregister = function (o) {
    _p = t.o.proxies, b = 0, i = o.p.proxy;
    if (_p[i]) {
     delete _p[i];
     b = 1;
     t.buildMatcher();
    }
    return b;
    
   };
   t.register = function (o, p) {
    var _p = t.o.proxies, b = 0;
    if (!_p[p]) {
     _p[p] = o;
     o.proxy = p;
     b = 1;
     t.buildMatcher();
     this.log("Register proxy provider " + o.i + " for " + p + ":");
    }
    return b;
   };
   t.isProxyProtocol = function (p, b) {
    return (D.TS(p) && p.match(t.p.re));
   };
   t.isProxied = function (p, b) {
    var m, r;
    r = (
     D.TS(p)
     &&
     (m = p.match(t.p.re))
     &&
     (b ? b : t.p.busType) == t.o.proxies[m[0]].bus
    );
    
    
    return r;

   };
   t.setAutoChangeBus = function (b) {
    this.p.autoChangeBus = (b ? 1 : 0);
   };
   t.setBusType = function (i) {
    this.p.busType = i;
   };

   t.stripProxyProtocol = function (p) {
    if (D.TS(p)) p = p.replace(this.p.re, "");
    return p;
   };

   t._handle_change_bus = function (s, v) {
    var _p = this.p;
    if (v && D.TN(v.data.src) && _p.autoChangeBus)
     _p.busType = v.data.src;
   };

   t.proxyXml = function (p, h, a, i, x, d, c, t) {
    var b, o, r, _p = this.p, q, _o = this.o, v;
    b = (a ? false : null);
    if (!this.isProxied(p)) {
     this.logError("URI is not proxied: " + p);
     return b;
    }
    o = _o.proxies[p.match(_p.re)[0]];
    if (!o || !o.proxy || !(o = Hemi.registry.service.getObject(o.providerId))) {
     this.logError("Proxy provider no longer available for " + p);
     return b;
    }

    r = o.handle_proxy_xml(p.replace(_p.re, ""), i, x, d, t, _p.busType);
    if (!r) {
     this.logError("Error composing Data IO Request for " + p);
     return b;
    }
    v = {
     requestId: r.requestId,
     responseId: 0,
     textMode: t,
     xmlHandler: h,
     id: i
    };

    if (a) {
     r.async = 1;
     _o.requests[r.requestId] = v;
    }
    Hemi.data.io.service.openRequest(
     Hemi.data.io.service.getSubject(),
     r,
     (a ? this._prehandle_xml_io_request : 0)
    );
    if (a) return true;
    v.responseId = r.responseId;
    q = Hemi.data.io.service.getResponseByName(r.responseId);
    b = this.composeXmlResponse(v, q);
    H.message.service.publish("onloadxml", b);
    if (typeof h == D.F) h("onloadxml", b);
    return (t ? (t == 2 ? b.json : b.text) : b.xdom);

    

    

   };
   t._handle_xml_io_request = function (sv, sj, rq, rp) {
    var v, _o = this.o, b;
    v = _o.requests[rq.requestId];
    this.log("Handle IO Response");
    if (!v) {
     this.logError("Invalid proxy request: " + rq.requestId);
     return;
    }
    delete _o.requests[rq.requestId];
    b = this.composeXmlResponse(v, rp);
    if (!b) {
     this.logError("Invalid data for request " + rq.requestId);
     return;
    }
    H.message.service.publish("onloadxml", b);
    if (typeof v.xmlHandler == D.F) v.xmlHandler("onloadxml", b);

   };
   t.composeXmlResponse = function (v, rp) {
    var b = { id: v.id }, x;
    if (!rp || !rp.responseData.length) {
     this.logWarning("Response data not found.");
     return b;
    }
    x = rp.responseData[0];
    switch (v.textMode) {
     case 2:
      if (typeof JSON != D.U)
       b.json = JSON.parse(x.value, H.xml.JSONReviver);
      break;
     case 1:
      b.text = x.value;
      break;
     default:
      b.xdom = Hemi.xml.parseXmlDocument(x.value);
      break;
    }
    return b;

   };

   H.util.logger.addLogger(t, "IO Proxy Service", "Data IO Proxy Service", "662");
   t.r = 4;
   t.scopeHandler("xml_io_request", 0, 0, 1);
   H.transaction.service.register(t, 1);
   t.joinTransactionPacket("iobus");
  }
 }, 1);
} ());






(function(){
 
 H.namespace("data.validator", H, {
  service:null,
  serviceImpl:
function(){
   
   var t = this,
    _x = H.xml,
    _m = H.message.service;



   
   
   
   
   t.p = {
    p:0,
    l:0,
    a:0
   };

   t.G=function(o){
    return t.Q(o,null,0);
   };
   t.S=function(o,v){
    return t.Q(o,1,v);
   };

   t.Q = function(o,q,v){
    
    var r;
    switch(o.type){
     case "checkbox":
      if(!q) r = "" + o.checked;
      else{
       r = v;
       o.checked = (v == "true" ? true : false);
      }
     break;
     case "select-one":
     case "textarea":
     case "password":
     case "text":
      if(!q) r = o.value;
      else r = o.value = v;
      break;
     
     default:
      H.logWarning("Unhandled element: '" + o.type + "'");
      return 0;
      break;
    }
    return r;
   };
   t.getPattern = function(i){
    return H.data.validator.definitions.service.o.patterns[i];
   };

   t.getValidationErrorText = function(o){
    var r,i,p;
    

    if(!D.TO(o) && !D.TS(o)){
     return "Invalid field reference";
    } 
   
    if(D.TS(o)) i = o;
    else i = o.getAttribute("pattern-id");
   
    if(!i){
     return "Field doesn't define a validation pattern id";
    }
    
    p =  t.getPattern(i);
    if(!D.TO(p)){
     return "Pattern id '" + i + "' is not a valid id.";
    }
    
    if(p.error) r = p.error;
    else r = "Undefined error for " + i;
    
    return r;
    
   };

   t.getIsWebSafe = function(o){
    return t.validateField(o,"web-safe");
   };

   t.validateField = function(o,i){
    
   
    var r = 0,
     ir = 1,
     tir,
     pid = 0,
     po,
     v,
     c
    ;

    
    if(!D.TO(o)){
     _m.S("Invalid field reference in validateField.","200.4",1);
     return 0;
    }
    
    if(D.TS(i)) pid = i;
    else pid = o.getAttribute("pattern-id");
   
    
    if(!pid){
     _m.S("Skipping empty pattern","200.1");
     return 1;
    }
    
    po = t.getPattern(pid);

    
    if(!D.TO(po)){
     _m.S("Pattern id '" + pid + "' is invalid in validateField.","200.4",1);
     return 0;
    }
   
    for(c = 0; c < po.include.length;c++){
     
     tir = t.validateField(o,po.include[c]);
     if(ir && !tir) ir = 0;
    }
    
    v = t.G(o);
    
    
    if(D.TN(v) && v == 0){
     return 1;
    }
    if(D.TU(v)){
     _m.S("Value is undefined for " + n,"200.4",1);
     return 0;
    }
   
    if(po.match){
     try{
      re = new RegExp(po.match);
      switch(po.type){
       case "replace":
        r = 1;
        if(D.TS(po.replace)){
         v = v.replace(re,po.replace);
         t.S(o,v);
        }
        break;
       case "bool":
        H.log("Validating " + po.match + " against " + v);
        if(
         
         (po.allow_null && v.length == 0)
         ||
         (v.match(re) != null ) == po.comp
        ){
         r = 1;
        }
        break;
      }
     }
     catch(e){
      _m.S("Error in validator.validateField:: " + (e.description?e.description:e.message),"200.4",1);
     }
    }
    
    if(po.type == "none") r = 1;
    
    if(r && !ir) r = 0;
    
    return r;
   };

   H.IM(t,"base_object","xhtml_validator","3.5.1");
   H.registry.service.addObject(t);
   t.r = 4;

  }
 },1);
}());



(function () {

 
 if (!D.TU(document.attachEvent)) {
  if (!H.isImported("excanvas")) {
   H.include("excanvas", "3rdParty/");
   if (typeof G_vmlCanvasManager != "undefined")
    G_vmlCanvasManager.init_(document);
  }
 }
 
 
 
 H.namespace("graphics.canvas", H, {
  newInstance: function (oContainer) {
   var n = H.newObject("canvas", "3.5.1");
   n.p = {
    MouseTrackLeft: 0,
    MouseTrackTop: 0,
    MouseTrackDown: 0,
    MouseOffsetX: 0,
    MouseOffsetY: 0,
    DefaultShapeRadius: 20,
    DefaultShapeVerticalSpacing: 15,
    DefaultShapeHorizontalSpacing: 15,
    DefaultShapeGridUnit: (20 * 2) + (15 * 2),
    TransactionName: "canvas",
    PacketId: 0,
    IERasterMode: 0
   };
   n.o = {
    container: oContainer,
    canvas: 0,
    canvas_2d: 0,
    temp_canvas: 0,
    temp_canvas_2d: 0,


    shapes: [],
    temp_shapes: [],

    shape_track_map: [],

    ShapeDecorators: [],
    MouseDownShape: 0,
    MouseDropShape: 0

   };
   n.sigterm = function () {
    this.destroy();
   };
   n.destroy = function () {
    if (this.r != 5) {
     this.r = 5;
     this.Clear();
     var _p = this.o, _e = H.event.removeEventListener;
     _e(_p.temp_canvas, 'mousedown', this._prehandle_canvas_mouse);
     _e(_p.temp_canvas, 'mousemove', this._prehandle_canvas_mouse);
     _e(_p.temp_canvas, 'mouseup', this._prehandle_canvas_mouse);
     _e(_p.temp_canvas, 'click', this._prehandle_canvas_mouse);
     _p.canvas.parentNode.removeChild(_p.canvas);
     _p.temp_canvas.parentNode.removeChild(_p.temp_canvas);

    }
   };
   n.getContainer = function () {
    return this.o.container;
   };
   n.Initialize = function () {
    var oC = this.getContainer(), oT, _t = H.transaction.service, oP, _p = this.p, _o = this.o, _e = H.event.addEventListener;
    if (oC.nodeName.toLowerCase() != "canvas") {
     oC = document.createElement("canvas");
     this.getContainer().appendChild(oC);
    }
    _o.canvas = oC;
    if (typeof oC.getContext == "undefined") {
     if (typeof G_vmlCanvasManager != "undefined") {
      _p.IERasterMode = 1;
      G_vmlCanvasManager.initElement(oC);
     }
     if (typeof oC.getContext == "undefined") {
      this.serveTransaction("canvas_available", this);
      H.message.service.S("Browser does not support canvas", "200.4");
      return;
     }
    }
    oC.parentNode.style.position = "relative";
    _o.canvas_2d = oC.getContext("2d");
    oT = document.createElement("canvas");

    oT.style.cssText = "position:absolute;top:" + oC.offsetTop + "px;left:" + oC.offsetLeft + "px;";
    oT.width = oC.clientWidth;
    oT.height = oC.clientHeight;

    oC.parentNode.appendChild(oT);
    if (typeof oT.getContext == "undefined" && typeof G_vmlCanvasManager != "undefined") {
     G_vmlCanvasManager.initElement(oT);
    }
    _o.temp_canvas = oT;
    _o.temp_canvas_2d = oT.getContext("2d");



    this.scopeHandler("canvas_mouse", 0, 0, 1);
    _e(oT, 'mousedown', this._prehandle_canvas_mouse);
    _e(oT, 'mousemove', this._prehandle_canvas_mouse);
    _e(oT, 'mouseup', this._prehandle_canvas_mouse);
    _e(oT, 'click', this._prehandle_canvas_mouse);

    if (this.getContainer().getAttribute("height")) {
     this.Resize(this.getContainer().getAttribute("width"), this.getContainer().getAttribute("height"));
    }
    _p.canvas_supported = 1;

    H.object.addObjectAccessor(this, "config");
    this.addNewConfig(this.getContextConfig(), "default");

    this.joinTransactionPacket();

    this.serveTransaction("canvas_available", this);




   };
   n._handle_canvas_impl_available = function (ts, tp) {
    tp.data.src.SetCanvasComponent(this);
   };
   n.newContextConfig = function (z, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    var y = {
     stroke: a,
     fill: b,
     alpha: c,
     lineWidth: d,
     lineCap: e,
     lineJoin: f,
     miterLimit: g,
     shadowOffsetX: h,
     shadowOffsetY: i,
     shadowColor: j,
     globalComposite: k,
     font: l,
     textAlign: m,
     textBaseline: n
    };
    this.addNewConfig(y, z);
    return y;
   };
   n.setTemporaryContextConfig = function (c) {
    this.setContextConfig(c, this.getTemporaryContext());
   };
   n.getTemporaryContextConfig = function () {
    return this.setContextConfig(this.getTemporaryContext());
   };
   n.setContextConfig = function (c, o) {
    if (!o) o = this.getContext();
    if (typeof c == "string") c = this.getConfigByName(c);
    if (!c || !o) return;
    o.save();
    for (var i in c) {
     if (D.TU(c[i])) continue;
     o[i] = c[i];
    }
   };
   n.getContextConfig = function (c) {
    if (!c) c = this.getContext();
    var o = this.newContextConfig();
    for (var i in o) {
     o[i] = c[i];
    }
    return o;
   };
   n.getContext = function () {
    return this.o.canvas_2d;
   };
   n.getTemporaryContext = function () {
    return this.o.temp_canvas_2d;
   };
   n.AddShapeDecorator = function (o) {
    this.o.ShapeDecorators.push(o);
   };
   n.Clear = function () {
    this.ClearTempCanvas();
    this.ClearCanvas();
   };
   
   n.removeShape = function (o) {
    var _p = this.o,i=0,b=0,x=-1;
    if(!o) return b;
    for(; i < _p.shapes.length;i++){

     if(_p.shapes[i] && _p.shapes[i].id==o.id){
      delete _p.shapes[i];
      b = 1;
      x=i;
      break;
     }
    }
    if(x > -1){
     for(i = 0; i < _p.temp_shapes.length;i++){
      if(_p.temp_shapes[i] == x){
       delete _p.temp_shapse[i];
       break;
      }
     }
    }
    return b;
   };
   n.clearEventTrack = function(){
    var _p = this.o, _s = this.p;
    _p.shape_track_map = [];
    _p.MouseDropShape = 0;
    _p.MouseClickShape = 0;
    _p.MouseDownShape = 0;
    _p.MouseOverShape = 0;
    _s.MouseOffsetX = 0;
    _s.MouseOffsetY = 0;
    _s.MouseTrackChoose = 0;
    _s.MouseTrackDown = 0;
    _s.MouseTrackLeft = 0;
    _s.MouseTrackTop = 0;
   };
   
   n.clearTempShapes = function(){
    var _p = this.o,i=0;
    for(; i < _p.temp_shapes.length;i++){
     if(typeof _p.temp_shapes[i] != D.N) continue;
     delete _p.shapes[_p.temp_shapes[i]];
    }
    
    _p.temp_shapes = [];
   };
   
   n.ClearTempCanvas = function () {
    var _p = this.o,i=0;
    _p.shape_track_map = [];
    this.clearTempShapes();
    _p.temp_canvas_2d.clearRect(0, 0, _p.canvas.clientWidth, _p.canvas.clientHeight);
   };
   n.ClearCanvas = function () {
    var _p = this.o, a, i;
    this.clearEventTrack();
    _p.canvas_2d.clearRect(0, 0, _p.canvas.clientWidth, _p.canvas.clientHeight);
    _p.shapes = [];
    a = _p.canvas.parentNode.getElementsByTagName("span");
    for (i = a.length - 1; i >= 0; i--) {
     _p.canvas.parentNode.removeChild(a[i]);
    }

   };
   
   n.Draw = function (o, b, x) {
    var _p = this.o;
    if (typeof o != "object" || typeof o.type != "string") return;
    if (!o.rendered) {
     _p.temp_shapes.push(o.index);
     o.rendered = 1;
    }
    switch (o.type) {
     case "Triangle":
     case "Polygon":

      this.DrawPolygon(o);
      break;
     case "RoundedRect":

      this.DrawRoundedRect(o);
      break;
     case "Ellipse":

      this.DrawEllipse(o);
      break;
     case "Arc":

      this.DrawArc(o);
      break;
     case "Rect":

      this.DrawRect(o);
      break;
     case "Text":

      var bType = this.DrawText(o);
      if (bType == 2) o.is_html = 1;
      break;
     case "Image":

      this.DrawImage(o);
      break;
     default:
      alert("Unknown shape: " + o.type);
    }
   };
   n.DrawPolygon = function (o) {
    var _p = this.o, tc2, aP = o.points, oP, oLP = 0;
    tc2 = _p.temp_canvas_2d;

    tc2.beginPath();
    if (o.fillStyle) tc2.fillStyle = o.fillStyle;
    if (o.strokeStyle) tc2.strokeStyle = o.strokeStyle;
    for (var p = 0; p < aP.length; p++) {
     oP = aP[p];
     if (p == 0) {
      oLP = oP;
      tc2.moveTo(oP.x, oP.y);
     }
     else {
      tc2.lineTo(oP.x, oP.y);
     }



    }

    if (oLP && o.closePath) {
     tc2.lineTo(oLP.x, oLP.y);
    }

    if (o.fillStyle) tc2.fill();
    if (o.strokeStyle) tc2.stroke();
    tc2.closePath();
   };
   n.DrawRoundedRect = function (o) {
    if (!o.type == "RoundedRect") return;
    var x1 = o.x, x2 = o.x + o.width, y1 = o.y, y2 = o.y + o.height
      , dx, dy, _p = this.o, tc2
    ;
    tc2 = _p.temp_canvas_2d;
    dx = Math.abs(x2 - x1);
    dy = Math.abs(y2 - y1);

    var dmin = (dx < dy) ? dx : dy;
    var cornersize = (dmin / 2 >= 15) ? 15 : dmin / 2;

    var xdir = (x2 > x1) ? cornersize : -1 * cornersize;
    var ydir = (y2 > y1) ? cornersize : -1 * cornersize;

    tc2.beginPath();
    tc2.fillStyle = o.fillStyle;
    tc2.strokeStyle = o.strokeStyle;
    tc2.moveTo(x1, y1 + ydir);
    tc2.quadraticCurveTo(x1, y1, x1 + xdir, y1);
    tc2.lineTo(x2 - xdir, y1);
    tc2.quadraticCurveTo(x2, y1, x2, y1 + ydir);
    tc2.lineTo(x2, y2 - ydir);
    tc2.quadraticCurveTo(x2, y2, x2 - xdir, y2);
    tc2.lineTo(x1 + xdir, y2);
    tc2.quadraticCurveTo(x1, y2, x1, y2 - ydir);
    tc2.fill();
    tc2.stroke();
    tc2.closePath();

   };
   n.DrawEllipse = function (o) {
    if (!o.type == "Ellipse") return;

    var x1 = o.x,
      x2 = o.x2,
      y1 = o.y,
      y2 = o.y2,
      kappa = o.kappa,
      rx, ry, cx, cy,
       _p = this.o,
       tc2
    ;
    tc2 = _p.temp_canvas_2d;
    rx = (x2 - x1) / 2;
    ry = (y2 - y1) / 2;
    cx = x1 + rx;
    cy = y1 + ry;

    tc2.beginPath();
    tc2.fillStyle = o.fillStyle;
    tc2.strokeStyle = o.strokeStyle;
    tc2.moveTo(cx, cy - ry);
    tc2.bezierCurveTo(cx + (kappa * rx), cy - ry, cx + rx, cy - (kappa * ry), cx + rx, cy);
    tc2.bezierCurveTo(cx + rx, cy + (kappa * ry), cx + (kappa * rx), cy + ry, cx, cy + ry);
    tc2.bezierCurveTo(cx - (kappa * rx), cy + ry, cx - rx, cy + (kappa * ry), cx - rx, cy);
    tc2.bezierCurveTo(cx - rx, cy - (kappa * ry), cx - (kappa * rx), cy - ry, cx, cy - ry);
    tc2.fill();
    tc2.stroke();
    tc2.closePath();
   };
   n.DrawArc = function (o) {
    var _p = this.o, tc2, f = o.fillStyle, c = o.strokeStyle;
    tc2 = _p.temp_canvas_2d;

    tc2.beginPath();
    if (f) tc2.fillStyle = f;
    if (c) tc2.strokeStyle = c;
    tc2.arc(o.x, o.y, o.radius, o.startAngle, o.endAngle, false);

    if (o.slice) tc2.lineTo(o.x, o.y);
    tc2.closePath();
    if (c) tc2.stroke();
    if (f) tc2.fill();

   };
   
   n.DrawImage = function (o) {
    var _p = this.o, tc2, f = o.fillStyle, c = o.strokeStyle;
    tc2 = _p.temp_canvas_2d;

    
    if (f) tc2.fillStyle = f;
    if (c) tc2.strokeStyle = c;
    tc2.drawImage(o.image, o.x, o.y, o.image.width, o.image.height);
   };
   
   n.DrawRect = function (o) {

    var _p = this.o, tc2,
     x = o.x, y = o.y, w = o.width, h = o.height, b = 0, f = o.fillStyle, c = o.strokeStyle
    ;
    tc2 = _p.temp_canvas_2d;
    if (!f) f = tc2.fillStyle;
    if (!c)
     c = f;

    tc2.fillStyle = f;
    tc2.strokeStyle = c;

    if (f) tc2.fillRect(x, y, w, h);
    if (c) tc2.strokeRect(x, y, w, h);
   };
   n.DrawText = function (o) {

    var x = o.text, vX = o.x, vY = o.y, sColor = o.fillStyle, iH = 0, _o = this.o,
                    sF = (o.size ? o.size : "10px") + " " + (o.font ? o.font : "Courier");
    ;
    iH = _o.canvas.clientHeight;
    if (!sColor) sColor = "#000000";
    if (typeof _o.canvas_2d.measureText != "undefined") {
     _o.temp_canvas_2d.font = sF;
     _o.temp_canvas_2d.fillStyle = sColor;
     if (vX == "center") {
      var iW = _o.canvas.width;
      var iTW = _o.canvas_2d.measureText(x).width;
      if (iTW < iW) vX = (iW / 2) - (iTW / 2);
      else vX = 0;
     }
     vY += 10;
     _o.temp_canvas_2d.fillText(x, vX, vY);
     return 1;
    }
    else {

     var oT = document.createElement("span");
     oT.appendChild(document.createTextNode(x));
     oT.style.csx = "font: normal " + sF + ";color: " + sColor + ";position:absolute;top:" + vY + "px;left:" + vX + "px;";
     _o.canvas.parentNode.appendChild(oT);
     return 2;
    }
   };
   n.ConnectShapes = function (o1, o2, sT) {
    var _p = this.o, tc2, x1 = o1.x, x2 = o2.x,
                y1 = o1.y, y2 = o2.y, w1 = o1.width, w2 = o2.width,
                h1 = o1.height, h2 = o2.height,
                yM = 1, xM = 1
                ;
    tc2 = _p.temp_canvas_2d;
    if (!sT) sT = "elbow";
    this.log(sT + " for " + w1 + "x" + h1 + " at " + x1 + ", " + y1 + " to " + w2 + "x" + h2 + " at " + x2 + "," + y2);
    
    if (o1.type.match(/Rect/)) {
     if (x2 >= x1 && x2 < (x1 + w1)) {
      if ((y2 - h2 / 2) < y1) {
       this.log("top center: " + "(" + y2 + " + " + h2 + " / 2 ) < " + y1);
       x1 += parseInt(w1 / 2);
      }
      else if ((y2 + h2 / 2) > y1) {
       this.log("bottom center: " + "(" + y2 + " + " + h2 + " / 2 ) > " + y1);
       x1 += parseInt(w1 / 2);
       y1 += h1;
      }
      else {
       this.log("right center");
       x1 += w1;
      }


     }
     else {

      
      if (x2 > x1) x1 += w1;
      y1 += parseInt(h1 / 2);
      this.log("right center 1: " + x1 + ", " + y1);
     }

     if ((y2 + h2) < y1) {
      
      yM = 0;
      y2 += h2;
      x2 += parseInt(w2 / 2);
      this.log("bottom center 2: " + x2 + ", " + y2);
     }
     else {
      
      y2 += parseInt(h2 / 2);
      this.log("left center 2: " + x2 + ", " + y2);
     }
     
    }
    if (sT == "line" || x2 == x1 || y2 == y1) {
     tc2.beginPath();
     tc2.moveTo(x1, y1);
     tc2.lineTo(x2, y2);
     
     tc2.stroke();
     tc2.closePath();
    }
    else if (sT == "elbow") {
     tc2.beginPath();
     tc2.fillStyle = "#FF0000";
     tc2.strokeStyle = "#FF0000";

     var iMod = 0;
     iMod = parseInt(o1.width / 2);
     tc2.moveTo(x1, y1);
     tc2.lineTo(x1, y1 + (yM * 10));
     tc2.lineTo(x2, y1 + (yM * 10));
     tc2.lineTo(x2, y2);
     
     tc2.stroke();
     tc2.closePath();
    }
   },
   n.Rasterize = function () {
    var _p = this.o, a = [], i=0,x=0;

    
    _p.canvas_2d.drawImage(_p.temp_canvas, 0, 0);
    
    _p.temp_shapes = [];
    

    for(;i<_p.shapes.length;i++){
     if(!_p.shapes[i]) continue;
     a[x] = _p.shapes[i];
     a[x].index = x++;
    }
    _p.shapes = a;
    this.ClearTempCanvas();
   };
   n.Ellipse = function (x, y, x2, y2, f, b) {
    var o = this.NewEllipse(x, y, x2, y2, f, b);
    this.Draw(o);
    return o;
   };
   n.Circle = function (x, y, r, f, b) {
    var o = this.NewCircle(x, y, r, f, b);
    this.Draw(o);
    return o;
   };
   n.RoundedRect = function (x, y, w, h, f, b) {
    var o = this.NewRoundedRect(x, y, w, h, f, b);
    this.Draw(o);
    return o;
   };
   n.Triangle = function (x, y, w, h, f, b) {
    var o = this.NewTriangle(x, y, w, h, f, b);
    this.Draw(o);
    return o;
   };
   n.Rect = function (x, y, w, h, f, b) {
    var o = this.NewRect(x, y, w, h, f, b);
    this.Draw(o);
    return o;
   };
   n.Text = function (e, x, y, f, s, sFz, sFf) {
    var o = this.NewText(e, x, y, f, s, sFz, sFf);
    this.Draw(o);
    return o;
   };
   n.Image = function (e, x, y, f, s) {
    var o = this.NewImage(e, x, y, f, s);
    this.Draw(o);
    return o;
   };
   n.Arc = function (x, y, r, s, e, b, f, k) {
    var o = this.NewArc(x, y, r, s, e, b, f, k);
    this.Draw(o);
    return o;
   };
   n.NewEllipse = function (x, y, x2, y2, f, s) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
     this.NewShape(i, "Ellipse", f, s),
     {
      x: x,
      y: y,
      x2: x2,
      y2: y2,
      kappa: 4 * ((Math.sqrt(2) - 1) / 3)
     }
    );
   };
   n.NewArc = function (x, y, r, s, e, b, f, k) {
    var i = this.o.shapes.length, v = (Math.PI / 180);
    return this.o.shapes[i] = this.Merge(

     this.NewShape(i, "Arc", f, k),
     {
      x: x,
      y: y,
      radius: r,
      startAngle: s * v,
      endAngle: e * v,
      slice: b
     }
    );
   };
   n.NewCircle = function (x, y, r, f, s) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
     this.NewShape(i, "Arc", f, s),
     {
      x: x,
      y: y,
      radius: r,
      startAngle: 0,
      endAngle: Math.PI * 2
     }
    );
   };
   n.NewImage = function (e, x, y, f, s) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
     this.NewShape(i, "Image", f, s),
     {
      x: x,
      y: y,
      image: e
     }
    );
   };
   n.NewText = function (e, x, y, f, s, sFz, sFf) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
     this.NewShape(i, "Text", f, s),
     {
      x: x,
      y: y,
      text: e,
      size: sFz,
      font: sFf
     }
    );
   };
   n.NewRoundedRect = function (x, y, w, h, f, s) {
    var o = this.NewRect(x, y, w, h, f, s);
    o.type = "RoundedRect";
    return o;
   };
   n.NewPoint = function (iX, iY) {
    return { x: iX, y: iY };
   };
   n.NewTriangle = function (x, y, w, h, f, s) {
    var iT = parseInt(y - h / 2), aP = [];
    aP.push(this.NewPoint(x, parseInt(y - h / 2)));
    aP.push(this.NewPoint(parseInt(x - w / 2), parseInt(y + h / 2)));
    aP.push(this.NewPoint(parseInt(x + w / 2), parseInt(y + h / 2)));
    var o = this.NewPolygon(aP, f, s);
    o.type = "Triangle";
    o.closeShape = 1;
    return o;
   };
   n.NewPolygon = function (aP, f, s) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
      this.NewShape(i, "Polygon", f, s),
      {
       points: aP,
       closeShape: 0
      }
     );
   };
   n.NewRect = function (x, y, w, h, f, s) {
    var i = this.o.shapes.length;
    return this.o.shapes[i] = this.Merge(
      this.NewShape(i, "Rect", f, s),
      {
       x: x,
       y: y,
       height: h,
       width: w
      }
     );
   };
   n.NewShape = function (i, y, f, s) {

    return {
     index: i,
     type: y,
     layerIndex: 0,
     fillStyle: f,
     strokeStyle: s,
     id: H.guid(),
     rendered: 0,
     children: [],
     parent: 0,
     is_html: 0,
     reference_id: -1,
     selectable: 1
    };
   };
   n.Merge = function (s, t) {
    for (var i in s) {
     if (typeof t[i] == "undefined") t[i] = s[i];
    }
    return t;
   };
   n.getShapeById = function (x) {
    var _p = this.o,i =0, o;
    for(i=0; !o && i < _p.shapes.length;i++){
     if(!_p.shapes[i]) continue;
     if(_p.shapes[i].id == x){
      o = _p.shapes[i];
      break;
     }
    }
    return o;
   };
   n.ShapeAt = function (x, y) {
    var _p = this.o;
    if (typeof _p.shape_track_map[x] == "object" && typeof _p.shape_track_map[x][y] == "number") {
     return _p.shapes[_p.shape_track_map[x][y]];
    }

    var oS = this.FindShapeAt(x, y);
    if (oS) {
     if (typeof _p.shape_track_map[x] != "object") _p.shape_track_map[x] = [];
     _p.shape_track_map[x][y] = oS.index;
    }
    return oS;
   };
   n.FindShapeAt = function (x, y) {
    var oShape, oMatch = 0, _p = this.o;
    
    var aS = _p.shapes;
    
    for (var i = aS.length - 1; i >= 0; i--) {
     if (!(oShape = aS[i]) || !oShape.selectable) continue;
     switch (oShape.type) {

      case "Arc":
       if (x >= oShape.x && x <= (oShape.x + (oShape.radius * 2)) && y >= oShape.y && y <= (oShape.y + (oShape.radius * 2))) oMatch = oShape;
       break;
      case "Rect":
       if (x >= oShape.x && x <= (oShape.x + oShape.width) && y >= oShape.y && y <= (oShape.y + oShape.height)) oMatch = oShape;
       break;
      case "Image":
       if (x >= oShape.x && x <= (oShape.x + oShape.image.width) && y >= oShape.y && y <= (oShape.y + oShape.image.height)) oMatch = oShape;
       break;
      default:
       break;
     }
     if (oMatch) break;
    }
    return oMatch;
   };
   n.handle_canvas_click = function (e) {
    if(this.getProperties().blockClick){
     this.log("Internal cancel click event");
     this.getProperties().blockClick = 0;
     return false;
    }
    this.o.MouseClickShape = this.ShapeAt(this.p.MouseTrackLeft, this.p.MouseTrackTop);
    var r = this.dispatch_decorators(e);
    this.o.MouseClickShape = 0;
    return r;
   };
   n.handle_canvas_mousemove = function (e) {
    var _o = this.o, _s = this.p,ld=0,r;
    _o.MouseDropShape = this.ShapeAt(_s.MouseTrackLeft, _s.MouseTrackTop);
    this.dispatch_decorators(e);
    
    
    if(_o.MouseOverShape && (!_o.MouseDropShape || _o.MouseDropShape.id != _o.MouseOverShape.id)){
     ld = _o.MouseOverShape.id;
     r = this.dispatch_decorators(e, "mouseout");
     
     _o.MouseOverShape = 0;
    }
    if(_o.MouseDropShape && _o.MouseDropShape.id != ld && !_o.MouseOverShape){
     _o.MouseOverShape = _o.MouseDropShape;
     r = this.dispatch_decorators(e, "mouseover");
    }
    return r;
   };

   n.handle_canvas_mouseup = function (e) {
    var _s = this.p;
    var r = this.dispatch_decorators(e);
    _s.MouseTrackDown = 0;
    this.o.MouseDownShape = 0;
    this.o.MouseDropShape = 0;
    _s.MouseTrackChoose = 0;
    _s.MouseOffsetX = 0;
    _s.MouseOffsetY = 0;
    if(typeof r != D.U && !r) this.getProperties().blockClick = 1;
    return r;
   };
   n.dispatch_decorators = function (e,a) {
    var aD = this.o.ShapeDecorators, s = (a ? a : e.type),r,z;
    
    for (var i = 0; i < aD.length; i++) {
     if (typeof aD[i]["handle_canvas_" + s] == "function"){
      z = aD[i]["handle_canvas_" + s](this, e);
      if(typeof z != "undefined" && !z) r = false;
     }
    }
    return r;
   };
   n.handle_canvas_mousedown = function (e) {
    var _s = this.p;
    _s.MouseTrackDown = 1;
    if(this.registerMouseDownShape(e)){
     _s.MouseTrackChoose = 1;
    }
    return this.dispatch_decorators(e);
   };
   n.registerMouseDownShape = function(e){
    var _s = this.p;
    var oShape = this.ShapeAt(_s.MouseTrackLeft, _s.MouseTrackTop);
    if (oShape) {
     this.o.MouseDownShape = oShape;
     _s.MouseOffsetX = _s.MouseTrackLeft - oShape.x;
     _s.MouseOffsetY = _s.MouseTrackTop - oShape.y;
    }
    return oShape;
   };
   n._handle_canvas_mouse = function (e) {
    e = H.event.getEvent(e);
    var sHandler = "handle_canvas_" + e.type, r;
    this.p.MouseTrackLeft = (typeof e.layerX == "number" ? e.layerX : e.offsetX);
    this.p.MouseTrackTop = (typeof e.layerY == "number" ? e.layerY : e.offsetY);

    if (typeof this[sHandler] == "function") r = this[sHandler](e);
    return r;
   };
   n.Resize = function (x, y) {
    var _p = this.o;
    this.getContainer().style.width = x;
    this.getContainer().style.height = y;
    _p.canvas.setAttribute("height", y);
    _p.canvas.setAttribute("width", x);
    _p.temp_canvas.setAttribute("height", y);
    _p.temp_canvas.setAttribute("width", x);
    _p.temp_canvas.style.cssText = "position:absolute;top:" + _p.canvas.offsetTop + "px;left:" + _p.canvas.offsetLeft + "px;";
   };

   H.event.addScopeBuffer(n);
   H.registry.service.addObject(n);
   H.transaction.service.register(n, 1);

   H.util.logger.addLogger(n, "Canvas Instance", "Canvas Instance", 230);

   n.r = 4;
   n.Initialize();

   return n;
  }
 });
} ());






(function () {
    
    
    H.namespace("storage.iestore", H, {
        
        st: "IEStorage",
        bs: 0,
        bsr: 0,
        cs: 0,
        bsn: "IEStorageProvider",

        getPreferredStorage: function () {
            return H.storage.iestore.gP();
        },
        gP: function () {
            var s = H.storage.iestore;
            if (!s.cs) s.init();
            return s.bs;
        },
        init: function () {
            var s = H.storage.iestore, o, br;

            o = document.createElement("div");

            o.style.cssText = "position:absolute;display:none;width:1px;height:1px;top:0px;left:0px;";
            document.body.appendChild(o);
            o.addBehavior("#default#userData");

            if (typeof o.XMLDocument != "undefined") {
                o.load(s.bsn);
                s.bs = o;
                br = s.bsr = H.util.config.newInstance();
                br.setElementParentName("c");
                br.setElementName("p");
                br.setAttrNameName("n");
                br.setAttrValueName("v");
                br.parseConfig(o.XMLDocument);
            }
            else {
                Hemi.logWarning("userData XML document not defined");
            }
            s.cs = 1;
            return s.bs;
        },

        getLength: function () {
            var o, s = H.storage.iestore, i = 0, ar, r = 0;
            o = s.gP();
            if (!o) return 0;
            if (s.bs) {
                ar = s.bsr.getParams();
                for (; i < ar.length; i++)
                    if (ar[i] != null && ar[i].value != null && typeof ar[i].value != "undefined") r++;

                return r;
            }
            return 0;
        },
        removeItem: function (n) {
            H.storage.iestore.setItem(n, null);
        },
        getItem: function (n) {
            var o, s = H.storage.iestore;
            o = s.gP();
            if (!o) return 0;
            if (s.bs) {
                return unescape(s.bsr.getParam(n));
            }
            return null;
        },
        setItem: function (n, v) {
            var o, s = H.storage.iestore;
            o = s.gP();
            if (!o) return 0;
            if (s.bs) {
                s.bsr.writeParam(s.bs.XMLDocument, n, escape(v));
                s.bs.save(s.bsn);
                return 1;
            }
            return 0;
        },

        key: function (i) {
            var o, s = H.storage.iestore, ar, m = 0, n = 0, z = 0;
            o = s.gP();
            if (!o || i < 0) return 0;
            if (s.bs) {
                ar = s.bsr.getParams();
                for (; n < ar.length; n++) {
                    if (ar[i].value == null || typeof ar[i].value == "undefined") continue;
                    if (m == i) {
                        z = ar[i].name;
                        break;
                    }
                    m++;
                }
                return z;
            }
            return 0;
        },

        clear: function () {
            var o, s = H.storage.iestore, ar, m = 0, n = 0, z = 0;
            o = s.gP();
            if (!o) return 0;
            ar = s.bsr.getParams();
            for (var i = ar.length - 1; i >= 0; i--) {
                if (ar[i].value == null || typeof ar[i].value == "undefined") continue;
                s.bsr.writeParam(s.bs.XMLDocument, ar[i].name, null);
            }
            s.bs.save(s.bsn);
            s.bsr.clearConfig();

        }

    });
} ());
















(function () {
    if (typeof localStorage != "undefined") {
        
    }
    if (!D.TU(document.documentElement.addBehavior)) {
        
    }
    H.namespace("storage", H, {



        v: "3.5.1",

        sp: 0,

        pst: "auto",

        psts: ["auto", "local", "session", "global"],

        getStorageProvider: function () {
            var o = H.storage.sp;
            if (o) return o;

            if (!D.TU(H.storage.dom))
                o = H.storage.tR(H.storage.dom);
            if (!o && !D.TU(H.storage.iestore))
                o = H.storage.tR(H.storage.iestore);

            H.storage.sp = o;
            return o;

        },
        
        tR: function (p) {
            var n = H.guid(), v = "~hsj", c;
            p.setItem(n, v);
            c = p.getItem(n);
            p.removeItem(n);
            return (c ? p : 0);

        },
        testStorageSupported: function () {
            return (H.storage.getStorageProvider() != null && H.storage.getStorageProvider().getPreferredStorage() != null ? 1 : 0);
        }
    });
} ());



(function(){
 
 H.namespace("web.security", H, {

  PageTickets : [],

  AddPageTicket : function(i,u){
   var _p = H.web.security.PageTickets;
   H.web.security.PageTickets.push({
    id:i,
    uri:u
   });
   
  },
  GetSession : function(){
   return H.registry.service.getObject("session");
  },
  IsAuthenticated : function(){
   var o = H.web.security.GetSession();
   if(!o) return 0;
   return o.GetBoolParam("IsLoggedIn");
  }
 });
}());

(function () {

    
    
    
    
    


    H.namespace("worker", H, {
        service: null,

        serviceImpl: function () {
            var t = this;
            H.IM(t, "base_object", "worker_service", "3.5.1");
            H.util.logger.addLogger(t, "Worker Service", "Worker Service", "630");

            H.registry.service.addObject(t);
            t.r = 4;
            



            t.NewWorker = function (p, x) {

                var w;

                if (typeof Worker != "undefined") {
                    w = new Worker(Hemi.hemi_base + "Workers/worker.bootstrap.js");
                    w.onmessage = this._prehandle_worker;
                    w.postMessage('_hwi:' + p);
                }
                else {
                    w = Hemi.newObject("proxy_worker", "3.5.1", 1, 0, {
                        object_create: function () {
                            this.getObjects().module = Hemi.app.module.service.NewModule(p, null, "Workers/", {
                                DecorateModuleContent: function () {
                                    return "var WorkerProxy = null;"
                                        +
                                        "function postMessage(v){var d = [{ data: v }];if(WorkerProxy && typeof WorkerProxy.onmessage == 'function'){WorkerProxy.onmessage.apply(this,d);}};"
                                        +
                                        "this._hwimessage_ = function(){if(typeof onmessage == 'function' && !onmessage.toString().match(/_hwdNo/)){onmessage.apply(this,arguments);}};"
                                        +
                                        "this.SetWorkerProxy = function(o){ WorkerProxy = o;};"
                                    ;
                                }
                            });
                            this.getObjects().module.SetWorkerProxy(this);
                        },
                        postMessage: function (v) {
                            var d = [{ data: v}];
                            this.getObjects().module._hwimessage_.apply(this.getObjects().module, d);
                        }
                    });
                }
                
                return w;
            };
            
            t.DecorateModuleContent = function () {
                var s =
                    (Hemi.in_worker ? "" : "function postMessage(v){Module._hwimessage_(v);};")
                    +
                    "this._hwimessage_ = function(){if(typeof onmessage == 'function' && !onmessage.toString().match(/_hwdNo/)){onmessage.apply(this,arguments);}};"
                  ;
                return s;
            };
        }
    }, 1);
} ());


(function () {
 
 
 H.namespace("framework.io.provider", H, {
  service: null,

  serviceImpl: function () {
   var t = this;

   H.prepareObject("hemi_framework_io_provider", "3.5.1", 1, t, 1);
   H.util.logger.addLogger(t, "Hemi Framework IO Provider", "Hemi Framework IO Provider", "660");
   Hemi.event.addScopeBuffer(t);
   t.scopeHandler("loadxml", 0, 0, 1);

   t.handle_io_register = function (sv) {
    this.getProperties().useRegisteredApi = 1;
    this.implement("Catalog", "List");
    this.implement("Action", "Read");
   };
   t.handle_io_request = function (sv, sj, rq, rp) {
    this.getProperties().request = 1;
    return 0;
   };

   t.handleRequestAction = function (sv, sj, rq, rp, a) {
    n = rq.requestName;
    if (!n) n = rq.requestId;
    t.log("handleRequestAction: " + a + ": " + Hemi.hemi_base + rq.requestContext + "/" + n);
    return Hemi.xml[(rq.mimeType && rq.mimeType.match(/^text/) ? "getText" : "getXml")](rq.requestContext + "/" + n, (rq.async ? this._prehandle_loadxml : 0), rq.async, rq.id);
   };

   t.requestActionRead = function (sv, sj, rq, rp) {
    this.log("ActionRead - " + rq.application + "/" + rq.requestContext + "/" + rq.requestCatalog + "/" + rq.requestName + " [#" + rq.requestId + "]/" + rq.requestAction);
    var oR = this.handleRequestAction(sv, sj, rq, rp, "Read");
    if (rq.async)
     return 0;
    
    this.writeRawData(rq, rp, v.xdom, rp.responseData);
    return 1;

   };

   t.requestCatalogList = function (sv, sj, rq, rp) {
       var _ra = rq.requestApplication;
    if (_ra != "DWAC" && _ra != "HemiFramework" && _ra != "Explorer") {
     this.logDebug("Skip Request: " + rq.requestApplication);
     return 1;
    }

    var b = 0, a, r = H.data.io.service.newPolicy(), ctx = rq.requestContext;
    r.read = 1;
    t.log("Catalog: " + _ra + "/" + ctx + "/" + rq.requestCatalog + " [#" + rq.requestId + "]");
    switch (rq.requestCatalog) {
     case "Components":
     case "Fragments":
     case "Modules":
     case "Tests":
     case "Templates":
     case "Workers":
     case "Projects":
     case "Pub":
                    case "Framework":
     case "Tasks":
      if (ctx == "Directory") t.RenderGroup(rp, rq.requestCatalog, r);
      else if (ctx == "Data") {
       try {
        if (t["RenderData" + rq.requestCatalog]) t["RenderData" + rq.requestCatalog](rp, r);
       }
       catch (e) {
        t.logError((e.message ? e.message : e.description));
       }
      }
      b = 1;
      break;
              case "Examples":

                  var g = H.data.io.service.newGroup();
                  g.name = "Examples";
                  g.path = g.name;
                  g.populated = 1;
                  rp.writeGroup(g, r);

                  rp.writeGroupArray(t.getHemiExampleGroups(r, "/" + rq.requestCatalog + "/"), t, g.groups, sv.getBusType().STATIC);
                  b = 1;
                  break;
     case "Hemi":
     case "DWAC":

      var g = H.data.io.service.newGroup();
      g.name = "DWAC";
      g.path = g.name;
      g.populated = 1;
      rp.writeGroup(g, r);

      rp.writeGroupArray(t.getHemiGroups(r, "/" + rq.requestCatalog + "/"), t, g.groups, sv.getBusType().STATIC);
      b = 1;
      break;
    }
    if (!b) {
     this.logWarning("Unhandled Request Catalog: " + rq.requestCatalog);
     b = 1;
    }
    return b;
   };
   t._handle_loadxml = function (s, v) {
    try {

     var rq = Hemi.data.io.service.getRequestByName(v.id), rp;
     if (!rq) {
      this.logError("Invalid request for id " + v.id);
      return;
     }
     rp = Hemi.data.io.service.getResponseByName(rq.responseId);
     if (!rp) {
      this.logError("Invalid response for id " + v.id);
      return;
     }
     if (rq.requestAction == "Read")
      this.writeRawData(rq, rp, (v.xdom ? v.xdom : v.text), rp.responseData);
     
     Hemi.data.io.service.continueRequest(rq, this, true);

    }
    catch (e) {
     alert(e.name + "\n" + e.number + "\n" + e.description + "\n" + e.message);
    }
   };
   t.writeRawData = function (rq, rp, x, a) {
    var o = Hemi.data.io.service.newData(), p = H.data.io.service.newPolicy();
    var s = D.TO(x) ? escape(Hemi.xml.serialize(x.documentElement)) : x;
    p.read = 1;
    o.name = (rq.requestName ? rq.requestName : rq.requestId);
    o.path = rq.requestContext + "/" + o.name;
    o.id = rq.requestId;
    o.group = rq.requestContext;
    o.size = s.length;
    o.description = 0;
    o.createdDate = "3.5.1";
    o.modifiedDate = 0;
    o.detailsOnly = 0;
    o.hash = 0;
    o.mimeType = "text/xml";
    o.value = s;
    o.policies.push(p);

    rp.writeData(o, t, a, Hemi.data.io.service.getBusType().STATIC);

    return o;
   };
            t.RenderDataFramework = function (rp, y) {
                t.RenderDataList(rp, t.getFrameworkData(y));
            };
   t.RenderDataComponents = function (rp, y) {
    t.RenderDataList(rp, t.getComponentData(y));
   };
   t.RenderDataModules = function (rp, y) {
    t.RenderDataList(rp, t.getModuleData(y));
   };
   t.RenderDataTemplates = function (rp, y) {
    t.RenderDataList(rp, t.getTemplateData(y));
   };
   t.RenderDataFragments = function (rp, y) {
    t.RenderDataList(rp, t.getFragmentData(y));
   };
   t.RenderDataTests = function (rp, y) {
    t.RenderDataList(rp, t.getTestData(y));
   };
   t.RenderDataList = function (rp, a) {
    if (rp.instruction.paginate) {
     rp.instruction.totalCount = a.length;
     a = a.slice(rp.instruction.startRecord, rp.instruction.startRecord + rp.instruction.recordCount);
    }
    for (var i = 0; i < a.length; i++) {
     a[i].createdDate = "3.5.1";
     a[i].modifiedDate = "3.5.1";
    }
    rp.writeDataArray(a, t, 0, Hemi.data.io.service.getBusType().STATIC);
   };
   t.RenderGroup = function (rp, n, y) {
    var g = H.data.io.service.newGroup();
    g.name = n;
    g.path = g.name;
    g.populated = 1;
    rp.writeGroup(g, y);
    return g;
            };
            t.getHemiExampleGroups = function (o, p) {
                return H.data.io.service.arrayToGroup(
                                [
                                    "Framework",
                                    "Fragments",
                                    "Templates",
                                    "Projects",
         "Tasks",
                                    "Tests",
                                    "Spaces",
                                    "Components",
                                    "Modules"
                                ],
                                o,
                                p
                );
            };
   t.getHemiGroups = function (o, p) {
    return H.data.io.service.arrayToGroup(
                    [
                        "Components",
                        "Fragments",
                        "Modules",
                        "Projects",
      "Pub",
                        "Tasks",
                        "Tests",
                        "Templates",
                        "Workers"
                    ],
                    o,
                    p
    );
                };
                t.getFrameworkData = function (o) {
                    return H.data.io.service.arrayToData(
                     [
          "setup.examples",
                      "framework.object.new",
          "framework.object.hook",
                                        "framework.object.prepare"
                     ],
                                    o
                                );
                };
   t.getComponentData = function (o) {
    return H.data.io.service.arrayToData(
     [
      "component.canvas.xml",
      "component.content_viewer.xml",
      "component.draggable.xml",
      "component.dragtracker.xml",
      "component.manager.xml",
      "component.session.xml",
      "component.steps.xml",
      "component.tabstrip.xml",
      "component.tree.xml",
      "component.tree_context.xml",
      "component.tree_decorator.xml",
      "component.wideselect.xml",
      "component.window.xml"
     ].sort(),
                    o
                );
   };
   t.getFragmentData = function (o) {
    return H.data.io.service.arrayToData(
     [
      "ActiveSource.xml",
      "BuilderControls.xml",
      "EngineStats.xml",
      "FrameworkAPIBrowser.xml",
      "FunMonInject.xml",
      "IOGrid.xml",
      "JavaScriptProfilerInject.xml",
      "MemberModelTools.xml",
      "RichSelect.xml",
      "RuntimeContainer.xml",
      "ScopeViewer.xml",
      "ScriptProfiler.xml",
      "TabTools.xml",
      "TestSuite.xml"
     ].sort(),
                    o
                );
   };
   t.getModuleData = function (o) {
    return H.data.io.service.arrayToData(
     [
      "console.output.js",
      "module.template.js",
                        "module.debug.js",
                        "dwac.offline.helper.js"
     ].sort(),
                    o
                );
   };
   t.getTemplateData = function (o) {
    return H.data.io.service.arrayToData(
     [
      "ActiveSource.xml",
      "ComponentBuilder.xml",
      "DWACDesigner.xml",
      "FragmentBuilder.xml",
      "FrameworkAPIBrowser.xml",
      "FrameworkDesigner.xml",
      "FrameworkProfiler.xml",
      "FVTs.xml",
      "IOGridTemplate.xml",
      "LogViewer.xml",
      "NewComponent.xml",
      "NewFragment.xml",
      "NewProject.xml",
      "NewTask.xml",
      "NewTaskList.xml",
      "NewTemplate.xml",
      "Picker.xml",
      "ProjectBuilder.xml",
      "RichSelectTemplate.xml",
      "RuntimeContainer.xml",
      "TaskBuilder.xml",
      "TemplateBuilder.xml",
      "TemplateTools.xml",
      "TestSuite.xml",
      "TextViewer.xml",
      "XslTransformer.xml"
     ].sort(),
                    o
                );
   };
   t.getTestData = function (o) {
    return H.data.io.service.arrayToData(
     [
     "test.app.comp.js",
     "test.app.comp.altdata.js",
     "test.app.space.js",
     "test.data.form.js",
     "test.data.io.js",
                    "test.data.io.offline.js",
     "test.data.validator.js",
     "test.framework.io.provider.js",
     "test.graphics.canvas.js",
     "test.message.js",
     "test.module.js",
     "test.monitor.js",
     "test.object.js",
     "test.object.xhtml.js",
     "test.storage.js",
     "test.task.js",
     "test.transaction.js",
                    "test.util.config.js",
     "test.xml.js",
     "test.worker.js"
     ].sort(),
                    o
                );
   };

   t.r = 4;
   H.data.io.service.register(t, Hemi.data.io.service.getBusType().STATIC);

  }
 }, 1);
} ());


(function () {
    
    
    
    
    
    H.namespace("framework.io.offline.provider", H, {
        service: null,

        serviceImpl: function () {
            var t = this;

            H.prepareObject("hemi_framework_io_offline_provider", "3.5.1", 1, t, 1);
            H.util.logger.addLogger(t, "Hemi Framework Offline IO Provider", "Hemi Framework Offline IO Provider", "663");
            t.getProperties().hfs_key = "_hfs_";

            t.handle_io_register = function (sv) {
                this.getProperties().useRegisteredApi = 1;
                this.implement("Catalog", "List");
                this.implement("Action", "CheckName");
                this.implement("Action", "Add");
                this.implement("Action", "Delete");
                this.implement("Action", "Edit");
                this.implement("Action", "Read");
            };


            
            t.handle_proxy_xml = function (p, i, x, d, t, bt) {
                var oD = 0,
     sA = "Read",
     sN = 0,
     sId = 0,
     bFull = 1,
     sFile = 0
    ;
                

                if (!p.match(/^\/DWAC/)) p = "/DWAC/Anonymous/" + p;

                var q = p.split("/");
                sFile = q[4];
                if (q[4].match(/\?/)) sFile = q[4].substring(0, q[4].lastIndexOf("?"));
                if (sFile.match(/^ID\-/)) sId = sFile.replace(/^ID\-/, "");
                else sN = sFile;

                var rq = Hemi.data.io.service.newIORequest(
     bt,
     "DWAC",
     q[3],
     0,
     sA,
     sId,
     sN,
     (bFull ? 0 : 1),
     0,
     0,
     0
    );

                rq.mimeType = (t ? "text/javascript" : "text/xml");
                this.log("Composed proxy request for " + p);
                
                return rq;

            };

            t.handle_io_request = function (sv, sj, rq, rp) {
                this.getProperties().request = 1;
                return 0;
            };
            t.requestActionCheckName = function (sv, sj, rq, rp) {
                var b = 1;
                var oG = this.GetGroup(rq.requestContext);
                if (oG) rp.status = (this.CheckData(oG, rq.requestName) ? true : false);
                return 1;
            };
            t.requestActionDelete = function (sv, sj, rq, rp) {
                var b = 1;
                var oG = this.GetGroup(rq.requestContext);
                if (!oG)
                    t.logWarning("Group '" + rq.requestContext + "' does not exist");
                else {
                    var r = -1, oD;
                    for (var i = 0; i < oG.data.length; i++) {
                        oD = oG.data[i];
                        if ((typeof oD.id == "number" && oD.id == rq.requestId) || oD.name == rq.requestName) {
                            r = i;
                            break;
                        }
                    }
                    if (r >= 0) {
                        t.log("Deleting " + rq.requestName + " at " + r);
                        oG.data.splice(r, 1);
                        if (t.SaveGroup(oG)) {
                            t.log("Saved group '" + oG.name + "'");
                            rp.status = true;
                        }
                        else {
                            t.logWarning("Unable to save group '" + oG.name + "'");
                        }
                    }
                }
                return b;
            };
            t.DeserializeFormData = function (oD) {
                if (!oD.name.match(/serial_form_data/) || !oD.postData || oD.mimeType != "application/xml") return;
                oD.mimeType = "text/xml";
                var aE = oD.value.documentElement.getElementsByTagName("Element");
                for (var i = 0; i < aE.length; i++) {
                    var sN = t.GT(aE[i], "Name");
                    var sValue = t.GT(aE[i], "Value");
                    if (sN.match(/_id$/)) oD.id = parseInt(sValue);
                    else if (sN.match(/_name$/)) oD.name = sValue;
                    else if (sN.match(/_description$/)) oD.description = sValue;
                    else if (sN.match(/_text$/)) oD.value = unescape(sValue);
                }
            };
            t.GT = function (oP, sN) {
                var a = oP.getElementsByTagName(sN);
                if (a.length == 0) return "";
                return Hemi.xml.getInnerText(a[0]);
            };
            t.requestActionCheckName = function (sv, sj, rq, rp) {
                var b = 1;
                rp.status = true;
                var oG = this.GetGroup(rq.requestContext);
                if (!oG)
                    oG = this.AddGroup(rq.requestContext);

                if (!oG) {
                    t.logWarning("Invalid group: " + rq.requestContext);
                    return b;
                }
                var oD = rq.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                t.DeserializeFormData(oD);

                var oD2 = t.GetData(oG, oD.name);

                if (oD2 && oD2.id != oD.id) {
                    t.logWarning("Data '" + oD.name + "' already exists :: " + oD2.name + " / " + oD2.id + "==" + oD.id);
                    return b;
                }
                rp.status = false;
                return b;
            };
            t.requestActionEdit = function (sv, sj, rq, rp) {
                var b = 1, dt = new Date();
                var g = this.GetGroup(rq.requestContext);
                if (!g)
                    g = this.AddGroup(rq.requestContext);

                if (!g) {
                    t.logWarning("Invalid group: " + rq.requestContext);
                    return b;
                }
                var oD = rq.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                t.DeserializeFormData(oD);

                var oD2 = t.GetData(g, oD.name);

                if (oD.id && oD2 && oD2.id != oD.id) {
                    t.logWarning("Data '" + oD.name + "' already exists (" + oD2.id + "==" + oD.id + ")");
                    return b;
                }
                oD2.name = oD.name;
                oD2.description = oD.description;
                oD2.value = oD.value;
                oD2.modifiedDate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
                oD2.size = oD.value.length;
                oD2.path = g.name + "/" + oD.name;
                if (t.SaveGroup(g)) {
                    t.log("Saved group '" + g.name + "'");
                    rp.status = true;
                    rp.responseId = oD2.id;
                    rp.responsePath = oD2.path;
                }
                else {
                    t.logWarning("Unable to edit data '" + oD.name + "'");
                }
                return b;
            };
            t.requestActionAdd = function (sv, sj, rq, rp) {
                var b = 1, dt = new Date();
                var g = this.GetGroup(rq.requestContext);
                if (!g)
                    g = this.AddGroup(rq.requestContext);

                if (!g) {
                    t.logWarning("Invalid group: " + rq.requestContext);
                    return b;
                }
                var oD = rq.requestData;
                if (!oD.length) {
                    t.logWarning("Invalid data");
                    return b;
                }
                oD = oD[0];
                if (!oD.name || oD.name.length == 0) {
                    t.logError("Data has no name");
                    return b;
                }
                t.DeserializeFormData(oD);

                if (t.CheckData(g, oD.name)) {
                    t.logWarning("Data '" + oD.name + "' already exists");
                    return b;
                }
                oD.group = g.name;
                oD.createdDate = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
                oD.modifiedDate = oD.createdDate;
                oD.size = oD.value.length;
                oD.path = g.name + "/" + oD.name;
                if (!oD.policies.length)
                    oD.policies.push(t.NewPolicy());

                oD.id = parseInt(Math.random() * 10000000);
                g.data.push(oD);
                if (!t.SaveGroup(g)) {
                    t.logError("Failed to save group data");
                }
                else {
                    rp.responseId = oD.id;
                    rp.status = true;
                    rp.responsePath = rq.requestApplication + "/" + rq.requestContext + "/" + oD.name;
                }
                return b;
            };
            t.NewPolicy = function () {
                var p = H.data.io.service.newPolicy();
                p.read = 1;
                p.write = 1;
                p.del = 1;
                p.change = 1;
                return p;
            };
            t.requestActionRead = function (sv, sj, rq, rp) {
                var b = 1, oD, g = this.GetGroup(rq.requestContext);
                if (g) {
                    oD = t.GetData(g, rq.requestName, rq.requestId);
                    if (oD) {
                        rp.status = true;
                        rp.writeData(oD, t, 0, Hemi.data.io.service.getBusType().OFFLINE);
                        t.log("Reading " + oD.name + " -> " + rp.responseData.length);
                    }
                }
                return 1;
            };

            t.requestCatalogList = function (sv, sj, rq, rp) {
                var _ra = rq.requestApplication;
                if (_ra != "DWAC" && _ra != "HemiFramework" && _ra != "Explorer") {
                    this.log("Skip Request: " + rq.requestApplication);
                    return 1;
                }

                var b = 0, a, r = t.NewPolicy(), ctx = rq.requestContext;

                t.log("Catalog: " + _ra + "/" + ctx + "/" + rq.requestCatalog + " [#" + rq.requestId + "]");
                switch (rq.requestCatalog) {
                    case "Components":
                    case "Fragments":
                    case "Modules":
                    case "Tests":
                    case "Tasks":
                    case "Templates":
                    case "Workers":
                    case "Projects":
                    case "Pub":

                    case "Tasks":
                        if (ctx == "Directory") {
                            t.log("Render Group: " + rq.requestCatalog);
                            H.framework.io.provider.service.RenderGroup(rp, rq.requestCatalog, r);
                        }
                        try {
                            t.RenderDataList(rq, rp, r);
                        }
                        catch (e) {
                            t.logError((e.message ? e.message : e.description));
                        }
                        b = 1;
                        break;
                    case "Framework":
                    case "Examples":
                    case "Hemi":
                    case "DWAC":
                        b = H.framework.io.provider.service.requestCatalogList(sv, sj, rq, rp);
                        break;
                }
                if (!b) {
                    this.logWarning("Unhandled Request Catalog: " + rq.requestCatalog);
                    b = 1;
                }
                return b;
            };

            t.DeleteGroup = function (sN) {
                var _sp = H.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + sN;
                if (!t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' doesn't exist");
                    return 0;
                }
                return (_sp.removeItem(_hk) ? 1 : 0);
                return 1;
            };
            t.SaveGroup = function (g) {
                var _sp = H.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + g.name;
                if (!t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' doesn't exist");
                    return 0;
                }
                _sp.setItem(_hk, JSON.stringify(g));
                return 1;
            };
            t.AddGroup = function (n) {
                var _sp = H.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + n, g;
                if (t.CheckKey(_hk)) {
                    t.log("Group '" + _hk + "' already exists");
                    return 0;
                }

                g = H.data.io.service.newGroup();
                g.name = n;
                g.path = g.name;
                g.populated = 1;

                _sp.setItem(_hk, JSON.stringify(g));
                return g;
            };
            t.CheckData = function (g, n, d) {
                return (t.GetData(g, n) ? 1 : 0);
            };
            t.GetData = function (g, n, d) {
                var b = 0, oD;
                for (var i = 0; i < g.data.length; i++) {
                    oD = g.data[i];
                    if ((n && oD.name == n) || (d && oD.id == d)) {
                        b = oD;
                        break;
                    }
                }
                return b;
            };
            t.CheckKey = function (k) {
                var _sp = H.storage.getStorageProvider(), b = 0, l, i = 0;
                l = _sp.getLength();
                for (; i < l; i++) {
                    if (_sp.key(i) == k) {
                        b = 1;
                        break;
                    }
                }
                return b;
            };
            t.GetGroup = function (n) {
                var _sp = H.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + n,
    d, s
    ;
                s = _sp.getItem(_hk);
                if (s && (d = JSON.parse(s, H.xml.JSONReviver))) {
                    return d;
                }
                t.log("Group not found: '" + _hk + "'");
                return 0;
            };
            
            t.RenderDataList = function (rq, rp, y) {
                var _sp = H.storage.getStorageProvider(), _hk = this.getProperties().hfs_key + "_grp_" + rq.requestCatalog, g, i = 0;
                g = t.GetGroup(rq.requestCatalog);
                if (!g)
                    g = t.AddGroup(rq.requestCatalog);

                rp.writeGroup(g, y);

                if (rp.instruction.paginate) {
                    rp.instruction.totalCount = g.data.length;
                    g.data = g.data.sort();
                    g.data = g.data.slice(rp.instruction.startRecord, rp.instruction.startRecord + rp.instruction.recordCount);
                }
                t.log("Writing data list " + g.data.length);
                for (; i < g.data.length; i++)
                    t.log("Data " + i + " " + g.data[i].name);

                rp.writeDataArray(g.data, t, 0, Hemi.data.io.service.getBusType().OFFLINE);
            };



            t.r = 4;
            if (H.storage.testStorageSupported())
                H.data.io.service.register(t, H.data.io.service.getBusType().OFFLINE, 0, "dwac:");

            else
                t.logError("Unable to register offline service");

        }
    }, 1);
} ());

(function(){
 
 H.namespace("ui.util", H, {
  getIsRequested : function(o){
   return o.p.is_requested;
  },
  request : function(t, o, c){
   var _s = t.p,b;
   if(!_s.can_request){
    H.logError("Cannot request control");
    return 0;
   }
   if(_s.is_requested){
    b = (o == t.o.qo) ? 1 : 0;
    t.endRequest(t, c);
    if(b) return 0;
   }
   
   t.o.qo = o;
   H.ui.util.alignControl(t, o, c);
   _s.is_requested = 1;
   return 1
  },
  endRequest : function(t, c){
  
   var _p = t.o,_s = t.p;
   _s = t.p;
   if(!_s.is_requested || !_s.can_request) return 0;

   c = (c ? c : _p.c);
   c.style.display = "none";
   
   _s.is_requested = 0;
  
   _p.qo = null;
   return 1;

  },

  alignControl : function(s, o, c){
   var
    
    
    
    
    
    w = o.offsetWidth,
    
    h = o.offsetHeight,
    
    l = H.css.getAbsoluteLeft(o),
    
    t = H.css.getAbsoluteTop(o),
    
    c_w,
    
    c_h,
    
    
    
    
    _p = s.o,
    _s = s.p

   ;
   c.style.display = "block";

   c_w = c.offsetWidth;
   c_h = c.offsetHeight; 
   
   
   c.style.top = (t + h) + "px";
   c.style.left = l + "px";
  
  }
 });
}());










(function(){
 
 
 
 H.namespace("ui.wideselect", H, {

  newInstance:
function(o, h, ph){
   


   
   
   
   



   
   var n = H.newObject("wideselect","3.5.1");  

   if(!D.TO(o)) o = document.body;
   
   n.o = {
    
    p:o,
    
    c:0,
    
    b:[],
    
    r:[],
    
    rh:[],
    
    h:h,
    
    ph:ph,
    a:null,
    v:[],

    
    g:[],
    
    s:[],
    qr:[],
    qo:0
   };
   n.p = {
    
    m:0,
    buffered:1,
    auto_commit:1,
    is_commit:0,
    buffer_delay:20,
    buffer_step:10,

    auto_scroll:0,
    auto_select:0,
    maximum_items:100,
    maximum_rollover:1,
    item_id_counter:0,
    multiple:0,

    
    is_paging:0,
    
    current_page:0,
    
    maximum_page_size:0,
    
    maximum_page_items:200,
    
    page_marker:0,
    
    page_stop:0,
    
    page_hashing:1,
    is_requested:0,
    can_request:0,
    
    class_container:"wideselect_container",
    class_item:"wideselect_item",
    class_item_blocked:"wideselect_item_blocked",
    class_item_hover:"wideselect_item_hover",
    class_item_active:"wideselect_item_active"
   };
   
   n.setMultiple = function(b){
    this.p.multiple=(b?1:0);
    this.deselectAllItems();
   };
   
   n.getMultiple = function(){
    return (this.p.multiple?true:false);
   };
   
   n.setMaximumItems = function(i){
    this.p.maximum_items = i;
   };
   
   n.getMaximumItems = function(){
    return this.p.maximum_items;
   };
   
   n.setMaximumPageItems = function(i){
    this.p.maximum_page_items = i;
   };
   
   n.getMaximumPageItems = function(){
    return this.p.maximum_page_items;
   };
   
   n.getCurrentPageItemCount = function(){
    var t = this, _p, _s;
    _p = t.o;
    _s = t.p;
    if(!D.TO(_p.g[_s.current_page])) _p.g[_s.current_page] = [];
    return _p.g[_s.current_page].length;
   };
   
   n.getContainer = function(){
    return this.o.c;
   };

   n.getBufferMark=function(){
    return this.p.m;
   };
   
   n.setResultHandler=function(f){
    this.o.h = f;
   };

   n.getBufferSize=function(){
    return this.o.b.length;
   };
   
   n.getItemSize=function(){
    return this.o.r.length;
   };
   
   n.getItems = function(){
    return this.o.r;
   };
   
   n.getItem=function(i){
    return this.o.r[i];
   };
   
   n.getActiveItem=function(){
    var c=this.o;
    if(c.a){
     return c.r[c.rh[c.a.getAttribute("rid")]]
    }
    return null;
   };

   n.setCanRequest = function(b){
    this.p.can_request = b;
   };

   n.setIsPaging = function(i){
    this.p.is_paging = (i?1:0);
    this.clearPagingValues();
   };

   n.getIsPaging = function(){
    return this.p.is_paging;
   };

   n.setPageStop = function(b){
    this.p.page_stop = (b?1:0);
   };
   
   n.getPageStop = function(){
    return this.p.page_stop;
   };
   
   n.setAutoCommit = function(b){
    this.p.auto_commit = b;
   };
   
   n.setAutoScroll = function(b){
    this.p.auto_scroll = b;
   };

   n.setAutoSelect = function(b){
    this.p.auto_select = b;
   };

   n.setMaximumRollover = function(b){
    this.p.maximum_rollover = b;
   };

   n.deselectAllItems = function(){
    var a, _p = this.o,i=0,l;
    a = _p.r;
    l = a.length;
    _p.v = [];
    _p.a = null;
    for(;i<l;i++){
     a[i].object.className = this.p.class_item;
    }
   };

   n.init=function(){
    var t=this,v,d,_m=H.message.service,_d=H.event,c,_p;

    _p = t.o;

    d = document.createElement("div");
    d.setAttribute("avoid","1");
    _p.p.appendChild(d);
    d.className = t.p.class_container;
    
    _d.addScopeBuffer(t);

    
    t.scopeHandler("buffer_check",0,0,1);
    t.scopeHandler("commit_buffer",0,0,1);

    t.scopeHandler("mouseover",0,0,1);
    t.scopeHandler("mouseout",0,0,1);
    t.scopeHandler("click",0,0,1);   

    _d.addEventListener(d,"mouseover",t._prehandle_mouseover,0);
    _d.addEventListener(d,"mouseout",t._prehandle_mouseout,0);
    _d.addEventListener(d,"click",t._prehandle_click,0);

    _m.subscribe(t,"destroy","HWD",window);
    

    _p.c = d;

    t.r = 4;

   };
   
   n.HWD=function(){
    this.destroy();
   };
  
   n.setIsBuffered=function(b){
    var t=this,c;
    t.p.buffered=b;
    t.p.m=0;
    t.o.b=[];
   };
   
   n.setBufferOffset=function(i){
    this.p.buffer_step=i;
   };
   
   n.setBufferDelay=function(i){
    this.p.buffer_delay=i;
   };

   n.destroy=function(){
    var t=this,c_p;
    _p = t.o;
    if(t.r == 4){
     t.clearItems();
     _p.b=[];
     _p.p.removeChild(_p.c);
     H.registry.service.removeObject(t);
    }
    t.r = 0;
   };

   n.addItem=function(s,d){
    var t=this,c,_p;
    _p = t.o;
    if(t.r != 4) return;
    if(t.p.buffered){
     _p.b[_p.b.length]={name:s,data:d};

     if(t.p.auto_commit && !t.p.is_commit){
     
      
      window.setTimeout(t._prehandle_buffer_check,t.p.buffer_delay);
      
     }
    }
    else{
     t._addItem(s,d);
    }
   };
   
   n._handle_buffer_check=function(){
    var t=this,c;
    if(t.p.auto_commit && !t.p.is_commit){
     t._handle_commit_buffer();
    }
   };
   
   n.commitBuffer=function(){
    this._handle_commit_buffer();
   };
   
   n._handle_commit_buffer=function(){
    var t=this,c,l,b,m,i,v,_p;
    _p = t.o;
    t.p.is_commit=1;
    l=_p.b.length;
    b = false;
    m = t.p.m;
    for(i=m;i< (m + t.p.buffer_step) ;i++){
     if(i >= l){
      b=true;
      break;
     }
     v=_p.b[i];
     t._addItem(v.name,v.data);
     t.p.m++;
    }
    if(b){
     t.p.m=0;
     _p.b = [];
     t.p.is_commit=0;
     H.message.service.publish("onbuffercommitted",t);
    }
    else{
     window.setTimeout(t._prehandle_commit_buffer,t.p.buffer_delay);
    }
   };
   
   n.pageItem = function(s,d){
    var t = this, _p, _s, page_size, l, v = {name:s,data:d};
    _p = t.o;
    _s = t.p;
    page_size = _s.maximum_page_size;

    if(_s.is_paging){
   
     
     if(!D.TO(_p.g[page_size])) _p.g[page_size] = [];
     
     l = _p.g[page_size].length;
   
     if(l >= _s.maximum_page_items){
      page_size = (++_s.maximum_page_size);
      if(!D.TO(_p.g[page_size])) _p.g[page_size] = [];
      l = _p.g[page_size].length;
     }
   
     
     if(_s.page_hashing) _p.s[d.id]=1;
   
   
     _p.g[page_size][l] = v;

    }
   };
   
   n.updatePage = function(){
    var t = this,
     _p = this.o,
     _s = this.p,
     a,
     b,
     i,
     p,
     c,
     o
 
    ;
   
    if(!_s.is_paging) return 0;
   
    c = _s.current_page;
    p = _s.maximum_page_size;





 
     
    
 
     
  
   
    t.clearItems();
    
    if(D.TO(_p.g[c])){
     for(i = 0; i < _p.g[c].length; i++){
      o = _p.g[c][i];
      if(_s.page_hashing && o.data && o.data.id && _p.qr[o.data.id])
       _p.s[o.data.id]=0;
       
   
      t.addItem(o.name, o.data);
     }
     
    }
    else{
     t.addItem("Paging Error at Page #" + c,"_avoid");
    }
    
   };

   n._addItem=function(s,d){
    var t=this,e,i=H.guid(),v,l,_p,_s;
    _s = t.p;
    _p = t.o;
    l = _p.r.length;
    
    if(
     _s.maximum_items > 0
     && l >= _s.maximum_items
    ){
     if(_s.maximum_rollover){
      t.clearItem(0);
      l--;
     }
     else{
      return;
     }
    }
    
    e = document.createElement("div");
    _p.c.appendChild(e);
    e.className = _s.class_item;
    if(
     (D.TS(d) && d != "_avoid")
     ||
     (D.TO(d) && d.value != "_avoid")
    ){
     e.setAttribute("is-result-item","1");
    }

    e.setAttribute("rid",i);
    

    
    H.xml.setInnerXHTML(e,s,0,0,0,0,1);


    v={
     name:s,
     data:d,
     object:e,
     id:i,
     index:l
    };
    
    _p.r[l] = v;
    _p.rh[i] =l;
    
    if(_s.auto_select) t.setActiveItem(l);
    if(_s.auto_scroll) t.scrollToItem(l);
   };

   n._handle_mouseover=function(v){
    var t=this,o,e,_p,_s, l;
    _s = t.p;
    _p = t.o;

    if(D.TN(v))
     o=_p.r[v].object;
    
    else{
     e=H.event.getEvent(v);
     o=(!D.TU(v) && v.nodeType)?v:H.event.getEventSource(v);
     if(o && o.nodeType==3) o=o.parentNode;
     l = o;
     while(l){
      
       if(typeof l.getAttribute != D.U && l.getAttribute("is-result-item")){
       o = l;
       break;
      }
      l = l.parentNode;
     }
    }
    if(
     o.getAttribute("is-result-item")
     &&
     ((
      _s.multiple
      &&
      !_p.v[o.getAttribute("rid")]
     )
     ||
     (
      !_s.multiple
      &&
      o != _p.a
     ))
     &&  
     (
      !_s.is_paging
      ||
      (_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
     )
    ){
     o.className = _s.class_item + " " + _s.class_item_hover;
     
    }
   };
   n._handle_mouseout=function(v){
    var t=this,o,e,_p,_s,l;
    _s = t.p;
    _p = t.o;
    e=H.event.getEvent(v);
    o=(!D.TU(v) && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    l = o;
    while(l){
      if(typeof l.getAttribute != D.U && l.getAttribute("is-result-item")){
      o = l;
      break;
     }
     l = l.parentNode;
    }
    if(
     o.getAttribute("is-result-item")
     &&
     ((
      _s.multiple
      &&
      !_p.v[o.getAttribute("rid")]
     )
     ||
     (
      !_s.multiple
      &&
      o != _p.a
     ))
   
     &&
     
     (
      !_s.is_paging
      ||
      (_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
     )
     
    ){
     o.className = _s.class_item;
     
    }
   };

   n.setActiveItem=function(i){
    this.selectItem(i,1);
   };

   n.selectItem=function(i,b){
    var t = this;
    if(t.o.r[i] != null){
     t._handle_mouseover(i);
     t._handle_click(i,b);
     t.scrollToItem(i);
    }
   };
   
   n.scrollToItem=function(i){
    var t = this,c;
    c=t.o;
    if(c.r[i]!=null){
     c.c.scrollTop=c.r[i].object.offsetTop;
    }
   };
   
   n._handle_click=function(v,b){
    var t=this,o,e,_p,_s,l;
    _p = t.o;
    _s = t.p;
    if(D.TN(v)){
     o = _p.r[v].object;
    }
    else{
     e=H.event.getEvent(v);
     o=(!D.TU(v) && v.nodeType)?v:H.event.getEventSource(v);
     if(o && o.nodeType==3) o=o.parentNode;
     l = o;
     while(l){
       if(typeof l.getAttribute != D.U && l.getAttribute("is-result-item")){
       o = l;
       break;
      }
      l = l.parentNode;
     }
    }
  
    if(
     o.getAttribute("is-result-item")
     &&
     (
      !_s.is_paging
      ||
      (_s.page_hashing && _p.s[_p.r[_p.rh[o.getAttribute("rid")]].data.id])
     ) 
    ){
     
     if(
      (
       _s.multiple
       &&
       _p.v[o.getAttribute("rid")]
      )
      ||
      (
       !_s.multiple
       &&
       o == _p.a
      )
     ){

      _p.v[o.getAttribute("rid")] = 0;
      _p.a = null;
      o.className = _s.class_item + " " + _s.class_item_hover;
      
      return;
     }

     if(!_s.multiple && _p.a != null){
      _p.a.className= _s.class_item;
      _p.v[_p.a.getAttribute("rid")] = 0;
     }

     _p.a = o;
     _p.v[o.getAttribute("rid")] = 1;
     o.className = _s.class_item + " " + _s.class_item_active;
     

     if(!b){
      H.message.service.publish("onresultclick",t);
      if(D.TF(_p.h)) _p.h("onresultclick",_p.r[_p.rh[o.getAttribute("rid")]]);
     }
    }
   };
   
   n.clearItem=function(i){
    var t=this,o,c,d,_p,x;
    _p = t.o;
    o=_p.r[i];
    if(o){
     d=o.id;
     if(
      (
       t.p.multiple
       &&
       _p.v[d]
      )
      ||
      (
       !t.p.multiple
       &&
       o != _p.a
      )
     ){
      _p.a=null;
      _p.v[d] = 0;
     }
 
     _p.rh[d] = null;

     o = o.object;
     _p.c.removeChild(o);
     _p.r.splice(i,1);

     
   
     for(x=i;x<_p.r.length;x++){
      _p.r[x].index = x;
      _p.rh[_p.r[x].id] = x;
     }

    }

   };

   n.clearItems=function(){
    var t=this,c,a,i,_p;
    _p = t.o;
    _p.a = null;
    _p.r = [];
    _p.rh = [];
    t.p.m = 0;
    _p.b=[];
    a = _p.c.childNodes;
    for(i = a.length - 1;i >= 0;i--){
     _p.c.removeChild(a[i]);
    }
   };

   n.clearPagingValues = function(){
    var _s = this.p,_p = this.o;
   
    _s.current_page=0;
    _s.maximum_page_size=0;
    _s.page_mark=0;
    _s.page_stop = 0;
    _p.g = [];
    _p.s = [];
    _p.qr = [];
   };
   
   n.reset = function(){
    var t = this;
    
    t.endRequest();
    
    t.clearItems();
    
    t.clearPagingValues();
   };

   n.moveFirst = function(){
    var _p = this.o,_s = this.p;
    _s.current_page = 0;
    this.updatePage();
    if(D.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
   };

   n.moveLast = function(){
    var _s = this.p, _p = this.o;
    if(_s.page_stop){
     _s.current_page = _s.maximum_page_size;
     this.updatePage();
     if(D.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
    }
   };

   n.getCanMoveNext = function(){
    return this.moveNext(1);
   };

   n.getCanMovePrevious = function(){
    return this.movePrevious(1);
   };
   n.moveNext = function(b){
    
    var _s = this.p, _p = this.o;
    if(
     (_s.current_page + 1) < _s.maximum_page_size
     ||
     (_s.page_stop && (_s.current_page + 1) == _s.maximum_page_size)
    ){
     if(!b){
      _s.current_page++;
      this.updatePage();
      if(D.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
     }
     return 1;
    }
 
    return 0;
   };
   
   n.movePrevious = function(b){
    
    var _s = this.p,_p = this.o;
    if((_s.current_page - 1) >= 0 && D.TO(_p.g[_s.current_page - 1])){
     if(!b){
      _s.current_page--;
      this.updatePage();
      if(D.TF(_p.ph)) _p.ph("onpagenavigate",_s.current_page);
     }
     return 1;
    }
    return 0;
   };

   n.importPageItems = function(a, b){
   
   
    if(!D.TO(a)) return 0;
   
    var n,
     c = 0,
     _s = this.p,
     v,
     z,
     s,
     l,
     _p = this.o,
     
     r = a.length,
     t = this
    ;
   
   
    if(r == 0){
     
     if(_p.r.length == 0 && _p.g.length == 0){
      if(_s.is_paging)
       t.pageItem("Zero Items","_avoid");
      else
       t.addItem("Zero Items","_avoid");
     }
    }
    else{
   
     s = _s.page_mark;
     l = _s.maximum_page_items;
    
     for(z=0; z < a.length; z++){
      n = a[z];
      c++;
    
      if(_s.is_paging) t.pageItem(n.label,n);
      else t.addItem(n.label,n);
   
     }
     _s.page_mark += _s.maximum_page_items;
    }
   
    if(c < _s.maximum_page_items || b)
     _s.page_stop = 1;
      
    if(_s.is_paging) 
     t.updatePage();
   
   };
   

   
   n.request = function(o){
    var t = this,_s,b=0;
    if( (b = H.ui.util.request(this, o, t.o.c)) && t.p.is_paging) t.updatePage();
    return b;
    

   };

   n.endRequest = function(){
    return H.ui.util.endRequest(this, this.o.c);
   };
   
   n.alignControl = function(o){
    var
     
     
     
     
     
     w = o.offsetWidth,
     
     h = o.offsetHeight,
     
     l = H.css.getAbsoluteLeft(o),
     
     t = H.css.getAbsoluteTop(o),
     
     c_w,
     
     c_h,
     
     
     
     
     _p = this.o,
     _s = this.p

    ;

    _p.c.style.display = "block";

    c_w = _p.c.offsetWidth;
    c_h = _p.c.offsetHeight; 
    
    
    _p.c.style.top = (t + h) + "px";
    _p.c.style.left = l + "px";
   
   };
   
   n.init();

   H.registry.service.addObject(n);

   return n;
  }
 });
}());



(function () {
 
 
 
 H.namespace("monitor", H, {
  service: null,
  serviceImpl: function () {
   var t = this;
   t.t = "MonitorService";
   t.v = "3.5.1";
   t.i = "monitor_service_1";
   t.r = 0;







   t.o = {
    monitors: [],
    context_object: 0
   };
   t.cookies = {};
   t.p = {
    
    ci: 0,
    delay: 1000,
    session_name: "MSESS_ID",
    document_rendered: 0,
    hashed_cookies: 0,
    window_interval: 0,
    can_interval: 1,
    window_state: 0,
    application_id: 0,
    dataset_id: 0,
    last_image_index: 0
   };

   t.getContextObject = function () {
    return t.o.context_object;
   };

   t.getDatasetId = function () {
    return t.p.dataset_id;
   };

   t.getDocumentRendered = function () {
    return t.p.document_rendered;
   };

   t.getWindowState = function () {
    return t.p.window_state;
   };

   t.getSessionId = function () {
    return t.cookies[t.p.session_name];
   };

   t.getApplicationId = function () {
    return t.p.application_id;
   };

   t.getContextId = function () {
    return t.p.ci;
   };

   t.hashCookie = function (n, b, s) {
    var c = t.p, k = t.cookies;
    if (!c.hashed_cookies++ || s)
     t.hashValue(document.cookie, ";", "=", k);

    
    if (b && D.TS(k[n]))
     t.hashValue(k[n], "&", ":", k);
   };

   t.hashValue = function (c, d, s, k) {
    if (c) {
     var j = 0,
      l,
      a = c.split(d),
      f = eval("/\\s*([^\\s" + s + "]+)" + s + "(.+)\\s*/")
     ;
     for (; a && j < a.length; ) {
      l = a[j++].match(f);
      if (l)
       k[l[1]] = l[2].match(/^\d+$/) ? parseInt(l[2]) : l[2];  
     }
    }
   };


   t.G = function (n) {

    return t.o.context_object.getElementsByTagName(n);

   };

   t.doInterval = function () {

    var m = t.o.monitors, c = t.p, i = 0, l, o, z;
    l = m.length;
    for (; i < l; ) {
     o = m[i++];
     if (!o) continue;
     z = o.p;
     if (D.TF(o.doInterval) && z.can_interval) {
      if (z.interval_offset <= 0) z.interval_offset = 1;
      z.interval_offset--;
      
      
      if (z.interval_offset <= 0) o.doInterval();
     }
    }
    c.window_interval = window.setTimeout(t.handle_window_interval, c.delay);
    return 1;
   };

   t.handle_window_interval = function () {
    var c = t.p;

    
    if (c.window_state > 3) {
     window.clearTimeout(c.window_interval);
     c.window_interval = 0;
     return;
    }
    if (!c.can_interval) return;

    if (c.can_interval)
     if (!t.doInterval()) {
      window.clearTimeout(c.window_interval);
      c.window_interval = 0;
      c.can_interval = 0;
     }
   };

   t.handle_document_stop = function (e) {
    t.DE("document_stop", e);
   };

   t.handle_window_load = function (e) {
    var c = t.p;
    if (c.window_state >= 3) return;
    t.BE();
    c.window_state = 3;
    c.document_rendered = 1;
    t.DE("window_load", e);

   };

   t.handle_window_beforeunload = function (e) {
    t.DE("window_beforeunload", e);
    t.p.window_state = 4;
    
   };

   t.handle_window_unload = function (e, bPub) {
    var c = t.p;

    
    
    if (!Hemi || typeof Hemi.include != "function") return;
    if (t.r == 4) {

     t.r = 4.5;
     c.window_state = 5;
     t.DE("window_unload", e);
     c.document_rendered = 0;
     
     t.BE(1);
     t.bindObjects(1);
     t.ImageProbe(1);
    }
    
    t.r = 5;
   };
   t.destroy = function (bPub) {
    this.handle_window_unload(0, 1);
   };

   t.DE = function (s, e, p2, p3) {
    
    var m = t.o.monitors, i = 0, l, o, n;
    n = "handle_" + s;
    l = m.length;
    for (; i < l; ) {
     o = m[i++];
     
     if (o && typeof o[n] == "function")
      o[n](e, p2, p3);

    }
   };

   t.initializeMonitorService = function () {
    if (t.r) return 0;
    var 
    d = document, w = window, c = t.p, o = t.cookies, p = t.o;
    t.r = 2;

    
    c.application_id = (typeof APPLICATION_ID != D.U) ? APPLICATION_ID : "Global";
    c.dataset_id = (typeof DATASET_ID != D.U ? DATASET_ID : "public");
    p.context_object = (typeof CONTEXT_OBJECT != D.U ? CONTEXT_OBJECT : document);

    
    t.hashCookie();

    c.ci = H.guid();

    
    if (!o[c.session_name]) {
     o[c.session_name] = c.ci;
     d.cookie = c.session_name + "=" + o[c.session_name] + ";";
    }
    t.bindObjects();
    t.ImageProbe();
    t.r = 4;
    t.doInterval();
    t.log("Initialized");
   };

   t.handle_context_menu = function (e) {
    t.DE("context_menu", e);
   };

   t.handle_window_error = function (m, u, l) {
    t.DE("window_error", m, u, l);
    if (typeof window.ph_error == D.F)
     return window.ph_error.apply(window, arguments);
   };

   t.handle_mouse_click = function (e) {
    t.DE("mouse_click", e);
   };

   t.handle_mouse_move = function (e) {
    t.DE("mouse_move", e);
   };

   t.handle_document_scroll = function (e) {
    t.DE("document_scroll", e);
   };

   t.handle_window_focus = function (e) {
    t.DE("window_focus", e);
   };

   t.handle_window_blur = function (e) {
    t.DE("window_blur", e);
   };

   t.handle_input_focus = function (e) {
    t.DE("input_focus", e);
   };

   t.handle_input_blur = function (e) {
    t.DE("input_blur", e);
   };

   t.handle_window_keydown = function (e) {
    t.DE("window_keydown", e);
   };

   t.handle_window_resize = function (e) {
    t.DE("window_resize", e);
   };

   t.handle_form_submit = function (e) {
    t.DE("form_submit", e);
    var oF = H.event.getEventSource(e);
    if (oF && oF.nodeType == 1 && typeof oF.ph_submit == D.F)
     return oF.ph_submit.apply(oF, arguments);
   };

   t.handle_form_reset = function (e) {
    t.DE("form_reset", e);
    var oF = H.event.getEventSource(e);
    if (oF && oF.nodeType == 1 && typeof oF.ph_reset == D.F)
     return oF.ph_reset.apply(oF, arguments);
   };


   t.handle_select_change = function (e) {
    t.DE("select_change", e);
   };
   t.bindObjects = function (b) {
    var _a = (b ? H.event.removeEventListener : H.event.addEventListener),
     d = document, w = window, f = false, o, p = t.o
    ;

    _a(d, "stop", t.handle_document_stop, f);

    _a(w, "load", t.handle_window_load, f);
    _a(w, "unload", t.handle_window_unload, f);
    _a(w, "beforeunload", t.handle_window_beforeunload, f);

    
    o = p.context_object;
    if (o == d) o = d.documentElement;
    _a(o, "contextmenu", t.handle_context_menu, f);
    _a(o, "mousemove", t.handle_mouse_move, f);
    _a(o, "click", t.handle_mouse_click, f);
    _a(o, "scroll", t.handle_document_scroll, f);
    _a(w, "focus", t.handle_window_focus, f);
    _a(w, "blur", t.handle_window_blur, f);
    _a(w, "keydown", t.handle_window_keydown, f);
    _a(w, "resize", t.handle_window_resize, f);
    if (!b) {
     if (w.onerror) w.ph_error = w.onerror;
     w.onerror = t.handle_window_error;
    }
    else {
     if (w.ph_error) w.onerror = w.ph_error;
    }


   };

   t.BE = function (b) {
    var a = [], i, o,
     f = (b ? H.event.removeEventListener : H.event.addEventListener),
     mc = t.handle_mouse_click,
     hs = t.handle_form_submit,
     hr = t.handle_form_reset,
     hc = t.handle_select_change,
     uf = t.handle_input_focus,
     ub = t.handle_input_blur
    ;

    H.util.absorb(t.G("form"), a);
    H.util.absorb(t.G("a"), a);
    H.util.absorb(t.G("input"), a);
    H.util.absorb(t.G("area"), a);
    H.util.absorb(t.G("select"), a);
    H.util.absorb(t.G("textarea"), a);

    for (i = 0; i < a.length; i++) {

     o = a[i];

     if (!o.nodeName.match(/select/i)) {
      f(o, "click", mc);
      f(o, "focus", uf);
      f(o, "blur", ub);
      f(o, "keydown", ub);
     }
     if (o.nodeName.match(/form/i)) {
      if (!b) {
       if (o.onsubmit) o.ph_submit = o.onsubmit;
       o.onsubmit = hs;

       if (o.onreset) o.ph_reset = o.onreset;
       o.onreset = hr;
      }
      else {
       if (o.ph_submit) o.onsubmit = o.ph_submit;
       if (o.ph_reset) o.onreset = o.ph_reset;
      }
     }
     else if (o.nodeName.match(/select/i)) {
      f(o, "click", hc);
      f(o, "change", hc);
      f(o, "focus", hc);
      f(o, "blur", hc);
      f(o, "keydown", hc);
     }
    }

   };
   t.removeMonitor = function (o) {
    var m = t.o.monitors, i = 0, b = 0;
    if (!o) return 0;
    for (; i < m.length; i++) {
     if (m[i] && m[i].getObjectId() == o.getObjectId()) {
      m[i] = 0;
      b = 1;
     }
    }
    return b;
   };

   t.addMonitor = function (o, c) {
    var m = t.o.monitors, r = H.registry.service;
    if (
     !D.TO(o)
     ||
     o == null
     ||
     r.isRegistered(o) == false
     ||
     !D.TF(o.initializeMonitor)
    ) {
     t.logError("Invalid monitor object");
     return 0;
    }


    if (!o.config_keys) o.config_keys = {};
    if (D.TO(o.config_keys) && D.TS(c))
     t.hashValue(c, "&", ":", o.config_keys);

    o.getConfigKeys = function () { return o.config_keys };
    o.getConfigKey = function (n) { return o.config_keys[n]; };
    o.getMonitorService = function () { return t; };
    o.p.can_interval = 1;
    o.p.interval_offset = 0;

    if (o.initializeMonitor()) {
     m[m.length] = o;
     return 1;
    }
    t.logError("Monitor " + o.t + " failed to initialize");
    return 0;

   };

   t.handle_image_load = function (e) {
    t.DE("image_load", e);
   };
   t.handle_image_abort = function (e) {
    t.DE("image_abort", e);
   };
   t.handle_image_error = function (e) {
    t.DE("image_error", e);
   };

   t.ImageProbe = function (b) {
    var _a = (b ? H.event.removeEventListener : H.event.addEventListener), _s = t.p, i, _i = document.images, l;
    if (t.r > 4 || !_i) return;
    l = _i.length;

    for (i = (b ? 0 : _s.last_image_index); i < l; i++) {
     _i[i].onload = t.handle_image_load;
     _i[i].onabort = t.handle_image_abort;
     _i[i].onerror = t.handle_image_error;
     _i[i]._ix = i;
    }
    _s.last_image_index = l;
    if (!_s.document_rendered) window.setTimeout(t.ImageProbe, 10);
   };
   H.IM(t, "base_object", "monitor_service", "3.5.1");
   H.registry.service.addObject(t);
   H.util.logger.addLogger(t, "Monitor Base", "Monitor Base Service", "700");
   t.initializeMonitorService();

  }

 }, 1);

} ());








(function(){
 

 H.namespace("wires",H,{
  service : null,
  serviceImpl : function(){
   var t = this;



   
   

   t.o = {
    w:[],
    h:[],
    
    l:[],
    pw: new H.wires.primitive.serviceImpl()
   };
   t.p = {
    counter:0,
    wire_id_label:"hemi.wire",
    can_signal:1
   };
   t.getWires = function(){
    return this.o.w;
   };
   t.getWiresHash = function(){
    return this.o.h;
   };
   t.sigterm = function(){
    if(this.r != 5){
     var _p = this.o;
     _p.w = [];
     _p.h = [];
     _p.l = [];
     this.r =5;
    }  
   };

   t.getLength = function(){
   
   };
   
   t.setCanSignal = function(b){
    t.p.can_signal = (b?1:0);
   };
   
   t.getCanSignal = function(){
    return t.p.can_signal;
   };
   
   

   t.invoke = function(args,xp,x,b,o){
    var i=-1,l,d,
     _p = t.o,
     _s = t.p,
     w,wl,
     pw,r,a
    ;
    
    if(!D.TO(args)) args = [];
    
    

    try{
     if(D.TS(xp)) xp = eval(xp);
    }
    catch(e){
     alert("ocjw.invoke.Error: " + e.toString());
     return 0;
    }
    
    if(!D.TU(xp) && x){
    
     l = (xp!=null?(xp.getObjectId ? xp.getObjectId() : (xp.id?xp.id:(xp.name?xp.name:0))):0);
     d = l + "-" + x;
     if(D.TO(_p.l[d])){
      wl = _p.l[d];
     }
     else{
      alert("Invalid Wire Reference (" + d + ") in hemi.wires.service::invoke");
     }
    }
    else{
     if(D.TO(_p.w[0])){
      w = _p.w[0];
      wl = _p.l[w.la + "-" + w.a];
     }
    }
    
    if(D.TO(wl) && wl.length > 0){
     w = _p.w[wl[0]];
     
     
     
     
     
     
     if(!o) r = _p.pw.invoke(w.pid,args,0,1,0,0,1);

     if(
      (
       o
       ||
       (!w.i && r)
      )
      ||
      b
     ){

      w.i = 1;

      for(i = 0;i<wl.length;i++){
       w = _p.w[wl[i]];
       
       
  
       
       
       _p.pw.invoke(w.pid,args,1,0,1,1,1);
       if(_s.can_signal){

        d = w.lh + "-" + w.h;

        
        if(D.TO(_p.l[d])){
         
         
         l = _p.w[_p.l[d][0]];
         
         

         pw = _p.pw.getWire(l.pid);
         if(pw){

          
          if(!l.i) t.invoke(args,pw.ap,pw.a,0,1);
         }
        }

       }
       
       
      }    
     }
     else{

 

     }

    }

    return r;
   };

   t.addInterceptor = function(o){
    
   };

   t.join = function(yp,y){
    
    
   };
   
   t.wire = function(xp,x,yp,y,ep,e){
    var v,i,a,
     _p = t.o,
     _s=t.p
    ;
 

    try{
     if(D.TS(xp)) xp = eval(xp);
     if(D.TS(yp)) yp = eval(yp);
     if(D.TS(ep)) ep = eval(ep);
    }
    catch(e){
     alert("ocjw.wire.Error: " + e.toString());
     return 0;
    }

    
    
    i = _p.pw.wire(xp,x,yp,y,ep,e,_s.wire_id_label);

    v = {
     pid:i,
     a:x,
     h:y,

     
     la:(xp!=null?(xp.i?xp.i:(xp.id?xp.id:(xp.name?xp.name:0))):0),

     
     lh:(yp!=null?(yp.i?yp.i:(yp.id?yp.id:(yp.name?yp.name:0))):0),

     
     le:(ep!=null?(ep.i?ep.i:(ep.id?ep.id:(ep.name?ep.name:0))):0),
     
     id:0,
     i:0
    };

    v.id = v.a + "-" + v.h + "-" + v.pid;
    
    _p.h[v.id] = _p.w.length;
    _p.w[_p.w.length] = v;

    
    i = v.la + "-" + v.a;

    if(!D.TO(_p.l[i])) _p.l[i] = [];
    
    a = _p.l[i];
    a[a.length] = _p.h[v.id];
    
    return 1;
   };
  
   t.primitiveWire = function(xp,x,yp,y,ep,e){
    var _p = t.o,
     _s=t.p
    ;

    try{
     if(D.TS(xp)) xp = eval(xp);
     if(D.TS(yp)) yp = eval(yp);
     if(D.TS(ep)) ep = eval(ep);
    }
    catch(e){
     alert("ocjw.wire.Error: " + e.toString());
     return 0;
    }

    

    return _p.pw.wire(xp,x,yp,y,ep,e,_s.wire_id_label);
   };


   t.invokePrimitive = function(args,i,o,z){
    
    var _pw = t.o.pw,r;
    
    if(D.TS(i)){
     if(!o){
      r = _pw.invoke(i,args,0,1,0,0,1);
     }
     if(
      o
      ||
      r
     ){
      if(!z){
       _pw.invoke(i,args,1,0,1,1,1);
      }
     }
     else{
 

     }
    }

    return r;
   };

   t.invokeHardWireAction=function(o,i,a){
    
    var pw, c = [], b, l, k=0,_m = H.message.service;
    if(!D.TO(o) || !D.TO(o.pw)){
     _m.S("Invalid object reference for primitive wire","511.4");
     return 0;
    }
    pw = o.getPrimitiveWire(i);
    if(!D.TO(pw)){
     _m.S("Invalid primitive wire id " + i,"511.4");
     return 0;
    }
    
    b = pw.action_arguments;
    for(;k < b.length;) c[k] = b[k++];
    if(D.TO(a) && (l = a.length) )
     for(k=0;k < l;) c[c.length] = a[k++];


    return t.invokePrimitive(c,pw.id,0,1);
   };

   t.invokeHardWireHandler=function(o,i,a){
    var pw,c = [], b, l, k=0,_m = H.message.service;
    if(!D.TO(o) || !D.TO(o.pw)){
     _m.S("Invalid object reference for primitive wire","511.4");
     return 0;
    }
    pw = o.getPrimitiveWire(i);
    if(!D.TO(pw)){
     _m.S("Invalid primitive wire id " + i,"511.4");
     return 0;
    }
    b = pw.handler_arguments;
    for(;k < b.length;) c[k] = b[k++];
    if(D.TO(a) && (l = a.length) )
     for(k=0;k < l;) c[c.length] = a[k++];

    return t.invokePrimitive(c,pw.id,1,0);
   };

     

   t.hardWire=function(o,i,action_args,handler_args,ac,a,hc,h,ec,e,error_args){
    
    if(!D.TO(o) || !D.TO(o.pw)) return 0;

    var pid = t.primitiveWire(ac,a,hc,h,ec,e);
    if(pid != 0){
     o.pw[i] = {id:pid,action_arguments:action_args,handler_arguments:handler_args,error_arguments:error_args};
    }
    return pid;
   };

   H.IM(t,"base_object","wire_service","3.5.1");
   H.registry.service.addObject(t);
   t.r = 4;
   return t;
  }
 },1);
}());




(function () {

 
 
 

 H.namespace("json.rpc.cache", H, {
  service: null,

  serviceImpl: function () {
   var t = this;
   H.prepareObject("jsonrpc_service_cache", "3.5.1", 1, t, 1);
   H.util.logger.addLogger(t, "JSON RPC Service Cache", "JSON RPC Service Cache", "668");
   
   t.o.cache = {};
   
   t.setCacheKeyResolver = function(f){
    t.o.cacheKeyResolver = f;
   };
   t.canCache = function(o){
    if(typeof o == D.O && typeof o.id == D.N && typeof o.name == D.S) return 1;
    else if(o instanceof Array) return 1;
    return 0;
   };
   t.defaulteCacheKeyResolver = function(o){
    if(!o || o instanceof Array) return;
    return (o.name + (o.parentId ? "-" + o.parentId : (o.group ? "-" + o.group.id : "")));
   };
   t.getCacheKey = function(o){
    if(!t.o.cacheKeyResolver) return;
    return t.o.cacheKeyResolver(o);
   };
   
   t.isCached = function(sSvc,sKey){
    var c = t.o.cache[sSvc];
    return (c && (typeof c.names[sKey] == D.N || typeof c.ids[sKey] == D.N || typeof c.altNames[sKey]==D.N));
   };
   
   t.readByName = function(sSvc, sName, vParent){
    var sKey = sName + (vParent ? "-" + vParent : ""),uObj;
    var c = t;
    if(!c.o.cache[sSvc]) return uObj;
    if(typeof c.o.cache[sSvc].names[sKey] == D.N){
     t.logDebug("Retrieve cached " + sSvc + " object by name " + sKey);
     return c.o.cache[sSvc].stack[c.o.cache[sSvc].names[sKey]];
    }
    else if(typeof c.o.cache[sSvc].altNames[sKey] == D.N){
     t.logDebug("Retrieve cached " + sSvc + " object by alternate name " + sKey);
     return c.o.cache[sSvc].stack[c.o.cache[sSvc].altNames[sKey]];
    }
    return uObj;
   };
   t.readById = function(sSvc, iId){
    var c = t, uObj;
    if(c.o.cache[sSvc] && typeof c.o.cache[sSvc].ids[iId] == D.N){
     t.logDebug("Retrieve cached " + sSvc + " object by id " + iId);
     return c.o.cache[sSvc].stack[c.o.cache[sSvc].ids[iId]];
    }
    return uObj;
   };
   t.updateToCache = function(sSvc, o){
    var c = t;
    if(!c.canCache(o)) return 0;
    t.logDebug("Update to " + sSvc + " cache " + o.name + " #" + o.id);
    if(c.isCached(sSvc,o)) c.removeFromCache(sSvc,o);
    return c.addToCache(sSvc,o);
   };
   t.addToCache = function(sSvc, o, sAltKey){
    var c = t, iIdx,uObj,x;
    if(!c.canCache(o)) return 0;
    if(!c.o.cache[sSvc]){
     c.o.cache[sSvc] = {
      stack : [],
      ids : {},
      names : {},
      altNames : {}
     };
    }
    x = c.o.cache[sSvc];
    if(x.ids[o.id]){
     if(sKey && !x.names[sKey] && !x.altNames[sKey]){
      x.altNames[sKey] = x.ids[o.id];
     }
     return 0;
    }
    iIdx = x.stack.length;
    sKey = c.getCacheKey(o);
    x.stack[iIdx] = o;
    if(sKey) x.names[sKey] = iIdx;
    if(sAltKey && sAltKey != o.name && sAltKey != sKey) x.altNames[sAltKey] = iIdx;
    x.ids[o.id] = iIdx;
    t.logDebug("Add " + sSvc + " object to cache as " + sKey + " #" + o.id + " at index " + iIdx);
    return 1;
   };
   t.clearCache = function(){
    t.logDebug("Clear all service caches");
    t.o.cache = {};
   };
   t.clearServiceCache = function(sSvc){
    t.logDebug("Clear " + sSvc + " service cache");
    delete t.o.cache[sSvc];
   };
   t.removeFromCache = function(sSvc, o){
    var c = t, iIdx,uObj;
    if(!c.canCache(o)) return 0;
    if(!c.o.cache[sSvc]) return 0;

    iIdx = c.o.cache[sSvc].ids[o.id];
    
    if(!iIdx) return 0;
    
    delete c.o.cache[sSvc].stack[iIdx];
    
    for(var i in c.o.cache[sSvc].names){
     if(c.o.cache[sSvc].names[i] == iIdx){
      delete c.o.cache[sSvc].names[i];
      break;
     }
    }
    for(var i in c.o.cache[sSvc].altNames){
     if(c.o.cache[sSvc].altNames[i] == iIdx){
      delete c.o.cache[sSvc].altNames[i];
      break;
     }
    }

    delete c.o.cache[sSvc].ids[o.id];
    t.logDebug("Removed cached " + sSvc + " object " + sKey + " #" + o.id + " at index " + iIdx);
    
   };
   t.setCacheKeyResolver(t.defaulteCacheKeyResolver);
   t.r = 4;
  }
 }, 1);
} ());




(function () {

 
 
 

 H.namespace("json.rpc", H, {
  service: null,

  serviceImpl: function () {
   var t = this;
   H.prepareObject("jsonrpc_service", "3.5.1", 1, t, 1);
   H.util.logger.addLogger(t, "JSON RPC Service", "JSON RPC Service", "667");
   
   t.o = {
    services : [],
    service_map : [],
    schema : {}
   };
   
   t.p.schemaToWindow = 1;
   t.getSchemaRoot = function(){
    return (t.p.schemaToWindow ? window : t.o.schema);
   };
   t.getServices = function(){
    return t.o.services;
   };
   t.getService = function(v, b){
    if(typeof v == D.S) v = t.o.service_map[v];
    if(typeof v != D.N || !t.o.services[v]) return 0;
    if(b && !t.o.services[v].loaded) t.loadService(t.o.services[v]);
    return t.o.services[v];
   };
   t.serviceCallConfig = function(f, a, i, c){
    return {hemiSvcCfg:true,id:i,cache:(c?true:false),async:(a?true:false),handler:(typeof f==D.F?f:0)};
   };
   t.loadService = function(v, x){
    if(typeof v != D.O) v = t.getService(v);
    if(!v || v.loaded) return 0;


    var oS = (x && (typeof x == D.O) ? x : H.xml.getJSON(v.uri));
    if(typeof oS != D.O || oS == null){
     alert("Unable to load service: " + v.uri + ":" + (typeof oS));
     return null;
    }
    v.schema = oS;
    v.loaded = 1;
    
    for(var i = 0; i < oS.methods.length; i++){
     var sMName = oS.methods[i].name;
     var sSUrl = oS.serviceURL;
     v[sMName] = buildMethod(v, sMName, sSUrl,oS.methods[i].httpMethod);
    }
    return 1;
   };
   t.invokeMethod = function(v, m, p, fH){
    var oSvc = t.getService(v,1);
    var oReq = NewJSONRPCRequest(m, p);
    return uwm.postJSON(oSvc.schema.serviceURL, oReq, fH);
   };
   
   t.loadJSONSchema = function(v, j){
    var oSvc = (typeof v == D.O ? v : t.getService(v,1));
    if(!oSvc.getJSONSchema && !oSvc.entity){
     return 0;
    }
    if(!oSvc.jsonSchema){
     oSvc.jsonSchema = (j && (typeof j == D.O) && j.result ? j.result : (oSvc.schema.serviceType.match(/^json-rest$/i) ? oSvc.entity() : oSvc.getJSONSchema().result));
     t.emitJSONSchema(oSvc.jsonSchema);
    }
   };
   
   t.addService = function(n, u, v, j, c){
    if(t.o.service_map[n]) return 0;
    var l = t.o.services.length;
    t.o.service_map[n] = l;
    t.o.services[l] = {
     name:n,
     cached : c,
     uri:u,
     loaded:0,
     schema:0,
     api : {}
    };
    
    if(v) {
     t.loadService(t.o.services[l],v);
     if(j) t.loadJSONSchema(t.o.services[l],j);
    }
   };
   t.emitJSONSchema = function(v){
    if(v.defaultPackage) sDef = v.defaultPackage;
    for(var i in v){
     if(typeof v[i] != D.O) continue;
     var o = (t.p.schemaToWindow ? window : t.o.schema);
     var sP = v[i].javaClass;
     if(!sP && v.defaultPackage) sP = v.defaultPackage + ".Def";
     var sPP = "";
     if(sP && sP.indexOf(".") > - 1){
      sPP = sP.substring(0,sP.lastIndexOf("."));
      o = H.namespace(sPP, o);
     }
     var sN = i.replace(/schema$/gi,""); 
     o[sN] = function(){
     };
     var udef;
     for(var p in v[i]){
      o[sN].prototype[p] = udef; 
     }
     
    }
   };
  }
   
 }, 1);
 
 function buildMethod(oSvc, sName, sUrl, sHttpMethod){
  
  var x;
  if(oSvc.schema.serviceType.match(/^json-rest$/i)){
   var f = function(){
    var o,v = sHttpMethod,a = [],d,i=0,ufg,fH,g = arguments,l = arguments.length,sc = H.json.rpc.cache.service;
    
    if(l > 0){
     if(typeof g[0] == D.O && !g[0].hemiSvcCfg){
      d = g[0];
     }
     if(typeof g[l - 1] == D.O && g[l - 1].hemiSvcCfg){
      ufg = g[l - 1];
      fH = ufg.handler;
      l--;
     }
    }
    if(!ufg) ufg=H.json.rpc.service.serviceCallConfig();
    if(!v){
     v = "GET";
     H.logError("Method not specified for " + sName + ". Defaulting to GET.")
    }
    if(v.match(/^get$/i)){
     for(;i<l;){
      a.push("/" + arguments[i++]);
     
     }
     var sK = f.mname + a.join("");
     if(f.cached && sc.isCached(f.serviceName,sK)){
      o = sc.readByName(f.serviceName, sK);
     }
     else{
      o = H.xml.getJSON(f.url + "/" + sK, fH, ufg.async, ufg.id, ufg.cache);
      
      if(f.cached && typeof o == D.O && o!=null && !ufg.async){
       sc.addToCache(f.serviceName,o,sK);
      }
     }
    }
    else{
     o = H.xml.postJSON(f.url + "/" + f.mname, d, fH, ufg.async, ufg.id, ufg.cache);
     if(f.cached){
      
       uwmServiceCache.clearServiceCache(f.serviceName);
     }
    }
    if(o && o.parseError) o = null;
    return o;
   };
   x = f;
  }
  else{
   var f = function(p,fH){
    var oReq = NewJSONRPCRequest(f.mname, p);
    return H.xml.postJSON(f.url, oReq, fH);
   };
   x = f;
  }
  x.serviceName = oSvc.name;
  x.mname = sName;
  x.url = sUrl;
  x.cached = oSvc.cached;
  return x;
 }
 
 function NewJSONRPCRequest(m, p){
  if(typeof p == "undefined") p = [];
  return {
   jsonrpc:"2.0",
   id:uwm.guid(),
   method: m,
   params: p
  };
 }
 
} ());





(function(){
 
 
 
 H.namespace("ui.calendar", H, {
  newInstance:
function(o, d){
   
   var n = H.newObject("caltasche","3.5.1");

 
   if(typeof o != D.O) o = document.body;
   
   n.o = {

     
     p:o,
     
     c:0,
     
     h:0,
     
     b:0,
     
     f:0,
     
     d:0,
     
     dc:0,
     
     cl:0,
     
     cn:0,
 
     
     pt:0,
     
     ptl:0,
     
     ptt:0,
     
     pta:0,
     
     tl:0,
     
     ts:0,
     
     ti:[],
     
     tim:[],
     
     tpn:0,
     
     tpp:0,
 
     
     
     pc:0,
     
     lf:0,
     
     lh:0,
     
     lhc:0,
     
     rhc:0,

     
     m:"January,February,March,April,May,June,July,August,September,October,November,December",
 
     
     d:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
 
     
     s:[31,29,31,30,31,30,31,31,30,31,30,31],
 
     
     SECOND:0,
     MINUTE:0,
     HOUR:0,
     DAY:0,
     WEEK:0,
 
     
     current_time:0,
 
     
     base_time:0
   };
    n.p = {
     cls:0,
     clear_node:"caltasche_clear_node",
     class_container:"caltasche_class_container",
     header_container:"caltasche_header_container",
     footer_label:"caltasche_footer_label",
     header_label:"caltasche_header_label",
     header_left_control:"caltasche_header_left_control",
     header_right_control:"caltasche_header_right_control",
     header_control_label:"caltasche_header_control_label",
     header_control_label_hover:"caltasche_header_control_label_hover",
     body_container:"caltasche_body_container",
     footer_container:"caltasche_footer_container",
     calendar_panel:"caltasche_calendar_panel",
     calendar_cell:"caltasche_calendar_cell",
     calendar_lastmonth_cell:"caltasche_calendar_lastmonth_cell",
     calendar_nextmonth_cell:"caltasche_calendar_nextmonth_cell",
     calendar_thismonth_cell:"caltasche_calendar_thismonth_cell",
     calendar_baseday_cell:"caltasche_calendar_baseday_cell",
     calendar_currentday_cell:"caltasche_calendar_currentday_cell",
     calendar_cell_hover:"caltasche_calendar_cell_hover",
     calendar_cell_label:"caltasche_calendar_cell_label",
 
 
     tp:"caltasche_tp",
     ta:"caltasche_ta",
     ti:"caltasche_ti",
     tib:"caltasche_tib",
     tl:"caltasche_tl",
     tcb:"caltasche_tcb",
     tcl:"caltasche_tcl",
     tbc:"caltasche_tbc",
     tn:"caltasche_tn",
     tc:"caltasche_tc",
     to:"caltasche_to",
 
     
     ce:35,
     cr:6,
     cl:7,
     d:0,
 
 
     g:0,
     cy:0,
     cM:0,
     cd:0,
     ch:0,
     cm:0,
     cs:0,
     ci:0,
     
     by:0,
     bM:0,
     bd:0,
     bh:0,
     bm:0,
     bs:0,
     bi:0,
 
     ld:0,
     nd:0,
     fm:0,
     lm:0,
     
     a:0,
     r:1,
     ic:0,
     rc:1,
     sc:0,
 
     it:0,
     rt:1,
 
     st:0,
     
     
     stc:0,
 
     
     
     scc:0,
     
     ir:0
    
   };
 
   n.init=function(){
    var t = this, _p, _d;
 
    _p = t.o;
    _d = t.o;
    
    t.r = 4;
 
       
 
    _d.SECOND = 1000;
    _d.MINUTE = _d.SECOND * 60;
    _d.HOUR = _d.MINUTE * 60;
    _d.DAY = _d.HOUR * 24;
    _d.WEEK = _d.DAY * 7;
 
    
    H.event.addScopeBuffer(t);
    t.scopeHandler("control_label_mouseout",0,0,1);
    t.scopeHandler("control_label_mouseover",0,0,1);
 
    if(t.p.a)
     t.render();
   
    
    t.applyDate();
    
   };
   
 
   n.render = function(){
    
    var t = this, _s;
    _s = t.p;
    if(!_s.ir && _s.r){
     t.createUI();
     if(_s.rc){
      
      t.createCalendar();
      if(!_s.sc) t.hideCalendar();
     }
     
     if(_s.rt){
      t.createTasks();
      if(!_s.st) t.hideTasks();
      
     }
     
     return 1;
    }
    return 0;
    
   };
   
   n.createUI = function(){
    var t = this, _s, _p, f, b, h, lh, lf;
    _s = t.p;
    _p = t.o;
    
    _p.cn = document.createElement("div");
    _p.cn.className = _s.clear_node;
 
 
 
    o = document.createElement("div");
    b = _p.b = o.cloneNode(false);
    h = o.cloneNode(false);
 
    lh = _p.lh = document.createElement("span");
    lhc = _p.lhc = lh.cloneNode(false);
    rhc = _p.rhc = lh.cloneNode(false);
    lf = _p.lf = lh.cloneNode(true);
    
    f = o.cloneNode(false);
 
    
    o.className = _s.class_container;
    h.className = _s.header_container;
    lh.className = _s.header_label;
    lhc.className = _s.header_left_control;
    rhc.className = _s.header_right_control;
    lf.className = _s.footer_label;
    b.className = _s.body_container;
    f.className = _s.footer_container;
 
    
    _p.p.appendChild(o);
    o.appendChild(h);
    o.appendChild(b);
    o.appendChild(f);
 
    
    h.appendChild(lhc);
    h.appendChild(lh);
    h.appendChild(rhc);
    h.appendChild(_p.cn.cloneNode(false));
    
    f.appendChild(lf);
    
    _p.c = o;  
   };
   n.setMonthLabels = function(s){
    this.o.m = s;
   };
   n.setDayLabels = function(s){
    this.o.d = s;
   };

   n.refreshUI = function(){
    var t = this, _s;
    _s = t.p;
 
    if(_s.sc){
     t.refreshCalendar();
    }  
 
    if(_s.st){
     t.refreshTasks();
    }
    
   };
   
   n.refreshDate = function(b){
    
    var t = this;
    t.o.base_time = new Date();
    t.setDate(t.o.base_time,b);
   };
 
   n.updateDate = function(){
    var t = this,o,_s;
    _s = t.p;
    t.setDate(new Date(_s.cy, _s.cM, _s.cd, _s.ch, _s.cm, _s.cs));
   };
   n.getDate = function(){
    return this.o.current_time;
   };
   n.setDate = function(o,b){
    
    if(typeof o == D.O){
     this.o.current_time = o;
     if(!b) this.applyDate();
     return 1;
    }
    return 0;
   };
   
   n.applyDate = function(){
    var t = this, _s, _d, o;
 
    _s = t.p;
    _d = t.o;
    o = _d.current_time;
 
    _s.d = o.getDay();
    _s.cd = o.getDate();
    _s.cy = o.getFullYear();
    _s.cM = o.getMonth();
    _s.g = o.getTimezoneOffset();
 
    _s.ch = o.getHours();
    _s.cm=  o.getMinutes();
    _s.cs = o.getSeconds();
    _s.ci = o.getMilliseconds();
 
    
    _d.s[1] = (((!(_s.cy % 4)) && (_s.cy % 100) ) || !(_s.cy % 400)) ? 29 : 28;
 
    _s.ld = _d.s[ ((_s.cM - 1) == 0 ? 12 : _s.cM - 1) - 1];
    _s.nd = _d.s[ ((_s.cM + 1) == 13 ? 1 : _s.cM + 1) - 1];
    
    _s.fm = new Date(_s.cy,_s.cM).getDay();
    _s.lm = new Date(_s.cy,_s.cM+1).getDay() - 1;
 
    if(_s.lm < 0) _s.lm += 7;
    
    
    o = _d.base_time;
    _s.by = o.getFullYear();
    _s.bM = o.getMonth();
    _s.bd = o.getDate();
    _s.bh = o.getHours();
    _s.bm = o.getMinutes();
    _s.bs = o.getSeconds();
    _s.bi = o.getMilliseconds();
    
    t.refreshUI();
    
    return 1;
   };
   
   n.getCurrentYear = function(){
    return this.p.cy;
   };
   n.setCurrentYear = function(i){
    this.p.cy = i;
   };
 
   n.getCurrentMonth = function(){
    return this.p.cM;
   };
   n.setCurrentMonth = function(i){
    this.p.cM = i;
   };
 
   n.getCurrentDay = function(){
    return this.p.cd;
   };
   n.setCurrentDay = function(i){
    this.p.cd = i;
   };
 
 
   n.getDaysInMonth = function(i){
    if(typeof i != D.N || i < 0 || i > 11) return -1;
    return this.o.s[i];
   };
 
   n.getCurrentHour = function(){
    return this.p.ch;
   };
   n.getCurrentMinute = function(){
    return this.p.cm;
   };
   n.getCurrentSecond = function(){
    return this.p.cs;
   };
   n.getCurrentMillisecond = function(){
    return this.p.ci;
   };
 
   n.getCellCount = function(){
    return this.p.ce;
   };
 
   
   n.clearLabels = function(){
    this.clearHeader();
    this.clearFooter();
    this.clearControls();
   };
   
   n.clearControls = function(){
    H.xml.removeChildren(this.o.rhc);  
    H.xml.removeChildren(this.o.lhc);
    this.p.scc = 0;
    
    
    this.p.stc = 0;
    
   };
   
   n.clearFooter = function(){
    H.xml.removeChildren(this.o.lf);
   };
   n.clearHeader = function(){
    H.xml.removeChildren(this.o.lh);
   };
   
   
   
   n.hideAllPanels = function(){
    var t = this;
    if(t.p.sc) t.hideCalendar();
 
    if(t.p.st) t.hideTasks();
 
 
   };
   
 
   
 
   n.showTasks = function(){
    var t = this;
    
    if(t.p.rt){
 
     t.hideAllPanels();
 
     t.p.st = 1;
     t.o.pt.style.display = "block";
     t.clearLabels();
     t.refreshTasks();
     return 1;
    }
    return 0;
   };
   
   n.hideTasks = function(){
    var t = this;
    if(t.p.rt){
     t.p.st = 0;
     t.o.pt.style.display = "none";
     t.clearLabels();
 
     return 1;
    }
    return 0;
   };
 
 
 
 
   n.refreshTasks = function(b){
    
    var t = this, _p, _s, _x = H.xml;
    
    _s = t.p;
    _p = t.o;
    _x.setInnerXHTML(_p.lh,"Tasks",0,0,0,1,1);
    _x.setInnerXHTML(_p.lf,"Now: " + (_s.bM + 1) + "/" + _s.bd + "/" + _s.by + " | Cur: " + (_s.cM + 1) + "/" + _s.cd + "/" + _s.cy,0,0,0,1,1);
 
    t.showTaskListControls();
   
    if(_s.stc){
 
     
     _p.tpp.style.display = (_p.tl.getCanMovePrevious() ? "block" : "none");
     _p.tpn.style.display = (_p.tl.getCanMoveNext() ? "block" : "none");
 
     
     _p.tpp.className = _s.header_control_label;
     _p.tpn.className = _s.header_control_label;
 
    }
    
    if(!b && _p.tl.getCurrentPageItemCount() > 0){
     _p.tl.updatePage();
    }
 
   };
   
   n.clearTasks = function(){
    var t = this, _p, _s,o, b, p, l;
   
    _p = t.o;
    _s = t.p;
 
    
    if(!_s.it) return 0;
    
    _p.tl.clearItems();
    _p.ti = [];
    _p.tim = [];
    
    return 1;  
   };
   
   n.addTask = function(i, n, d, c){
    
    var t = this, _p, _s,o, b, p, l;
   
    _p = t.o;
    _s = t.p;
 
    
    if(!_s.it) return 0;
    
    
    if(_p.tim[i])
     return 0;
     
 
 
    
    p = document.createElement("div");
    b = document.createElement("span");
 
    o = b.cloneNode(false);
    o.className = _s.tbc + " " + _s.tl + " " + _s.tcb;
    o.appendChild(document.createTextNode("+"));
    p.appendChild(o);
    
    o = b.cloneNode(false);
    o.className = _s.tn + " " + _s.tl + " " + _s.tcb;
    o.appendChild(document.createTextNode(n));
    p.appendChild(o);
 
    o = b.cloneNode(false);
    o.className = _s.tc + " " + _s.tl + " " + _s.tcb;
    o.appendChild(document.createTextNode("yes"));
    p.appendChild(o);
 
    o = b.cloneNode(false);
    o.className = _s.to + " " + _s.tl + " " + _s.tcb;
    o.appendChild(document.createTextNode("+"));
    p.appendChild(o);
    
    p.appendChild(_p.cn.cloneNode(true));
 
    
     
    _p.tl.pageItem(p,i);
    
    
    l = _p.ti.length;
    _p.tim[i] = l;
    _p.ti[l] = {i:i,n:n,d:d,c:c};
    
   };
   
   n.showTaskListControls = function(){
 
    var t = this, _s, _p, lb, rb,_e=H.event;
    _s = t.p;
    _p = t.o;
 
    
    if(_s.stc) return 0;
    
    _p.tpp = lb = document.createElement("span");
 
    _p.tpn = rb = lb.cloneNode(false);
 
    _e.addEventListener(lb,"mouseover",t._prehandle_control_label_mouseover,0);
    _e.addEventListener(lb,"mouseout",t._prehandle_control_label_mouseout,0);
    _e.addEventListener(lb,"click",t._prehandle_task_pageback,0);
    
    _e.addEventListener(rb,"mouseover",t._prehandle_control_label_mouseover,0);
    _e.addEventListener(rb,"mouseout",t._prehandle_control_label_mouseout,0);
    _e.addEventListener(rb,"click",t._prehandle_task_pagenext,0);
    
    lb.className = _s.header_control_label;
    rb.className = _s.header_control_label;
    
    _p.lhc.appendChild(lb);
    _p.rhc.appendChild(rb);
 
 
    lb.appendChild(document.createTextNode("<"));
    rb.appendChild(document.createTextNode(">"));
 
 
    
    _s.stc = 1;
   };
 
 
   n.createTasks = function(){
    var t = this, _p, _s,_e = H.event, o, b;
   
    _p = t.o;
    _s = t.p;
  
    if(!_s.rt || _s.it) return 0;
    
    
    _p.pt = document.createElement("div");
    _p.ptl = _p.pt.cloneNode(false);
    _p.ptt = _p.pt.cloneNode(false);
    _p.pta = _p.pt.cloneNode(false);
 
    _p.b.appendChild(_p.pt);
    _p.pt.className = _s.tp;
    _p.pta.className = _s.ta;
    _p.pta.style.display = "none";
    
    _p.pt.appendChild(_p.ptl);
    _p.pt.appendChild(_p.ptt);
    _p.pt.appendChild(_p.pta);
    
    _p.ptl.className = _s.ti + " " + _s.tib;
    b = document.createElement("span");
 
    
    o = b.cloneNode(false);
    o.className = _s.tbc + " " + _s.tl + " " + _s.tcl;
    o.appendChild(document.createTextNode("B"));
    _p.ptl.appendChild(o);
    
    o = b.cloneNode(false);
    o.className = _s.tn + " " + _s.tl + " " + _s.tcl;
    o.appendChild(document.createTextNode("name"));
    _p.ptl.appendChild(o);
    
    o = b.cloneNode(false);
    o.className = _s.tc + " " + _s.tl + " " + _s.tcl;
    o.appendChild(document.createTextNode("com"));
    _p.ptl.appendChild(o);
 
    o = b.cloneNode(false);
    o.className = _s.to + " " + _s.tl + " " + _s.tcl;
    o.appendChild(document.createTextNode("late"));
    _p.ptl.appendChild(o);
    
    _p.ptl.appendChild(_p.cn.cloneNode(true));
    
       
    t.scopeHandler("task_click",0,0,1);
    t.scopeHandler("task_pageback",0,0,1);
    t.scopeHandler("task_pagenext",0,0,1);
    t.scopeHandler("task_pagenavigate",0,0,1);
    t.scopeHandler("ta",0,0,1);
 
    _p.tl = H.ui.wideselect.newInstance(_p.ptt,t._prehandle_task_click, t._prehandle_task_pagenavigate);
    _p.tl.setIsPaging(1);
    _p.tl.setIsBuffered(0);
    _p.tl.setPageStop(1);
    _p.ts = new H.task.serviceImpl();
     
 
    _s.it = 1;
   
    return 1;
   };
   
 
   n._handle_ta = function(s, v){
    
   };
 
   n._handle_task_pagenavigate = function(s, v){
    this.refreshTasks(1);
   };
   
   n._handle_task_pageback = function(s, v){
    var t = this, _p;
    _p = t.o;
    if(!_p.tl.getCanMovePrevious()) return 0;
    _p.tl.movePrevious();
   };
   n._handle_task_pagenext = function(s, v){
    var t = this, _p;
    _p = t.o;
    if(!_p.tl.getCanMoveNext()) return 0;
    _p.tl.moveNext();  
   };
   
   n._handle_task_click = function(s, v){
    var t = this, _p, r, i, o, _x = H.xml;
    _p = t.o;
 
    if(_p.tl.getActiveItem() == null || (!v && !v.data)){
     t.refreshTasks();
     return 0;
    }
    i = v.data;
    if(typeof _p.tim[i] != D.N) return 0;
    o = _p.ti[_p.tim[i]];
    if(!o.c){
     _x.setInnerXHTML(_p.lf,o.n + " incomplete.",0,0,0,0,1);
    }
    else{
     _x.setInnerXHTML(_p.lf,o.n + " complete.",0,0,0,0,1);
    }
 
   };
 
   
   
   
   n.showCalendarControls = function(){
 
    var t = this, _s, _p, lb, rb,_e=H.event;
 
    _s = t.p;
    _p = t.o;
 
    
    if(_s.scc) return 0;
    
    lb = document.createElement("span");
    rb = lb.cloneNode(false);
 
    lb.setAttribute("move-month","-1");
    rb.setAttribute("move-month","1");
 
    _e.addEventListener(lb,"mouseover",t._prehandle_control_label_mouseover,0);
    _e.addEventListener(lb,"mouseout",t._prehandle_control_label_mouseout,0);
    _e.addEventListener(lb,"click",t._prehandle_navigate_month,0);
    
    _e.addEventListener(rb,"mouseover",t._prehandle_control_label_mouseover,0);
    _e.addEventListener(rb,"mouseout",t._prehandle_control_label_mouseout,0);
    _e.addEventListener(rb,"click",t._prehandle_navigate_month,0);
    
    lb.className = _s.header_control_label;
    rb.className = _s.header_control_label;
    
    _p.lhc.appendChild(lb);
    _p.rhc.appendChild(rb);
 
    lb.appendChild(document.createTextNode("<"));
    rb.appendChild(document.createTextNode(">"));
 
    _s.scc = 1;
 
   };
   
   n.showCalendar = function(){
    var t = this;
 
    if(t.p.rc){
 
     t.hideAllPanels();
 
     t.p.sc = 1;
     t.o.pc.style.display = "block";
     t.clearLabels();
     t.refreshCalendar();
     return 1;
    }
 
    return 0;
   };
   
   n.hideCalendar = function(){
    var t = this;
    if(t.p.rc){
     t.p.sc = 0;
     t.o.pc.style.display = "none";
     t.clearLabels();
     return 1;
    }
    return 0;
   };
   
   n.refreshCalendar = function(){
    var t = this, _p, _s, _d, o, a, i = 0, j, c = 0, cd = 0, bc, ld, bd, db, fd, m, _x, dl, lm, nm, ly, ny,_e=H.event;
    
 
    
    _s = t.p;
    _d = t.o;
    _p = t.o;
 
    if(!_s.rc || !_s.sc) return 0;
 
    _x = H.xml;
 
    m = _s.cM;
 
    
    ld = _d.s[m];
 
    
    lm = (m > 0 ? m - 1 : 11);
    ly = (lm == 11 ? _s.cy - 1 : _s.cy);
 
    
    nm = (m < 11 ? m + 1 : 0);
    ny = (nm == 0 ? _s.cy + 1 : _s.cy);
 
    
    bd = _d.s[ lm ];
    fd = _s.fm;
 
    
    
    db = (fd ? fd : _s.cl);
 
    for(; i < _s.cr;i++){
     for(j = 0; j < _s.cl; j++){
      o = _p.dc[i][j];
      dl = "";
      bc = "";
 
      
      if(cd == 0 && db == 0) cd++;
      
      
      if(db > 0){
       
       dl = bd - (db-1);
 
       bc = _s.calendar_lastmonth_cell;
       db--;
       o.setAttribute("month",lm);
       o.setAttribute("year",ly);
      }
      
      
      else if(cd  > ld){
       bc = _s.calendar_nextmonth_cell;
       dl = c - ld - (fd ? fd : _s.cl) + 1;;
       o.setAttribute("month",nm);
       o.setAttribute("year",ny);
      }
 
      
      else{
       dl = cd;
       if(cd == _s.cd){
        bc = _s.calendar_currentday_cell;
       }
       else if(_s.by == _s.cy && _s.bM == _s.cM && cd == _s.bd){
        bc = _s.calendar_baseday_cell;
       }
       else{
        bc = _s.calendar_thismonth_cell;
       }
       o.setAttribute("month",_s.cM);
       o.setAttribute("year", _s.cy);
      }
 
      o.setAttribute("day",dl);
 
      o.className = _s.calendar_cell + " " + bc;
      o.setAttribute("base-class",bc);
      c++;
      if(db <= 0 && cd  <= ld){
 
       cd++;
      }
 
      
      _x.setInnerXHTML(o,"" + dl,0,0,0,0,1);
 
     }
    }
    
    o = document.createElement("span");
    o.appendChild(document.createTextNode("Now:" + (_s.bM + 1) + "/" + _s.bd + "/" + _s.by));
    _e.addEventListener(o,"mouseover",t._prehandle_control_label_mouseover,0);
    _e.addEventListener(o,"mouseout",t._prehandle_control_label_mouseout,0);
    _e.addEventListener(o,"click",t._prehandle_navigate_basedate,0);
    o.className = _s.header_control_label;
    
    _x.setInnerXHTML(_p.lh,_d.m.split(",")[_s.cM] + " " + _s.cy,0,0,0,1,1);
 
    _x.removeChildren(_p.lf);
    _p.lf.appendChild(o);
    _x.setInnerXHTML(_p.lf," | Cur: " + (_s.cM + 1) + "/" + _s.cd + "/" + _s.cy,1,0,0,1,1);
 
    t.showCalendarControls();
 
    return 1;
   
   };
   
   n.createCalendar = function(){
    var t = this, _p, o, _s, f, b, h, p, i, j,c,l,tl,_e=H.event;
   
    _p = t.o;
    _s = t.p;
  
    if(!_s.rc || _s.ic) return 0;
    
    
    _p.pc = document.createElement("div");
    _p.b.appendChild(_p.pc);
    _p.pc.className = _s.calendar_panel;
 
    t.scopeHandler("navigate_basedate",0,0,1);
    t.scopeHandler("navigate_month",0,0,1);
    t.scopeHandler("cell_mouseover",0,0,1);
    t.scopeHandler("cell_mouseout",0,0,1);
    t.scopeHandler("cell_click",0,0,1);
    
    _p.dc = [];
    _p.cl = [];
    c = t.o.d.split(",");
    tl = _s.cls;
 
    for(i = 0; i < _s.cl;i++){
     l = c[i];
     if(l.length > tl && tl > 0) l = l.substring(0,tl);
     
     o = _p.cl[i] = document.createElement("span");
     o.appendChild(document.createTextNode(l));
     _p.pc.appendChild(o);
     o.className = _s.calendar_cell_label;
    }
 
    for(i = 0; i < _s.cr;i++){
     o = _p.dc[i] = [];
     for(j = 0; j < _s.cl;j++){
      o[j] = document.createElement("span");
      _p.pc.appendChild(o[j]);
      _e.addEventListener(o[j],"mouseover",t._prehandle_cell_mouseover,0);
      _e.addEventListener(o[j],"mouseout",t._prehandle_cell_mouseout,0);
      _e.addEventListener(o[j],"click",t._prehandle_cell_click,0);
      
     }
    }
 
    
    _p.pc.appendChild(_p.cn.cloneNode(false));
    
    _s.ic = 1;
    
    return 1;
 
   };
   
   
 
 
   n._handle_cell_mouseover = function(v){
    var t=this,o,e,bc;
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    bc = o.getAttribute("base-class");
    if(!bc) bc = "";
    o.className = t.p.calendar_cell + " " + bc + " " + t.p.calendar_cell_hover;
   };
 
   n._handle_cell_mouseout = function(v){
    var t=this,o,e,bc;
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    bc = o.getAttribute("base-class");
    if(!bc) bc = "";
    o.className = t.p.calendar_cell + " " + bc;
   };  
 
   n._handle_cell_click = function(v){
    var t=this,o,e,_p,_s, m, d, y;
 
    _s = t.p;
    _p = t.o;
 
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    
    m = o.getAttribute("month");
    d = o.getAttribute("day");
    y = o.getAttribute("year");
 
    if(
     typeof m != D.U && m != null
     &&
     typeof d != D.U && d != null
     &&
     typeof y != D.U && y != null
    ){
     m = parseInt(m);
     d = parseInt(d);
     t.setCurrentMonth(m);
     t.setCurrentDay(d);
     t.setCurrentYear(y);
     t.updateDate();
     H.message.service.publish("ondatechanged",t);
     H.message.service.publish("onselectdate",t);
    }
   };
 
 
   n._handle_control_label_mouseover = function(v){
    var t=this,o,e;
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    o.className = t.p.header_control_label + " " + t.p.header_control_label_hover;
   };
 
   n._handle_control_label_mouseout = function(v){
    var t=this,o,e;
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    o.className = t.p.header_control_label;
   };  
 
   n._handle_navigate_basedate = function(v){
    this.refreshDate();
   };
 
   n._handle_navigate_month = function(v){
    var t=this,o,e, i;
    e=H.event.getEvent(v);
    o=(typeof v != D.U && v.nodeType)?v:H.event.getEventSource(v);
    if(o && o.nodeType==3) o=o.parentNode;
    i = o.getAttribute("move-month");
    if(i){
     i = parseInt(i);
     t.setCurrentMonth(t.p.cM + i);
     t.updateDate();
     H.message.service.publish("ondatechanged",t);
    }
 
   };
 
   n.HWD=function(){
    this.destroy();
   };
   
   n.destroy=function(){
    var t=this,c;
    c=t.o;
    if(t.r == 4){
     c.p.removeChild(c.c);
     H.registry.service.removeObject(t);
    }
    t.r = 0;
   };
   
   n.refreshDate(1);
 
   n.init();
 
   H.registry.service.addObject(n);
 
   return n;
  }
 });
}());


/* End Hemi Framework 3.5 */
		