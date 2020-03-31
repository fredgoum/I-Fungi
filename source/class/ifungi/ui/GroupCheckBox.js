/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.ui.GroupCheckBox",
{
  extend : qx.ui.mobile.form.CheckBox,

  properties : {
    group :{
      check  : "qx.ui.mobile.form.RadioGroup",
      nullable : true,
      apply : "_applyGroup",
      event: "changeGroup"
    }
  },

  construct : function(value) {
    this.base(arguments);
  },
  members :
  {
    _applyGroup : function(value, old) {
     if (old) {
       old.remove(this);
     }
     if (value) {
       value.add(this);
     }
    }
  }
});
