sap.ui.define(['jquery.sap.global'], function (jQuery) {
  "use strict";
  var oResource;
  oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP4.i18n.i18n"}).getResourceBundle();

  var PisteTableHome = {
      oData: {
          _persoSchemaVersion: "1.0",
          aColumns: [
              {
                id: "Manutenzione-tbManutenzione-col1",
                order: 0,
                text: oResource.getText("NumAppuntamenti"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col2",
                order: 1,
                text: oResource.getText("INDEX"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col3",
                order: 2,
                text: oResource.getText("Divisione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-co4",
                order: 3,
                text: oResource.getText("Impianto"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col5",
                order: 4,
                text: oResource.getText("TA"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col6",
                order: 5,
                text: oResource.getText("Ordine"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col7",
                order: 6,
                text: oResource.getText("TipoOrdine"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col8",
                order: 7,
                text: oResource.getText("TipoSchedulazione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col9",
                order: 8,
                text: oResource.getText("Agg"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col10",
                order: 9,
                text: oResource.getText("SedeTecnica"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col11",
                order: 10,
                text: oResource.getText("DescrizioneComponente"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col12",
                order: 11,
                text: oResource.getText("DescrizioneAzionePMO"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col13",
                order: 12,
                text: oResource.getText("DataUltimaEsecuzione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col14",
                order: 13,
                text: oResource.getText("DataPianificazione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col15",
                order: 114,
                text: oResource.getText("Ritardo"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col16",
                order: 15,
                text: oResource.getText("Indisponibilita"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col17",
                order: 16,
                text: oResource.getText("Percorso"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col18",
                order: 17,
                text: oResource.getText("StatoODM"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col19",
                order: 18,
                text: oResource.getText("Equipment"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col20",
                order: 19,
                text: oResource.getText("DataFineCardine"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col21",
                order: 20,
                text: oResource.getText("Sistema"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col22",
                order: 21,
                text: oResource.getText("Classe"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col23",
                order: 22,
                text: oResource.getText("Azione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col24",
                order: 23,
                text: oResource.getText("TipoAgg"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col25",
                order: 24,
                text: oResource.getText("Scostamento"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col26",
                order: 25,
                text: oResource.getText("Frequenza"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col27",
                order: 26,
                text: oResource.getText("UMFrequenza"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col28",
                order: 27,
                text: oResource.getText("CDL"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col29",
                order: 28,
                text: oResource.getText("Destinatario"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col30",
                order: 29,
                text: oResource.getText("TipoGestione"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col31",
                order: 30,
                text: oResource.getText("Finalita"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col32",
                order: 31,
                text: oResource.getText("GruppoControlli"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col33",
                order: 32,
                text: oResource.getText("TipoAttivita"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col34",
                order: 33,
                text: oResource.getText("LavoroTot"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col35",
                order: 34,
                text: oResource.getText("FattEse"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col36",
                order: 35,
                text: oResource.getText("NumRis"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col37",
                order: 36,
                text: oResource.getText("DurataStandard"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col38",
                order: 37,
                text: oResource.getText("Chiave"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col39",
                order: 38,
                text: oResource.getText("UMLavoro"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col40",
                order: 39,
                text: oResource.getText("TestoEsteso"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col41",
                order: 40,
                text: oResource.getText("Documenti"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col42",
                order: 41,
                text: oResource.getText("UtOggTec"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col43",
                order: 42,
                text: oResource.getText("Priorita"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col44",
                order: 43,
                text: oResource.getText("FlagMateriali"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col45",
                order: 44,
                text: oResource.getText("FlagPrestazioni"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col46",
                order: 45,
                text: oResource.getText("FlagGestCollective"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col47",
                order: 48,
                text: oResource.getText("Criticita"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col48",
                order: 47,
                text: oResource.getText("Determinanza"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col49",
                order: 48,
                text: oResource.getText("Differibile"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col50",
                order: 49,
                text: oResource.getText("PuntoDiMisura"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col51",
                order: 50,
                text: oResource.getText("DefPuntoDiMisura"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col52",
                order: 51,
                text: oResource.getText("PosMisura"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col53",
                order: 52,
                text: oResource.getText("NomeCaratteristica"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col54",
                order: 55,
                text: oResource.getText("CentroDiLavoro"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col55",
                order: 54,
                text: oResource.getText("CentroDiLavoro1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col56",
                order: 55,
                text: oResource.getText("TipoAttività1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col57",
                order: 56,
                text: oResource.getText("LavoroTotale1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col58",
                order: 57,
                text: oResource.getText("CentroDiLavoro2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col59",
                order: 58,
                text: oResource.getText("TipoAttività2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col60",
                order: 59,
                text: oResource.getText("LavoroTotale2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col61",
                order: 60,
                text: oResource.getText("CentroDiLavoro3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col62",
                order: 61,
                text: oResource.getText("TipoAttività3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col63",
                order: 62,
                text: oResource.getText("LavoroTotale3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col64",
                order: 63,
                text: oResource.getText("CentroDiLavoro4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col65",
                order: 64,
                text: oResource.getText("TipoAttività4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col66",
                order: 65,
                text: oResource.getText("LavoroTotale4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col67",
                order: 66,
                text: oResource.getText("CentroDiLavoro5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col68",
                order: 67,
                text: oResource.getText("TipoAttività5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col69",
                order: 68,
                text: oResource.getText("LavoroTotale5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col70",
                order: 69,
                text: oResource.getText("FattoreDiEsecuzione1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col71",
                order: 70,
                text: oResource.getText("NumeroRisorse1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col72",
                order: 71,
                text: oResource.getText("DurataStandard1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col73",
                order: 72,
                text: oResource.getText("FattoreDiEsecuzione2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col74",
                order: 73,
                text: oResource.getText("NumeroRisorse2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col75",
                order: 74,
                text: oResource.getText("DurataStandard2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col76",
                order: 75,
                text: oResource.getText("FattoreDiEsecuzione3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col77",
                order: 76,
                text: oResource.getText("NumeroRisorse3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col78",
                order: 77,
                text: oResource.getText("DurataStandard3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col79",
                order: 78,
                text: oResource.getText("FattoreDiEsecuzione4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col80",
                order: 79,
                text: oResource.getText("NumeroRisorse4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col81",
                order: 80,
                text: oResource.getText("DurataStandard4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col82",
                order: 81,
                text: oResource.getText("FattoreDiEsecuzione5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col83",
                order: 82,
                text: oResource.getText("NumeroRisorse5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col84",
                order: 83,
                text: oResource.getText("DurataStandard5"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col85",
                order: 84,
                text: oResource.getText("Chiave1"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col86",
                order: 85,
                text: oResource.getText("Chiave2"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col87",
                order: 86,
                text: oResource.getText("Chiave3"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col88",
                order: 87,
                text: oResource.getText("Chiave4"),
                visible: true
              },
              {
                id: "Manutenzione-tbManutenzione-col89",
                order: 88,
                text: oResource.getText("Chiave5"),
                visible: true
              },
          ]
      },

      getPersData: function () {
          var oDeferred = new jQuery.Deferred();
          if (!this._oBundle) {
              this._oBundle = this.oData;
          }
          var oBundle = this._oBundle;
          oDeferred.resolve(oBundle);
          return oDeferred.promise();
      },

      setPersData: function (oBundle) {
          var oDeferred = new jQuery.Deferred();
          this._oBundle = oBundle;
          oDeferred.resolve();
          return oDeferred.promise();
      }
  };

  return PisteTableHome;

});
