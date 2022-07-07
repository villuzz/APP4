/* eslint-disable no-undef */
// @ts-nocheck
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "PM030/APP4/model/formatter",
  "sap/m/MessageBox",
  "sap/ui/model/Sorter",
  "PM030/APP4/util/LocalFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "PM030/APP4/util/underscore-min",
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.routing.History} History
   * @param {typeof sap.ui.core.UIComponent} UIComponent
   * @param {typeof PM030.APP4.model.formatter} formatter
   * @param {typeof sap.m.MessageBox} MessageBox 
   * @param {typeof sap.ui.model.Sorter} Sorter 
   * @param {typeof PM030.APP4.util.LocalFormatter} LocalFormatter 
   * @param {typeof sap.ui.model.Filter} Filter 
   * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
   * @param {typeof sap.ui.core.Fragment} Fragment 
   * @param {typeof PM030.APP4.util.underscore-min} underscore
   */
  function (Controller, History, UIComponent, formatter, MessageBox, Sorter, LocalFormatter, Filter, FilterOperator, Fragment, underscore) {
    "use strict";

    return Controller.extend("PM030.APP4.controller.BaseController", {
      formatter: formatter,
      LocalFormatter: LocalFormatter,
      underscore: underscore,
      /**
           * Convenience method for getting the view model by name in every controller of the application.
           * @public
           * @param {string} sName the model name
           * @returns {sap.ui.model.Model} the model instance
           */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
           * Convenience method for setting the view model in every controller of the application.
           * @public
           * @param {sap.ui.model.Model} oModel the model instance
           * @param {string} sName the model name
           * @returns {sap.ui.mvc.View} the view instance
           */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
           * Convenience method for getting the resource bundle.
           * @public
           * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
           */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      /**
           * Method for navigation to specific view
           * @public
           * @param {string} psTarget Parameter containing the string for the target navigation
           * @param {Object.<string, string>} pmParameters? Parameters for navigation
           * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
           */
      navTo: function (psTarget, pmParameters, pbReplace) {
        this.getRouter().navTo(psTarget, pmParameters, pbReplace);
      },

      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      onNavBack: function () {
        var sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.back();
        } else {
          this.getRouter().navTo("appHome", {}, true /*no history*/
          );
        }
      },
      Shpl: async function (ShplName, ShplType, aFilter) {

        var sFilter = {
          "ReturnFieldValueSet": [{}]
        };
        sFilter.ShplType = ShplType;
        sFilter.ShplName = ShplName;
        sFilter.IFilterDataSet = aFilter;
        // Shlpname Shlpfield Sign Option Low

        var result = await this._saveHana("/dySearch", sFilter);
        if (result.ReturnFieldValueSet !== undefined) {
          result = result.ReturnFieldValueSet.results;
        } else {
          result = [];
        }

        return result;
      },
      _saveHana: function (URL, sData) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.create(URL, sData, {
            success: function (oDataIn) {
              resolve(oDataIn);
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
            }
          });
        });
      },
      _saveHanaNoError: function (URL, sData) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve) {
          xsoDataModelReport.create(URL, sData, {
            success: function (oDataIn) {
              resolve(oDataIn);
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              resolve(responseObject.error.code);
            }
          });
        });
      },
      _updateHanaNoError: function (sURL, oEntry) {
        var xsoDataModelReport = this.getOwnerComponent().getModel();
        return new Promise(function (resolve) {
          xsoDataModelReport.update(sURL, oEntry, {
            success: function (oDataIn) {
              resolve(oDataIn);
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              resolve(responseObject.error.code);
            }
          });
        });
      },
      _updateHana: function (sURL, oEntry) {
        var xsoDataModelReport = this.getOwnerComponent().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.update(sURL, oEntry, {
            success: function (oDataIn) {
              resolve(oDataIn);
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
            }
          });
        });
      },
      _removeHana: function (URL) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve) {
          xsoDataModelReport.remove(URL, {
            success: function () {
              resolve();
            },
            error: function () {
              resolve();
            }
          });
        });
      },
      _getLastItemData: function (Entity, Filters, SortBy) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            sorters: [new Sorter(SortBy, true)],
            urlParameters: {
              "$select": SortBy,
              "$top": 1
            },
            success: function (oDataIn) {
              if (oDataIn.results[0] !== undefined) {
                if (oDataIn.results[0][SortBy] === null) {
                  resolve(0);
                } else {
                  resolve(oDataIn.results[0][SortBy]);
                }
              } else {
                resolve(0);
              }
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
            }
          });
        });
      },
      _getTableIndexAzioni: function (Entity, Filters) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            sorters: [
              new Sorter("INDEX", true),
              new Sorter("CONTATORE", true)
            ],
            success: function (oDataIn) {
              if (oDataIn.results !== undefined) {
                resolve(oDataIn.results);
              } else {
                resolve(oDataIn);
              }
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
            }
          });
        });
      },
      _getLine: function (Entity, Filters) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            urlParameters: {
              "$top": 1
            },
            success: function (oDataIn) {
              if (oDataIn.results[0] !== undefined) {
                resolve(oDataIn.results[0]);
              } else {
                resolve(oDataIn);
              }
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
            }
          });
        });
      },
      _getTable: function (Entity, Filters) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            success: function (oDataIn) {
              if (oDataIn.results !== undefined) {
                resolve(oDataIn.results);
              } else {
                resolve(oDataIn);
              }
            },
            error: function (err) {
              var responseObject = JSON.parse(err.responseText);
              reject(MessageBox.error(responseObject.error.message.value));
              sap.ui.core.BusyIndicator.hide();
            }
          });
        });
      },
      _getTableNoError: function (Entity, Filters) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            success: function (oDataIn) {
              if (oDataIn.results !== undefined) {
                resolve(oDataIn.results);
              } else {
                resolve(oDataIn);
              }
            },
            error: function () {
              resolve([]);
            }
          });
        });
      },
      _getTableDistinct: function (Entity, Filters, Columns) {
        var xsoDataModelReport = this.getView().getModel();
        return new Promise(function (resolve) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            urlParameters: {
              "$select": Columns
            },
            success: function (oDataIn) {
              resolve(oDataIn.results);
            },
            error: function () {
              resolve();
            }
          });
        });
      }
    });
  });
