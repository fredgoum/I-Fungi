/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.data.Arbre",
{
  type: "singleton",
  extend : qx.core.Object,

  events : {
    /**
    * Fired when the json file is completly loaded
    */
    "loadedJsonFile" : "qx.event.type.Data"
  },

  construct : function(value) {
    this.base(arguments);
  },

  members :
  {
    /**
      * Takes as input the JSON file of the criteria tree
      * and returns as result a JSON object.
      * @param file {Object} Object containing the criteria tree.
     */
    getJsonfile : function(file) {
      var jsonFile = new qx.data.store.Json();
      // For if file is loaded completly with success
      jsonFile.addListener("loaded", function(e) {
        var response = qx.util.Serializer.toNativeObject(jsonFile.getModel());
        this.fireDataEvent("loadedJsonFile", response);
      }, this);
      //  For if file don't load completly with success
      jsonFile.addListener("error", function(e) {
      }, this);
      jsonFile.setUrl(file);
    }
  }
});
