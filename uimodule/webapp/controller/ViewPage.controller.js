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
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], /**
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 * @param {typeof sap.m.MessageBox} MessageBox 
 * @param {typeof sap.m.TablePersoController} TablePersoController 
 * @param {typeof sap.ui.core.Popup} Popup 
 * @param {typeof sap.ui.core.Fragment} Fragment 
 * @param {typeof sap.ui.export.Spreadsheet} Spreadsheet 
 * @param {typeof sap.ui.export.library} exportLibrary 
 * @param {typeof sap.ui.model.Filter} Filter 
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
 */
  function (Controller, JSONModel, MessageBox, manutenzioneTable, TablePersoController, Popup, Fragment, Spreadsheet, exportLibrary, Filter, FilterOperator) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({ bundleName: "PM030.APP4.i18n.i18n" }).getResourceBundle();
    var EdmType = exportLibrary.EdmType;

    return Controller.extend("PM030.APP4.controller.ViewPage", {
      onInit: function () {
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
        // sData.TIPO_GESTIONE = await this._getTableNoError("/T_TP_MAN");
        // sData.TIPO_GESTIONE_1 = await this._getTableNoError("/T_TP_MAN1");
        // sData.TIPO_GESTIONE_2 = await this._getTableNoError("/T_TP_MAN2");
        // sData.CENTRO_LAVORO = await this._getTableNoError("/T_DEST");
        // sData.TIPO_ATTIVITA = await this.Shpl("T353I", "CH");
        // sData.SISTEMA = await this._getTableNoError("/T_ACT_SYST");
        // sData.CLASSE = await this._getTableNoError("/T_ACT_CL");
        // oModelHelp.setData(sData);
        // this.getView().setModel(oModelHelp, "sHelp");
        // console.timeEnd("await");

        const aHelp = [
          this.Shpl("T003O", "CH"),
          this.Shpl("H_T001W", "SH"),
          this._getTableNoError("/T_TP_MAN"),
          this._getTableNoError("/T_TP_MAN1"),
          this._getTableNoError("/T_TP_MAN2"),
          this._getTableNoError("/T_DEST"),
          this.Shpl("T353I", "CH"),
          this._getTableNoError("/T_ACT_SYST"),
          this._getTableNoError("/T_ACT_CL"),
        ];

        console.time('all')
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
              CLASSE
            };
            oModelHelp.setData(oData);
            this.getView().setModel(oModelHelp, "sHelp");
            console.timeEnd('all');
          })
          .catch((err) => {
            console.timeEnd('all');
            console.log(err);
          });
      },
      onSearchResult: function () {
        this.onSearchFilters();
        /*var oModel = this.getView().getModel("sFilter");
        var divisione = oModel.getData().Divisione;
        if (! divisione) {
            debugger
            MessageBox.error(oResource.getText("MessageDivisioneObbligatoria"));
        } else {
            this.onSearchFilters();
        }*/
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

        sFilter.PDat1 = oData.DataDiRiferimento;
        sFilter.PDat2 = oData.PeriodoDiSelezioneDa;
        sFilter.PDat3 = oData.PeriodoDiSelezioneA;

        if (oData.Divisione !== undefined && oData.Divisione !== "") {
          sFilter.SDivisioneu = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Divisione,
            High: ""
          }];
        }
        if (oData.Index !== undefined && oData.Index !== "") {
          sFilter.SIndexPmo = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Index,
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
        if (oData.TipoOrdine !== undefined && oData.TipoOrdine !== "") {
          sFilter.STipoOrdine = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.TipoOrdine,
            High: ""
          }];
        }
        /*if (oData.TipoAttivita !== undefined && oData.TipoAttivita !== ""){
          sFilter.STipoAttivita = [{ Sign: "I", Option: "EQ", Low: oData.TipoAttivita, High: "" }];
        }*/
        if (oData.Indisponibilita !== undefined && oData.Indisponibilita !== "") {
          sFilter.SIndisponibilita = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Indisponibilita,
            High: ""
          }];
        }
        if (oData.Sistema !== undefined && oData.Sistema !== "") {
          sFilter.SSistema = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Sistema,
            High: ""
          }];
        }
        if (oData.Azione !== undefined && oData.Azione !== "") {
          sFilter.SAzione = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Azione,
            High: ""
          }];
        }
        if (oData.Classe !== undefined && oData.Classe !== "") {
          sFilter.SClasse = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Classe,
            High: ""
          }];
        }
        if (oData.Impianto !== undefined && oData.Impianto !== "") {
          sFilter.SPltxu = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Impianto,
            High: ""
          }];
        }
        if (oData.sedeTecnicaComponente !== undefined && oData.sedeTecnicaComponente !== "") {
          sFilter.SStrno = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.sedeTecnicaComponente,
            High: ""
          }];
        }
        if (oData.ComponenteEquipment !== undefined && oData.ComponenteEquipment !== "") {
          sFilter.SEquipmentCompo = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.ComponenteEquipment,
            High: ""
          }];
        }
        if (oData.DescrizioneComponente !== undefined && oData.DescrizioneComponente !== "") {
          sFilter.SDesComponente = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.DescrizioneComponente,
            High: ""
          }];
        }
        if (oData.CentroDiLavoro !== undefined && oData.CentroDiLavoro !== "") {
          sFilter.SCentroLavoro = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.CentroDiLavoro,
            High: ""
          }];
        }
        if (oData.Destinatario !== undefined && oData.Destinatario !== "") {
          sFilter.SDestinatario = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Destinatario,
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
        if (oData.TipoGestione !== undefined && oData.TipoGestione !== "") {
          sFilter.STipoGestione = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.TipoGestione,
            High: ""
          }];
        }
        if (oData.Finalita !== undefined && oData.Finalita !== "") {
          sFilter.STipoGestione1 = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Finalita,
            High: ""
          }];
        }
        if (oData.GrupControllo !== undefined && oData.GrupControllo !== "") {
          sFilter.STipoGestione2 = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.GrupControllo,
            High: ""
          }];
        }
        if (oData.Collective !== undefined) {
          sFilter.Collective = oData.Collective;
        }

        var oModel = new sap.ui.model.json.JSONModel(),
          allIndex = [];

        // In realtà fa una read, andava richiamato il metodo Post
        allIndex = await this._saveHana("/GetODM", sFilter);
        allIndex = allIndex.Odm.results;

        oModel.setData(allIndex);
        this.getView().setModel(oModel, "mManutenzione");
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

        var sTesto = await this._getTableNoError("/TestiEstesi", aFilter);
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
      onImpostaData: function (oEvent) {
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        if (aItems.length === 0) {
          MessageBox.error(oResource.getText("MessageNotSelected"));
        } else {
          this.getView().setModel(new JSONModel([{
            DataPian: "",
            FineCard: ""
          }]), "oModelImpostaData");
          var oButton = oEvent.getSource(),
            oView = this.getView();

          // Create popover
          if (!this._pInnerPopoverExternalLinks) {
            this._pInnerPopoverExternalLinks = Fragment.load({ id: oView.getId(), name: "PM030.APP4.fragment.PopoverImpostaData", controller: this }).then(function (oPopover) {
              oView.addDependent(oPopover);
              return oPopover;
            });
          }
          this._pInnerPopoverExternalLinks.then(function (oPopover) { // INIZIALIZZO GLI INPUT
            oPopover.setModel(new JSONModel({ DataPian: "", FineCard: "" }));
            oPopover.openBy(oButton);
          });
        }
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
            if (sDate.DataPian !== "") {
              if (line.Napp === 1) {
                sIndex.Scostamento = (sDate.DataPian - line.UltimaEsecuz) / 86400000;
              } else {
                sIndex.Scostamento = (sDate.DataPian - line.UltimaEsecuz) / 86400000;
              } sIndex.Scostamento = Number((sIndex.Scostamento - line.Ggtot).toFixed());
            }
            if (sDate.FineCard !== "") {
              sIndex.FineCard = sDate.FineCard;
            }
          } else {
            // Cancellazione
            // sIndex.FineCard = "";
            sIndex.Scostamento = 0;
          } sIndex.IndexPmo = line.IndexPmo;
          var sURL = "/T_PMO(IndexPmo='" + sIndex.IndexPmo + "')";
          await this._updateHana(sURL, sIndex);
        }
        this.byId("myPopoverImpostaData").close();
      },
      /** MANAGE ODM - START */
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
        if (oData.Divisione !== undefined && oData.Divisione !== "") {
          sFilter.SDivisioneu = [{
            Sign: "I",
            Option: "EQ",
            Low: oData.Divisione,
            High: ""
          }];
        }
        sFilter.SIndexPmo = [{
          Sign: "I",
          Option: "EQ",
          Low: index,
          High: ""
        }];

        return await this._saveHana("/GetODM", sFilter);
      },
      _checkCreazioneODM: async function (aSelected) {
        let oError = { status: false, message: "" };
        // Recupero il binding della riga selezionata
        const aSelectedObj = aSelected.map((e) => e.getBindingContext("mManutenzione").getObject());

        // 4 - Posso selezionare più appuntamenti di index diversi (rispettando sempre l’ordine degli appuntamenti) per effettuare la creazione degli ordini. Nel caso in cui seleziono gli appuntamenti sbagliati scatta l’errore “Errore selezione appuntamento”
        const oGroupedByIndex = aSelectedObj.reduce(function (rv, x) {
          (rv[x["IndexPmo"]] = rv[x["IndexPmo"]] || []).push(x);
          return rv;
        }, {});

        for (const key in oGroupedByIndex) {
          if (oGroupedByIndex.hasOwnProperty(key)) {
            const current = oGroupedByIndex[key];
            const index = parseInt(key).toString();
            const { Odm: { results } } = await this._retrieveIndexODM(index);
            // Nel caso in cui si seleziona un appuntamento di un index contenente tutte azioni Elementari disattive, non è possibile creare l’ordine e scatta il messaggio bloccante: “Appuntamenti senza Azioni Elementari attive”
            // chiamata JoinPMO verificare l'expand 
            const JoinPMO = await this._getTable("/JoinPMO" /* ('${index}') */, [
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
                oError = { status: true, message: "Appuntamenti senza Azioni Elementari attive" };
              }
            } else {
              oError = { status: true, message: "Appuntamenti senza Azioni Elementari attive" };
            }

            // 3 - Posso selezionare più appuntamenti dello stesso index (rispettando sempre l’ordine degli appuntamenti) per effettuare la creazione degli ordini. Nel caso in cui seleziono gli appuntamenti sbagliati scatta l’errore “Errore selezione appuntamento”
            for (let i = 0; i < current.length; i++) {
              const element = current[i];
              // 2 - Se seleziono un appuntamento di un index già pianificato in ODM, non è possibile creare l’ODM. Scatta il messaggio: “Seleziona Index senza ODM”
              if (element.NumOrdAttivo) {
                oError = { status: true, message: `L'appuntamento ${element.Napp} contiene già un ODM (${element.NumOrdAttivo})!\n Seleziona Index senza ODM` };
                break;
              }

              // 1 - Se un Index ha tutti appuntamenti senza Ordine, si deve partire dal primo appuntamento per la creazione dello stesso e procedere in modo crescente (esempio: non posso creare l’ODM all’appuntamento 3 se al 2 non c’è ancora ODM ecc.) altrimenti errore “Errore selezione appuntamento”.
              const aBefore = results.filter((e) => e.Napp < element.Napp);
              for (let b = 0; b < aBefore.length; b++) {
                const e = aBefore[b];
                // se ne ha almeno 1 valorizzato tra quelli precedenti da errore
                if (!e.NumOrdAttivo) {
                  oError = { status: true, message: "Errore selezione appuntamento" };
                  break;
                }
              }
            }
          }
        }

        return oError;


      },
      /** MANAGE ODM - END */
      onCreaODM: async function () {
        var that = this;
        var oTable = this.byId("tbManutenzione");
        var SelectItem = oTable.getSelectedItems();
        if (SelectItem.length !== 0) {
          // MANAGE ODM - START
          sap.ui.core.BusyIndicator.show(0);
          const oError = await this._checkCreazioneODM(SelectItem);
          sap.ui.core.BusyIndicator.hide(0);
          if (oError && oError.status) {
            return MessageBox.error(oError.message);
          }
          // MANAGE ODM - END
          return MessageBox.warning(oResource.getText("MessageCreaODM"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                MessageBox.information(
                  oResource.getText("MessageAggregatore"),
                  {
                    //icon: MessageBox.Icon.WARNING,
                    //title: oResource.getText("MessageAggregatore"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO, oResource.getText("Annulla")],
                    emphasizedAction: oResource.getText("Annulla"),
                    initialFocus: oResource.getText("Annulla"),
                    onClose: function (sAction2) {
                      if (sAction2 === MessageBox.Action.YES) {
                        that.byId("Aggregatore").setValue(that.byId("tbManutenzione").getSelectedItems()[0].getBindingContext("mManutenzione").getObject().Aggregatore);
                        that.byId("popAggregatore").open();
                      } else if (sAction2 === MessageBox.Action.NO) {
                        that.createOdm();
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
      createOdm: async function (Aggregatore) {
        var aItems = this.byId("tbManutenzione").getSelectedItems();
        for (var i = 0; i < aItems.length; i++) {
          var payload = aItems[i].getBindingContext("mManutenzione").getObject();
          //Crea ODM 
          var sData = this._fillPayloadInsert(payload);
          var result = await this._saveHana("/CreateOrder", sData);

          // gestire taella di ritorno. --> results.ErrorMessagesSet

          //Aggiorna Tabelle Z 
          if (result.OrderNumber !== "") {

            var lineWO = {
              Zcount: "",
              IndexOdm: payload.IndexPmo,
              Appuntam: payload.Napp,
              Aufnr: result.OrderNumber,
              Aufpl: payload.Aufpl,
              Aplzl: payload.Aplzl,
              Aplzl1: payload.Aplzl1,
              Aplzl2: payload.Aplzl2,
              Aplzl3: payload.Aplzl3,
              Aplzl4: payload.Aplzl4,
              Aplzl5: payload.Aplzl5,
              Qmnum: "",
              NumIntervento: "",
              StatoOdm: "I0001",
              DettConf: "",
              DataPian: this.formatDate(payload.InizioVal),
              DataFineCard: this.formatDate(payload.FineCard),
              //DataPianNatur:this.formatDate(sItems.InizioVal) todo
            };

            if (Aggregatore === "X") {
              lineWO.Aggregatore = payload.aggregatore;
              lineWO.DescAggregatore = payload.desc_aggregatore;
            }


            //INSERT zpm4r_t_app_wo.
            //UPDATE zpm4r_t_pmo SET scostamento = 0 fine_card = '00000000' WHERE index_pmo EQ tabt_app_odm-index_pmo AND appuntam EQ tabt_app_odm-napp

          }
        }
        MessageBox.success(oResource.getText("MessageSuccessCreate"));
      },
      _fillPayloadInsert: function (sItems) {
        const payloadInsert = {
          NotificationID: "",
          OrderNumber: "",
          Status: "",
          EquipmentID: "",
          OrderType: sItems.TipoOrdine, // "M4", // TipoOrdine
          SystCondition: sItems.Indisponibilita, // "0", // Indisponibilita
          FunctionalLocation: sItems.StComponente, // "ITW-ITWI-A1-01", // Sede Tecnica
          PlannerGroup: "",
          MaintPlanningPlant: "",
          Description: "SHORT 1", // Sembra un concatena tra estrazione di "impianto" e Tipo Attività PM, però a volte prende la descrizione del terzo livello della Sede Tecnica e la Descrizione Azione PMO (da controllare a codice)
          StartDate: this.formatDate(new Date()), // "20190314", // Data Pianificazione
          FinishDate: this.formatDate(new Date()), //"20190314", // Data Pianificazione
          MaintPlant: "",
          Plant: "",
          MainWorkCenter: "",
          MantActivityType: sItems.TipoAttivita, // "AC", // Tipo Attività PM
          ProcessingGrp: "00",
          Priority: sItems.Priorita, // "3", // Priorità
          UserCreator: "",
          DateCreation: "",
          TimeCreation: "",
          OperationListSet: [],
          // expands
          ErrorMessagesSet: [],
          // ObjectListSet: [],
          // OrderDetailsSet: [],
          // TUserStatusSet: [],
          // TextCreateOrderSet: []
        };
        for (let index = 0; index < 6; index++) {
          payloadInsert.OperationListSet.push({
            OperationNumber: `${index + 1}0`.toString().padStart(4, "0"), // "0010", // 0010, 0020, 0030 ecc
            ControlKey: sItems[`Steus${index || ""}`], // "", //"PM01", // Steus, Steus1, Steus2, Steus3, Steus4, Steus5
            WorkCenter: sItems[`Cdl${index || ""}`], // "I_MM5", // Cdl, Cdl1, Cdl2, Cdl3, Cdl4, Cdl5
            Plant: sItems.Divisionec, // Divisionec
            Description: "", // ? 
            Quantity: "0", // Persone, Persone1, Persone2, Persone3, Persone4, Persone5
            Price: "0", // Num, Num1, Num2, Num3, Num4, Num5
            WorkActivity: sItems[`Lstar${index || ""}`], // "", // Lstar, Lstar1, Lstar2, Lstar3, Lstar4, Lstar5
            NormalDuration: sItems[`Hper${index || ""}`].toString(), // "0", // Hper, Hper1, Hper2, Hper3, Hper4, Hper5
            WorkUnit: sItems.Daune // "H" // Daune
          });
        }
        return payloadInsert;

        // var line = {
        //   NotificationID: "",
        //   Status: "",
        //   OrderNumber: "",
        //   EquipmentID: sItems.EquipmentCompo,
        //   OrderType: sItems.TipoOrdine,
        //   FunctionalLocation: sItems.StComponente,
        //   PlannerGroup: "",
        //   MaintPlanningPlant: sItems.Divisionec,
        //   Description: sItems.DesBreve,
        //   StartDate: this.formatDate(sItems.InizioVal), //string
        //   FinishDate: this.formatDate(sItems.FineVal), //string
        //   MaintPlant: sItems.Divisionec,
        //   Plant: sItems.Divisionec,
        //   MainWorkCenter: "",
        //   MantActivityType: sItems.TipoAttivita,
        //   ProcessingGrp: "00",
        //   RequiredStartTime: "",
        //   RequiredEndTime: "",
        //   UserCreator: "",
        //   DateCreation: "",
        //   TimeCreation: "",
        //   Priority: sItems.Priorita,
        //   UserPartner: "",
        //   SystCondition: "0",
        //   ZGPSCoord: "",
        //   SubnetwrkOprtn: "",
        //   ActivityNumber: "",
        //   WbsElem: "",
        //   Revision: "",
        //   OperationListSet: []
        // };
        // var opNumber = 10;
        // if (sItems.Steus !== "") {
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus,
        //     WorkCenter: sItems.Cdl,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // if (sItems.Steus1 !== "") {
        //   opNumber = opNumber + 10;
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus1,
        //     WorkCenter: sItems.Cdl1,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar1,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // if (sItems.Steus2 !== "") {
        //   opNumber = opNumber + 10;
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus2,
        //     WorkCenter: sItems.Cdl2,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar2,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // if (sItems.Steus3 !== "") {
        //   opNumber = opNumber + 10;
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus3,
        //     WorkCenter: sItems.Cdl3,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar3,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // if (sItems.Steus4 !== "") {
        //   opNumber = opNumber + 10;
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus4,
        //     WorkCenter: sItems.Cdl4,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar4,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // if (sItems.Steus5 !== "") {
        //   opNumber = opNumber + 10;
        //   line.OperationListSet.push({
        //     OperationNumber: opNumber.toString().padStart(4, "0"),
        //     ControlKey: sItems.Steus5,
        //     WorkCenter: sItems.Cdl5,
        //     Plant: sItems.Divisionec,
        //     Description: "",
        //     Quantity: "0",
        //     Price: "0",
        //     WorkActivity: sItems.Lstar5,
        //     NormalDuration: "",
        //     WorkUnit: "H",
        //     StartCons: "",
        //     StartTimeCons: "",
        //     FinConstr: "",
        //     FinTimeCons: "",
        //     ConstraintStart: "",
        //     ConstraintFinich: ""
        //   });
        // }
        // return line;

      },
      onConfirmAgg: function () {
        this.createOdm("X");
        this.byId("popAggregatore").close();
      },
      onCloseAgg: function () {
        this.byId("popAggregatore").close();
      },
      onCancellaData: function () {
        var oTable = this.byId("tbManutenzione");
        var SelectItem = oTable.getSelectedItems();
        if (SelectItem.length !== 0) {
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
        } else {
          MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onRilascioODM: function () {
        var oTable = this.byId("tbManutenzione");
        var SelectItem = oTable.getSelectedItems();
        if (SelectItem.length !== 0) {
          MessageBox.warning(oResource.getText("MessageRilascioODM"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function () { }
          });
        } else {
          MessageBox.error(oResource.getText("MessageNotSelected"));
        }
      },
      onStampaDoc: function () {
        var oTable = this.byId("tbManutenzione");
        var SelectItem = oTable.getSelectedItems();
        if (SelectItem.length !== 0) {
          MessageBox.warning(oResource.getText("MessageStampaDoc"), {
            actions: [
              MessageBox.Action.OK, MessageBox.Action.CANCEL
            ],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function () { }
          });
        } else {
          MessageBox.error(oResource.getText("MessageNotSelected"));
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
            onClose: function () { }
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
