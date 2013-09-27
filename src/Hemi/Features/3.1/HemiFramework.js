if (typeof window != "object") window = {};
(function () {

    //if ((typeof window == "object" && window.Hemi) || typeof Hemi != "object") return;

    HemiEngine = {
        Libraries: [],
        LibraryMap: [],
        Namespaces: [],
        NamespaceMap: [],
        ClassImports: [],
        Context: window,

        ///		<property name = "hemi_base" get = "1" set = "1" type = "String">The base path of the Hemi Framework. By default, the base path is /Hemi/ when accessed via http/s, and the current directory when accessed via the filesystem.</property>
        ///
        hemi_base: (location.protocol.match(/^file/i) ? location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) : "/Hemi/"),
        uid_prefix: "hemi-",
        guid_counter: 0
    };


    if (!window.Hemi) window.Hemi = HemiEngine;
})();