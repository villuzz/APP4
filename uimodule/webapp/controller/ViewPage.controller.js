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
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
], function (Controller, JSONModel, MessageBox, manutenzioneTable, TablePersoController, Popup, Fragment, Spreadsheet, exportLibrary, Filter, FilterOperator) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP4.i18n.i18n"}).getResourceBundle();
    var EdmType = exportLibrary.EdmType;

    return Controller.extend("PM030.APP4.controller.ViewPage", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: async function () {
          sap.ui.core.BusyIndicator.show();
            var oModel1 = new sap.ui.model.json.JSONModel();
            oModel1.setData({
                DataDiRiferimento: new Date(),
                PeriodoDiSelezioneDa: new Date(new Date().getFullYear(), "00", "01"),
                PeriodoDiSelezioneA: new Date(new Date().getFullYear(), 11, 31)
            });
            this.getView().setModel(oModel1, "sFilter");

            this._mViewSettingsDialogs = {};
            this._oTPC = new TablePersoController({table: this.byId("tbManutenzione"), componentName: "Piani", persoService: manutenzioneTable}).activate();

            if (this.getView().getModel("sHelp") === undefined) {
              await this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
          }
          sap.ui.core.BusyIndicator.hide(0);
        },
        getValueHelp: async function () {
          var sData = {};
          var oModelHelp = new sap.ui.model.json.JSONModel();

          sData.TIPO_ORDINE = await this.Shpl("T003O", "CH");
          sData.DIVISIONE = await this.Shpl("H_T001W", "SH");
          sData.TIPO_GESTIONE = await this._getTableNoError("/T_TP_MAN");
          sData.TIPO_GESTIONE_1 = await this._getTableNoError("/T_TP_MAN1");
          sData.TIPO_GESTIONE_2 = await this._getTableNoError("/T_TP_MAN2");
          sData.CENTRO_LAVORO = await this._getTableNoError("/T_DEST");
          sData.TIPO_ATTIVITA = await this.Shpl("T353I", "CH");
          sData.SISTEMA = await this._getTableNoError("/T_ACT_SYST");
          sData.CLASSE = await this._getTableNoError("/T_ACT_CL");

          oModelHelp.setData(sData);
          this.getView().setModel(oModelHelp, "sHelp");
        },
        Shpl: async function (ShplName, ShplType) {
          var aFilter = [];
          aFilter.push(new Filter("ShplName", FilterOperator.EQ, ShplName));
          aFilter.push(new Filter("ShplType", FilterOperator.EQ, ShplType));

          var result = await this._getTableNoError("/dySearch", aFilter);
          if (result[0] !== undefined) {
              if (result[0].ReturnFieldValueSet) {
                  result = result[0].ReturnFieldValueSet.results;
                  result.splice(0, 1);
              } else {
                  result = [];
              }
          } else {
              result = [];
          }
          return result;
      },
        onSearchResult: function () {
            var oModel = this.getView().getModel("sFilter");
            var divisione = oModel.getData().Divisione;
            if (!divisione) {
                MessageBox.error(oResource.getText("MessageDivisioneObbligatoria"));
            } else {
                this.onSearchFilters();
            }
        },
        onSearchFilters: async function () {
          sap.ui.core.BusyIndicator.show();
            var oData = this.getModel("sFilter").getData();

            var sFilter = {
              Odm: [{}],
              PDat1: "",
              PDat2: "",
              PDat3: "",
              FlagAttivo: "X",
           /*   Collective: "",
              RiskAnalysis: "",
            
              SDivisioneu: [],
              SAzione: [],  
              SCentroLavoro: [],
              SClasse: [],
              SDesComponente: [],
              SDestinatario: [],
              SEquipmentCompo: [],
              SIndexPmo: [],
              SIndisponibilita: [],
              SPercorso: [],
              SPltxu: [], //impianto
              SProgres: [],
              SSistema: [],
              SStrno: [], //sedeTecnica
              //STipoAttivita: [],
              STipoGestione: [],
              STipoGestione1: [],
              STipoGestione2: [],
              STipoOrdine: [],
              STipoPmo: [] //Tipo Schedulazione*/
              };

              sFilter.PDat1 = oData.DataDiRiferimento;
              sFilter.PDat2 = oData.PeriodoDiSelezioneDa;
              sFilter.PDat3 = oData.PeriodoDiSelezioneA;

            if (oData.Divisione !== undefined && oData.Divisione !== ""){
              sFilter.SDivisioneu = [{ Sign: "I", Option: "EQ", Low: oData.Divisione, High: "" }];
            }
            if (oData.Index !== undefined && oData.Index !== ""){
              sFilter.SIndexPmo = [{ Sign: "I", Option: "EQ", Low: oData.SIndexPmo, High: "" }];
            }
            if (oData.TipoSchedulazione !== undefined && oData.TipoSchedulazione !== ""){
              sFilter.STipoPmo = [{ Sign: "I", Option: "EQ", Low: oData.TipoSchedulazione, High: "" }];
            }
            if (oData.TipoOrdine !== undefined && oData.TipoOrdine !== ""){
              sFilter.STipoOrdine = [{ Sign: "I", Option: "EQ", Low: oData.TipoOrdine, High: "" }];
            }
            /*if (oData.TipoAttivita !== undefined && oData.TipoAttivita !== ""){
              sFilter.STipoAttivita = [{ Sign: "I", Option: "EQ", Low: oData.TipoAttivita, High: "" }];
            }*/
            if (oData.Indisponibilita !== undefined && oData.Indisponibilita !== ""){
              sFilter.SIndisponibilita = [{ Sign: "I", Option: "EQ", Low: oData.Indisponibilita, High: "" }];
            }
            if (oData.Sistema !== undefined && oData.Sistema !== ""){
              sFilter.SSistema = [{ Sign: "I", Option: "EQ", Low: oData.Sistema, High: "" }];
            }
            if (oData.Azione !== undefined && oData.Azione !== ""){
              sFilter.SAzione = [{ Sign: "I", Option: "EQ", Low: oData.Azione, High: "" }];
            }
            if (oData.Classe !== undefined && oData.Classe !== ""){
              sFilter.SClasse = [{ Sign: "I", Option: "EQ", Low: oData.Classe, High: "" }];
            }
            if (oData.Impianto !== undefined && oData.Impianto !== ""){
              sFilter.SPltxu = [{ Sign: "I", Option: "EQ", Low: oData.Impianto, High: "" }];
            }
            if (oData.sedeTecnicaComponente !== undefined && oData.sedeTecnicaComponente !== ""){
              sFilter.SStrno = [{ Sign: "I", Option: "EQ", Low: oData.sedeTecnicaComponente, High: "" }];
            }
            if (oData.ComponenteEquipment !== undefined && oData.ComponenteEquipment !== ""){
              sFilter.SEquipmentCompo = [{ Sign: "I", Option: "EQ", Low: oData.ComponenteEquipment, High: "" }];
            }
            if (oData.DescrizioneComponente !== undefined && oData.DescrizioneComponente !== ""){
              sFilter.SDesComponente = [{ Sign: "I", Option: "EQ", Low: oData.DescrizioneComponente, High: "" }];
            }
            if (oData.CentroDiLavoro !== undefined && oData.CentroDiLavoro !== ""){
              sFilter.SCentroLavoro = [{ Sign: "I", Option: "EQ", Low: oData.CentroDiLavoro, High: "" }];
            }
            if (oData.Destinatario !== undefined && oData.Destinatario !== ""){
              sFilter.SDestinatario = [{ Sign: "I", Option: "EQ", Low: oData.Destinatario, High: "" }];
            }
            if (oData.Percorso !== undefined && oData.Percorso !== ""){
              sFilter.SPercorso = [{ Sign: "I", Option: "EQ", Low: oData.Percorso, High: "" }];
            }
            if (oData.TipoGestione !== undefined && oData.TipoGestione !== ""){
              sFilter.STipoGestione = [{ Sign: "I", Option: "EQ", Low: oData.TipoGestione, High: "" }];
            }
            if (oData.Finalita !== undefined && oData.Finalita !== ""){
              sFilter.STipoGestione1 = [{ Sign: "I", Option: "EQ", Low: oData.Finalita, High: "" }];
            }
            if (oData.GrupControllo !== undefined && oData.GrupControllo !== ""){
              sFilter.STipoGestione2 = [{ Sign: "I", Option: "EQ", Low: oData.GrupControllo, High: "" }];
            }
            if (oData.Collective !== undefined && oData.Collective !== ""){
              sFilter.Collective = oData.Collective;
            }

            var oModel = new sap.ui.model.json.JSONModel(),
                allIndex = [];

            //In realtà fa una read, andava richiamato il metodo Post
            allIndex = await this._saveHana("/GetODM", sFilter);
            allIndex = allIndex.Odm.results;
            debugger
            oModel.setData(allIndex);
            this.getView().setModel(oModel, "mManutenzione");
            sap.ui.core.BusyIndicator.hide();
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
                var prop = c.getCustomData()[0].getValue();

                if (prop === "UltimaEsecuz") {
                  typ = EdmType.Date;
                }
                if (prop === "Datpia") {
                  typ = EdmType.Date;
                }
                if (prop === "FineCard") {
                  typ = EdmType.Date;
                }
                if (prop === "InizioVal") {
                  typ = EdmType.Date;
                }
                if (prop === "FineVal") {
                  typ = EdmType.Date;
                }

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
