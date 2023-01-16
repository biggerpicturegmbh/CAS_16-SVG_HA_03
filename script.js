
//--- Random mit fxhash ----
let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var fxhash =
        "oo" +
        Array(49)
                .fill(0)
                .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
                .join("");

//--- --> seed für URL ----
const params = new URLSearchParams(location.search);
if(params.has('seed')){
   const seed = params.get('seed');
   fxhash = seed;
}


//--- Random mit fxhash ----
let b58dec = (str) =>
        [...str].reduce(
                (p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0,
                0
        );
let fxhashTrunc = fxhash.slice(2);
let regex = new RegExp(".{" + ((fxhashTrunc.length / 4) | 0) + "}", "g");
let hashes = fxhashTrunc.match(regex).map((h) => b58dec(h));
let sfc32 = (a, b, c, d) => {
        return () => {
                a |= 0;
                b |= 0;
                c |= 0;
                d |= 0;
                var t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
        };
};
var fxrand = sfc32(...hashes);

//--- --> seed in console zum kopieren ----
console.clear()
console.log("Unique seed! Copy after URL: ?seed=" + fxhash)

//const r = Math.random;
const r = fxrand;

const vbWidth = 1000;
const vbHeight = 1000;


//--- SVG erstellen Basic ----
const ns = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(ns, "svg");
svg.setAttribute("viewBox", `0 0 ${vbWidth} ${vbHeight}`);
document.body.append(svg);

// const divSeed = document.createElement("div")
// document.body.append(divSeed);
const pSeed = document.createElement("p");
pSeed.setAttribute("id", "seed")
pSeed.innerHTML = `Seed: ${fxhash}`
document.body.append(pSeed);

//--- Arrays Farbpallete  ----
//--- https://coolors.co/e7eef1-1b1a16-d53829-ff541b-e6ae2e-80a25c-009f6c-387eff-4e22b6-ff2ea5 ---
const colorfulls = [ 
        "#d53829", "#ff541b", "#e6ae2e", 
        "#80a25c", "#009f6c", "#387eff", 
        "#4e22b6", "#ff2ea5"
    ]
const colorAchro = [
        "#e7eef1", "#1b1a16"
    ]

//--- Funktion für zufällige Auswahl im Array  ----
const pick = (d) => d[Math.floor(r() * d.length)];

//--- Rechteck für BG  ----
const bg = document.createElementNS(ns, "rect");
        svg.append(bg);
        bg.setAttribute("width", vbWidth);
        bg.setAttribute("height", vbHeight);
        bg.setAttribute("fill", pick(colorAchro))

//--- Funktion für waveLines  ----
function waveLines (wpTransX, wpOscil){
        const wave = document.createElementNS(ns, "path");
        svg.append(wave);

        let wX = -100;
        let wY = 0;
        let countW = 0;
        let countUp = true;

        const wavePoints = Array(11)
        .fill(0)
        .map((d) => {
                if (countUp)
                {
                ++countW;         
                if (countW >= 2)
                countUp = false;
                }
                else
                {
                --countW; 
                if (countW <= 0)
                countUp = true;
                }
                wX = wX + 100*(waveNoise+1);
                wY = (countW-1)*wpOscil*(waveNoise+0.2)+wpTransX;
                return [wX, wY];
        })
        wavePoints.shift()

        const strD = `M0,${wpTransX} Q${wavePoints.map((d) =>
                d.join(" ")
        )}`;
                wave.setAttribute("d", strD);
                wave.setAttribute("fill", "none");
                wave.setAttribute("stroke", pick(colorfulls));
                wave.setAttribute("stroke-width", `${2*(waveNoise+0.5)}`);
}

//--- Array für alle Waves --> umschreiben für formale Programmierung  ----
let waveNoise = r()
let waveRange = r() * (12   - 2) + 2;
for (let i = 0; i < 2000; i++) {
        waveLines((12*i+20)*waveNoise, (waveRange*i+10)*waveNoise);
      }


// ---- Download SVG ------
const mime = {
        type: "image/svg+xml",
};

const download = (blob) => {
        const link = document.createElement("a"),
                time = Math.round(new Date().getTime() / 1000);
        link.download = `${document.title}-${time}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
};

const save = (svg) => {
        const str = new XMLSerializer().serializeToString(svg);
        download(new Blob([str], mime));
};

const keyHandlerSave = (event) => {
    if (event.key === "s") {
        save(svg);
    }
};

document.addEventListener("keypress", keyHandlerSave);

// ---- Reload auf Taste "space" ------
const keyHandlerReload = (event) => {
    location.reload()
};

document.addEventListener("keypress", keyHandlerReload );