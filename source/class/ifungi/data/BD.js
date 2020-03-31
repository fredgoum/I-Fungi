/* ************************************************************************

   Copyright: 2019 INRA

   License: CeCILL

   Authors: Alfred Goumou (fredgoum) alfredgoumou@gmail.com

************************************************************************ */

/**
 * TODO: needs documentation
 */
qx.Class.define("ifungi.data.BD",
{
  type: "singleton",
  extend : qx.core.Object,

  properties :
  {
    /** For all indexes of criteres corresponding to species in database */
    indexCriteria :
    {
      check : "Object",
      nullable : true,
      event : "changeIndexCriteria"
    },
    /** For all species in database */
    speciesList :
    {
      check : "Object",
      nullable : true,
      event : "changeSpeciesList"
    },
    /** For all species in database */
    genesList :
    {
      check : "Object",
      nullable : true,
      event : "changeSpeciesList"
    },
    /** For indexes of Species Images in database */
    allImages :
    {
      check : "Array",
      nullable : true,
      event : "changeAllImages"
    },
    /** Array containing all criteres in datacsv */
    criteriaInDatabase :
    {
      check : "Object",
      nullable : true,
      event : "changeCriteriaInDatabase"
    }
  },

  events : {
    /**
      * Fired for geting the indexes of species in database to load
     */
    "getSpeciesIndexesFinal" : "qx.event.type.Data",
    /**
      * Fired for geting the count of checkBox checked
     */
    "noCheckboxChecked" : "qx.event.type.Data"
  },

  construct : function(value) {
    this.base(arguments);
  },

  members :
  {
    // overridden
    _initialize : function() {
      this.base(arguments);
    },
    /**
     * Parse the csv file (database)
     * @param file {Object} Object containing the criteres.
     * returns a large array in which each CSV column is storage as
     * a array with for first element, the header of the column.
    */
    getfilecsv : function(file) {
      var req = new qx.io.request.Xhr(file);
      // For if file is loaded completly with success
      req.addListener("success", function(e) {
        var req = e.getTarget();
        // Response parsed according to the server's
        // response content type, e.g. JSON
        var response = req.getResponse();
        var lines = response.split(/\n/);
        var tabglobalOfCriteres = [];
        var headlines = lines[0].split(/,/);
        for (let i = 0; i < headlines.length; i++) {
          var tab = [];
          tabglobalOfCriteres.push(tab);
        }
        for (let line = 0; line < lines.length; line++) {
          var linestab = lines[line].split(/,/);
          for (let i = 0; i < tabglobalOfCriteres.length; i++) {
            tabglobalOfCriteres[i].push(linestab[i]);
          }
        }
        this.setCriteriaInDatabase(tabglobalOfCriteres);
      }, this);
      //  For if file don't load completly with success
      req.addListener("fail", function(e) {
        // console.log("CSV data loaded with failure");
      }, this);
      // Send request
      req.send();
    },
    /**
      * Takes the array of criteria returns by the function getfilecsv()
      * returns array of species and indexes of species images to display
    */
    getAllIndexCriteria : function() {
      var tabglobalOfCriteres = this.getCriteriaInDatabase();
      var indexCriteres = [];
      var allImages = [];
      for (let j = 0; j < tabglobalOfCriteres.length; j++) {
        if (tabglobalOfCriteres[j][0] == "Photo micro" || tabglobalOfCriteres[j][0] == "Dessus" || tabglobalOfCriteres[j][0] == "Dessous") {
          allImages.push(tabglobalOfCriteres[j]);
        }else if (tabglobalOfCriteres[j][0] == "Genre" || tabglobalOfCriteres[j][0] == "Gender") {  // Gender tab
            this.setGenesList(tabglobalOfCriteres[j]);
        } else {
          var myObject = {};
          var critere = new ifungi.page.Critere();
          var array = tabglobalOfCriteres[j].map(function (val) {
           return critere.cleanUpSpecialChars(val);
          });
          if (array[0] == "espece" || array[0] == "specie") { // Species tab
            this.setSpeciesList(array);
          }
          for (let i = 0; i < array.length; i++) {
            var stringToFind = array[i];
            var indexesOfcritere = [];
            array.forEach(function(elem, index, array) {
                if (elem === stringToFind) {
                  indexesOfcritere.push(index);
                }
                return indexesOfcritere;
            });
            myObject[stringToFind] = indexesOfcritere;
          }
          indexCriteres.push(myObject);
        }
      }
      this.setIndexCriteria(indexCriteres);
      this.setAllImages(allImages);
    },
    /**
     * return le final indexes of criteria choseen by user
     * after doing intersection beetween indexes of criteria
     * @param dicoCriteres {Array} Array list of criteria choseen by user.
    */
    searchSpecies : function (dicoCriteres) {
      // console.log("--------------------------------------------------------------");
      var tabResultCriteres = [];
      var nbCheckboxChecked = 0;
      if (this.getSpeciesList() != null) {
        var indexCriterestab = this.getIndexCriteria();
        for (let i = 0; i < dicoCriteres.length; i++) {
          var critereSelect = dicoCriteres[i];

          Object.entries(critereSelect).forEach(([key, value]) => {
             var pereCritereSelect = key;
             var valueCritereSelect = value;
             for (let j = 0; j < indexCriterestab.length; j++) {
               var obj = indexCriterestab[j];
               if (pereCritereSelect == Object.keys(obj)[0]) {
                 nbCheckboxChecked++;
                 if (valueCritereSelect in obj) {
                   tabResultCriteres.push(obj[valueCritereSelect]);
                 } else {
                   tabResultCriteres.push([]);
                 }
               }
             }
          });
        }
        var finalSpeciesIndexes = [];
        if (tabResultCriteres.length != 0) {
          finalSpeciesIndexes = tabResultCriteres.reduce((a, b) => a.filter(c => b.includes(c)));
        }
        this.fireDataEvent("getSpeciesIndexesFinal", finalSpeciesIndexes);
        // If there is no checkbox checked
        if (nbCheckboxChecked == 0) {
          this.fireDataEvent("noCheckboxChecked", nbCheckboxChecked);
        }
      }
    }
  }
});
