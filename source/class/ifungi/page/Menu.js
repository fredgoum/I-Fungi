/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.Menu",
{
  extend : qx.ui.mobile.page.NavigationPage,

  events : {
    /**
      * Fired when the menu Morphological Identification is tapped
     */
    "tapMorphological" : "qx.event.type.Data",
    /**
      * Fired when the menu Educative Ressources is tapped
     */
    "tapEducativeRes" : "qx.event.type.Data"
  },

  construct : function() {
    this.base(arguments);
    this.setTitle(this.tr("Menu"));
  },

  members :
  {
    __input: null,

    // overridden
    _initialize: function() {
      this.base(arguments);
      /**
        * Menu Morphological Identification
       */
      var morphologicalId = this.__input = new ifungi.ui.NavEntry(this.tr("MORPHOLOGICAL <br> IDENTIFICATION"));
      morphologicalId.addListener("tap", function(evt) {
        var item = this.__input.getLabel();
        this.fireDataEvent("tapMorphological", item);
      }, this);
      /**
        * Menu Educative Ressources
       */
      var educativeRes = this.__input = new ifungi.ui.NavEntry(this.tr("EDUCATIVE <br> RESSOURCES"));
      educativeRes.addListener("tap", function(evt) {
        var item = this.__input.getLabel();
        this.fireDataEvent("tapEducativeRes", item);
      }, this);
      /**
        * Menu Search Fungal Species
       */
      var fungal = new ifungi.ui.NavEntry(this.tr("SEARCH <br> FUNGAL SPECIES"));
      var darkImageFungal = new qx.ui.mobile.basic.Image("resource/ifungi/dark.png");
      var textfield = new qx.ui.mobile.form.TextField();
      var searchIcon = new qx.ui.mobile.basic.Image("resource/ifungi/eee.png");
      searchIcon.addListener("tap", function() {
        console.log("Searching...");
      }, this);
      var fungalHBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      fungalHBox.add(textfield);
      fungalHBox.add(searchIcon);
      var hBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      hBox.add(darkImageFungal);
      hBox.add(fungalHBox);
      var searchFuncgalSp = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      searchFuncgalSp.add(fungal);
      searchFuncgalSp.add(hBox);
      /**
        * Menu Molecular Identification
       */
      var molecularId = new ifungi.ui.NavEntry(this.tr("MOLECULAR <br> IDENTIFICATION"));
      var blast = new qx.ui.mobile.form.Label(this.tr("BLAST"));
      blast.addListener("tap", function() {
        console.log("BLAST");
      }, this);
      var phylogeny = new qx.ui.mobile.form.Label(this.tr("Phylogeny"));
      phylogeny.addListener("tap", function() {
        console.log("Phylogeny");
      }, this);
      var darkImageMolId = new qx.ui.mobile.basic.Image("resource/ifungi/dark.png");
      var molecularVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      molecularVBox.add(blast);
      molecularVBox.add(phylogeny);
      var molecularHBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      molecularHBox.add(darkImageMolId);
      molecularHBox.add(molecularVBox);
      var molecularSuperVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      molecularSuperVBox.add(molecularId);
      molecularSuperVBox.add(molecularHBox);
      /**
        * Menu Diversity
       */
      var diversity = new ifungi.ui.NavEntry(this.tr("DIVERSITY"));
      var listSpecies = new qx.ui.mobile.form.Label(this.tr("List of species"));
      listSpecies.addListener("tap", function() {
        console.log("List of species");
      }, this);
      var sequenceLibrary = new qx.ui.mobile.form.Label(this.tr("Libraries of sequences"));
      sequenceLibrary.addListener("tap", function() {
        console.log("Libraries of sequences");
      }, this);
      var darkImageDiversity = new qx.ui.mobile.basic.Image("resource/ifungi/dark.png");
      var diversityVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      diversityVBox.add(listSpecies);
      diversityVBox.add(sequenceLibrary);
      var diversityHBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      diversityHBox.add(darkImageDiversity);
      diversityHBox.add(diversityVBox);
      var diversitySuperVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      diversitySuperVBox.add(diversity);
      diversitySuperVBox.add(diversityHBox);
      /**
        * Menu About us
      */
      var aboutus = new ifungi.ui.NavEntry(this.tr("About us"));
      aboutus.addListener("tap", function() {
        console.log("Abous us");
      }, this);

      this.getContent().add(morphologicalId);
      this.getContent().add(educativeRes);
      this.getContent().add(searchFuncgalSp);
      this.getContent().add(molecularSuperVBox);
      this.getContent().add(diversitySuperVBox);
      this.getContent().add(aboutus);
      educativeRes.setEnabled(false);
      searchFuncgalSp.setEnabled(false);
      molecularSuperVBox.setEnabled(false);
      diversitySuperVBox.setEnabled(false);
      aboutus.setEnabled(false);
    }
  }

});
