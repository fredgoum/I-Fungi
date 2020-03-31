/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.ui.NavEntry",
{
  extend : qx.ui.mobile.core.Widget,

  properties : {
    icon : {
      init: "resource/ifungi/arrow-right-circle-outline.png",
      nullable: false,
      event: "changeIcon"
    },
    label : {
      init: null,
      nullable: true,
      event: "changeLabel"
    }
  },

  construct : function(value) {
    this.base(arguments);
    var icon = new qx.ui.mobile.basic.Image(this.getIcon());
    var label = new qx.ui.mobile.form.Label();
    this.bind("icon", icon, "source");
    this.bind("label", label, "value");
    if (value) {
      this.setLabel(value);
    }
    this._setLayout(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
    this._add(icon, {flex: null});
    this._add(label, {flex: 9});
  }
});
