1. npm installieren. Unter Windows einfach die MSI-Datei ausführen. 
   Steht alles auf der Website: https://www.npmjs.com/package/npm
2. Repro clonen. Kann man auch davor machen.
3. Kommandozeile/Terminal öffnen und folgendes eingeben: 'npm install http-server -g'
   Damit installiert ihr einen lokalen Webserver, der zum ausführen des Spiels benötigt wird.
   Sollte der Befehl npm nicht erkannt werden, liegts wahrscheinlich an der PATH-Variable.
   Da müsst ihr dann manuell den Pfad zu npm einfügen. Google --> npm path windows --> erstes Ergebnis
4. Per Kommandozeile/Terminal in das lokale Repro navigieren (in den Ordner wo die index.html liegt)
   Dann per 'http-server' den Webserver starten. Der übernimmt dann gleich alle Dateien und Ordner im aktuellen
   Verzeichnis auf. Die IP ist zwar 0.0.0.0:8080 aber am Besten ihr ruft im Browser 127.0.0.1:8080 auf.
5. Jetzt sollte das Spiel starten. Den Sourcecode könnt ihr live editieren. 
   Wenn ihr ihn abspeichert wird er direkt auf den Server geladen und ihr müsst nur die Website aktualisieren.
