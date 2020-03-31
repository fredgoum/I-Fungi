/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.Void",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function() {
    this.base(arguments);
    this.set({
      showBackButton : true,
      backButtonText : "Back"
    });
  },

  members :
  {
    // overridden
    _initialize : function() {
      this.base(arguments);
      this.setLayout(new qx.ui.mobile.layout.HBox());
      this.addCssClass("void");
    }
  }
});
