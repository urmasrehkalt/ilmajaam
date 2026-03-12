# VPS deploy (Ubuntu + Nginx + Let's Encrypt)

Allolev juhend eeldab:
- VPS on Ubuntu (22.04/24.04)
- DNS `A` kirje `ilm.fsa.ee` osutab VPS IP-le
- tulemüüris on avatud pordid `80` ja `443`

## 1) Paigalda Nginx ja Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

## 2) Loo veebikaust ja kopeeri failid

```bash
sudo mkdir -p /var/www/ilm.fsa.ee
sudo chown -R $USER:$USER /var/www/ilm.fsa.ee
```

Kopeeri sinna vähemalt need failid:
- `index.html`
- `styles.css`
- `app.js`

Näide, kui oled projekti kaustas VPS-is:

```bash
cp index.html styles.css app.js /var/www/ilm.fsa.ee/
```

## 3) Aktiveeri Nginx virtuaalhost

Kopeeri conf fail:

```bash
sudo cp deploy/nginx-ilm.fsa.ee.conf /etc/nginx/sites-available/ilm.fsa.ee
sudo ln -s /etc/nginx/sites-available/ilm.fsa.ee /etc/nginx/sites-enabled/ilm.fsa.ee
sudo rm -f /etc/nginx/sites-enabled/default
```

Kontroll + reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4) Lisa HTTPS sertifikaat

```bash
sudo certbot --nginx -d ilm.fsa.ee
```

Vali:
- redirect HTTP -> HTTPS: `Yes`
- email + Terms: `Yes`

## 5) Kontroll

Ava brauseris:
- `https://ilm.fsa.ee`

## Uuendamine hiljem

Kui muudad frontendi faile, kopeeri need uuesti:

```bash
cp index.html styles.css app.js /var/www/ilm.fsa.ee/
sudo systemctl reload nginx
```
