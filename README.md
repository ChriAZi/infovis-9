# Projekt der Gruppe 9 in der Vorlesung Informationsvisualisierung
WS20/21 - Ludwig-Maximilians-Universität München.
Gruppenmitglieder: Amina Dacikj, Maike Friedrich, David Spormann, Christopher Voit, Elena Wallwitz

Die Koordination des Projektes findet sich unter: [Notion](https://www.notion.so/WS2020-IV-Gruppe-9-573af56127fe49eea1a96e360f50bf54)

Das Projekt hat zum Ziel das zeitliche Entwicklungsgeschehen des Corona-Virus in Deutschland und seinen Landkreisen an mehreren Kennzahlen zu veranschaulichen. Dies umfasst die neuen Infektionen und Todesfälle sowie die gesamten Infektionen und Todesfälle und die 7-Tage-Inzidenz.
Zusätzlich soll die Visualisierung einen Bezug zur Intensivbettauslastung herstellen und den Einfluss der Bevölkerungsdichte auf das Infektionsgeschehen veranschaulichen. 

## Feature List des Minimum Viable Products(MVP):

### Datensatz: 

  *	ein statischer Datensatz wird mit build_data.py als Nested Maps in data.json und counties.json angelegt. Dieser sollte vor Verwendung täglich lokal aktualisiert werden. 
  *	Der Aufbau des Datensatzes findet sich unter Notion Dokumentation/Code/Datensatz Spec

### Kartenansicht:

  *	Geodaten werden als Landkreise angezeigt
  *	Der Wert der Kennzahl der einzelnen Landkreise wird aus dem statischen Datensatz ausgelesen und der Wert der Farbe wird dynamisch berechnet
  *	Bei anderer Parameterauswahl wird die Farbe aller Landkreise entsprechend der neuen Kennzahl berechnet
  *	die Landkreise sind mit einem mouseover-event markierbar
  *	die Visualisierung kann die Daten tagesgenau darstellen
  *	TODO unterschiedlich Farben für Kennzahlen und Farbverlauf?

### Schichtdiagramm:

  * das Schichtdiagramm zeigt die Anzahl der freien und belegten Betten, sowie die Bereitstellung von Reservebetten in Deutschland an
     * die blaue Fläche entspricht der Menge der belegten Betten, 
     *	die grüne Fläche der Anzahl der freien Betten
     *	die violette Fläche den zur Verfügung stehenden Reservebetten
  *	die ausgewählte Zeit wird als Senkrechte mit Datum dargestellt
  *	TODO Liniendiagramms, welches den Verlauf der gewählten Kennzahl anzeigt

### Scatterplot:

  *	Der Scatterplot zeigt bis jetzt die Anzahl der Neuinfektionen in Abhängigkeit der Bevölkerungsanzahl der einzelnen Landkreise an

### Interaktionen: 

  *	Zeitlich Interaktion: 
      *	Bei Auswahl eines neuen Datums:
          *	Aktualisierung der Karte
          *	Verschiebung der zeitanzeigenden Senkrechten im Schichtdiagramm
      *	Möglichkeiten der Interaktionen mit der Timeline:
          *	Auswahl des Datums über den Slider
          *	Play/Stop-Button: Datum wird automatisch fortlaufend angezeigt
          *	Schneller/Langsamer-Button: Fortschreiten des Datums wird schneller oder langsamer
          *	Vor/zurück-Button: ein Datum zurück oder vorspringen, lange halten bewirkt Sprung zum Ende/Anfang
  *	Kennzahlinteraktion:
      *	Kennzahlen können über die Buttons in der Parameterauswahl selektiert werden
      *	Bei Auswahl neuer Kennzahl:
          *	Kartendiagramm zeigt Farben in Abhängigkeit der neuen Kennzahl
          *	TODO Liniendiagramm im Schichtdiagramm zeigt Verlauf der ausgewählten Kennzahl an

### Layout: 

 * Layout für die Parameterauswahl, die drei Visualisierungen und die Timeline steht


## Folgende Features sollen noch umgesetzt werden: 

### Layout und Interaktion:
  * Legende mit Farben/Kennzahl Erklärung
  * Auswahl der Landkreise über die Karte und evtl. Anpassung des Schichtdiagrammes
  * Anzeige des Namens und der Daten des ausgewählten Landkreises links von dem Kartendiagramm

### Kartenansicht:
  * Daten des Landkreises über dem sich die Maus befindet, sollen über dem Mauszeiger erscheinen

### Schichtdiagramm und Liniendiagramm:
  * evtl. Auswahl zwischen Landkreisen und ganz Deutschland

### Scatterplot:
  * Bevölkerungsdichte statt Einwohnerzahl auf x-Achse
  * Kennzahl auf y-Achse veränderbar
  * evtl. Selektion von Landkreisen möglich -> Hervorhebung
