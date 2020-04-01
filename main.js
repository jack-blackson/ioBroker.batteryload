"use strict";
const utils = require("@iobroker/adapter-core");
const tools = require("./lib/tools");
const moment = require('moment');

let adapter;

//TEMPORÄR HIER FIXIERT!!
//-----------------------------------
//ÜBERSCHRIFT ÜBER TABELLE


let   htmlUberschrift=true;                           // mit Überschrift über der tabelle

let   htmlSignature=false;                              // anstatt der Überscghrift eine signature: - kleiner - anliegend

const htmlFeldUeber='Batterie Zustand Sensoren';              // Überschrift und Signature

const htmlFarbUber="white";                         // Farbe der Überschrift

const htmlSchriftWeite="normal";                       // bold, normal - Fettschrift für Überschrift

const htmlÜberFontGroesse="22px";                       // schriftgröße überschrift

let pfadBilder = "/admin/img/"

//MEHRERE TABELLEN NEBENEINANDER

let   mehrfachTabelle=3;                              // bis zu 4 Tabellen werden nebeneinander geschrieben-  verkürzt das Ganze, dafür etwas breiter - MÖGLICH 1,2,3,oder 4 !!!

const trennungsLinie="2";                             //extra trennungslinie bei mehrfachtabellen - evtl auf 0 stellen, wnn htmlRahmenLinien auf none sind

const farbetrennungsLinie="white";

const htmlFarbZweiteTabelle="white";                // Farbe der Überschrift bei jeder 2.ten Tabelle

const htmlFarbTableColorUber="#BDBDBD";               // Überschrift in der tabelle - der einzelnen Spalten

//ÜBERSCHRIFT SPALTEN

const UeberSchriftHöhe="35";                          //Überschrift bekommt mehr Raum - darunter und darüber - Zellenhöhe

const LinieUnterUeberschrift="3";                   // Linie nur unter Spaltenüberschrift - 

const farbeLinieUnterUeberschrift="white";

const groesseUeberschrift=20;

const UeberschriftStyle="normal"                     // möglich "bold"

//GANZE TABELLE

let abstandZelle="3";

let farbeUngeradeZeilen="#000000";                     //Farbe für ungerade Zeilenanzahl - Hintergrund der Spaltenüberschrift bleibt bei htmlFarbTableColorGradient1/2

let farbeGeradeZeilen="#151515";                        //Farbe für gerade Zeilenanzahl - Hintergrund der Spaltenüberschrift bleibt bei htmlFarbTableColorGradient1/2

let weite="auto";                                     //Weite der Tabelle

let zentriert=true;                                   //ganze tabelle zentriert

const backgroundAll="#000000";                        //Hintergrund für die ganze Seite - für direkten aufruf oder iqontrol sichtber - keine auswirkung auf vis-widget

const htmlSchriftart="RobotoCondensed-Regular"  //"Helvetica";

const htmlSchriftgroesse="18px";

//FELDER UND RAHMEN

let   UeberschriftSpalten=true;                // ein- oder ausblenden der spatlen-überschriften

const htmlFarbFelderschrift="#6E6E6E";                  // SchriftFarbe der Felder

const htmlFarbFelderschrift2="#585858";                 // SchriftFarbe der Felder für jede 2te Tabelle

const htmlFarbTableColorGradient1="#424242";          //  Gradient - Hintergrund der Tabelle - Verlauffarbe

const htmlFarbTableColorGradient2="#424242";          //  Gradient - Hintergrund der Tabelle - ist dieser Wert gleich Gradient1 gibt es keinen verlauf

const htmlFarbTableBorderColor="grey";             // Farbe des Rahmen - is tdieser gleich den gradienten, sind die rahmen unsichtbar

let htmlRahmenLinien="rows";                            // Format für Rahmen: MÖGLICH: "none" oder "all" oder "cols" oder "rows"

const htmlSpalte1Weite="auto";                   //  Weite der ersten beiden  Spalten oder z.b. 115px

var myJsonWidget=[]; 

var myJsonWidget2=[];

var htmlTabUeber="";

var htmlOut="";

var mix;

var counter;

var AkkuAlarm=[];

var alarmMessage=[];

let AkkuMessageLengthAlt=0;

 var arrDoppelt=[];

 let borderHelpBottum;

let borderHelpRight;

let htmlcenterHelp;

let htmlcenterHelp2;

var htmlTabUeber1 = "";
var htmlTabUeber2 = "";
var htmlTabUeber2_1 = "";
var htmlTabUeber3 = "";

var myColl=[];

var myObjF=[];

var val1help;

let htmlColorDeviceUeberschrift="#A0C2A0"             //  Farbe der Geräte Marken 

let HTMLbrandSetting="b"                              // style der geräte marken:  möglich b fett; i kursiv; span normal

var htmlZentriert='<center>'
var htmlStart = ''
var htmlTabStyle = ''

//HIER SIND DIE  WERTE, DIE IN DER SCHLEIFE GEFILTERET WER%DEN - Jede spalte einen wert - jeder valx muss in dieser schleife gesetzt werden !!

var val1; var val0; var val2;

var json1; var json2; var json3; var json4; var json5; var json6; var json3_1=0;


function startAdapter(options) {

    options = options || {};
    Object.assign(options, {
        name: 'batteryload',
        useFormatDate: true,
        ready: function() {
            main()
        }
    });

    adapter = new utils.Adapter(options);

    adapter.on(`unload`, callback => {
        //clearInterval(Interval);
        callback && callback();
    });

    

    return adapter;

}

function main() {
  configHtml()
  adapter.log.info('Adapter läuft')
  loopDevices()
  //writeHTML();


  //tabelleFinish(); // AB HIER NICHTS ÄNDERN - tabelle fertigstellen
  adapter.setState('Alarm',AkkuAlarm.length);
  adapter.setState('AlarmMessage',alarmMessage.toString()); AkkuMessageLengthAlt=AkkuAlarm.length;
  alarmMessage=[];

  //writeFile(home, path ,htmlOut, function (error) { log('file written');  ?????
  //});
  
}

function configHtml(){
    if(htmlRahmenLinien=="rows") {borderHelpBottum=1;borderHelpRight=0;}
    if(htmlRahmenLinien=="cols") {borderHelpBottum=0;borderHelpRight=1;}
    if(htmlRahmenLinien=="none") {borderHelpBottum=0;borderHelpRight=0;}
    if(htmlRahmenLinien=="all")  {borderHelpBottum=1;borderHelpRight=1;}

    zentriert ? htmlcenterHelp="auto" : htmlcenterHelp="left";
    zentriert ? htmlcenterHelp2="center" : htmlcenterHelp2="left";
    htmlStart=    "<!DOCTYPE html><html lang=\"de\"><head><title>Vorlage</title><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">"+
                      "<style> * {  margin: 0;} body {background-color: "+backgroundAll+"; margin: 0 auto;  }"+
                      " p {padding-top: 10px; padding-bottom: 10px; text-align: "+htmlcenterHelp2+"}"+
                      " td { padding:"+abstandZelle+"px; border:0px solid "+htmlFarbTableBorderColor+";  border-right:"+borderHelpRight+"px solid "+htmlFarbTableBorderColor+";border-bottom:"+borderHelpBottum+"px solid "+htmlFarbTableBorderColor+";}"+ 
                      " table { width: "+weite+";  margin: 0 "+htmlcenterHelp+"; border:1px solid "+htmlFarbTableBorderColor+"; border-spacing=\""+abstandZelle+"0px\" ; }"+   // margin macht center
                      "td:nth-child(1) {width: "+htmlSpalte1Weite+"}"+"td:nth-child(2) {width:"+htmlSpalte1Weite+"}"+
                      " </style></head><body> <div>";

    htmlTabStyle= "<table bordercolor=\""+htmlFarbTableBorderColor+"\" border=\"2px\" cellspacing=\""+abstandZelle+"\" cellpadding=\""+abstandZelle+"\" width=\""+weite+"\" rules=\""+htmlRahmenLinien+"\" style=\"color:"+htmlFarbFelderschrift+";  font-size:"+htmlSchriftgroesse+
                        "; font-family:"+htmlSchriftart+";background-image: linear-gradient(42deg,"+htmlFarbTableColorGradient2+","+htmlFarbTableColorGradient1+");\">";
    htmlTabUeber1="<tr height=\""+UeberSchriftHöhe+"\" style=\"color:"+htmlFarbTableColorUber+"; font-size: "+groesseUeberschrift+"px; font-weight: "+UeberschriftStyle+" ;  border-bottom: "+LinieUnterUeberschrift+"px solid "+farbeLinieUnterUeberschrift+" \">";
    htmlTabUeber3="</tr>";    
    htmlTabUeber2="<td width="+htmlSpalte1Weite+" align="+adapter.config.Feld1lAlign+">&ensp;"+adapter.config.htmlFeld1+"&ensp;</td><td width="+htmlSpalte1Weite+" align="+adapter.config.Feld2lAlign+">&ensp;"+adapter.config.htmlFeld2+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+">&ensp;"+adapter.config.htmlFeld3+"&ensp;</td>";
    htmlTabUeber2_1="<td width="+htmlSpalte1Weite+" align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbZweiteTabelle+"\">&ensp;"+adapter.config.htmlFeld1+"&ensp;</td><td width="+htmlSpalte1Weite+"  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbZweiteTabelle+"\">&ensp;"+adapter.config.htmlFeld2+
                      "&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\"color:"+htmlFarbZweiteTabelle+"\">&ensp;"+adapter.config.htmlFeld3+"&ensp;</td>";
}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
} 

function tabelleBind(){
      switch (mehrfachTabelle) { 
        case 1: 
          if(counter%2==0)         
            {htmlOut=htmlOut+"<tr bgcolor=\""+farbeGeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td></tr>"; break;
          }
          else    
            {htmlOut=htmlOut+"<tr bgcolor=\""+farbeUngeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td></tr>"; break;}
        case 2: 
          if(counter%4==0){
            if(counter%2==0)  
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeGeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\" align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            } 
            else 
              {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td></tr>";
            } 
            break;
          }else{
            if(counter%2==0)  
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeUngeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            } 
            else 
              {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td></tr>";
            } break;
          }
        case 3:
          if(counter%2==0)
            {if(counter%3==0 ) 
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeGeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            } 
            else
              {if(counter%3==1 )
                { htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"; \"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td>";
              }
              else    
                {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td></tr>";
              }
            } 
            break;
          }else
            {if(counter%3==0 )
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeUngeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            }
            else 
              {if(counter%3==1 )  
                { htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td>";
              } 
              else
                {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td></tr>";
              }
            } 
            break;
          }                                          
        case 4:  // counter=counter+8;
          if(counter%8==0)   
            {if(counter%4==0)  
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeGeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td  style=\" border-right: "+trennungsLinie+"px solid "+ farbetrennungsLinie+";\" align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            }
            else 
              {if(counter%4==1 )  
                { htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\"border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td>";
              }
              else    
                {if(counter%4==3)  
                  { htmlOut= htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td></tr>";
                }
                else    
                  {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"  align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>";
                }
              }

            } 
            break;
          }
          else
            {if(counter%4==0)  
              {htmlOut = htmlOut+"<tr bgcolor=\""+farbeUngeradeZeilen+"\"><td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td  style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\" align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>"; 
            }
            else 
              {if(counter%4==1 )  
                { htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td  align="+adapter.config.Feld3lAlign+" style=\"border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td>";
              }
              else    
                {if(counter%4==3)  
                  { htmlOut= htmlOut+"<td align="+adapter.config.Feld1lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val0+"&ensp;</td><td  align="+adapter.config.Feld2lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val1+"&ensp;</td><td align="+adapter.config.Feld3lAlign+" style=\"color:"+htmlFarbFelderschrift2+"\">&ensp;"+val2+"&ensp;</td></tr>";
                }
                else    
                  {htmlOut = htmlOut+"<td align="+adapter.config.Feld1lAlign+">&ensp;"+val0+"&ensp;</td><td align="+adapter.config.Feld2lAlign+">&ensp;"+val1+"&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+";\"align="+adapter.config.Feld3lAlign+">&ensp;"+val2+"&ensp;</td>";
                }
              }
            } 
            break;
          }                                    
       }
}

function writeHTML(){
  AkkuAlarm=[];
  htmlOut="";
  counter=-1;
  htmlTabUeber="";
  switch (mehrfachTabelle) { 
    case 1: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber3;  break;
    case 2: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber3; break;
    case 3: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber2+htmlTabUeber3; break;
    case 4: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber3; break;
  };   

  if (!UeberschriftSpalten) {htmlTabUeber=""} 
}

function loopDevices(){
  //homematic
  adapter.log.info('Starte loop device')

  if (adapter.config.homematic){
    logHomematic()
  }

}

function logHomematic(){
  adapter.log.info('Starte homematic')

  tabelleMachSchoen()
  counter=-1
  for(var i=0;i<mehrfachTabelle;i++ ) {
    val0=""; val1=""; val2="";counter++;tabelleBind();
  }

  for(var i=0;i<mehrfachTabelle;i++ ) {
    if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HOMEMATIC DEVICES</b>";} else{val0=""; }
    val1=""; val2="";counter++;tabelleBind();
  } 
  arrDoppelt=[];
  myObjF=[];

  $('hm-rpc.*.*.*.BATTERY_STATE').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

  if (!adapter.config.filterArray.includes(id)){
    var ida = id.split('.');
    var arrFilt=[];
    $(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]+".*").each(function(id, i) {   // kontrolliere ob OPERATING_VOLTAGE vorhanden
        var idc = id.split('.');
        arrFilt.push(idc[4])
    });
    arrDoppelt.push(ida[0]+"."+ida[1]+"."+ida[2]);

    if (arrFilt.includes("BATTERY_STATE")) {
      val0=adapter.getObject(id).common.name ; 
      var ida = val0.split('.');
      val0=ida[0].replace(/:.+/g,"");
      json1=val0;
      val1help=adapter.getState(id).val;
      var  val1helper=adapter.getState(id.replace("LOW_BAT","BATTERY_STATUS")).val;     

      //bigBatterien 
      if (val1helper>3.2){
        if (val1helper<=adapter.config.bigBattAlarm) {
          val2=adapter.config.adapter.config.symbolKO;json3=adapter.config.adapter.config.symbolKO
        } else if (val1helper<=adapter.config.bigBattWarn && val1helper>adapter.config.bigBattAlarm){} 
          val2=adapter.config.adapter.config.symbolWARN;json3=adapter.config.adapter.config.symbolWARN} else{val2=adapter.config.adapter.config.symbolOK;json3=adapter.config.adapter.config.symbolOK
        };
        if (val1helper<=adapter.config.bigBattAlarm){
          val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"
        } else if (val1helper<=adapter.config.bigBattWarn && val1helper>adapter.config.bigBattAlarm) {
          val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="Yellow";json2=val1helper.toFixed(1)+" V"
        } else{
          val1=(" <font color=\"lightgreen\"> ")+(val1helper.toFixed(1))+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"
        };
        json3_1=Math.abs((val1helper-adapter.config.bigBattAlarm)/((5-adapter.config.bigBattAlarm))*100)
        if (val1helper<adapter.config.bigBattAlarm) AkkuAlarm.push(1);
        if (val1helper<=adapter.config.bigBattAlarm)  alarmMessage.push(val0);
    }
    else {
      if (val1helper<=1.5){
        if (val1helper<1.1) {
          val2=adapter.config.adapter.config.symbolKO;json3=adapter.config.adapter.config.symbolKO
        } else if (val1helper<=1.2 && val1helper>=1.1) {
          val2=adapter.config.adapter.config.symbolWARN;json3=adapter.config.adapter.config.symbolWARN} else{val2=adapter.config.adapter.config.symbolOK;json3=adapter.config.adapter.config.symbolOK
        };
          
        if (val1helper<1.1){
          val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"
        } else if (val1helper<=1.2 && val1helper>=1.1) {
          val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="yellow";json2=val1helper.toFixed(1)+" V"
        } else{
          val1=(" <font color=\"lightgreen\"> ")+val1helper.toFixed(1)+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"
        };
          
        json3_1=Math.abs((val1helper-1.1)/((1.5-1.1))*100)
        if (val1helper<1.1) AkkuAlarm.push(1);
        if (val1helper<1.1)  alarmMessage.push(val0)
        } else {        
          if (val1helper<2.2) {
            val2=adapter.config.adapter.config.symbolKO;json3=adapter.config.adapter.config.symbolKO
          } else if (val1helper<=2.5 && val1helper>=2.2) {
            val2=adapter.config.symbolWARN;json3=adapter.config.adapter.config.symbolWARN
          } else{
            val2=adapter.config.symbolOK;json3=adapter.config.symbolOK
          };

          if (val1helper<2.2) {
            val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"
          } else if (val1helper<=2.5 && val1helper>=2.2) {
            val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="yellow";json2=val1helper.toFixed(1)+" V"
          } else{
            val1=(" <font color=\"lightgreen\"> ")+val1helper.toFixed(1)+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"
          };

          json3_1=Math.abs((val1helper-2.2)/((3-2.2))*100)
          if (val1helper<2.2) AkkuAlarm.push(1);
          if (val1helper<2.2)  alarmMessage.push(val0);
        }
      }
    } else {
      val0=adapter.getObject(id).common.name ; 
      var ida = val0.split('.');
      val0=ida[0].replace(/:.+/g,"");
      json1=val0;
      val1help=adapter.getState(id).val;

      if (val1help) {
        val1=(" <font color=\"red\"> ")+"low bat"; json2="low";json5="red";json3_1=0
      } else{
        val1=(" <font color=\"lightgreen\"> ")+"full bat";json2="high";json5="green";json3_1=100
      } 

      if (val1help) {
        val2=adapter.config.symbolKO;json3=adapter.config.symbolKO
      } else{
        val2=adapter.config.symbolOK;json3=adapter.config.symbolKO
      }         
      if (val1help) AkkuAlarm.push(1);
      if (val1help)  alarmMessage.push(val0);
    }

    json3=val2;
    json6="HOMEMATIC"

    json4=pfadBilder+"homematic.png"
    makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);
    let help=[val0,val1,val2]; myObjF.push(help);
  });

  $('hm-rpc.*.*.0.LOWBAT').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!
      var ida = id.split('.');
      if (!adapter.config.filterArray.includes(id) && !arrDoppelt.includes(ida[0]+"."+ida[1]+"."+ida[2]) ) {
        val0=adapter.getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name                     
        var ida = val0.split('.');
        val0=ida[0].replace(/:.+/g,"");
        json1=val0;     
        val1help=adapter.getState(id).val; 

        if(typeof adapter.getState(id).val!="number"){  
          if (val1help) {val1=(" <font color=\"red\"> ")+"low bat"; json2="low";json5="red";json3_1=0
          } else{
            val1=(" <font color=\"lightgreen\"> ")+"full bat";json2="high";json5="green";json3_1=100
          } 
          if (val1help) {
            val2="<font color=\"red\">"+adapter.config.symbolKO;json3=adapter.config.symbolKO
          } else {
            val2=adapter.config.symbolOK;json3=adapter.config.symbolKO
          }
          if (val1help) AkkuAlarm.push(1);
          if (val1help)  alarmMessage.push(val0);     
        } else {
          val1=(" <font color=\"yellow\"> ")+"no bat val"; json2="no bat val";json5="yellow";json3_1=0;val2="<font color=\"yellow\">"+adapter.config.symbolWARN;json3=adapter.config.symbolWARN; 
        }

        json6="HOMEMATIC"
        json4=pfadBilder+"homematick.png"
        makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);
        let help=[val0,val1,val2]; myObjF.push(help);
    } 
  });
  sortierMal(myObjF);
  adapter.log.info('Beende homematic')

}

function tabelleMachSchoen() {
  switch (mehrfachTabelle) {  
          case 1:    break;
          case 2:    
                     if(counter%2==0)  htmlOut = htmlOut.replace(/<\/td>$/, '</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>');
                     break;
          case 3:   if(counter%3==2)  htmlOut = htmlOut.replace(/<\/td>$/, "</td></tr>");
                    if(counter%3==1)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");        
                    if(counter%3==0)      htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td  style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");
                     break;
          case 4:   if(counter%4==3)  htmlOut = htmlOut.replace(/<\/td>$/, "</td></tr>");  
                    if(counter%4==2)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");  
                    if(counter%4==1)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");     
                    if(counter%4==0)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");      
                    break; }
}

function makeJsonWidget(vax1,vax2,vax3,vax4,vax5,vax6,vax3_1) {
  myJsonWidget.push({
      Device : vax1,
      Wert : vax2,
      Status : vax3,
      Hersteller : vax4,
      helpSort : vax3_1
  });

  let mysubText = `<div style="display: flex; flex-direction: row; line-height: 1.3; padding-left: 1px; padding-right: 8px; align-items: center;">
                             <div style="flex: 1;">${vax2}</div>
                             <div style="color: grey; font-size: 16px; font-family: RobotoCondensed-LightItalic; text-align: right;">${vax6}</div>
                         </div>`

  myJsonWidget2.push({
              text: vax1,
              subText: mysubText,
              statusBarColor: vax5,
              image: vax4,
              imageColor: "",
              listType: "text",
              showValueLabel: false,
              name: vax1,
              status: vax3,
              Wert : vax2,
              Hersteller : vax4,
              helpSort : vax3_1
    });
}


function sortierMal(myObjF) {
  myObjF.sort(function (alpha, beta) {
  if ((alpha[0].toUpperCase()).trim() > (beta[0].toUpperCase()).trim())
     return 1;
  if ((beta[0].toUpperCase()).trim() > (alpha[0].toUpperCase()).trim())
     return -1;
  return 0;
  });  

  for(var i=0;i<myObjF.length;i++) {
    counter++
    val0=myObjF[i][0] ;
    val1=myObjF[i][1] ;
    val2=myObjF[i][2] ;
    tabelleBind(); 
  } 
}


function tabelleFinish() {
  adapter.log.info('starte Tabellefinisht')

  switch (mehrfachTabelle) {  
    case 1:    
            break;
    case 2:    
            if(counter%2==0)  htmlOut = htmlOut.replace(/<\/td>$/, '</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>');
            break;
    case 3:   
            if(counter%3==2)  htmlOut = htmlOut.replace(/<\/td>$/, "</td></tr>");
            if(counter%3==1)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");        
            if(counter%3==0)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td  style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");
            break;
    case 4: 
            if(counter%4==3)  htmlOut = htmlOut.replace(/<\/td>$/, "</td></tr>");
            if(counter%4==2)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");
            if(counter%4==1)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");    
            if(counter%4==0)  htmlOut = htmlOut.replace(/<\/td>$/, "</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+"\">&ensp;</td><td>&ensp;</td><td>&ensp;</td><td>&ensp;</td></tr>");      
            break; 
  }
  var htmlUeber=    "<p style=\"color:"+htmlFarbUber+"; font-family:"+htmlSchriftart+"; font-size: "+htmlÜberFontGroesse+"; font-weight:"+htmlSchriftWeite+ "\">"+htmlFeldUeber+"&ensp;&ensp;Last Update: "+   moment(Date(), 'SS:mm:ss')  +"</p>"; 
  var htmlUnter= "<div  style=\"color:"+htmlFarbUber+"; font-family:"+htmlSchriftart+"; font-size: 70%; text-align: right;\" >"+htmlFeldUeber+"&ensp;&ensp;Last Update: "+ moment(Date(), 'SS:mm:ss') +"</div>";
  
  if (!htmlSignature) htmlUnter="";
  
  //Ausgabe über VIS html widget - tabelle in datenpunkt schreiben - html tabelle ohne html header und body
  var htmlOutVIS="";
    
  if (htmlUberschrift) { 
    zentriert ? htmlOutVIS=htmlZentriert+htmlUeber+htmlTabStyle+htmlTabUeber+htmlOut+"</table>"+htmlUnter : htmlOutVIS=htmlUeber+htmlTabStyle+htmlTabUeber+htmlOut+"</table>"+htmlUnter ;      
  } else {
    zentriert ?  htmlOutVIS=htmlZentriert+htmlTabStyle+htmlTabUeber+htmlOut+"</table>"+htmlUnter :  htmlOutVIS=htmlTabStyle+htmlTabUeber+htmlOut+"</table>"+htmlUnter;
  }
   // log("bin raus aus tabelleBind");
  
  adapter.setState('VIS', htmlOutVIS );
    
  var htmlUnter= "<div  style=\"color:"+htmlFarbUber+"; font-family:"+htmlSchriftart+"; font-size: 80%;  text-align: center; \" >"+htmlFeldUeber+"&ensp;&ensp;Last Update: "+ moment(Date(), 'SS:mm:ss') +"</div>"
  
  if (!htmlSignature) htmlUnter="";
  
  var htmlEnd="</table>"+htmlUnter+"</div></body>";
    
  htmlUberschrift ? htmlOut=htmlStart+htmlUeber+htmlTabStyle+htmlTabUeber+htmlOut+htmlEnd : htmlOut=htmlStart+htmlTabStyle+htmlTabUeber+htmlOut+htmlEnd;
  
  adapter.setState('MaterialWidger',JSON.stringify(myJsonWidget2)); 
  myJsonWidget2=[];
  adapter.setState('MaterialWidgetTable',JSON.stringify(myJsonWidget)); 
  myJsonWidget=[];

  // Adapter erfolgreich durchgeführt
  adapter.terminate ? adapter.terminate(0) : process.exit(0);

}



//Original Script: 
/*


//@liv-in-sky Januar 2020 26.3-11:46

// https://forum.iobroker.net/topic/28789/script-fürtabelle-der-batterie-zustände

 

//HIER WIRD PFAD UND FILENAME DEFINIERT

const path = "/htmlakku.html";                   //FIlenamen definieren

const home ='vis.0'                                 //wo soll das file im iobroker-file-system liegen ? (oder z.b auch iqontrol.meta)

let   braucheEinFile=false;                          // bei true wird ein file geschrieben - NUR FÜR IQONTROL oder DIRECT BROWSER-Aufruf

let   braucheEinVISWidget=true;                     // bei true wird ein html-tabelle in einen dp geschrieben - MUSS ANGELEGT WERDEN !!!

let   braucheMaterialDesignWidget=false;             // bei true wird ein json in einen dp geschrieben - MUSS ANGELEGT WERDEN !!!

let   braucheMaterialDesignWidgetTable=false;        // bei true wird ein json in einen dp geschrieben - MUSS ANGELEGT WERDEN !!!

let dpVIS="controll-own.0.TABELLEN.AKKU" ;           //WICHTIG wenn braucheEinVISWidget auf true gesetzt !!  dp zusätzlich für VIS-HTML-Basic-Widget - zeichenkette(string)

let dpAlarm="controll-own.0.TABELLEN.AkkuAlarm";      // muss erstellt werden - datenpunkt erstellen vom typ "number" - bei 0 kein alarm und größer 0 die anzahl der schlechten batterien

let dpAlarmMessage="controll-own.0.TABELLEN.AkkuMeessage";                    // muss erstellt werden -  datenpunkt erstellen vom typ "string" Inhalt - alle devices mit lowbat-alarmen

let dpMaterialWidget="controll-own.0.TABELLEN.AkkuMaterialWidget";            // WICHTIG wenn braucheMaterialDesignWidget auf true MATERIALDESIGN List Widget - datenpunkt anlegen : zeichenkette  

let dpMaterialWidgetTable="controll-own.0.TABELLEN.AkkuMaterialWidgetTable";  // WICHTIG wenn braucheMaterialDesignWidgetTable auf true MATERIALDESIGN Table Widget - datenpunkt anlegen: zeichenkette  

let pfadBilderMaterialWidget="/vis.0/armin/img/marken/"  ;                     //für materialdesign widgets!!! PFAD zu den bildern, die in die vis geladen wurden

let wantAmessage=false;                                      // dieser message datenpunkt kann hier abgeschalten werden



var battAlarm=25;                                     //alarm batterie wert

var battAlarmWarning=40;                                     //warnungen batterie wert

 

 // ------------------------    hier einstellen, was man für adapter hat - die nicht gebraucht werden auf false setzen !!!

var tradfri=false;

var hue=false;

var hueExt=false;

var homematic=false;

var homematicIp=false;

var xiaomi=false;                                                // mihome.0

var fritzDect=true;

var netatmo=true;

var homee=false;

var tado=false;

var zigbee=false;

var zwave=false;

var deconz=false;

var iogo=false;                                                 // iogo - adapter - hat batterie abfrage

var fullyBrowser=true;                                         // fullybrowser - adapter - hat batterie abfrage

var handy1=false;                                              // sind einzelne datenpunkte, 

var handy2=false;

 

// AB HIER NICHTS  ÄNDERN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

 

function writeHTML(){

  AkkuAlarm=[];

 

  htmlOut="";

  

  counter=-1;

  htmlTabUeber="";

  switch (mehrfachTabelle) { 

    case 1: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber3;  break;

    case 2: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber3; break;

    case 3: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber2+htmlTabUeber3; break;

    case 4: htmlTabUeber=htmlTabUeber1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber2+htmlTabUeber2_1+htmlTabUeber3; break;

  };   

  if (!UeberschriftSpalten) {htmlTabUeber=""}

 

 

//--------------------------------------------------------------------------------------------------------------------------------------------------

//---------hier kommt eure schleife rein counter++, tabelleBind() und tabelleFinish() müssen so integriert bleiben !!!------------------------------

//---------alle valx werte müssen von euch bestimmt werden - val0,val1,val2 !!!---------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------------

var myColl=[];

var myObjF=[];

var val1help;

 

  

   if (fritzDect){

 

             counter=-1;

            

              for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

            //  tabelleMachSchoen() 

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">FRITZDECT THERMOSTATE</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

 counter=-1;

  

 

myObjF=[];

  $('fritzdect.*.*.battery').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

     if (!filterArray.includes(id)){

         var ida = id.split('.');

        

         //  counter++; 

             

         //  val0=ida[2]+"."+ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

           json1=val0; 

           json3_1=val1help=parseFloat((getState(id).val)); 

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

            

           

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

            json3=val2;

            json6="AVM"

           if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"fritzk.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           let help=[val0,val1,val2]; myObjF.push(help);

      

    

     // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

     

    }  }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

    sortierMal(myObjF);

     

 } //ende fritzdect

 

    if (homee){

        tabelleMachSchoen()

        counter=-1;

    

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HOMEE DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

  $('homee.0.*.BatteryLevel*').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

     if (!filterArray.includes(id)){

         var ida = id.split('.');

        

        //   counter++; 

             

         //  val0=ida[2]+"."+ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

           json1=val0; 

           json3_1=val1help=parseFloat((getState(id).val));

          //    var val2_1;

         //   if (parseInt((new Date().getTime())) - val2_2help < 120000) {val2_1=true} else {val2_1=false;}

 

         if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

         if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

         //  var val2_2help=Date.parse(getState(id.replace("BatteryStatus","LastUpdate")).val); 

         //  if (val2_1) {val2=adapter.config.symbolOK} else{val2=adapter.config.symbolKO}   

                

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="HOMEE"

           if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"homeek.png"

               makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           let help=[val0,val1,val2]; myObjF.push(help);

      

    

     // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

     

   }  }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

   sortierMal(myObjF);

 } //ende fritzdect

 

    if (netatmo){

              tabelleMachSchoen()

                  counter=-1;

              

              for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">NETATMO DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

 

myObjF=[];

  $('netatmo.*.*.*.BatteryStatus').each(function(id, i) {           // netatmo.0.Hinxxxer.Außenmodul-Carport.BatteryStatus

 

 //  if (!filterArray.includes(id)){

 

       

         var ida = id.split('.');

      

       //    counter++; 

             

         //  val0=ida[2]+"."+ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name ;

                  json1=val0;

           json3_1=val1help=parseFloat((getState(id).val));

           //   var val2_1;

         //   if (parseInt((new Date().getTime())) - val2_2help < 120000) {val2_1=true} else {val2_1=false;}

 

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"}  

          if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

          

         //  var val2_2help=Date.parse(getState(id.replace("BatteryStatus","LastUpdate")).val); 

         //  if (val2_1) {val2=adapter.config.symbolOK} else{val2=adapter.config.symbolKO}   

                 json3=val2;  json6="NETATMO";    

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

 

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"netatmok.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

        let help=[val0,val1,val2]; myObjF.push(help);

    

     // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

     

     }   }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

    sortierMal(myObjF);

 } //ende fritzdect

 

  if (xiaomi){

            tabelleMachSchoen()

            counter=-1

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">XIAOMI DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

$('mihome.*.devices.*.percent').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

       // log (id)

        if (!filterArray.includes(id)){

         var ida = id.split('.');

        

         

        //   counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

         //  val0=ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name ;

          val0=val0.replace(/.battery$/,""); 

       json1=val0;

         // log(val0+"   "+id);

           json3_1=val1help=parseFloat((getState(id).val));

          if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

          if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (val1help>battAlarm && val1help<=battAlarmWarning) {json2=val1help.toString()+" %"}

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}  

           json3=val2; json6="MIHOME/XIAOMI"; //json2="dd"       

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

          

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

          if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"xiaomki.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

              

           let help=[val0,val1,val2]; myObjF.push(help);

           

    

    //  tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

  

  }  }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

    sortierMal(myObjF);

  } //ende xiaomi

 

 if (hue){

              tabelleMachSchoen()

              counter=-1

              for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

              for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HUE DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

    myObjF=[]; 

$('hue.*.*.battery').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

  

   if (!filterArray.includes(id)){

        var ida = id.split('.');

       

        

         // counter++; 

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name ;   val0=val0.replace(/.battery$/,""); val0=val0.replace("Philips_hue.",""); val0=val0.replace(/_/g," ");                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

           json1=val0;

           json3_1=val1help=parseFloat((getState(id).val));

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"}  

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

         

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="HUE"

             if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"huek.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           let help=[val0,val1,val2]; myObjF.push(help);

   

     //tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

 

 } }); sortierMal(myObjF);

 

  }  //ende hue

 if (hueExt){ 

        tabelleMachSchoen()

            counter=-1

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HUE EXTENDED</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

      

 

myObjF=[];

$('hue-extended.*.*.*.config.battery').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

 

 if (!filterArray.includes(id)){

       var ida = id.split('.');

    

       

      //   counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

        

            val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name ;   val0=val0.replace("Philips_hue.",""); val0=val0.replace(/_/g," ");                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

           json1=val0;

           json3_1=val1help=parseFloat((getState(id).val));

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="HUE-Extended"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"huek.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           let help=[val0,val1,val2]; myObjF.push(help);

 

        

   // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

 

  }  }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

  sortierMal(myObjF);

 

   } //ende hue-extended

 

 

 

 if (deconz){ 

 

             tabelleMachSchoen()

             counter=-1

             for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

             for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">DECONZ DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

let mydeconzArr=[];

$('deconz.*.*.*.battery').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

      

       if (!filterArray.includes(id)  ){

       var ida = id.split('.');

      

       

      //   counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

        

        

          val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name ;

         // log(val0+"   "+id);

         if (!mydeconzArr.includes(val0)) {

         mydeconzArr.push(val0);

         json1=val0;

        // val1help=getState(id).val;

         json3_1=val1help=parseFloat((getState(id).val));

         if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

          if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"} 

         if (getState(id).val==null) {val2="never used"}; //log(id)}; 

         if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}  

          json3=val2; json6="DECONZ"; //json2="dd"          

         if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

         

         if (val1help<=battAlarm) AkkuAlarm.push(1);

         if (val1help<=battAlarm)  alarmMessage.push(val0);

         let help=[val0,val1,val2]; myObjF.push(help);

          if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

         json4=pfadBilderMaterialWidget+"deconzk.png"

          makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

         } // doppelter name

 

   // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

 

 } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

 sortierMal(myObjF);

  }

    if (zigbee){ 

 

             tabelleMachSchoen()

             counter=-1

             for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

             for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">ZIGBEE DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

$('zigbee.*.*.battery').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

      

       if (!filterArray.includes(id)){

       var ida = id.split('.');

      

       

      //   counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

        

        

          val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

         // log(val0+"   "+id);

         json1=val0;

         val1help=getState(id).val;

         json3_1=val1help=parseFloat((getState(id).val));

        if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

        if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

         if (getState(id).val==null) {val2="never used"}; //log(id)}; 

         if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

         if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

 

         if (val1help<=battAlarm) AkkuAlarm.push(1);

         if (val1help<=battAlarm)  alarmMessage.push(val0);

          json3=val2;

            json6="ZIGBEE"

           if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"zigbeek.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

         let help=[val0,val1,val2]; myObjF.push(help);

  

   // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

 

 } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

 sortierMal(myObjF);

  }

 

 if (tradfri){ 

 

       tabelleMachSchoen()

              counter=-1

  

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">IKEA TRADFRI</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

$('tradfri.*.*.batteryPercentage').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

      

       if (!filterArray.includes(id)){

       var ida = id.split('.');

      

       

        // counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

        

        

          val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

          json1=val0;

         // log(val0+"   "+id);

       //  val1help=getState(id).val;

         json3_1=val1help=parseFloat((getState(id).val));

         if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

         if (getState(id).val==null) {val2="never used"}; //log(id)}; 

         if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

         if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

 

         if (val1help<=battAlarm) AkkuAlarm.push(1);

         if (val1help<=battAlarm)  alarmMessage.push(val0);

          json3=val2;

            json6="IKEA"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"tradfrik.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

         let help=[val0,val1,val2]; myObjF.push(help);

  

    //tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

 

 } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

 sortierMal(myObjF);

  }

 

  if (tado){

      tabelleMachSchoen()

             counter=-1

  

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">TADO DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

 

 myObjF=[];

$('tado.*.*.*.*.*.*.info.batteryState').each(function(id, i) {          

     var ida = id.split('.');

      if (!filterArray.includes(id)){

      

        val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]+"."+ida[4]).common.name                    

         json1=val0;                                                                             

       

        //log(val0+"   "+id);

       val1help=getState(id).val;

       if (val1help=="LOW") {val1=(" <font color=\"red\"> ")+"low bat"; json2="low";json5="red";json3_1=-1} else{val1=(" <font color=\"lightgreen\"> ")+"full bat";json2="high";json5="green";json3_1=101} 

      

       //if (val1help<=battAlarm) {val2="<font color=\"red\"><b>X</b>"} else{val2=adapter.config.symbolOK}

       if (val1help=="LOW") {val2="<font color=\"red\">"+adapter.config.symbolKO;json3=adapter.config.symbolKO} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolKO}   

       //if (val1help) {val2=<font color=\"red\"><b>X</b>} else{val2="✔"}         

       

       if (val1help=="LOW") AkkuAlarm.push(1);

       if (val1help=="LOW")  alarmMessage.push(val0);

      

            json6="TADO"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"tadok.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

       let help=[val0,val1,val2]; myObjF.push(help);

 

 // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

      } // ende filterArr

}); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!! 

sortierMal(myObjF);

   }  //ende tado

 

 



   } //ende hm

 

 if (homematicIp ){ 

     tabelleMachSchoen()

                counter=-1

    

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HOMEMATIC IP</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

 

 myObjF=[];

$('hm-rpc.*.*.0.LOW_BAT').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

 

  if (!filterArray.includes(id)){

       var ida = id.split('.');

 

       var arrFilt=[];

 

           $(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]+".*").each(function(id, i) {   // kontrolliere ob OPERATING_VOLTAGE vorhanden

               var idc = id.split('.');

            arrFilt.push(idc[4])

            });

       // log(arrFilt.toString());

 

        // counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

 

      if (arrFilt.includes("OPERATING_VOLTAGE")) {

                //  val0=getObject(id).common.name ; 

                  val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ; 

                  var ida = val0.split('.');

                  val0=ida[0].replace(/:.+/g,"");

                  json1=val0;

                  val1help=getState(id).val;

                  var  val1helper=getState(id.replace("LOW_BAT","OPERATING_VOLTAGE")).val;     

                  //bigBatterien 

                  //log (val1helper.toFixed(1))

                  if (val1helper>3.2){

                       if (val1helper<=bigBattAlarm) {val2=adapter.config.symbolKO;json3=adapter.config.symbolKO} else if (val1helper<=bigBattWarn && val1helper>bigBattAlarm) 

                          {val2=adapter.config.symbolWARN;json3=adapter.config.symbolWARN} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolOK};

                       if (val1helper<=bigBattAlarm) {val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"} else if (val1helper<=bigBattWarn && val1helper>bigBattAlarm) 

                          {val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="Yellow";json2=val1helper.toFixed(1)+" V"} else{val1=(" <font color=\"lightgreen\"> ")+(val1helper.toFixed(1))+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"};

                       json3_1=(val1helper-bigBattAlarm)/((5-bigBattAlarm))*100

                       if (val1helper<bigBattAlarm) AkkuAlarm.push(1);

                       if (val1helper<=bigBattAlarm)  alarmMessage.push(val0);

                    }

 

                else {

                      if (val1helper<=1.5){

                         if (val1helper<1.1) {val2=adapter.config.symbolKO;json3=adapter.config.symbolKO} else if (val1helper<=1.2 && val1helper>=1.1) 

                         {val2=adapter.config.symbolWARN;json3=adapter.config.symbolWARN} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolOK};

                         if (val1helper<1.1) {val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"} else if (val1helper<=1.2 && val1helper>=1.1) 

                            {val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="yellow";json2=val1helper.toFixed(1)+" V"} else{val1=(" <font color=\"lightgreen\"> ")+val1helper.toFixed(1)+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"};

                         json3_1=(val1helper-1.1)/((1.5-1.1))*100

                         if (val1helper<1.1) AkkuAlarm.push(1);

                         if (val1helper<1.1)  alarmMessage.push(val0)

 

                      } else {        

                         if (val1helper<2.2) {val2=adapter.config.symbolKO;json3=adapter.config.symbolKO} else if (val1helper<=2.5 && val1helper>=2.2) 

                         {val2=adapter.config.symbolWARN;json3=adapter.config.symbolWARN} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolOK};

                         if (val1helper<2.2) {val1=(" <font color=\"red\"> ")+val1helper.toFixed(1)+" V";json5="red";json2=val1helper.toFixed(1)+" V"} else if (val1helper<=2.5 && val1helper>=2.2) 

                            {val1=(" <font color=\"yellow\"> ")+val1helper.toFixed(1)+" V";json5="yellow";json2=val1helper.toFixed(1)+" V"} else{val1=(" <font color=\"lightgreen\"> ")+val1helper.toFixed(1)+" V";json5="lightgreen";json2=val1helper.toFixed(1)+" V"};

                         json3_1=(val1helper-2.2)/((3-2.2))*100

                         if (val1helper<2.2) AkkuAlarm.push(1);

                         if (val1helper<2.2)  alarmMessage.push(val0);}}

 

        } else {

                                                     

                 val0=getObject(id).common.name ; 

               var ida = val0.split('.');

               val0=ida[0].replace(/:.+/g,"");

               json1=val0;

               val1help=getState(id).val;

               if (val1help) {val1=(" <font color=\"red\"> ")+"low bat"; json2="low";json5="red";json3_1=0} else{val1=(" <font color=\"lightgreen\"> ")+"full bat";json2="high";json5="green";json3_1=100} 

               if (val1help) {val2=adapter.config.symbolKO;json3=adapter.config.symbolKO} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolKO}         

               if (val1help) AkkuAlarm.push(1);

               if (val1help)  alarmMessage.push(val0);

 

        }

            json3=val2;

            json6="HOMEMATIC-IP"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"homematick.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

        let help=[val0,val1,val2]; myObjF.push(help);

 

   // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

   

 } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

 

 

        $('hmip.*.*.0.lowBat').each(function(id, i) {  

             // val0=getObject(id).common.name ; 

               var ida = id.split('.');

               val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]+"."+ida[3]).common.name 

               json1=val0;

               val1help=getState(id).val;

               if (val1help=="true") {val1=(" <font color=\"red\"> ")+"low bat"; json2="low";json5="red";json3_1=0} else{val1=(" <font color=\"lightgreen\"> ")+"full bat";json2="high";json5="green";json3_1=100} 

               if (val1help=="true") {val2=adapter.config.symbolKO;json3=adapter.config.symbolKO} else{val2=adapter.config.symbolOK;json3=adapter.config.symbolKO}         

               if (val1help=="true") AkkuAlarm.push(1);

               if (val1help=="true")  alarmMessage.push(val0);

 

        

            json3=val2;

            json6="HOMEMATIC-IP"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"homematick.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

        let help=[val0,val1,val2]; myObjF.push(help);

});

 

 sortierMal(myObjF);

    

  }  //ende hm-ip

 

      if (zwave){

          tabelleMachSchoen()

                  counter=-1

    

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">ZWAVE DEVICES</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

   

   myObjF=[];

  $('zwave.*.*.BATTERY.Battery_Level*').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

     if (!filterArray.includes(id)){

         var ida = id.split('.');

        

         //  counter++; 

             

         //  val0=ida[2]+"."+ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

           json1=val0;

           json3_1=val1help=parseFloat((getState(id).val));

          //    var val2_1;

         //   if (parseInt((new Date().getTime())) - val2_2help < 120000) {val2_1=true} else {val2_1=false;}

 

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

         //  var val2_2help=Date.parse(getState(id.replace("BatteryStatus","LastUpdate")).val); 

         //  if (val2_1) {val2=adapter.config.symbolOK} else{val2=adapter.config.symbolKO}   

                

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="ZWAVE"

          if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"zwavek.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

          

           let help=[val0,val1,val2]; myObjF.push(help);

      

    

     // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

     

   } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

   sortierMal(myObjF);

 } //ende fritzdect

 

  if (fullyBrowser){

      tabelleMachSchoen()

              counter=-1

    

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

             

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">FULLYBROWSER</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

 

myObjF=[];

$('fullybrowser.*.*.Info.batteryLevel').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

 if (!filterArray.includes(id)){

         var ida = id.split('.');

        

         

        //   counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

 

           val0=getState(id.replace("batteryLevel","deviceName")).val;

           json1=val0;

           json3_1=val1help=parseFloat((getState(id).val));

           if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"}  

           if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

          

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="FULLY BROWSER"

           if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"fullyk.png"

              makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           let help=[val0,val1,val2]; myObjF.push(help);

    

     // tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

  

  }  }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

  sortierMal(myObjF);

  

  } //ende fullybrowser

 

 

  if (iogo){

            tabelleMachSchoen()

              counter=-1

    

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

               

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">>HANDY über IOGO</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

 

myObjF=[];

$('iogo.*.*.battery.level').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

 if (!filterArray.includes(id)){

         var ida = id.split('.');

        

         

         //  counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

        //   val0=ida[3];

           val0=getObject(ida[0]+"."+ida[1]+"."+ida[2]).common.name ;

           json1=val0;

         // log(val0+"   "+id);

           json3_1=val1help=parseFloat((getState(id).val));

          if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"}  

            if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

           if (getState(id).val==null) {val2="never used"}; //log(id)}; 

           if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

           if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

          

           if (val1help<=battAlarm) AkkuAlarm.push(1);

           if (val1help<=battAlarm)  alarmMessage.push(val0);

           json3=val2;

            json6="IOGO"

             if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"iogok.png"

             makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

           

           let help=[val0,val1,val2]; myObjF.push(help);

    

    //  tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

  

 } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!

 sortierMal(myObjF);

  

  } //ende iogo

 

 

   if (handy1){  

       tabelleMachSchoen()

                 counter=-1

   

              // 

                for(var i=0;i<mehrfachTabelle;i++ ) {

                val0=""; val1=""; val2="";counter++;tabelleBind();

              }

                tabelleMachSchoen()

               for(var i=0;i<mehrfachTabelle;i++ ) {

                  if(i==0){val0="<font color=\""+htmlColorDeviceUeberschrift+"\"><"+HTMLbrandSetting+">HANDYs</b>";} else{val0=""; }

                   val1=""; val2="";counter++;tabelleBind();

              } 

     

        myObjF=[];

        $('controll-own.0.HANDY.*batt*').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

         if (!filterArray.includes(id)){

       var ida = id.split('.');

       

        // counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

         val0=ida[3];

         json1=val0;

        // log(val0+"   "+id);

         json3_1=val1help=parseFloat((getState(id).val));

        if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

        if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

         if (getState(id).val==null) {val2="never used"}; //log(id)}; 

         if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

         if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

 

         if (val1help<=battAlarm) AkkuAlarm.push(1);

         if (val1help<=battAlarm)  alarmMessage.push(val0);

         json3=val2;

            json6="HANDYs"

            if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"handyk.png"

             makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

         

         let help=[val0,val1,val2]; myObjF.push(help);

    

  

  //  tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

        

         } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

         sortierMal(myObjF);

 

   } //ende handy1

 

 

 

   if (handy2){ 

       myObjF=[];

            $('controll-own.0.HANDY.*Batt*').each(function(id, i) {           // hier eigene schleife definieren und den wert counter++ nicht vergessen  !!!

             if (!filterArray.includes(id)){

       var ida = id.split('.');

       

        // counter++;                                       // SEHR WICHTIG - MUSS IN JEDER SCHLEIFE INTEGRIERT SEIN

         val0=ida[3];

         json1=val0;

        // log(val0+"   "+id);

         json3_1=val1help=parseFloat((getState(id).val));

          if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="yellow"}

       if (val1help<=battAlarm) {val1=(" <font color=\"red\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %";json5="red"} else{val1=(" <font color=\"lightgreen\"> ")+val1help.toString()+" %";json2=val1help.toString()+" %",json5="green"} 

         if (val1help>battAlarm && val1help<=battAlarmWarning) {val1=(" <font color=\"yellow\"> ")+val1help.toString()}

         if (getState(id).val==null) {val2="never used"}; //log(id)}; 

         if (val1help<=battAlarm) {val2=adapter.config.symbolKO} else{val2=adapter.config.symbolOK}         

         if (val1help>battAlarm && val1help<=battAlarmWarning) val2=adapter.config.symbolWARN;

         json3=val2;

            json6="HANDYs"

             if (braucheMaterialDesignWidget || braucheMaterialDesignWidgetTable) {

              json4=json4=pfadBilderMaterialWidget+"handyk.png"

             makeJsonWidget(json1,json2,json3,json4,json5,json6,json3_1);}

         let help=[val0,val1,val2]; myObjF.push(help);

        

 

  

    //tabelleBind(); //HIER NICHTS ÄNDERN : HIER WERDEN DIE DATEN DER SCHLEIFE ZUSAMMENGESETZT  - diese function muss als letztes in der eigenen schleife aufgerufen werden

   

             } }); //Schleifen Ende - je nach schleifenart muss hier etwas geändert werden !!!!!!!!!  

             sortierMal(myObjF);

   } //ende handy2

//-------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------Ende der schleife------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------

 

     
}); 

writeHTML();  

if (braucheEinFile) {writeFile(home, path ,htmlOut, function (error) { /* log('file written');  });}                                 //     <tdalign style=\" border-right: "+trennungsLinie+"px solid "+farbetrennungsLinie+



*/