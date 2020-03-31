/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * This is the main application class of your custom application "${Name}"
 *
 * @asset(ifungi/*)
 */
qx.Class.define("ifungi.Application",
{
  extend : qx.application.Mobile,

  members :
  {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function() {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console.
        // Trigger a "longtap" event on the navigation bar for opening it.
        qx.log.appender.Console;
      }
      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
        Remove or edit the following code to create your application.
      -------------------------------------------------------------------------
      */
      qx.module.Css.includeStylesheet("resource/ifungi/css/style.css");

      // Instance of singleton class Arbre
      var arbre = ifungi.data.Arbre.getInstance();
      // Instance of singleton class BD
      var bd = ifungi.data.BD.getInstance();
      // Navigation Pages
      var menu = new ifungi.page.Menu();
      var voidpage = new ifungi.page.Void();
      var critere = new ifungi.page.Critere();
      var result = new ifungi.page.Result();
      var description = new ifungi.page.DescriptionSpecie();
      var help = new ifungi.page.HelpCriteria();
      var overview = new ifungi.page.Overview();

      // The back buttons names for pages
      critere.setBackButtonText(this.tr("Menu"));
      voidpage.setBackButtonText(this.tr("Criteria"));
      result.setBackButtonText(this.tr("Criteria"));
      description.setBackButtonText(this.tr("Result"));
      overview.setBackButtonText(this.tr("Menu"));
      // Shown Back button on tablet
      critere.setShowBackButtonOnTablet(true);
      description.setShowBackButtonOnTablet(true);
      help.setShowBackButtonOnTablet(true);

      // Locale Manager for app langage
      var manag = qx.locale.Manager.getInstance();
      // Add the pages to the page manager.
      var manager = new qx.ui.mobile.page.Manager();
      manager.setHideMasterButtonCaption(this.tr("Hide"));
      manager.addMaster([
        menu,
        critere
      ]);
      manager.addDetail([
        voidpage,
        result,
        description,
        help,
        overview
      ]);
      // Initialize the appl criterion routing
      this.getRouting().onGet("/", function() {
        help.show({"animation": null});
        overview.show({"animation": null});
        result.show({"animation": null});
        description.show({"animation": null});
        voidpage.show({"animation": null});
        critere.show({"animation": null});
        menu.show({"animation": null});
      }, this);
      // Load the critere and show the critere page
      menu.addListener("tapMorphological", function(evt) {
        critere.show();
      }, this);
      // Load the overview and show the overview page
      menu.addListener("tapEducativeRes", function(evt) {
        overview.show();
      }, this);
      // Load Json file and show menu criteres
      arbre.addListener("loadedJsonFile", function(evt) {
        critere.showTree(evt.getData());
      }, this);

      var dicoCriteres = [];
      // Load the critere indexes and add to the critere dictionnary when critere checked
      critere.addListener("addCriterion", function(evt) {
        bd.getAllIndexCriteria();
        dicoCriteres.push(evt.getData());
        bd.searchSpecies(dicoCriteres);
      }, this);
      /** Load the critere indexes and remove the critere unchecked
        * in the critere dictionnary
       */
      critere.addListener("removeCriterion", function(evt) {
        for (let i = 0; i < dicoCriteres.length; i++) {
          if (JSON.stringify(dicoCriteres[i]) === JSON.stringify(evt.getData())) {
            dicoCriteres.splice(i, 1);
            bd.searchSpecies(dicoCriteres);
          }
        }
      }, this);
      /** Geting all indexes of species in database and load
        * species names and specie images corresponding, in the result page
       */
      bd.addListener("getSpeciesIndexesFinal", function(evt) {
        result.show();
        var indexSpecies = evt.getData();
        var specieList = bd.getSpeciesList();
        var geneList = bd.getGenesList();
        var allImages = bd.getAllImages();
        /**
         * Management of the display of the images results according to
         * whether it is tablet or telephone or it's a landscape or portrait.
         * The images are resized at each orientation of the screen.
         * On tablet (portrait or landscape), the size of the image is
         * half the width of the window (less a certain margin).
         * On telephone, in protrait the size of the image coresponds to
         * the width of the window and in landscape it corresponds
         * to half of the width of the window (less a certain margin).
         */
        // Getting window first with before moving it
        var screenWidth = (window.screen.availWidth-(window.screen.availWidth*0.1));
        if (result._isTablet == true) { // It's tablet
          result.showResults(indexSpecies, geneList, specieList, allImages, screenWidth);
        } else { // It's not tablet
          if (window.screen.availWidth > window.screen.availHeight) { // It's Landscape
           result.showResults(indexSpecies, geneList, specieList, allImages, screenWidth);
          } else {
           result.showResultOnPhone(indexSpecies, geneList, specieList, allImages, screenWidth*2);
          }
        }
        window.addEventListener("orientationchange", function() {
          if (screen.orientation.type === "landscape-primary" || screen.orientation.type === "landscape-secondary" || screen.orientation.type === "landscape") {
            var landscapeScreenWidth = window.screen.availWidth-(window.screen.availWidth*0.1);
            result.showResults(indexSpecies, geneList, specieList, allImages, landscapeScreenWidth);
          } else {
            var portraitScreenWidth = window.screen.availWidth;
            if (result._isTablet == true) {
              result.showResults(indexSpecies, geneList, specieList, allImages, portraitScreenWidth);
            } else {
              result.showResultOnPhone(indexSpecies, geneList, specieList, allImages, portraitScreenWidth*2);
            }
          }
        });
      }, this);

      // If there is no checkBox Checked, tell user to select criteria
      bd.addListener("noCheckboxChecked", function(evt) {
        result.hide();
        var label = new qx.ui.mobile.form.Label(this.tr("Please select criteria to see results !!"));
        voidpage.removeAll();
        voidpage.add(label);
        voidpage.show();
      }, this);
      // Display more information about a criterion
      critere.addListener("displayCritereHelp", function(evt) {
        let lab = new qx.ui.mobile.form.Label(evt.getData());
        help.removeAll(lab);
        help.add(lab);
        help.show();
      }, this);
      // Back to top Button for Result Page
      var topContainer = new qx.ui.mobile.container.Composite();
      var top = new qx.ui.mobile.basic.Image("resource/ifungi/top_bouton.png");
      topContainer.add(top);
      topContainer.addCssClass("top");
      result.show();
      result.add(topContainer);
      topContainer.setVisibility("excluded");
      topContainer.addListener("tap", function(evt) {
        result.__scrollContainer.__containerElement.scrollTop = 0;
        topContainer.setVisibility("excluded");
      }, this);
      result.addListener("roll", function(evt) {
        if (result.__scrollContainer.__containerElement.scrollTop > 20) {
          topContainer.setVisibility("visible");
        }else {
          topContainer.setVisibility("excluded");
        }
      }, this);
      // Show more informations about specie in additional to his images
      result.addListener("tapdOnSpecie", function(evt) {
        if (manag.getLocale() == "en_ie") {
          description.showSpecieDescription("resource/ifungi/Markdown/MarkdownEN/"+evt.getData()+".md");
        }else {
          description.showSpecieDescription("resource/ifungi/Markdown/MarkdownFR/"+evt.getData()+".md");
        }
        description.show();
      }, this);
      // Manage Boutton Langage
      var composite = new qx.ui.mobile.container.Composite();
      var lang = new qx.ui.mobile.basic.Image();
      if (manag.getLocale() == "en_ie") {
        lang.setSource("resource/ifungi/fr.png");
      }else {
        lang.setSource("resource/ifungi/eng.png");
      }
      composite.add(lang);
      menu.getLeftContainer().add(composite);
      composite.addListener("tap", function(evt) {
        if (manag.getLocale() == "en_ie") {
          manag.setLocale("fr");
          lang.setSource("resource/ifungi/eng.png");
        }else {
          manag.setLocale("en_ie");
          lang.setSource("resource/ifungi/fr.png");
        }
      }, this);
      /** If language changed then
        * load JSON and CSV corresponding to a new langage
        * change also description page of the specie
       */
      manag.addListener("changeLocale", function(evt) {
        dicoCriteres = [];
        if (manag.getLocale() == "en_ie") {
          arbre.getJsonfile("resource/ifungi/arbres/micromycetes/fileEN.json");
          bd.getfilecsv("resource/ifungi/datasets/micromycetes/fileEN.csv");
          description.showSpecieDescription("resource/ifungi/Markdown/MarkdownEN/"+result.getNameSpecieTaped()+".md");
        }else {
          arbre.getJsonfile("resource/ifungi/arbres/micromycetes/fileFR.json");
          bd.getfilecsv("resource/ifungi/datasets/micromycetes/fileFR.csv");
          description.showSpecieDescription("resource/ifungi/Markdown/MarkdownFR/"+result.getNameSpecieTaped()+".md");
        }
      }, this);
      // Back to the Menu
      critere.addListener("back", function(evt) {
        menu.show({
          reverse: true
        });
      }, this);
      // Back to the Menu
      overview.addListener("back", function(evt) {
        menu.show({
          reverse: true
        });
      }, this);
      // Back to the Critere Page
      result.addListener("back", function(evt) {
        critere.show({
          reverse: true
        });
      }, this);
      // Back to the Critere Page
      voidpage.addListener("back", function(evt) {
        result.hide();
        critere.show({
          reverse: true
        });
      }, this);
      // Back to the Result Page
      description.addListener("back", function(evt) {
        result.show({
          reverse: true
        });
      }, this);
      // Back to the Overview page
      help.addListener("back", function(evt) {
        voidpage.show({
          reverse: true
        });
      }, this);
      // Load database JSON and CSV
      if (manag.getLocale() == "en_ie") {
        arbre.getJsonfile("resource/ifungi/arbres/micromycetes/fileEN.json");
        bd.getfilecsv("resource/ifungi/datasets/micromycetes/fileEN.csv");
      }else {
        arbre.getJsonfile("resource/ifungi/arbres/micromycetes/fileFR.json");
        bd.getfilecsv("resource/ifungi/datasets/micromycetes/fileFR.csv");
      }
      this.getRouting().init();
      navigator.splashscreen.hide();
    }
  }
});
