# Ember & Olive

A fictional Mediterranean restaurant in Stockholm, and the second portfolio concept for Albatros Coding. The page is a static site: semantic HTML, CSS, and vanilla JavaScript. There is no framework, build step, backend, payment, or ordering system.

Prices are in SEK. The copy is in English. The address, phone number, and email are examples for this demo. They are not a real venue.

## View the page

Open `index.html` in a browser, or from this folder run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## What the page does

- Category tabs switch the menu without a reload. If JavaScript does not run, every category stays on the page and the category links jump to it.
- Each signature dish can open a dialog with the description, ingredients, and example allergen information. If JavaScript does not run, the same details open in place.
- Gallery photographs can open larger. If JavaScript does not run, the link opens the image file.
- The reservation form asks for name, email, date, time, and guest count. It rejects past dates, Mondays (the dining room is closed), and dates more than 60 days ahead. Time choices are sample seating times that follow the published hours.
- Submitting the form states that no reservation was made. The script does not send, store, or log what was typed. The fields have no `name` attributes, so a browser will not put them in a request. The confirmation stays on the page until it is cleared.

## Images

Photographs are saved in `assets/images/`. They are used to suggest the food and the room. They are not pictures of this fictional restaurant. Licenses and sources:

| File | Subject | Author | License | Source |
| --- | --- | --- | --- | --- |
| `hero.jpg` | Lamb chops on a charcoal grill | domdomegg | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lamb_chops_on_the_barbecue_06.jpg) |
| `dish-fish.jpg` | Two grilled whole fish | pompi | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Plated_grilled_fish.jpg) |
| `dish-prawns.jpg` | Prawns on a grill | Gordon Leggett | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2026-05-24_01_Grilled_Spot_prawns_(Pandalus_platyceros)_-_Victoria_BC_CAN.jpg) |
| `dish-mezze.jpg` | Mixed mezze plate | Dr. Bernd Gross | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Karisik_Meze_Tabagi_-_Vorspeisen.JPG) |
| `story-room.jpg` | Taverna dining room | JIP | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Interior_of_restaurant_Zorbas.jpg) |
| `gallery-salad.jpg` | Greek salad | Armineaghayan | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Greek_Salad_from_Thessaloniki.jpg) |
| `gallery-octopus.jpg` | Grilled octopus | Gatorfan252525 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Greek-style_grilled_octopus_with_olive_oil,_lemon,_butter_and_parsley.jpg) |
| `gallery-mezze.jpg` | Greek mezze plate | JIP | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pikilia_Orektikon_at_Taverna_Zorbas.jpg) |
| `gallery-cake.jpg` | Lemon olive oil cake | stu_spivack | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lemon_olive_oil_cake_-_3300260329.jpg) |
| `gallery-baklava.jpg` | Baklava | Kultigin | Public domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Baklava_-_Turkish_special,_80-ply.JPEG) |

The files in this project are the Wikimedia images, saved locally and not further edited. The same credits are in the page footer.

Outfit and Fraunces are loaded from Google Fonts. If that request fails, the page uses Palatino, Georgia, and Segoe UI.
