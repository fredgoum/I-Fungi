/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.DescriptionSpecie",
{
  extend : qx.ui.mobile.page.NavigationPage,
  events : {
    /**
      * Fired when the Markdown file is completly loaded
     */
    "loadedMarkdown" : "qx.event.type.Data"
  },

  construct : function() {
    this.base(arguments);
    this.set({
      title : this.tr("Description of species"),
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
     * Displays the description of the specie
     * @param myNewJSON {Object} Object containing the criteria.
     */
    showSpecieDescription : function(mdSpecieSource) {
      var req = new qx.io.request.Xhr(mdSpecieSource);
      // For if file is loaded completly with success
      req.addListener("success", function(e) {
        var req = e.getTarget();
        let response = req.getResponse();
        this.fireDataEvent("loadedMarkdown", response);
      }, this);
      //  For if file don't load completly with success
      req.addListener("fail", function(e) {
        var label = new qx.ui.mobile.form.Label(this.tr("Sorry my description is not ready yet"));
        this.getContent().add(label);
      }, this);
      // Send request
      req.send();
      // Convert md to html and display htmlText
      var mdToHtml = new Remarkable();
      var html = new qx.ui.mobile.embed.Html();
      this.addListener("loadedMarkdown", function(evt) {
        let firtHtml = mdToHtml.render(evt.getData());
        let secondHtml = firtHtml.replace(/<img/g, '<img height="300"');
        let newHtml = secondHtml.replace(/SAUTDELINE/g, '<br>');
        html.setHtml(newHtml);
      }, this);
      this.getContent().removeAll(html);
      this.getContent().add(html);
    }
  }
});
