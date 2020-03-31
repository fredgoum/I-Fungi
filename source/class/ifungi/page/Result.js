/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.page.Result",
{
  extend : qx.ui.mobile.page.NavigationPage,

  events : {
    /**
      * Fired when specie item is typed
      * for show description page of specie
     */
    "tapdOnSpecie" : "qx.event.type.Data"
  },

  properties : {
    /** For the name of specie taped */
    nameSpecieTaped :
    {
      init : "",
      nullable : true,
      event : "changeNameSpecieTaped"
    }
  },

  construct : function() {
    this.base(arguments);
    this.set({
      title : this.tr("Result"),
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
     * Show user request result on the screen corresponding to species images
     * @param indexSpecies {Array} Array containing indexes of species of criteria chooseen by user
     * @param geneList {Array} Array containing list of genes
     * @param specieList {Array} Array containing list of all species
     * @param allImages {Array} Array containing tables of images
     */
    showResults : function (indexSpecies, geneList, specieList, allImages, screenWidth) {
      this.getContent().removeAll();
      var resultVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      var hitsHBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      var carouselContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      if (indexSpecies.length != 0) {
        /**
         * Number of hits found
        */
        var hitsNumber = new qx.ui.mobile.form.Label(indexSpecies.length+ this.tr(" HITS"));
        var sort = new qx.ui.mobile.form.Label(this.tr("sort by GENUS or <br>SPECIES"));
        if (hitsNumber != null) {
          hitsHBox.add(hitsNumber, {flex:1});
          hitsHBox.add(sort);
        }
        var isTabletCarousel = [];
        var isTabletNameSpecie = [];
        // Species to load
        for (let i = 0; i < indexSpecies.length; i++) {
          var itemSpecie = specieList[indexSpecies[i]];
          // Elimination of duplicates in the images list to display
          var uniqueImages = [];
          for (let l = 0; l < allImages.length; l++) {
            var index = uniqueImages.findIndex(x => x==allImages[l][indexSpecies[i]]);
            if (index === -1) {
              if (allImages[l][indexSpecies[i]] != "") { // if not enmpty value
                uniqueImages.push(allImages[l][indexSpecies[i]]);
              }
            }
          }
          // console.log(uniqueImages);
          /**
            * Addition species and images of specice in a component
            * depending on whether it is a tablet or a smarphones
           */
          var carousel = new qx.ui.mobile.container.Carousel();
          var nameSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
          var hboxNameSpecie = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignX:"center"}));
          var nameSpecie = new qx.ui.mobile.form.Label("<i>"+geneList[indexSpecies[i]]+" "+specieList[indexSpecies[i]]+"<i>");
          hboxNameSpecie.add(nameSpecie);
          hboxNameSpecie.add(new qx.ui.mobile.basic.Image("resource/ifungi/btn_scopic2.png"));
          nameSpecieContainer.add(hboxNameSpecie);
          // Listener on name of specie for shown the description of specie
          hboxNameSpecie.addListener("tap", this.bindClick(itemSpecie), this);
          // Display Images
          if (uniqueImages.length != 0) {
            for (let m = 0; m < uniqueImages.length; m++) {
              let source = "resource/ifungi/FolderImages/"+uniqueImages[m]+".jpg";
              var imageSpecie = new qx.ui.mobile.basic.Image();
              // Check if image exists else load default Image
              if (this.__imagExists(source)) {
                imageSpecie.setSource(source);
              }else {
                imageSpecie.setSource("resource/ifungi/FolderImages/forImageNotExist.jpg");
              }
              // Resize Images
              this.resizeImage(imageSpecie, carousel, screenWidth);
              // Listener on image of specie for shown the description of specie
              imageSpecie.addListener("tap", this.bindClick(itemSpecie), this);
              let imageSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
              imageSpecieContainer.add(imageSpecie);
              carousel.add(imageSpecieContainer);
            }
          } else {  // if specie exist but there no image name gave in the csv file
            let source = "resource/ifungi/FolderImages/defaultImage.jpg";
            var defaultImageSpecie = new qx.ui.mobile.basic.Image(source);
            // Resize Images
            this.resizeImage(defaultImageSpecie, carousel, screenWidth);
            // Listener on image of specie for shown the description of specie
            defaultImageSpecie.addListener("tap", this.bindClick(itemSpecie), this);
            let imageSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
            imageSpecieContainer.add(defaultImageSpecie);
            carousel.add(imageSpecieContainer);
          }
          isTabletNameSpecie.push(nameSpecieContainer);
          isTabletCarousel.push(carousel);
        }
        var isTabletNameSplit = this.__splitPairs(isTabletNameSpecie);
        var isTabletCarouselSplit = this.__splitPairs(isTabletCarousel);
        for (let i = 0; i < isTabletCarouselSplit.length; i++) {
          var hboxForNames = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
          var hboxForCarousel = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
          for (let j = 0; j < isTabletCarouselSplit[i].length; j++) {
            hboxForNames.add(isTabletNameSplit[i][j]);
            hboxForCarousel.add(isTabletCarouselSplit[i][j]);
          }
          carouselContainer.add(hboxForNames);
          carouselContainer.add(hboxForCarousel);
        }
      } else {
        carouselContainer.add(new qx.ui.mobile.form.Label(this.tr("There is no species")));
      }
      resultVBox.add(hitsHBox);
      resultVBox.add(carouselContainer);
      this.getContent().add(resultVBox);
    },

    showResultOnPhone : function (indexSpecies, geneList, specieList, allImages, screenWidth) {
      this.getContent().removeAll();
      var resultVBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      var hitsHBox = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignY:"middle"}));
      var carouselContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignY:"middle"}));
      if (indexSpecies.length != 0) {
        /**
          * Number of hits found
         */
        var hitsNumber = new qx.ui.mobile.form.Label(indexSpecies.length+ this.tr(" HITS"));
        var sort = new qx.ui.mobile.form.Label(this.tr("sort by GENUS or <br>SPECIES"));
        if (hitsNumber != null) {
          hitsHBox.add(hitsNumber, {flex:1});
          hitsHBox.add(sort);
        }
        // Species to load
        for (let i = 0; i < indexSpecies.length; i++) {
          var itemSpecie = specieList[indexSpecies[i]];
          console.log(indexSpecies[i] + "  " + specieList[indexSpecies[i]]);
          // Elimination of duplicates in the images list to display
          var uniqueImages = [];
          for (let l = 0; l < allImages.length; l++) {
            var index = uniqueImages.findIndex(x => x==allImages[l][indexSpecies[i]]);
            if (index === -1) {
              if (allImages[l][indexSpecies[i]] != "") { // if not enmpty value
                uniqueImages.push(allImages[l][indexSpecies[i]]);
              }
            }
          }
          console.log(uniqueImages);
          /**
            * Addition species and images of specice in a component
            * depending on whether it is a tablet or a smarphones
           */
          var carousel = new qx.ui.mobile.container.Carousel();
          var nameSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
          var hboxNameSpecie = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox().set({alignX:"center"}));
          var nameSpecie = new qx.ui.mobile.form.Label("<i>"+geneList[indexSpecies[i]]+" "+specieList[indexSpecies[i]]+"<i>");
          hboxNameSpecie.add(nameSpecie);
          hboxNameSpecie.add(new qx.ui.mobile.basic.Image("resource/ifungi/btn_scopic2.png"));
          nameSpecieContainer.add(hboxNameSpecie);
          // Listener on name of specie for shown the description of specie
          hboxNameSpecie.addListener("tap", this.bindClick(itemSpecie), this);
          // Display Images
          if (uniqueImages.length != 0) {
            for (let m = 0; m < uniqueImages.length; m++) {
              let source = "resource/ifungi/FolderImages/"+uniqueImages[m]+".jpg";
              var imageSpecie = new qx.ui.mobile.basic.Image();
              if (this.__imagExists(source)) {
                imageSpecie.setSource(source);
              }else {
                imageSpecie.setSource("resource/ifungi/FolderImages/forImageNotExist.jpg");
              }
              // Resize Images
              this.resizeImage(imageSpecie, carousel, screenWidth);
              // Listener on image of specie for shown the description of specie
              imageSpecie.addListener("tap", this.bindClick(itemSpecie), this);
              let imageSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
              imageSpecieContainer.add(imageSpecie);
              carousel.add(imageSpecieContainer);
            }
          } else {
            let source = "resource/ifungi/FolderImages/defaultImage.jpg";
            var defaultImageSpecie = new qx.ui.mobile.basic.Image(source);
            // Resise Images
            this.resizeImage(defaultImageSpecie, carousel, screenWidth);
            // Listener on image of specie for shown the description of specie
            defaultImageSpecie.addListener("tap", this.bindClick(itemSpecie), this);
            let imageSpecieContainer = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox().set({alignX:"center"}));
            imageSpecieContainer.add(defaultImageSpecie);
            carousel.add(imageSpecieContainer);
          }
          carouselContainer.add(nameSpecieContainer);
          carouselContainer.add(carousel);
        }
      } else {
        carouselContainer.add(new qx.ui.mobile.form.Label(this.tr("There is no species")));
      }
      resultVBox.add(hitsHBox);
      resultVBox.add(carouselContainer);
      this.getContent().add(resultVBox);
    },
    /**
      * Check if image exists before load
      * @param source {String} string whose is image source
    */
    __imagExists: function (source)
    {
      var http = new XMLHttpRequest();
      http.open('HEAD', source, false);
      http.send();
      return http.status==200;
    },
    /**
      * Retrun the name of the image
      * @param source {String} string whose is image source
    */
    bindClick : function(itemSpecie) {
      return function() {
          this.setNameSpecieTaped(itemSpecie);
          this.fireDataEvent("tapdOnSpecie", itemSpecie);
      };
    },
    /**
      * Split a large Array in the several arrays of two element
      * @param array {Array} Array whose split for display result
    */
    __splitPairs : function(arr) {
      var pairs = [];
      for (let i=0; i<arr.length; i+=2) {
          if (arr[i+1] !== undefined) {
              pairs.push([arr[i], arr[i+1]]);
          } else {
              pairs.push([arr[i]]);
          }
      }
      return pairs;
    },
    /**
      * Resize Images to display
      * That define the same dimension (height and width) to all images.
      * @param imag {Image} Image to resize
    */
    resizeImage : function(imag, carousel, clientWidth) {
      imag.__containerElement.width = (clientWidth/2)-(clientWidth*0.1);
      imag.__containerElement.height = (clientWidth/2)-(clientWidth*0.1);
      carousel.setHeight(imag.__containerElement.height);
    }
  }
});
