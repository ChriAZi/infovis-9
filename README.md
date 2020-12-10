# infoVis_9
Das Projekt der Gruppe 9 in der Vorlesung "Informationsvisualisierung" and der Ludwig Maximilians Universtität München.

Die Koordination des Projektes findet sich unter: https://www.notion.so/WS2020-IV-Gruppe-9-573af56127fe49eea1a96e360f50bf54

Das Projekt hat zum Ziel das zeitliche Entwicklungsgeschehen des Corona-Viruses in Deutschland und seinen Landkreisen an mehreren Kennzahlen zu veranschlauchen. Dies umfasst die neuen Infektionen und Todesfälle sowie die gesammten Infektionen und Todesfälle und die 7-Tage-Inzidenz.
Zusätzlich soll die Visualisierung einen Bezug zur Intensivbettauslastung herstellen und den Einfluss der Bevölkerungsdichte auf das Infektionsgeschehen veranschaulichen. 


Die bisherigen Features des Projektes:

Allgemein: 
- Layout für die Visualisierung steht
- ein statischer Datensatz mit den zu verwendeten Daten ist angelegt

Kartenansicht:
- Geodaten werden als Landkreise aufbereitet
- Landkreise werden bei einem Mouseover-Event hervorgehoben

Schichtdiagramm:
- das Schichtdiagramm zeigt die Anzahl der freien und belegten Betten, sowie die Bereitstellung von Reservebetten in Deutschland an

Scatterplot:
- Der Scatterplot zeigt bis jetzt die Anzahl der Neuinfektionen in Abhängigkeit der Bevölkerungsanzahl der einzenen Landkreise an


Folgende Features sollen noch umgesetzt werden: 

Allgemein:
- Auswahl der relevatenten Kenndaten über Buttons
- Auswahl der Landkreise über die Karte und Anpassung des Schichtdiagrammes
- Auswahl der relevanten Zeiten mithilfe einer Zeitachse mit Schieberegeler, die dynamisch beschriftet wird
- Legende mit Farben/Kennzahl Erklärung

Kartenansicht:
- Landkreisfare ändert sich in Abhängigkeit von der ausgewählten Kennzahl
- Landkreis kann ausgewählt werden

Schichtdiagramm und Liniendiagramm:
- Hinzufügen eines Liniendiagramms, welches den Verlauf der gewälten Kennzahl anzeigt
- Aktueller Zeitpunkt wird durch vertikale Linie hervorgehoben
- Auswahl zwischen Landkreisen und ganz Deutschland

Scatterplot:
- Bevölkerungsdichte statt Einwohnerzahl auf x-Achse
- Kennzahl auf y-Achse veränderbar
- evtl. Seletkrion von Landkreisen möglich -> Hervorhebung
