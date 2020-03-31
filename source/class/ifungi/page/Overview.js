/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.Overview",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function() {
    this.base(arguments);
    this.set({
      title : this.tr("Overview"),
      showBackButton : true,
      backButtonText : "Back"
    });
  },

  members :
  {
    // overridden
    _initialize : function() {
      this.base(arguments);
    }
  }
});
