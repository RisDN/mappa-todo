// Készítette: Rostás András Péter - Ris

// Alap elemek definiálása
const ures_beiras = document.getElementById('ures_beiras');
const ures_jegyzetek = document.getElementById('ures_jegyzetek');
const szoveg_doboz = document.getElementById('beiras-jegyzet');
const teljes_ures = document.getElementById('teljesen_ures');
const lista = document.getElementById('lista');
const info = document.getElementById('info');



function teljesen_ures() {
    if (localStorage.getItem('mappák') == '[]') {
        teljes_ures.style.display = 'block';
        localStorage.removeItem('mappák')
        localStorage.removeItem('jegyzetek')
    } else {
        teljes_ures.style.display = 'none';
    }
    if (localStorage.getItem('mappák') == null) {
        teljes_ures.style.display = 'block';
    } else {
        teljes_ures.style.display = 'none';
    }
}




// Jegyzet hozzá adás függvény 
function hozzadasGomb() {
    const beirt_szoveg = szoveg_doboz.value;
    const mappak_kijeloles = document.getElementsByClassName('mappa_pipa');
    for (var i = 0; i < mappak_kijeloles.length; i++) {
        var bevanepipalva_ = mappak_kijeloles[i].checked;
        if (bevanepipalva_) {
            szoveg_doboz.value = '';
            if (beirt_szoveg != '') {
                hozzadas(beirt_szoveg)
            } else {
                uresbeiras()
            }
            break
        }
    }
}

// Mappa létrehozása
function mappa_letrehozas() {
    let listak = document.getElementById('mappak_lista');
    let listak2 = document.getElementById('mappak_lista_kivalaszt');
    let szoveg_doboz_mappa = document.getElementById('beiras-mappa');
    let uj_mappa = document.createElement('div');
    let doboz_lent = document.getElementById('mappaklistaja');
    megadott_mappa_neve = szoveg_doboz_mappa.value;
    if (szoveg_doboz_mappa.value != '') {
        uj_mappa.setAttribute('class', 'mappak');
        uj_mappa.setAttribute('id', megadott_mappa_neve)
        uj_mappa.innerHTML +=
            `<span onclick="mappa_torlese('${megadott_mappa_neve}')" class="bezaras_x">&times;</span>` +
            `<h3>${megadott_mappa_neve}</h3>` +
            `<ul class="lista" id="mappaneve_${megadott_mappa_neve}_pipa"></ul>`;
        doboz_lent.appendChild(uj_mappa);

        uj_mappa_neve = document.createElement('li');
        uj_mappa_neve.innerHTML = `${megadott_mappa_neve}`;
        uj_mappa_neve.setAttribute('id', `mappak_lista_${megadott_mappa_neve}`)
        listak.appendChild(uj_mappa_neve);

        listak2.innerHTML += (`<input class="mappa_pipa" type="checkbox" id="${megadott_mappa_neve}_pipa"> ${megadott_mappa_neve}<br>`);
        szoveg_doboz_mappa.value = '';
        mappa_adatbázis_frissítés();
    }
    teljesen_ures();
}

// <li> (lista) elem hozzáadása a szövegdoboz tartalmával
function hozzadas(megadott_jegyzet) {
    const mappak_kijeloles = document.getElementsByClassName('mappa_pipa');
    for (var i = 0; i < mappak_kijeloles.length; i++) {
        const uj_jegyzet = document.createElement('li');
        uj_jegyzet.appendChild(document.createTextNode(megadott_jegyzet));
        uj_jegyzet.setAttribute('class', 'nincsenkeszen')
        uj_jegyzet.setAttribute('id', 'egyjegyzet')
        if (mappak_kijeloles[i].type == "checkbox") {
            var bevanepipalva = mappak_kijeloles[i].checked;
            if (bevanepipalva) {
                console.log("mappaneve_" + mappak_kijeloles[i].id)
                var ebbeRakjaBele = document.getElementById("mappaneve_" + mappak_kijeloles[i].id);
                console.log(ebbeRakjaBele)
                uj_jegyzet.addEventListener("click", () => {
                    let megvane = uj_jegyzet.className;
                    if (megvane == 'nincsenkeszen') {
                        uj_jegyzet.className = 'keszenvan';
                    } else {
                        uj_jegyzet.className = 'nincsenkeszen';
                    }
                    adatbázis_frissítés();
                });
                uj_jegyzet.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    torles(uj_jegyzet)
                }, );
                for (var a = 0; a < mappak_kijeloles.length; a++) {
                    ebbeRakjaBele.appendChild(uj_jegyzet)
                }
            }
        }
    }

    adatbázis_frissítés();
}




// Jegyzet hozzá adás függvény meghívása Enter lenyomására.
szoveg_doboz.addEventListener("keydown", function(e) {
    if (e.code === "Enter") {
        hozzadasGomb()
    }
});


// A szöveg doboz üres hozzáadáskor
function uresbeiras() {
    ures_beiras.style.display = 'block';
    ures_beiras.innerHTML = 'Adj meg valami szöveget!';
    setInterval(function() {
            ures_beiras.style.display = 'none';
        },
        3500)
}


// a kattintott <li> (lista) elem törlése a jegyzetekből
function torles(torlendo_lista_elem) {
    const folista = torlendo_lista_elem.parentElement;
    localStorage.removeItem(torlendo_lista_elem.innerText)
    folista.removeChild(torlendo_lista_elem)
    adatbázis_frissítés();
    teljesen_ures();
}

// Betöltéskor elmentett jegyzetek betöltése
function mentett_jegyzetek_megjelenitese() {
    const mentett_jegyzetek = JSON.parse(localStorage.getItem("jegyzetek"));
    console.log(mentett_jegyzetek)
    if (mentett_jegyzetek) {
        mentett_jegyzetek.forEach((mentett_jegyzetek) => {
            betoltes_jegyzetek(mentett_jegyzetek.szoveg, mentett_jegyzetek.keszenvan, mentett_jegyzetek.mappa);
        });
    }
}

// Mentett jegyzetek szortítozása a megfelelő mappába
function betoltes_jegyzetek(mentett_szoveg, keszenvane, mappa_neve) {
    console.log(keszenvane)
    const ebbe_kerul_bele = document.getElementById(mappa_neve)
    const uj_jegyzet = document.createElement('li');
    uj_jegyzet.appendChild(document.createTextNode(mentett_szoveg));
    if (keszenvane == true) {
        uj_jegyzet.setAttribute('class', 'keszenvan')
    } else {
        uj_jegyzet.setAttribute('class', 'nincsenkeszen')
    }
    uj_jegyzet.setAttribute('id', 'egyjegyzet')
    ebbe_kerul_bele.appendChild(uj_jegyzet)
    uj_jegyzet.addEventListener("click", () => {
        let megvane = uj_jegyzet.className;
        if (megvane == 'nincsenkeszen') {
            uj_jegyzet.className = 'keszenvan';
        } else {
            uj_jegyzet.className = 'nincsenkeszen';
        }
        adatbázis_frissítés();
    });
    uj_jegyzet.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        torles(uj_jegyzet)
    }, );
}


// Local storage frissítése mappák
function mappa_adatbázis_frissítés() {
    const mappakEl = document.querySelectorAll('.mappak');
    console.log(mappakEl)
    const osszes_mappa = [];
    mappakEl.forEach((mappakEl) => {
        osszes_mappa.push({
            mappaneve: mappakEl.id,
        });
    });
    localStorage.setItem("mappák", JSON.stringify(osszes_mappa));
}


// Mentett mappák betöltése
function mentett_mappak_megjelenitese() {
    const mentett_mappák = JSON.parse(localStorage.getItem("mappák"));
    if (mentett_mappák) {
        mentett_mappák.forEach((mentett_mappák) => {
            mentett_mappa_letrehozas(mentett_mappák.mappaneve);
        });
    }
}

// Mappa törlés, és az abban lévő jegyzetek
function mappa_torlese(melyikmappa) {
    const listaszoveg = document.getElementById(`mappak_lista_${melyikmappa}`);
    listaszovegParent = listaszoveg.parentElement;
    listaszovegParent.removeChild(listaszoveg)

    const listaszovegPipa = document.getElementById(`${melyikmappa}_pipa`);
    listaszovegPipaParent = listaszovegPipa.parentElement;
    listaszovegPipaParent.removeChild(listaszovegPipa)

    const mappadivje = document.getElementById(melyikmappa);
    const mappadivje_parent = mappadivje.parentElement;
    const mappa_listak = document.getElementById(`mappaneve_${melyikmappa}_pipa`)
    $(mappa_listak).empty()
    mappadivje_parent.removeChild(mappadivje)
    mappa_adatbázis_frissítés();
    adatbázis_frissítés();
    teljesen_ures();
}

// Teszt számláló
function mennyivan(m) {
    const mennyiazazannyi = document.querySelectorAll(`#${m} li`)
    for (var i = 0; i < mennyiazazannyi.length; i++) {

    }
    return i
}

// Mentett mappa betöltése
function mentett_mappa_letrehozas(nev) {
    let listak = document.getElementById('mappak_lista');
    let listak2 = document.getElementById('mappak_lista_kivalaszt');
    let uj_mappa = document.createElement('div');
    let doboz_lent = document.getElementById('mappaklistaja');

    uj_mappa.setAttribute('class', 'mappak');
    uj_mappa.setAttribute('id', nev)
    uj_mappa.innerHTML +=
        `<span onclick="mappa_torlese('${nev}')" class="bezaras_x">&times;</span>` +
        `<h3>${nev}</h3>` +
        `<ul class="lista" id="mappaneve_${nev}_pipa"></ul>`;
    doboz_lent.appendChild(uj_mappa);

    uj_mappa_neve = document.createElement('li');
    uj_mappa_neve.innerHTML = `${nev}`;
    uj_mappa_neve.setAttribute('id', `mappak_lista_${nev}`)
    listak.appendChild(uj_mappa_neve);

    //`<input type="checkbox" id="mappa_neve_pipa"> ${nev}<br>`

    listak2.innerHTML += (`<input class="mappa_pipa" type="checkbox" id="${nev}_pipa"> ${nev}<br>`);
    mappa_adatbázis_frissítés();
}



// Local storage frissítése jegyzetek
function adatbázis_frissítés() {
    const jegyzetEl = document.querySelectorAll("#egyjegyzet");
    console.log(jegyzetEl.parentElement)
    const osszes_jegyzet = [];
    jegyzetEl.forEach((jegyzetEl) => {
        osszes_jegyzet.push({
            szoveg: jegyzetEl.innerText,
            keszenvan: jegyzetEl.classList.contains("keszenvan"), // class nevét nézi meg
            mappa: jegyzetEl.parentElement.id,
        });
    });
    localStorage.setItem("jegyzetek", JSON.stringify(osszes_jegyzet));
}

// Alap függvények meghívása
mentett_mappak_megjelenitese();
mentett_jegyzetek_megjelenitese();
teljesen_ures();