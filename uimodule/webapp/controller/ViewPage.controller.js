sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "PM030/APP4/util/manutenzioneTable",
    "sap/m/TablePersoController",
    "sap/ui/core/Popup",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
], function (Controller, JSONModel, MessageBox, manutenzioneTable, TablePersoController, Popup, Fragment, Spreadsheet, exportLibrary,) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP4.i18n.i18n"}).getResourceBundle();
    var EdmType = exportLibrary.EdmType;

    return Controller.extend("PM030.APP4.controller.ViewPage", {
        onInit: function () {
            debugger;
            // leggere i modelli che ci servono
            var sPiani = [
                {
                    Divisione: "123",
                    Ritardo: "64"
                }, {
                    Divisione: "23",
                    Ritardo: "76"
                },
            ];
            var oManutenzione = new sap.ui.model.json.JSONModel();
            oManutenzione.setData(sPiani);
            this.getView().setModel(oManutenzione, "mManutenzione");

            this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                DataDiRiferimento: new Date(),
                PeriodoDiSelezioneDa: new Date(new Date().getFullYear(), 0, 1),
                PeriodoDiSelezioneA: new Date(new Date().getFullYear(), 11, 31)
            });
            this.getView().setModel(oModel, "FilterModel");

            this._mViewSettingsDialogs = {};
            this._oTPC = new TablePersoController({table: this.byId("tbManutenzione"), componentName: "Piani", persoService: manutenzioneTable}).activate();
        },
        onSearchResult: function (oEvent) {
            debugger;
            var oModel = this.getView().getModel("FilterModel");
            var divisione = oModel.getData().Divisione;
            if (! divisione) {
                MessageBox.error(oResource.getText("MessageDivisioneObbligatoria"))
            } else {
                this.onSearchFilters();
            }
        },
        onSearchFilters: function () {
            var model = this.getModel("FilterModel");
            var oData = model.getData();

            var oBinding = this.byId("tbManutenzione").getBinding("items");
            if (oBinding.isSuspended()) {
                oBinding.resume();
            }

            var filterArray = [
                new sap.ui.model.Filter("DataDiRiferimento", sap.ui.model.FilterOperator.EQ, oData.DataDiRiferimento),
                new sap.ui.model.Filter("PeriodoDiSelezioneDa", sap.ui.model.FilterOperator.EQ, oData.PeriodoDiSelezioneDa),
                filterArray.push(new sap.ui.model.Filter("PeriodoDiSelezioneA", sap.ui.model.FilterOperator.EQ, oData.PeriodoDiSelezioneDa)),
            ];
            oData.Divisione.map((d) => {
                filterArray.push(new sap.ui.model.Filter("Divisione", sap.ui.model.FilterOperator.EQ, d));
            });
            oData.Index.map((i) => {
                filterArray.push(new sap.ui.model.Filter("Index", sap.ui.model.FilterOperator.EQ, i));
            });
            oData.TipoSchedulazione.map((ts) => {
                filterArray.push(new sap.ui.model.Filter("TipoSchedulazione", sap.ui.model.FilterOperator.EQ, ts));
            });
            oData.TipoOrdine.map((to) => {
                filterArray.push(new sap.ui.model.Filter("TipoOrdine", sap.ui.model.FilterOperator.EQ, to));
            });
            oData.TipoAttivita.map((ta) => {
                filterArray.push(new sap.ui.model.Filter("TipoAttivita", sap.ui.model.FilterOperator.EQ, ta));
            });
            oData.Indisponibilita.map((ind) => {
                filterArray.push(new sap.ui.model.Filter("Indisponibilita", sap.ui.model.FilterOperator.EQ, ind));
            });
            oData.Divisione.map((sis) => {
                filterArray.push(new sap.ui.model.Filter("Sistema", sap.ui.model.FilterOperator.EQ, sis));
            });
            oData.Azione.map((az) => {
                filterArray.push(new sap.ui.model.Filter("Azione", sap.ui.model.FilterOperator.EQ, az));
            });
            oData.Classe.map((clas) => {
                filterArray.push(new sap.ui.model.Filter("Classe", sap.ui.model.FilterOperator.EQ, clas));
            });
            oData.Divisione.map((im) => {
                filterArray.push(new sap.ui.model.Filter("Impianto", sap.ui.model.FilterOperator.EQ, im));
            });
            oData.Divisione.map((stc) => {
                filterArray.push(new sap.ui.model.Filter("SedeTecnicaComponente", sap.ui.model.FilterOperator.EQ, stc));
            });
            oData.ComponenteEquipment.map((ce) => {
                filterArray.push(new sap.ui.model.Filter("ComponenteEquipment", sap.ui.model.FilterOperator.EQ, ce));
            });
            oData.DescrizioneComponente.map((dc) => {
                filterArray.push(new sap.ui.model.Filter("DescrizioneComponente", sap.ui.model.FilterOperator.EQ, dc));
            });
            oData.CentroDiLavoro.map((cdl) => {
                filterArray.push(new sap.ui.model.Filter("CentroDiLavoro", sap.ui.model.FilterOperator.EQ, cdl));
            });
            oData.Destinatario.map((dest) => {
                filterArray.push(new sap.ui.model.Filter("Destinatario", sap.ui.model.FilterOperator.EQ, dest));
            });
            oData.Percorso.map((p) => {
                filterArray.push(new sap.ui.model.Filter("Percorso", sap.ui.model.FilterOperator.EQ, p));
            });
            oData.TipoGestione.map((tg) => {
                filterArray.push(new sap.ui.model.Filter("TipoGestione", sap.ui.model.FilterOperator.EQ, tg));
            });
            oData.Finalita.map((f) => {
                filterArray.push(new sap.ui.model.Filter("Finalita", sap.ui.model.FilterOperator.EQ, f));
            });
            oData.GrupControllo.map((gp) => {
                filterArray.push(new sap.ui.model.Filter("GrupControllo", sap.ui.model.FilterOperator.EQ, gp));
            });
            oData.Collective.map((col) => {
                filterArray.push(new sap.ui.model.Filter("Collective", sap.ui.model.FilterOperator.EQ, col));
            });

            var self = this;
            var oDataModel = self.getModel();

            oDataModel.read("", {
                filters: filterArray,
                success: function (response) { // debugger;

                },
                error: function () { // debugger;
                }
            });
        },

        onImpostaData: function (oEvent) {
            this.getView().setModel(new JSONModel([{
                    DataDa: "",
                    DataA: ""
                }]), "oModelImpostaData");
            var oButton = oEvent.getSource(),
                oView = this.getView();

            // Create popover
            if (!this._pInnerPopoverExternalLinks) {
                this._pInnerPopoverExternalLinks = Fragment.load({id: oView.getId(), name: "PM030.APP4.view.PopoverImpostaData", controller: this}).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }
            this._pInnerPopoverExternalLinks.then(function (oPopover) { // INIZIALIZZO GLI INPUT
                oPopover.setModel(new JSONModel({DataDa: "", DataA: ""}));
                oPopover.openBy(oButton);
            });
        },
        onClosePopoverImpostaData: function (oEvent) {
            this.byId("myPopoverImpostaData").close();
        },
        onSalvaImpostaData: function (oEvent) {},

        onCreaODM: function (oEvent) {
            var oTable = this.byId("tbManutenzione");
            var SelectItem = oTable.getSelectedItem();
            if (SelectItem) {
                MessageBox.warning(oResource.getText("MessageCreaODM"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {}
                });
            } else {
                MessageBox.error(oResource.getText("MessageNotSelected"));
            }
        },
        onCancellaData: function (oEvent) {
            var oTable = this.byId("tbManutenzione");
            var SelectItem = oTable.getSelectedItem();
            if (SelectItem) {
                MessageBox.warning(oResource.getText("MessageCancellaData"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {}
                });
            } else {
                MessageBox.error(oResource.getText("MessageNotSelected"));
            }
        },
        onRilascioODM: function (oEvent) {
            var oTable = this.byId("tbManutenzione");
            var SelectItem = oTable.getSelectedItem();
            if (SelectItem) {
                MessageBox.warning(oResource.getText("MessageRilascioODM"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {}
                });
            } else {
                MessageBox.error(oResource.getText("MessageNotSelected"));
            }
        },
        onStampaDoc: function (oEvent) {
            var oTable = this.byId("tbManutenzione");
            var SelectItem = oTable.getSelectedItem();
            if (SelectItem) {
                MessageBox.warning(oResource.getText("MessageStampaDoc"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {}
                });
            } else {
                MessageBox.error(oResource.getText("MessageNotSelected"));
            }
        },
        onConsuntivazione: function (oEvent) {
            var oTable = this.byId("tbManutenzione");
            var SelectItem = oTable.getSelectedItem();
            if (SelectItem) {
                MessageBox.warning(oResource.getText("MessageConsuntivazione"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {}
                });
            } else {
                MessageBox.error(oResource.getText("MessageNotSelected"));
            }
        },
        onDataExport: function () {
            var selectedTab = this.byId("tbManutenzione");

            var aCols,
                oRowBinding,
                oSettings,
                oSheet;

            aCols = this._createColumnConfig(selectedTab);
            oRowBinding = selectedTab.getBinding("items");
            oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: oRowBinding,
                fileName: "DataExport.xlsx",
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build(). finally(function () {
                oSheet.destroy();
            });
        },

        _createColumnConfig: function () {
            var oCols = this.byId("tbManutenzione").getColumns().map((c) => {
                var templ = "";
                var typ = EdmType.String;
                var prop = c.mAggregations.header.getText();
                return {
                    label: c.getHeader().getText(),
                    property: prop,
                    type: typ,
                    format: (value) => {},
                    template: templ
                };
            }) || [];
            return oCols;
        },

        onPersoButtonPressed: function () {
            this._oTPC.openDialog();
        },

        // onBack: function () {
        // sap.ui.core.UIComponent.getRouterFor(this).navTo("TilePage");
        // }

    });
});
