# Projekt der Gruppe 9 in der Vorlesung Informationsvisualisierung

Live auf https://chriazi.github.io/infoVis9/

WS20/21 - Ludwig-Maximilians-Universität München.
Gruppenmitglieder: Amina Dacikj, Maike Friedrich, David Spormann, Christopher Voit, Elena Wallwitz

Die Koordination des Projektes findet sich unter: [Notion](https://www.notion.so/WS2020-IV-Gruppe-9-573af56127fe49eea1a96e360f50bf54)

Das Projekt hat zum Ziel das zeitliche Entwicklungsgeschehen des Corona-Virus in Deutschland und seinen Landkreisen an mehreren Kennzahlen zu veranschaulichen. Dies umfasst die neuen Infektionen und Todesfälle sowie die gesamten Infektionen und Todesfälle und die 7-Tage-Inzidenz.
Zusätzlich soll die Visualisierung einen Bezug zur Intensivbettauslastung herstellen und den Einfluss der Bevölkerungsdichte auf das Infektionsgeschehen veranschaulichen. 

## Final Feature List:

### Datensatz: 

  *	ein statischer Datensatz wird mit build_data.py als Nested Maps in data.json und counties.json angelegt. Dieser sollte vor Verwendung täglich lokal aktualisiert werden. 
  *	Der Aufbau des Datensatzes findet sich in [Notion](https://www.notion.so/Datensatz-Spec-f26643879ff14ed98793cc5ac79c40f7)

### Kartenansicht:

  *	Geodaten werden als Landkreise angezeigt
  *	Der Wert der Kennzahl der einzelnen Landkreise wird aus dem statischen Datensatz ausgelesen und der Wert der Farbe wird dynamisch berechnet
  *	Bei anderer Parameterauswahl wird die Farbe aller Landkreise entsprechend der neuen Kennzahl berechnet
  *	die Landkreise sind mit einem click-event markierbar
  *	die Visualisierung kann die Daten tagesgenau darstellen
  *	unterschiedliche Farben für Kennzahlen und Farbverlauf?
  * Daten des Landkreises über dem sich die Maus befindet, sollen über dem Mauszeiger erscheinen
  
### Schichtdiagramm und Liniendiagramm:

  * das Schichtdiagramm zeigt die Anzahl der freien und belegten Betten, sowie die Bereitstellung von Reservebetten in Deutschland an
     * die orange Fläche entspricht der Menge der belegten Betten, 
     *	die weiße Fläche der Anzahl der freien Betten
     *	die hellgrüne Fläche den zur Verfügung stehenden Reservebetten
  *	die ausgewählte Zeit wird als Senkrechte mit Datum dargestellt
  * Auswahl zwischen Landkreisen und ganz Deutschland
  * Liniendiagramms, welches den Verlauf der gewählten Kennzahl für den ausgewählten Landkreis anzeigt
  
### Scatterplot:

  *	Der Scatterplot zeigt die Anzahl der Neuinfektionen in Abhängigkeit der Bevölkerungsdichte der einzelnen Landkreise an
  * Die Landkreise werden entsprechend der Kennzahl eingefärbt (siehe Kartendiagramm)
  * Zoomfunktion
  
### Interaktionen: 

  *	Zeitliche Interaktion: 
      *	Bei Auswahl eines neuen Datums:
          *	Aktualisierung der Karte
          *	Verschiebung der zeitanzeigenden Senkrechten im Schichtdiagramm
          *	Aktualisierung der Kennzahlen
      *	Möglichkeiten der Interaktionen mit der Timeline:
          *	Auswahl des Datums über den Slider
          *	Play/Stop-Button: Datum wird automatisch fortlaufend angezeigt
          *	Schneller/Langsamer-Button: Fortschreiten des Datums wird schneller oder langsamer
          *	Vor/zurück-Button: ein Datum zurück oder vorspringen, lange halten bewirkt Sprung zum Ende/Anfang
  *	Kennzahlinteraktion:
      *	Kennzahlen können über die Buttons in der Parameterauswahl selektiert werden
      *	Bei Auswahl neuer Kennzahl:
          *	Kartendiagramm zeigt Farben in Abhängigkeit der neuen Kennzahl
  * Karteninteraktion:
      * Auswahl der Landkreise über die Karte
      * Anzeige des Namens und der Daten des ausgewählten Landkreises links von dem Kartendiagramm

### Layout:

 * Layout für die Parameterauswahl, die drei Visualisierungen und die Timeline steht
 * Layout ist responsive für Bildschirme zwischen 1440px | 900px und 1280px | 800px
 * Legende mit Farben/Kennzahl Erklärung
