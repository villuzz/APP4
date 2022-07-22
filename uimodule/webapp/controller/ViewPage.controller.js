sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "PM030/APP4/util/manutenzioneTable",
  "sap/m/TablePersoController",
  "sap/ui/core/Popup",
  "sap/m/Token",
  "sap/ui/core/Fragment",
  "sap/ui/export/Spreadsheet",
  "sap/ui/export/library",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "PM030/APP4/util/Validator",
], /**
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 * @param {typeof sap.m.MessageBox} MessageBox 
 * @param {typeof sap.m.TablePersoController} TablePersoController 
 * @param {typeof sap.ui.core.Popup} Popup 
 * @param {typeof sap.m.Token} Token 
 * @param {typeof sap.ui.core.Fragment} Fragment 
 * @param {typeof sap.ui.export.Spreadsheet} Spreadsheet 
 * @param {typeof sap.ui.export.library} exportLibrary 
 * @param {typeof sap.ui.model.Filter} Filter 
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
 */
  function (Controller, JSONModel, MessageBox, manutenzioneTable, TablePersoController, Popup, Token, Fragment, Spreadsheet, exportLibrary, Filter, FilterOperator, Validator) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({ bundleName: "PM030.APP4.i18n.i18n" }).getResourceBundle();
    var EdmType = exportLibrary.EdmType;

    return Controller.extend("PM030.APP4.controller.ViewPage", {
      Validator: Validator,
      onInit: function () {

        var oinIndex = this.getView().byId("inIndex");
        var fnValidator = function (args) {
            var text = args.text;
            return new Token({key: text, text: text});
        };
        oinIndex.addValidator(fnValidator);
        this.getView().byId("inEquip").addValidator(function(args){
          if (args.suggestionObject){
            var key = args.suggestionObject.getCells()[0].getText();
            return new sap.m.Token({key: key, text: key});
          } else {
            var text = args.text;
            return new sap.m.Token({key: text, text: text});
          }
          });
        this.getView().byId("inSede").addValidator(function(args){
          if (args.suggestionObject){
            var key = args.suggestionObject.getCells()[0].getText();
            return new sap.m.Token({key: key, text: key});
          } else {
            var text = args.text;
            return new sap.m.Token({key: text, text: text});
          }
          });
          this.getView().byId("inImpianto").addValidator(function(args){
            if (args.suggestionObject){
              var key = args.suggestionObject.getCells()[0].getText();
              return new sap.m.Token({key: key, text: key});
            } else {
              var text = args.text;
              return new sap.m.Token({key: text, text: text});
            }
            });

            this.getView().byId("inAzione").addValidator(function(args){
              if (args.suggestionObject){
                var key = args.suggestionObject.getCells()[0].getText();
                return new sap.m.Token({key: key, text: key});
              } else {
                var text = args.text;
                return new sap.m.Token({key: text, text: text});
              }
              });

        this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);
      },
      _onObjectMatched: async function () {
        sap.ui.core.BusyIndicator.show(0);
        var oModel1 = new sap.ui.model.json.JSONModel();
        oModel1.setData({
          DataDiRiferimento: new Date(),
          PeriodoDiSelezioneDa: new Date(new Date().getFullYear(), "00", "03"),
          PeriodoDiSelezioneA: new Date(new Date().getFullYear(), 11, 31)
        });
        this.getView().setModel(oModel1, "sFilter");

        this._mViewSettingsDialogs = {};
        this._oTPC = new TablePersoController({ table: this.byId("tbManutenzione"), componentName: "Piani", persoService: manutenzioneTable }).activate();

        if (this.getView().getModel("sHelp") === undefined) {
          await this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
        } sap.ui.core.BusyIndicator.hide(0);
      },
      getValueHelp: async function () {

        var oModelHelp = new sap.ui.model.json.JSONModel();

        // console.time('await')
        // var sData = {};
        // sData.TIPO_ORDINE = await this.Shpl("T003O", "CH");
        // sData.DIVISIONE = await this.Shpl("H_T001W", "SH");
        // sData.TIPO_GESTIONE = await this._fetchDataNoError("/T_TP_MAN");
        // sData.TIPO_GESTIONE_1 = await this._fetchDataNoError("/T_TP_MAN1");
        // sData.TIPO_GESTIONE_2 = await this._fetchDataNoError("/T_TP_MAN2");
        // sData.CENTRO_LAVORO = await this._fetchDataNoError("/T_DEST");
        // sData.TIPO_ATTIVITA = await this.Shpl("T353I", "CH");
        // sData.SISTEMA = await this._fetchDataNoError("/T_ACT_SYST");
        // sData.CLASSE = await this._fetchDataNoError("/T_ACT_CL");
        // oModelHelp.setData(sData);
        // this.getView().setModel(oModelHelp, "sHelp");
        // console.timeEnd("await");
        var aFilter = [];
        aFilter.push({
          "Shlpname": "ZPROGPARAM",
          "Shlpfield": "PROG",
          "Sign": "I",
          "Option": "EQ",
          "Low": "ZM_CONSUNTIVAZIONI"
      });
      aFilter.push({
        "Shlpname": "ZPROGPARAM",
        "Shlpfield": "ZPARAM",
        "Sign": "I",
        "Option": "CP",
        "Low": "CAUSA_MANC_ESEC*"
    });
        const aHelp = [
          this.Shpl("T003O", "CH"),
          this.Shpl("H_T001W", "SH"),
          this._fetchDataNoError("/T_TP_MAN"),
          this._fetchDataNoError("/T_TP_MAN1"),
          this._fetchDataNoError("/T_TP_MAN2"),
          this._fetchDataNoError("/T_DEST"),
          this.Shpl("T353I", "CH"),
          this._fetchDataNoError("/T_ACT_SYST"),
          this._fetchDataNoError("/T_ACT_CL"),
          this.Shpl("ZPM4R_D_FLG_CONF", "FV"),
          this.Shpl("ZH_T001", "SH"),
          this.Shpl("ZPROGPARAM", "CH", aFilter),
        ];

        // console.time('all')
        // eslint-disable-next-line no-undef
        return Promise.all(aHelp)
          .then((values) => {
            const [
              TIPO_ORDINE,
              DIVISIONE,
              TIPO_GESTIONE,
              TIPO_GESTIONE_1,
              TIPO_GESTIONE_2,
              CENTRO_LAVORO,
              TIPO_ATTIVITA,
              SISTEMA,
              CLASSE,
              CONFERMA,
              SOCIETA,
              CAUSA
            ] = values;
            const oData = {
              TIPO_ORDINE,
              DIVISIONE,
              TIPO_GESTIONE,
              TIPO_GESTIONE_1,
              TIPO_GESTIONE_2,
              CENTRO_LAVORO,
              TIPO_ATTIVITA,
              SISTEMA,
              CLASSE,
              CONFERMA,
              SOCIETA,
              CAUSA
            };
            oModelHelp.setData(oData);
            this.getView().setModel(oModelHelp, "sHelp");
            // console.timeEnd('all');
          })
          .catch((err) => {
            // console.timeEnd('all');
            MessageBox.error(err.message);
          });
      },
      onSearchResult: function () {
        this.onSearchFilters();
        /*var oModel = this.getView().getModel("sFilter");
        var divisione = oModel.getData().Divisione;
        if (! divisione) {
            MessageBox.error(oResource.getText("MessageDivisioneObbligatoria"));
        } else {
            this.onSearchFilters();
        }*/
      },

      filterSetMulti: function (sValue, Op) {
        if (!Op){ Op = "EQ"; }
        var aValue = [];
        if (sValue !== undefined) {
          if (sValue.length !== 0) {
          for (var i = 0; i < sValue.length; i++) {
            aValue.push({
              Sign: "I",
              Option: Op,
              Low: sValue[i],
              High: ""
            });
          }
        }
        }
        return aValue;
      },
      onSearchFilters: async function () {
        sap.ui.core.BusyIndicator.show(0);
        var oData = this.getModel("sFilter").getData();

        var sFilter = {
          Odm: [
            {}
          ],
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

        var aFilterFE = [], tempFilter = [], i = 0;
        /*if (oData.TipoAttivita !== undefined && oData.TipoAttivita !== ""){
          aFilterFE.push(new Filter("TipoAttivita", FilterOperator.EQ, oData.TipoAttivita));
        }*/
        if (oData.TipoAttivita !== undefined) {
          if (oData.TipoAttivita.length !== 0) {
              tempFilter = this.multiFilterText(oData.TipoAttivita, "TipoAttivita");
              aFilterFE = aFilterFE.concat(tempFilter);
          }
        }
        sFilter.PDat1 = oData.DataDiRiferimento;
        sFilter.PDat2 = oData.PeriodoDiSelezioneDa;
        sFilter.PDat3 = oData.PeriodoDiSelezioneA;

        if (this.getView().byId("inIndex").getTokens().length > 0) {
            var aSelIndici = this.getView().byId("inIndex").getTokens();
            sFilter.SIndexPmo = [];
            for (i = 0; i < aSelIndici.length; i++) {
              sFilter.SIndexPmo.push({
                Sign: "I",
                Option: "EQ",
                Low: aSelIndici[i].getProperty("key"),
                High: ""
              });
            }
        }
        if (this.getView().byId("inEquip").getTokens().length > 0) {
          var aSelEquip = this.getView().byId("inEquip").getTokens();
          sFilter.SEquipmentCompo = [];
          for (i = 0; i < aSelEquip.length; i++) {
            sFilter.SEquipmentCompo.push({
              Sign: "I",
              Option: "CP",
              Low: aSelEquip[i].getProperty("key"),
              High: ""
            });
          }
      }
      if (this.getView().byId("inImpianto").getTokens().length > 0) {
        var aSelImpianto = this.getView().byId("inImpianto").getTokens();
        sFilter.SPltxu = [];
        for (i = 0; i < aSelImpianto.length; i++) {
          sFilter.SPltxu.push({
            Sign: "I",
            Option: "EQ",
            Low: aSelImpianto[i].getProperty("key"),
            High: ""
          });
        }
    }
    if (this.getView().byId("inAzione").getTokens().length > 0) {
      var aSelAzione = this.getView().byId("inAzione").getTokens();
      sFilter.SAzione = [];
      for (i = 0; i < aSelAzione.length; i++) {
        sFilter.SAzione.push({
          Sign: "I",
          Option: "EQ",
          Low: aSelAzione[i].getProperty("key"),
          High: ""
        });
      }
  }

      if (this.getView().byId("inSede").getTokens().length > 0) {
        var aSelSede = this.getView().byId("inSede").getTokens();
        sFilter.SStrno = [];
        for (i = 0; i < aSelSede.length; i++) {
          sFilter.SStrno.push({
            Sign: "I",
            Option: "CP",
            Low: aSelSede[i].getProperty("key") + "*",
            High: ""
          });
          sFilter.SStrno.push({
            Sign: "I",
            Option: "EQ",
            Low: aSelSede[i].getProperty("key"),
            High: ""
          });
        }
    }
        if (oData.DescrizioneComponente !== undefined && oData.DescrizioneComponente !== "") {
          sFilter.SDesComponente = [{
            Sign: "I",
            Option: "CP",
            Low: oData.DescrizioneComponente + "*",
            High: ""
          }];
        }
        if (oData.Percorso !== undefined && oData.Percorso !== "") {
          sFilter.SPercorso = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Percorso,
            High: ""
          }];
        }
        if (oData.Collective !== undefined) {
          sFilter.Collective = oData.Collective;
        }
        if (oData.Indisponibilita !== undefined && oData.Indisponibilita !== "") {
          sFilter.SIndisponibilita = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Indisponibilita,
            High: ""
          }];
        }
        if (oData.TipoSchedulazione !== undefined && oData.TipoSchedulazione !== "") {
          sFilter.STipoPmo = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.TipoSchedulazione,
            High: ""
          }];
        }
        sFilter.SDivisioneu = this.filterSetMulti(oData.Divisione);
        sFilter.STipoOrdine = this.filterSetMulti(oData.TipoOrdine);
        sFilter.SSistema = this.filterSetMulti(oData.Sistema);
        sFilter.SClasse = this.filterSetMulti(oData.Classe);
        sFilter.SCentroLavoro = this.filterSetMulti(oData.CentroDiLavoro);
        sFilter.SDestinatario = this.filterSetMulti(oData.Destinatario);
        sFilter.STipoGestione = this.filterSetMulti(oData.TipoGestione);
        sFilter.STipoGestione1 = this.filterSetMulti(oData.Finalita);
        sFilter.STipoGestione2 = this.filterSetMulti(oData.GrupControllo);

        var oModel = new sap.ui.model.json.JSONModel(),
          allIndex = [];

        // In realtà fa una read, andava richiamato il metodo Post
        allIndex = await this._saveHana("/GetODM", sFilter);
        allIndex = allIndex.Odm.results;
        if (allIndex.length === 0) {
          sap.m.MessageToast.show("Nessun record trovato");
          oModel.setData([]);
          this.getView().setModel(oModel, "mManutenzione");
      } else {
        oModel.setData(allIndex);
        this.getView().setModel(oModel, "mManutenzione");
          this.byId("tbManutenzione").getBinding("items").filter(aFilterFE);
      }
      this.getView().getModel("mManutenzione").refresh();
        sap.ui.core.BusyIndicator.hide();
      },
      handleTestoView: async function (oEvent) {
        var line = oEvent.getSource().getBindingContext("mManutenzione").getObject();
        var vSO10 = "ZI" + line.IndexPmo + this.formatDate(line.InizioVal) + this.formatDate(line.FineVal) + line.Uzeit.replaceAll(":", "");

        var aFilter = [];
        aFilter.push(new Filter("Tdname", FilterOperator.EQ, vSO10));
        aFilter.push(new Filter("Tdid", FilterOperator.EQ, "ST"));
        aFilter.push(new Filter("Tdspras", FilterOperator.EQ, "I"));
        aFilter.push(new Filter("Tdobject", FilterOperator.EQ, "TEXT"));

        var sTesto = await this._fetchDataNoError("/TestiEstesi", aFilter);
        // EXTRACTION TEXT
        if (sTesto.length !== 0) {
          this.getView().byId("vTextAreaView").setText(sTesto[0].Testo);
          this.byId("popTestoView").open();
        }
      },

      formatDate: function (sValue) {

        if (sValue === "" || sValue === undefined || sValue === null) {
          return "00000000";
        } else {
          jQuery.sap.require("sap.ui.core.format.DateFormat");
          var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
          return oDateFormat.format(new Date(sValue), true);
        }
      },
      onCloseTestoView: function () {
        this.byId("popTestoView").close();
      },
      onImpostaData: async function (oEvent) {
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        if (aItems.length === 0) {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
        if (aItems.length !== 1) {
          return MessageBox.error(oResource.getText("MessageSelOne"));
        }
        var sItems = aItems[0].getBindingContext("mManutenzione").getObject();
        var aFilters = [];
        aFilters.push(new Filter("IndexOdm", FilterOperator.EQ, sItems.IndexPmo));
        aFilters.push(new Filter("Aufnr", FilterOperator.NE, ""));
        var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
        if (aWO.length > 0){
          return MessageBox.error(oResource.getText("MessageOrdineAtt"));
        }
          this.getView().setModel(new JSONModel([{
            DataPian: "",
            FineCard: ""
          }]), "oModelImpostaData");

            this.byId("myPopoverImpostaData").open();
          // Create popover
          /*if (!this._pInnerPopoverExternalLinks) {
            this._pInnerPopoverExternalLinks = Fragment.load({ id: oView.getId(), name: "PM030.APP4.fragment.PopoverImpostaData", controller: this }).then(function (oPopover) {
              oView.addDependent(oPopover);
              return oPopover;
            });
          }
          this._pInnerPopoverExternalLinks.then(function (oPopover) { // INIZIALIZZO GLI INPUT
            oPopover.setModel(new JSONModel({ DataPian: "", FineCard: "" }));
            oPopover.openBy(oButton);
          });*/
      },
      onClosePopoverImpostaData: function () {
        this.byId("myPopoverImpostaData").close();
      },
      onSalvaImpostaData: async function (sValue) {
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        for (var i = 0; i < aItems.length; i++) {
          var sIndex = {};
          var line = aItems[i].getBindingContext("mManutenzione").getObject();

          // Modifica
          if (sValue !== "X") {
            var sDate = this.getView().getModel("oModelImpostaData").getData();
            if (sDate.DataA !== "") {
              if (line.Napp === 1) {
                sIndex.Scostamento = (sDate.DataDa - line.UltimaEsecuz) / 86400000;
              } else {
                sIndex.Scostamento = (sDate.DataDa - line.UltimaEsecuz) / 86400000;
              } sIndex.Scostamento = Number((sIndex.Scostamento - line.Ggtot).toFixed());
            }
            if (sDate.DataA !== "") {
              sIndex.FineCard = sDate.DataA;
            }
          } else {
            // Cancellazione
            sIndex.FineCard = null;
            sIndex.Scostamento = 0;
          } sIndex.IndexPmo = line.IndexPmo;
          var sURL = "/T_PMO(IndexPmo='" + sIndex.IndexPmo + "')";
          await this._updateHana(sURL, sIndex);
        }
        this.byId("myPopoverImpostaData").close();
        sap.ui.core.BusyIndicator.hide(0);
        this.onSearchResult();
      },
      /** MANAGE ODM - START */
      onSuggestSEDE: async function (oEvent) {
        if (oEvent.getParameter("suggestValue").length >= 3) {
            var sTerm = oEvent.getParameter("suggestValue");

            var ListFl = {
                Language: "IT",
                GetDetails: "X",
                N_FunclocList: [],
                N_FunclocRa: [],
                N_CategoryRa: []
            };
            if (sTerm != "" && sTerm != null) {
                ListFl.N_FunclocRa.push({
                    Sign: "I",
                    Option: "CP",
                    Low: sTerm + "*"
                });
            }

            var allSedi = await this._saveHana("/ListFl", ListFl);
            var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.SedeRealeSingle = allSedi.N_FunclocList.results;
            this.getView().getModel("sHelp").refresh(true);
        }
    },
    onSuggestEquipment: async function (oEvent) {
      var sTerm = oEvent.getParameter("suggestValue");
      if (sTerm.length >= 3) {
          var aFilter = [];
          aFilter.push({
              "Shlpname": "ZPM4R_SH_EQUI",
              "Shlpfield": "SPRAS",
              "Sign": "I",
              "Option": "EQ",
              "Low": "IT"
          });
          aFilter.push({
              "Shlpname": "ZPM4R_SH_EQUI",
              "Shlpfield": "EQUNR",
              "Sign": "I",
              "Option": "CP",
              "Low": oEvent.getParameter("suggestValue") + "*"
          });
          var sHelp = this.getView().getModel("sHelp").getData();
          sHelp.EQUIPMENT = await this.Shpl("ZPM4R_SH_EQUI", "SH", aFilter);
          this.getView().getModel("sHelp").refresh(true);
      }
  },
      _retrieveIndexODM: async function (index) {
        const oData = this.getModel("sFilter").getData();
        const sFilter = {
          Odm: [
            {}
          ],
          PDat1: new Date(),
          PDat2: new Date("1970", "01", "01"),
          PDat3: new Date("2999", "12", "31"),
          FlagAttivo: "X"
        };

        sFilter.PDat1 = oData.DataDiRiferimento;
        sFilter.PDat2 = oData.PeriodoDiSelezioneDa;
        sFilter.PDat3 = oData.PeriodoDiSelezioneA;
        sFilter.SDivisioneu = this.filterSetMulti(oData.Divisione);
        sFilter.SIndexPmo = [{
          Sign: "I",
          Option: "EQ",
          Low: index,
          High: ""
        }];

        return await this._saveHana("/GetODM", sFilter);
      },
      _gruopedByKey: function (array, key) {
        return array.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      },
      _gruopedByKeyCumulazione: function (array) {
        //chiave di raggruppamento per creazione ordine unico / piu ordini 
        return array.reduce(function (rv, x) {
          let key = x.Divisioneu + x.Indisponibilita + x.TipoOrdine + x.TipoAttivita + x.StComponente + x.EquipmentCompo + x.Lstar + x.Lstar1 + x.Lstar2 + x.Lstar3 + x.Lstar4 + x.Lstar5;
          (rv[key] = rv[key] || []).push(x);
          return rv;
        }, {});
      },
      _gruopedByKeyPass: function (array) {
        //chiave di raggruppamento per creazione ordine unico / piu ordini 
        return array.reduce(function (rv, x) {
          let key = x.Divisioneu + x.Indisponibilita + x.TipoOrdine + x.TipoAttivita + x.StComponente + x.EquipmentCompo;
          (rv[key] = rv[key] || []).push(x);
          return rv;
        }, {});
      },
      _checkCreazioneODM: async function (aSelected) {
        let oError = { status: false, message: "" };
        // Recupero il binding della riga selezionata
        const aSelectedObj = aSelected.map((e) => e.getBindingContext("mManutenzione").getObject());

        // 4 - Posso selezionare più appuntamenti di index diversi (rispettando sempre l’ordine degli appuntamenti) per effettuare la creazione degli ordini. Nel caso in cui seleziono gli appuntamenti sbagliati scatta l’errore “Errore selezione appuntamento”
        const oGroupedByIndex = this._gruopedByKey(aSelectedObj, "IndexPmo");

        for (const key in oGroupedByIndex) {
          // eslint-disable-next-line no-prototype-builtins
          if (oGroupedByIndex.hasOwnProperty(key)) {
            const current = oGroupedByIndex[key];
            const index = parseInt(key).toString();
            const { Odm: { results } } = await this._retrieveIndexODM(index);
            // Nel caso in cui si seleziona un appuntamento di un index contenente tutte azioni Elementari disattive, non è possibile creare l’ordine e scatta il messaggio bloccante: “Appuntamenti senza Azioni Elementari attive”
            // chiamata JoinPMO verificare l'expand 
            const JoinPMO = await this._fetchData("/JoinPMO" /* ('${index}') */, [
              new Filter("IIndexPmo", FilterOperator.EQ, index)
            ]);
            // 1 - che abbia almeno una azione elementare.
            if (JoinPMO &&
              JoinPMO.length > 0 &&
              JoinPMO[0].T_ACT_ELSet.results &&
              JoinPMO[0].T_ACT_ELSet.results.length > 0) {
              // 2 - verificare che sia almeno uno attivo. // NO - verificare che siano tutti col flag attivo. --> T_ACT_EL
              const res = JoinPMO[0].T_ACT_ELSet.results;
              let disattivi = 0;
              for (let r = 0; r < res.length; r++) {
                const el = res[r];
                if (!el.FlagAttivo) {
                  disattivi++;
                }
              }

              if (disattivi === res.length) {
                //"Appuntamenti senza Azioni Elementari attive"
                oError = { status: true, message: oResource.getText("ODMErrorAzioniElementari") };
              }
            } else {
              oError = { status: true, message: oResource.getText("ODMErrorAzioniElementari") };
            }

            // 3 - Posso selezionare più appuntamenti dello stesso index (rispettando sempre l’ordine degli appuntamenti) per effettuare la creazione degli ordini. Nel caso in cui seleziono gli appuntamenti sbagliati scatta l’errore “Errore selezione appuntamento”
            for (let i = 0; i < current.length; i++) {
              const element = current[i];
              // 2 - Se seleziono un appuntamento di un index già pianificato in ODM, non è possibile creare l’ODM. Scatta il messaggio: “Seleziona Index senza ODM”
              if (element.NumOrdAttivo) {
                // `L'appuntamento ${element.Napp} contiene già un ODM (${element.NumOrdAttivo})!\n Seleziona Index senza ODM`
                const m = oResource.getText("ODMErrorOrderExists")
                  .replace("${Napp}", element.Napp)
                  .replace("${NumOrdAttivo}", element.NumOrdAttivo);
                oError = { status: true, message: m };
                break;
              }

              // 1 - Se un Index ha tutti appuntamenti senza Ordine, si deve partire dal primo appuntamento per la creazione dello stesso e procedere in modo crescente (esempio: non posso creare l’ODM all’appuntamento 3 se al 2 non c’è ancora ODM ecc.) altrimenti errore “Errore selezione appuntamento”.
              const aBefore = results.filter((e) => e.Napp < element.Napp);
              for (let b = 0; b < aBefore.length; b++) {
                const e = aBefore[b];
                // gestione casistica creazione appuntamenti consecutivi.
                if (current.map(c => c.Napp).includes(e.Napp)) e.NumOrdAttivo = "FITTIZIO";
                // se ne ha almeno 1 valorizzato tra quelli precedenti da errore
                if (!e.NumOrdAttivo) {
                  // Errore selezione appuntamento
                  oError = { status: true, message: oResource.getText("ODMErrorSelezione") };
                  break;
                }
              }
            }
          }
        }

        return oError;
      },
      _checkRilascioODM: async function (aSelected) {
        let m = "";
        let oError = { status: false, message: "" };
        // Recupero il binding della riga selezionata
        const aSelectedObj = aSelected.map((e) => e.getBindingContext("mManutenzione").getObject());
        // 4 - Possono essere selezionati più appuntamenti dello stesso index o di diversi index con ODM per il rilascio purché abbiano l’ordine in stato APER
        const oGroupedByIndex = this._gruopedByKey(aSelectedObj, "IndexPmo");
        for (const key in oGroupedByIndex) {
          // eslint-disable-next-line no-prototype-builtins
          if (oGroupedByIndex.hasOwnProperty(key)) {
            const current = oGroupedByIndex[key];
            const statiEsclusione = ["TECO", "CONF", "CALP", "KKMP", "NLIA"];
            for (let i = 0; i < current.length; i++) {
              const e = current[i];

              // 6 - Selezionando un index con appuntamento ma senza ODM, se provo a rilasciare non sarà possibile poiché non c’è l’ordine
              if (!e.NumOrdAttivo) {
                oError = { status: true, message: oResource.getText("ODMErrorNumOrd") };
                break;
              }

              // 3 - Selezionando un appuntamento di un index pianificato in ODM, se l’ordine è in stato TECO CONF CALP KKMP NLIA (CHIUSO) scatta il seguente messaggio: “Lo stato dell'ordine xxxxx non ammette alcuna modifica”
              if (statiEsclusione.includes(e.StatoOdm)) {
                m = oResource.getText("ODMErrorNotStatusError").replace("${NumOrdAttivo}", e.NumOrdAttivo);
                oError = { status: true, message: m };
                break;
              }
              // 2 -Nel caso in cui l’ODM è già rilasciato scatta il messaggio “Ordine ${NumOrdAttivo} già rilasciato”.
              else if (e.StatoOdm === "RIL.") {
                m = oResource.getText("ODMErrorNotRIL").replace("${NumOrdAttivo}", e.NumOrdAttivo);
                oError = { status: true, message: m };
                break;
              }
              // 1 - Selezionando un appuntamento di un index pianificato in ODM, prima del rilascio verifica che l’ordine sia in stato APER e non ancora rilasciato. 
              else if (e.StatoOdm !== "APER") {
                oError = { status: true, message: oResource.getText("ODMErrorNotAPER") };
                break;
              }
            }
          }
        }
        return oError;
      },
      _checkPrintODM: async function (aSelected) {
        let oError = { status: false, message: "" };
        // Recupero il binding della riga selezionata
        const aSelectedObj = aSelected.map((e) => e.getBindingContext("mManutenzione").getObject());
        // 2 - È possibile selezionare uno o più appuntamenti con Ordine dello stesso index e di index differenti per effettuare la stampa.
        const oGroupedByIndex = this._gruopedByKey(aSelectedObj, "IndexPmo");
        for (const key in oGroupedByIndex) {
          // eslint-disable-next-line no-prototype-builtins
          if (oGroupedByIndex.hasOwnProperty(key)) {
            const current = oGroupedByIndex[key];
            for (let i = 0; i < current.length; i++) {
              const e = current[i];
              // 1 - Selezionando un appuntamento senza OdM non è possibile stampare. Scatta il messaggio: “Nella selezione sono presenti solo Appuntamenti Senza ordine”.
              if (!e.NumOrdAttivo) {
                oError = { status: true, message: oResource.getText("ODMErrorNumOrd") };
                break;
              }
            }
          }
        }
        return oError;
      },
      /** MANAGE ODM - END */

      onAggrega: async function () {
        const oTable = this.byId("tbManutenzione");
        const aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length !== 0) {
          var vAggregatore = "",vDescAggr = "", contAggr = 0, contNOAggr = 0;
          const aSelectedObj = this._gruopedByKey(aSelectedItems.map(s => s.getBindingContext("mManutenzione").getObject()), "NumOrdAttivo");
            //Controlli prima di Disaggregare 
            for (const key in aSelectedObj) {
                const aItems = aSelectedObj[key];
              for (var i = 0; i < aItems.length; i++) {
            if (Number(aItems[i].Aggregatore) > 0 && vAggregatore !== aItems[i].Aggregatore.toString()){
              contAggr = contAggr + 1;
              vAggregatore = aItems[i].Aggregatore.toString();
              var aFilters = [];
              aFilters.push(new Filter("IndexOdm", FilterOperator.EQ, aItems[i].IndexPmo));
              aFilters.push(new Filter("Appuntam", FilterOperator.NE, aItems[i].Napp));
              var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
              if (aWO.length > 0){
                vDescAggr = aWO[0].DescAggregatore;
              }
            }
            if (contAggr > 1){
              return MessageBox.error(oResource.getText("MessageplusAggr"));
            }
            if (Number(aItems[i].Aggregatore) === 0){
              contNOAggr = contNOAggr + 1;
            }
            if (aItems[i].StatoOdm !== "APER"){
              return MessageBox.error(oResource.getText("MessageSelOrderOpen"));
            }
            if (aItems[i].NumOrdAttivo === "" || aItems[i].NumOrdAttivo === undefined || aItems[i].NumOrdAttivo === null){
              return MessageBox.error(oResource.getText("MessageSelOrder"));
            }
          }
        }
          if (contNOAggr === 0 || contAggr === 0){
            return MessageBox.error(oResource.getText("MessagenoAggr"));
          }
          //var aFilters = [];
          //aFilters.push(new Filter("Aggregatore", FilterOperator.EQ, vAggregatore));
          //var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
          //aWO[0].DescAggregatore

          //Aggrega
          this.doAggregaOrDisaggrega(aSelectedObj, "GEAG", vAggregatore, vDescAggr);
          this.onSearchResult();
        } else {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onDisaggrega: async function () {
        const oTable = this.byId("tbManutenzione");
        const aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length !== 0) {
            const aSelectedObj = this._gruopedByKey(aSelectedItems.map(s => s.getBindingContext("mManutenzione").getObject()), "NumOrdAttivo");
            //Controlli prima di Disaggregare 
            for (const key in aSelectedObj) {
                const aItems = aSelectedObj[key];
                for (var i = 0; i < aItems.length; i++) {
                    if (aItems[i].Aggregatore === "000000000000" || aItems[i].Aggregatore === undefined || aItems[i].Aggregatore === null){
                    return MessageBox.error(oResource.getText("MessageNotDisAggr"));
                    }
                    if (aItems[i].StatoOdm.includes("RIL") || aItems[i].StatoOdm.includes("TECO")){
                        return MessageBox.error(oResource.getText("MessageNotDisAggr"));
                    }
                }
          }
          //Disaggrega
          this.doAggregaOrDisaggrega(aSelectedObj, "GEOC", "", "");

          sap.ui.core.BusyIndicator.hide(0);
          this.onSearchResult();
        } else {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
        sap.ui.core.BusyIndicator.hide(0);
        return MessageBox.success(oResource.getText("MessageSuccessDisagregga"));
      },

      doAggregaOrDisaggrega: async function (aSelectedObj, Status, Aggregatore, DescAggregatore) {
        for (const key in aSelectedObj) {
          const aItems = aSelectedObj[key];
          var sData = await this._fillPayloadUpdate(aItems[0]);
          sData.Status = Status;
          await this._saveHana("/UpdateOrder", sData);

          for (var i = 0; i < aItems.length; i++) {
            var aFilters = [];
            aFilters.push(new Filter("Aufnr", FilterOperator.EQ, aItems[i].NumOrdAttivo));
            var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
            for (var k = 0; k < aWO.length; k++) {
              var sURL = "/" + aWO[k].__metadata.uri.split("/")[aWO[k].__metadata.uri.split("/").length - 1];
              delete aWO[k].__metadata;
              aWO[k].Aggregatore = Aggregatore;
              aWO[k].DescAggregatore = DescAggregatore;
              await this._updateHana(sURL, aWO[k]);
          }
        }
      }
    },
      onCreaODM: async function () {
        const oTable = this.byId("tbManutenzione");
        const dialogAggregatore = this.byId("popAggregatore");
        const aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length !== 0) {
          // MANAGE ODM - START
          sap.ui.core.BusyIndicator.show(0);
          const oError = await this._checkCreazioneODM(aSelectedItems);

          if (oError && oError.status) {
            sap.ui.core.BusyIndicator.hide(0);
            return MessageBox.error(oError.message);
          }
          // MANAGE ODM - END
          sap.ui.core.BusyIndicator.hide(0);
          return MessageBox.warning(oResource.getText("MessageCreaODM"), {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                MessageBox.information(
                  oResource.getText("MessageGEOCALL"),
                  {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO, oResource.getText("Annulla")],
                    emphasizedAction: oResource.getText("Annulla"),
                    initialFocus: oResource.getText("Annulla"),
                    onClose: async (sActionGeoCall) => {
                      if (sActionGeoCall === MessageBox.Action.YES) {
                        MessageBox.information(
                          oResource.getText("MessageAggregatore"),
                          {
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO, oResource.getText("Annulla")],
                            emphasizedAction: oResource.getText("Annulla"),
                            initialFocus: oResource.getText("Annulla"),
                            onClose: async (sActionAggregatore) => {
                              if (sActionAggregatore === MessageBox.Action.YES && aSelectedItems.length === 1) {
                                //that.byId("Aggregatore").setValue(that.byId("tbManutenzione").getSelectedItems()[0].getBindingContext("mManutenzione").getObject().Aggregatore);
                                const oAggregatori = this._gruopedByKey(aSelectedItems.map(s => s.getBindingContext("mManutenzione").getObject()), "IndexPmo");
                                const aAggregatori = [];
                                var lastAggr = await this._getLastItemData("/T_APP_WO", "", "Aggregatore");
                                lastAggr = lastAggr + 1;
                                //for (const key in oAggregatori) {
                                  // eslint-disable-next-line no-prototype-builtins
                                  //if (oAggregatori.hasOwnProperty(key)) {
                                    aAggregatori.push({ IndexPmo: "", Aggregatore: lastAggr || "", Descrizione: "", Note: "" }); //IndexPmo: key
                                  //}
                                //}
                                dialogAggregatore.setModel(new JSONModel({ pagesCount: 4, items: aAggregatori }), "mAGGR" );
                                dialogAggregatore.open();
                              } else if (sActionAggregatore === MessageBox.Action.NO) {
                                await this.doCreateOdm(true, false, false);
                              } else if (sActionAggregatore === MessageBox.Action.YES && aSelectedItems.length > 1){
                                return MessageBox.error(oResource.getText("MessageAggrOneSel"));
                              }
                            }
                          }
                        );
                      } else if (sActionGeoCall === MessageBox.Action.NO) {

                        const aSelectedObj = aSelectedItems.map((e) => e.getBindingContext("mManutenzione").getObject());
                        const oGroupedByIndex = this._gruopedByKeyCumulazione(aSelectedObj);
                        var cont = 0;
                        for (const key in oGroupedByIndex) {
                          cont++;
                        }
                        if (cont === 1 && aSelectedObj.length > 1){
                            MessageBox.information(
                                oResource.getText("MessageCUMULA"),
                                {
                                    actions: [MessageBox.Action.YES, MessageBox.Action.NO, oResource.getText("Annulla")],
                                    emphasizedAction: oResource.getText("Annulla"),
                                    initialFocus: oResource.getText("Annulla"),
                                    onClose: async (sActionCumula) => {
                                    if (sActionCumula === MessageBox.Action.YES) {
                                        await this.doCreateOdm(false, false, true);
                                    } else if (sActionCumula === MessageBox.Action.NO) {
                                        await this.doCreateOdm(false, false, false);
                                    }
                                    }
                                });
                        } else {
                            await this.doCreateOdm(false, false, false);
                        }
                      }
                    }
                  }
                );
              }
            }
          });
        } else {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      doConsuntivazione: async function () {
        sap.ui.core.BusyIndicator.show(0);
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        const aRes = [];
        for (var i = 0; i < aItems.length; i++) {
          var payload = aItems[i].getBindingContext("mManutenzione").getObject();
          var result = await this._fetchData("/PrintOrderOutputBin", [new Filter("OutputBin", FilterOperator.EQ, payload.NumOrdAttivo)]);
          aRes.push(result);
        }
        sap.ui.core.BusyIndicator.hide(0);
        return MessageBox.success(oResource.getText("MessageSuccessCreate"));
      },
      doPrint: async function () {
        sap.ui.core.BusyIndicator.show(0);
        const aItems = this.byId("tbManutenzione").getSelectedItems();
        const aRes = [];
        for (let i = 0; i < aItems.length; i++) {
          const oBinding = aItems[i].getBindingContext("mManutenzione").getObject();

          const oPayload = {
            WorkPaper: "ES15", PaperText: "", TDdest: "FRONTEND", OutputBin: "",
            "TOrderSet": [{ Aufnr: oBinding.NumOrdAttivo, Operation: "", Matnr: "", Maktx: "" }],
            "PrintOrderOutputBinSet": []
          };

          var result = await this._saveHana("/ShopPaper", oPayload);
          aRes.push(result);
        }
        var pdfData = atob(
          "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog" +
          "IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv" +
          "TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K" +
          "Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg" +
          "L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+" +
          "PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u" +
          "dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq" +
          "Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU" +
          "CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu" +
          "ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g" +
          "CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw" +
          "MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v" +
          "dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G");

        aRes.map((current) => {
          var blob = new Blob([current.OutputBin || pdfData], { type: "application/pdf" });
          var objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);
        });

        sap.ui.core.BusyIndicator.hide(0);
        return MessageBox.success(oResource.getText("MessageSuccessCreate"));
      },
      doReleaseOdm: async function () {
        sap.ui.core.BusyIndicator.show(0);
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        const aSelectedObj = this._gruopedByKey(aItems.map(s => s.getBindingContext("mManutenzione").getObject()), "NumOrdAttivo");
        for (const key in aSelectedObj) {
          if (aSelectedObj.hasOwnProperty(key)) {
          const payload = aSelectedObj[key][0];

          var sData = await this._fillPayloadRelease(payload);
          await this._saveHana("/UpdateOrder", sData);

          var aFilters = [];
          aFilters.push(new Filter("Aufnr", FilterOperator.EQ, payload.NumOrdAttivo));
          var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
          for (var k = 0; k < aWO.length; k++) {
            var sURL = "/" + aWO[k].__metadata.uri.split("/")[aWO[k].__metadata.uri.split("/").length - 1];
            delete aWO[k].__metadata;
            aWO[k].StatoOdm = "RIL.";
            await this._updateHana(sURL, aWO[k]);
          }
        }
      }
        sap.ui.core.BusyIndicator.hide(0);
        this.onSearchResult();
        return MessageBox.success(oResource.getText("MessageSuccessRelease"));
      },
      doCreateOdm: async function (Geocall, Aggregatore, Cumulatore) {
        sap.ui.core.BusyIndicator.show(0);
        var aSelItems = this.byId("tbManutenzione").getSelectedItems();

        const aSelectedObj = aSelItems.map((e) => e.getBindingContext("mManutenzione").getObject());
        const aGroupByKey = this._gruopedByKeyPass(aSelectedObj);

        for (const key in aGroupByKey) {
          if (aGroupByKey.hasOwnProperty(key)) {
          const aItems = aGroupByKey[key];
          var aAPP_WO = [];
          //Crea ODM 
          var sData = await this._fillPayloadInsert(aItems[0]);

          var vActual = 0, vTestoActual = 0, ComponentUpdate = [], OrderDetailsSet = [],  TextCreateOrderSet = [];
          var nItemMatnr = 0;
          for (var i = 0; i < aItems.length; i++) {

            var lineWO = {
              Zcount: "",
              IndexOdm: aItems[i].IndexPmo.padStart(12, "0"),
              Appuntam: aItems[i].Napp,
              Aufpl: aItems[i].Aufpl,
              Qmnum: "",
              NumIntervento: "",
              StatoOdm: "APER",
              DettConf: "",
              DataPian: aItems[i].Datpia || null,
              DataFineCard: aItems[i].FineCard || null,
              DataPianNatur: aItems[i].InizioVal || null
            };
            if (Aggregatore) {
              var mAggr = this.byId("popAggregatore").getModel("mAGGR").getData();
              lineWO.Aggregatore = mAggr.items[0].Aggregatore;
              lineWO.DescAggregatore = mAggr.items[0].Descrizione;
              //Note
            }
            if (Cumulatore && i > 0){
              for (let index = 0; index < 6; index++) {
                if (aItems[i][`Lstar${index || ""}`] !== ""){
                  sData.OperationListSet[index].WorkActivity = (Number(sData.OperationListSet[index].WorkActivity) + Number(aItems[i][`Toth${index || ""}`])).toString();
                  sData.OperationListSet[index].NormalDuration = (Number(sData.OperationListSet[index].NormalDuration) + Number(aItems[i][`Hper${index || ""}`] * aItems[i][`Num${index || ""}`] )).toString();
                  lineWO[`Aplzl${index || ""}`] = `${index + 1}`.toString();
                  //Persone
                }
              }
            } else {
              var vTestoEsteso = await this.onTestoEstesoI(aItems[i]);
              for (let index = 0; index < 6; index++) {
                if (aItems[i][`Lstar${index || ""}`] !== ""){
                  sData.OperationListSet.push({
                    OperationNumber: `${vActual + 1}0`.toString().padStart(4, "0"), // "0010", // 0010, 0020, 0030 ecc
                    ControlKey: aItems[i][`Steus${index || ""}`], // "", //"PM01", // Steus, Steus1, Steus2, Steus3, Steus4, Steus5
                    WorkCenter: aItems[i][`Cdl${index || ""}`], // "I_MM5", // Cdl, Cdl1, Cdl2, Cdl3, Cdl4, Cdl5
                    Plant: aItems[i].Divisionec, // Divisionec
                    Description: aItems[i].DesBreve,
                    Dest_merc: aItems[i].Destinatario,
                    Quantity: "", // Persone, Persone1, Persone2, Persone3, Persone4, Persone5
                    Price: "0", // Num, Num1, Num2, Num3, Num4, Num5
                    WorkActivity: aItems[i][`Toth${index || ""}`], // "", // Lstar, Lstar1, Lstar2, Lstar3, Lstar4, Lstar5
                    NormalDuration: (aItems[i][`Hper${index || ""}`] * aItems[i][`Num${index || ""}`]).toString(), // "0", // Hper, Hper1, Hper2, Hper3, Hper4, Hper5
                    WorkUnit: aItems[i].Daune // "H" // Daune
                    //cCalc: 0,
                    //Act Work 
                    //Persone
                  });
                  if (vTestoEsteso !== undefined && vTestoEsteso !== "" && vTestoEsteso !== null){
                    OrderDetailsSet.push({
                      "TextLine": aItems[i].DesBreve,
                      "ColFormat": "*"
                    });
                    OrderDetailsSet.push({
                      "TextLine": vTestoEsteso,
                      "ColFormat": "*"
                    });
                    TextCreateOrderSet.push({
                      "OrderNumber": "",
                      "OperationNumber": `${vActual + 1}0`.toString().padStart(4, "0"),
                      "Language": "IT",
                      "LangugeSAP": "IT",
                      "TextStart": (vTestoActual + 1).toString().padStart(8, "0"),
                      "TextEnde": (vTestoActual + 2).toString().padStart(8, "0")
                    });
                    vTestoActual = vTestoActual + 2;
                  }
                  lineWO[`Aplzl${index || ""}`] = `${vActual + 1}`.toString();
                  vActual++;
                }
              }
            }
            aAPP_WO.push(lineWO);

            var JoinPMO = await this._fetchData("/JoinPMO", [ new Filter("IIndexPmo", FilterOperator.EQ, aItems[i].IndexPmo) ]);
            if (JoinPMO){
              var aMatnr = JoinPMO[0].T_PMO_MSet.results;
              for (var k = 0; k < aMatnr.length; k++) {
                nItemMatnr = nItemMatnr + 10;
                ComponentUpdate.push({
                  Material: aMatnr[k].Matnr ? aMatnr[k].Matnr.padStart(18, "0") : "",
                  Plant: aMatnr[k].Werks ? aMatnr[k].Werks : "",
                  RequirementQuantity: Number(aMatnr[k].Menge ? aMatnr[k].Menge : 0),
                  //RequirementQuantityUnit: aMatnr[k].Meins ? aMatnr[k].Meins : "",
                  StgeLoc: aMatnr[k].Lgort ? aMatnr[k].Lgort : "",
                  ItemNumber: nItemMatnr.toString().padStart(4, "0"),
                  Activity: "0010",
                  ItemCat: "L"
                });
              }
            }
          }
          //Crea l ordine
          var result = await this._saveHana("/CreateOrder", sData);
          if (result.ErrorMessagesSet.results.map(r => r.Type).indexOf("E") !== -1) {
            sap.ui.core.BusyIndicator.hide(0);
            return MessageBox.error((result.ErrorMessagesSet.results.map((r) => r.Message).join("\n")));
          }

          if (result.OrderNumber !== "") {
            // Aggiorna i Componenti e le Operazioni che sul metodo precedente non vanno 
            sData.OrderNumber = result.OrderNumber;
            for (var k = 0; k < TextCreateOrderSet.length; k++) {
              TextCreateOrderSet[k].OrderNumber = result.OrderNumber;
            }
            if (ComponentUpdate.length > 0){
              sData.ComponentUpdateSet = ComponentUpdate;
            } else {
              delete sData.ComponentUpdate;
            }
            delete sData.DateCreation;
            delete sData.RequiredEndTime;
            delete sData.RequiredStartTime;
            delete sData.Revision;
            delete sData.TimeCreation;
            delete sData.UserCreator;
            delete sData.WbsElem;
            //delete sData.TUserStatusSet;
            sData.OrderDetailsSet = OrderDetailsSet;
            sData.TextCreateOrderSet = TextCreateOrderSet;
            if (Geocall && !Aggregatore) sData.Status  = "GEOC";
            else if (Geocall && Aggregatore) sData.Status  = "GEAG";
            else sData.Status  = "OAMP";

            await this._saveHana("/UpdateOrder", sData);

            // Salva la riga sull APP_WO     
            aAPP_WO = _.sortBy(aAPP_WO, "Appuntam");
            for (i = 0; i < aAPP_WO.length; i++) {
              aAPP_WO[i].Aufnr = result.OrderNumber,
              await this._saveHana("/T_APP_WO", aAPP_WO[i]);

              var sIndex = {
                IndexPmo: aAPP_WO[i].IndexOdm,
                Appuntam: aAPP_WO[i].Appuntam
              };
              var sURL = "/T_PMO(IndexPmo='" + aAPP_WO[i].IndexOdm + "')";
              await this._updateHana(sURL, sIndex);
            }
          }
         }
        }
        sap.ui.core.BusyIndicator.hide(0);
        this.onSearchResult();
        return MessageBox.success(oResource.getText("MessageSuccessCreate"));
      },
      _fillPayloadInsert: async function (sItems) {
        const payloadInsert = await this._fillPayload(sItems);
        return payloadInsert;
      },
      _fillPayload: async function (sItems) {
        let payload = {
          NotificationID: "",
          OrderNumber: "",
          Status: "",
          EquipmentID: "",
          OrderType: sItems.TipoOrdine, // "M4", // TipoOrdine
          SystCondition: sItems.Indisponibilita, // "0", // Indisponibilita
          FunctionalLocation: sItems.StComponente, // "ITW-ITWI-A1-01", // Sede Tecnica
          PlannerGroup: "",
          MaintPlanningPlant: "",
          Description: "",
          StartDate: this.formatDate(sItems.Datpia), // "20190314", // Data Pianificazione
          FinishDate: this.formatDate(sItems.Datpia), //"20190314", // Data Pianificazione
          MaintPlant: "",
          Plant: "",
          MainWorkCenter: "",
          MantActivityType: sItems.TipoAttivita, // "AC", // Tipo Attività PM
          ProcessingGrp: "00",
          Priority: sItems.Priorita, // "3", // Priorità
          OperationListSet: [],
          // expands
          ErrorMessagesSet: [],
          // ObjectListSet: [],
          // OrderDetailsSet: [],
          // TextCreateOrderSet: []
          //TUserStatusSet: []
        };

        payload.Description = sItems.Impianto + " " + (sItems.StComponente.split("-")[2] === undefined ? "" :  sItems.StComponente.split("-")[2]);
        var aFilters = [];
        aFilters.push(new Filter("Spras", FilterOperator.EQ, "IT"));
        aFilters.push(new Filter("Ilart", FilterOperator.EQ, sItems.TipoAttivita));
        var aATTPM = await this._fetchDataNoError("/T_ATTPM", aFilters);
        if (aATTPM.length > 0){
          payload.Description = payload.Description + " " + aATTPM[0].Ilatx;
        }
        return payload;
      },
      _fillPayloadRelease: async function (sItems) {

        const payloadUpdate = await this._fillPayload(sItems);
        payloadUpdate.SystemStatus = "RELEASE";
        payloadUpdate.OrderNumber = sItems.NumOrdAttivo;

        const sFilter = {
          "DateIn": "19700101",
          "DateFi": "99991231",
          "OrderNumber": sItems.NumOrdAttivo,
          "GetOperationListSet": []
        };
        var aOperation = await this._saveHana("/GetOrder", sFilter);
        aOperation = aOperation.GetOperationListSet.results;
        for (var i = 0; aOperation.length > i; i++) {
          payloadUpdate.OperationListSet.push({
            OperationNumber: aOperation[i].OperationNumber,
            ControlKey: aOperation[i].ControlKey,
            WorkCenter: aOperation[i].WorkCenter,
            Plant: aOperation[i].Plant,
            Description: aOperation[i].Description,
            Quantity: aOperation[i].Quantity,
            Price: aOperation[i].Price,
            WorkActivity: aOperation[i].WorkActivity,
            NormalDuration: aOperation[i].NormalDuration,
            WorkUnit: aOperation[i].WorkUnit
          });
        }
        return payloadUpdate;
      },
      _fillPayloadUpdate: async function (sItems) {
        const payloadUpdate = await this._fillPayload(sItems);
        payloadUpdate.OrderNumber = sItems.NumOrdAttivo;

        const sFilter = {
          "DateIn": "19700101",
          "DateFi": "99991231",
          "OrderNumber": sItems.NumOrdAttivo,
          "GetOperationListSet": [],
          "OrderHeaderSet": []
        };

        var aOperation = await this._saveHana("/GetOrder", sFilter);
        if (aOperation.OrderHeaderSet.results.length > 0){
          this.Status = aOperation.OrderHeaderSet.results[0].ObjectStatus;
        } else {
          this.Status = "";
        }
        aOperation = aOperation.GetOperationListSet.results;
        for (var i = 0; aOperation.length > i; i++) {
          payloadUpdate.OperationListSet.push({
            OperationNumber: aOperation[i].OperationNumber,
            ControlKey: aOperation[i].ControlKey,
            WorkCenter: aOperation[i].WorkCenter,
            Plant: aOperation[i].Plant,
            Description: aOperation[i].Description,
            Quantity: aOperation[i].Quantity,
            Price: aOperation[i].Price,
            WorkActivity: aOperation[i].WorkActivity,
            NormalDuration: aOperation[i].NormalDuration,
            WorkUnit: aOperation[i].WorkUnit
          });
        }
        return payloadUpdate;
      },
      onConfirmAgg: async function () {
        await this.doCreateOdm(true, true, false);
        this.byId("popAggregatore").close();
      },
      onCloseAgg: function () {
        this.byId("popAggregatore").close();
      },
      onCancellaData: async function () {

        var aItems = this.byId("tbManutenzione").getSelectedItems();
        if (aItems.length === 0) {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
        /*if (aItems.length !== 1) {
          return MessageBox.error(oResource.getText("MessageSelOne"));
        }*/
        const aSelectedObj = aItems.map((e) => e.getBindingContext("mManutenzione").getObject());
        for (var i = 0; i < aSelectedObj.length; i++) {
          var aFilters = [];
          aFilters.push(new Filter("IndexOdm", FilterOperator.EQ, aSelectedObj[i].IndexPmo));
          aFilters.push(new Filter("Aufnr", FilterOperator.NE, ""));
          var aWO = await this._fetchDataNoError("/T_APP_WO", aFilters);
          if (aWO.length > 0){
            return MessageBox.error(oResource.getText("MessageOrdineAtt"));
          }
            if ((aSelectedObj[i].Scostamento === 0 || aSelectedObj[i].Scostamento === "0" || aSelectedObj[i].Scostamento === undefined)
             && (aSelectedObj[i].FineCard === "" || aSelectedObj[i].FineCard === null || aSelectedObj[i].FineCard === undefined)){
              return MessageBox.error(oResource.getText("MessageSelScosFine"));
            }
        }
        MessageBox.warning(oResource.getText("MessageCancellaData"), {
          actions: [
            MessageBox.Action.OK, MessageBox.Action.CANCEL
          ],
          emphasizedAction: MessageBox.Action.OK,
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              this.onSalvaImpostaData("X");
            }
          }.bind(this)
        });

      },
      onReleaseODM: async function () {
        var oTable = this.byId("tbManutenzione");
        var aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length !== 0) {
          // MANAGE ODM - START
          sap.ui.core.BusyIndicator.show(0);
          const oError = await this._checkRilascioODM(aSelectedItems);

          if (oError && oError.status) {
            sap.ui.core.BusyIndicator.hide(0);
            return MessageBox.error(oError.message);
          }
          // MANAGE ODM - END
          sap.ui.core.BusyIndicator.hide(0);
          return MessageBox.warning(oResource.getText("MessageRilascioODM"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: async (sAction) => {
              if (sAction === MessageBox.Action.OK)
                await this.doReleaseOdm();
            }
          });
        } else {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onStampaDoc: async function () {
        var oTable = this.byId("tbManutenzione");
        var aSelectedItems = oTable.getSelectedItems();
        if (aSelectedItems.length !== 0) {
          // MANAGE ODM - START
          sap.ui.core.BusyIndicator.show(0);
          const oError = await this._checkPrintODM(aSelectedItems);

          if (oError && oError.status) {
            sap.ui.core.BusyIndicator.hide(0);
            return MessageBox.error(oError.message);
          }
          // MANAGE ODM - END
          return MessageBox.warning(oResource.getText("MessageStampaDoc"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: async (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                await this.doPrint();
              }
            }
          });
        } else {
          return MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onConsuntivazione: function () {
        var oTable = this.byId("tbManutenzione");
        var SelectItem = oTable.getSelectedItems();
        if (SelectItem.length !== 0) {
          MessageBox.warning(oResource.getText("MessageConsuntivazione"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.OK) {
                var oModel1 = new sap.ui.model.json.JSONModel();
                oModel1.setData({});
                this.getView().setModel(oModel1, "sSelect");
                this.byId("popSocieta").open();
              }
            }
          });
        } else {
          MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onConfirmConsuntivazione: function () {
        this.byId("popConsuntivazione").close();
        this.doConsuntivazione();
      },
      onCloseConsuntivazione: function () {
        this.byId("popConsuntivazione").close();
      },
      onConfirmSocieta: function () {
        var sSelect = this.getView().getModel("sSelect").getData();
        if (sSelect.Societa === "" || sSelect.Societa === undefined || sSelect.DataSocieta === null || sSelect.DataSocieta === undefined){
          return sap.m.MessageToast.show("Inserire i Campi");
        }
        this.byId("popSocieta").close();
        this.byId("popConsuntivazione").open();
      },
      onCloseSocieta: function () {
        this.byId("popSocieta").close();
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
        oSheet.build().finally(function () {
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
            format: () => { },
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
