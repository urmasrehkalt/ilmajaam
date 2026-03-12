# Ilmajaam

Lihtne eestikeelne ilmaennustuse veebirakendus.

Rakendus kuvab:
- praeguse ilma (temperatuur, tajutav temperatuur, ilm, tuul, õhuniiskus)
- 3 päeva prognoosi

Andmed tulevad `Open-Meteo` API-st.

Kui brauseri geolokatsioon ei tööta, kasutatakse automaatselt fallback asukohta: **Tallinn, Eesti**.

## Tehnoloogia

- HTML
- CSS
- Vanilla JavaScript

## Lokaalne käivitamine

```bash
python3 -m http.server 8030
```

Ava brauseris:

`http://localhost:8030`

## Projektifailid

- `index.html` - rakenduse struktuur
- `styles.css` - stiilid
- `app.js` - ilmaandmete päring ja UI loogika
- `deploy/` - serveri deploy juhendid ja konfiguratsioon

## Deploy (VPS)

Selles repos on deploy failid:

- `deploy/README.md`
- `deploy/nginx-ilm.fsa.ee.conf`

Kui kasutad Caddyt, piisab staatiliste failide serveerimisest kaustast `/var/www/ilm.fsa.ee`.

## Domeen

Tootmises on kasutusel:

`https://ilm.fsa.ee`
