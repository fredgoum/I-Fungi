/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.Critere",
{
  extend : qx.ui.mobile.page.NavigationPage,

  events : {
    /**
     * Fired when the checkBox are checked
     */
    "addCriterion" : "qx.event.type.Data",
    /**
     * Fired when the checkBox are unchecked
     */
    "removeCriterion" : "qx.event.type.Data",
    /**
     * Display page for more information about a critere
     */
     "displayCritereHelp" : "qx.event.type.Data"
  },

  construct : function() {
    this.base(arguments);
    this.set({
      title : this.tr("Criteria"),
      showBackButton : true,
      backButtonText : "Back"
    });
  },

  members :
  {
    // overridden
    _initialize : function() {
      this.base(arguments);
    },
    /**
     * Build the tree of criteria thanks
     * to the recursive function __affciherNoeuds
     * @param myNewJSON {Object} Object containing the criteria.
     */
    showTree : function(myNewJSON) {
      var tabCheckBoxform = [];
      this.getContent().removeAll(tabCheckBoxform);
      var rootEnfants = myNewJSON.root.enfants;
      for (let i = 0; i < rootEnfants.length; i++) {
        var profondeur = 0;
        var checkBoxform = this.__showNodes(myNewJSON, rootEnfants[i], profondeur);
        checkBoxform.checkBoxform.setVisibility("visible");
        tabCheckBoxform.push(checkBoxform)
      }
    },
    /**
     * Displays the criteria tree
     * @param myNewJSON {Object} Object containing the criteria.
     * @param node {String} string corresponding to criterion.
     * @param profondeur {Integer} Integer corresponding to criterion deepth in JSON tree.
     */
    __showNodes : function(myNewJSON, node, profondeur) {
      if (myNewJSON[node] != null) {
        var critere = myNewJSON[node].langue;
        var parentNode = myNewJSON[node].parent;
        var parentCritere = myNewJSON[parentNode].langue;
        var checkBox = new ifungi.ui.GroupCheckBox();
        var form = new qx.ui.mobile.form.Form();
        form.add(checkBox, "&nbsp;&nbsp;&nbsp;&nbsp;".repeat(profondeur) + "&#8226;&nbsp" + critere);
        var checkBoxform = new qx.ui.mobile.form.renderer.Single(form);
        this.getContent().add(checkBoxform);
        checkBoxform.setVisibility("excluded");
        // Display more information about a criterion
        checkBoxform.addListener("longtap", function(evt) {
          this.fireDataEvent("displayCritereHelp", critere);
        }, this);
        // If node childs exists then
        if (myNewJSON[node].enfants.length != 0) {
          var checkboxes = [];
          var leafCheckboxes = [];
          var nodeChilds = myNewJSON[node].enfants;
          for (let i = 0; i < nodeChilds.length; i++) {
            if (myNewJSON[nodeChilds[i]] != null) {
              if (myNewJSON[nodeChilds[i]].enfants.length == 0) {
                leafCheckboxes.push(this.__showNodes(myNewJSON, nodeChilds[i], profondeur+1));
              } else {
                checkboxes.push(this.__showNodes(myNewJSON, nodeChilds[i], profondeur+1));
              }
            }
          }
          // Add Listener on checkBoxes
          checkBox.addListener("changeValue", function(evt) {
            // If checkBox is checked then displays its sub items
            if (evt.getData()) {
              for (let j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checkBoxform.setVisibility("visible");
              }
              // Add JSON tree sheets in a checkBoxGroup and showing their
              var group = new qx.ui.mobile.form.RadioGroup();
              var checkBoxInit = new ifungi.ui.GroupCheckBox();
              group.add(checkBoxInit);
              for (let j = 0; j < leafCheckboxes.length; j++) {
                group.add(leafCheckboxes[j].checkBox);
                leafCheckboxes[j].checkBoxform.setVisibility("visible");
              }
            } else {
              for (let j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checkBoxform.setVisibility("excluded");
                if (checkboxes[j].checkBox._state != undefined) {
                  if (checkboxes[j].checkBox._state == true) {
                    checkboxes[j].checkBox._onTap();
                  }
                }
              }
              for (let j = 0; j < leafCheckboxes.length; j++) {
                leafCheckboxes[j].checkBoxform.setVisibility("excluded");
                if (leafCheckboxes[j].checkBox._state == true) {
                  leafCheckboxes[j].checkBox._onTap();
                }
              }
            }
          }, this);
        } else {
          // Add Listener on leaves of the JSON tree
          checkBox.addListener("changeValue", function(evt) {
            var parentCritereAndCritere = {};
            parentCritereAndCritere[this.cleanUpSpecialChars(parentCritere)] = this.cleanUpSpecialChars(critere);
            if (evt.getData()) {
              this.fireDataEvent("addCriterion", parentCritereAndCritere);
            } else {
              this.fireDataEvent("removeCriterion", parentCritereAndCritere);
            }
          }, this);
        }
      }
      return {
        checkBoxform,
        checkBox
      };
    },
    /**
     * Application of sensitive case to bind JSON and CSV database
     * strings with special char like accent are replaced by
     * string with none accent.
     * Strings are then put in lowercase for advanced cases where
     * JSON ou CSV database are wrote in lowercase or uppercase.
     * Except columns of images in CSV database because containing
     * names of images corresponding to images in local.
     * @param node {String} string corresponding to a string.
     */
    cleanUpSpecialChars : function(str) {
      var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g // C, c
      ];
      var noaccent = ["A", "a", "E", "e", "I", "i", "O", "o", "U", "u", "N", "n", "C", "c"];
      for (let i = 0; i < accent.length; i++) {
          str = str.replace(accent[i], noaccent[i]);
      }
      return str.toLowerCase();
    }
  }
});
