var CATEGORY_PAGES = {
  Whisky:     { url: 'whisky.html',     label: 'Whisky' },
  Cognac:     { url: 'cognac.html',     label: 'Cognac' },
  Tequila:    { url: 'tequila.html',    label: 'Tequila' },
  Champagnes: { url: 'champagnes.html', label: 'Champagnes' }
};

var CATALOG_DATA = {
  Whisky: {
    accent: '#B8792F',
    items: [
      { name:'Hennessy', bottle:25000, carton:142000, img:'hennessy.jpeg' },
      { name:'Chivas XV 6x', bottle:38000, carton:217000, img:'chivas-xv.jpeg' },
      { name:'Johnnie Walker Black Label', bottle:28000, carton:160000, img:'jw-black-label.jpeg' },
      { name:'Johnnie Walker Blue Label', bottle:222000, carton:1265000, img:'jw-blue-label.jpeg' },
      { name:'Glenfiddich 12 Y.O', bottle:40000, carton:228000, img:'glenfiddich-12.jpeg' },
      { name:'Macallan 12 Y.O', bottle:69000, carton:393000, img:'macallan-12.jpeg' },
      { name:'Royal Salute 21 Y.O', bottle:168000, carton:958000, img:'royal-salute-21.jpeg' }
    ]
  },
  Cognac: {
    accent: '#8B4513',
    items: [
      { name:'Hennessy VS', bottle:25000, carton:142000, img:'hennessy.jpeg' },
      { name:'Hennessy VSOP', bottle:53000, carton:302000, img:'hennessy-vsop.jpeg' },
      { name:'Hennessy XO', bottle:90000, carton:513000, img:'hennessy-xo.jpeg' },
      { name:'Rémy Martin VSOP', bottle:50000, carton:285000, img:'remy-martin-vsop.jpeg' },
      { name:'Rémy Martin XO', bottle:115000, carton:656000, img:'remy-martin-xo.jpeg' },
      { name:'Martell Cordon Bleu', bottle:95000, carton:542000, img:'martell-cordon-bleu.jpeg' },
      { name:'Martell XO', bottle:160000, carton:912000, img:'martell-xo.jpeg' },
      { name:'Camus XO', bottle:80000, carton:456000, img:'camus-xo.jpeg' }
    ]
  },
  Tequila: {
    accent: '#C9A227',
    items: [
      { name:'Don Julio Blanco', bottle:38000, carton:217000, img:'don-julio-blanco.jpeg' },
      { name:'Don Julio Reposado', bottle:45000, carton:256000, img:'don-julio-reposado.jpeg' },
      { name:'Don Julio Añejo', bottle:55000, carton:314000, img:'don-julio-anejo.jpeg' },
      { name:'Don Julio 1942', bottle:220000, carton:1254000, img:'don-julio-1942.jpeg' },
      { name:'Clase Azul Reposado', bottle:220000, carton:1254000, img:'clase-azul-reposado.jpeg' },
      { name:'Clase Azul Añejo', bottle:350000, carton:1995000, img:'clase-azul-anejo.jpeg' },
      { name:'Patrón Silver', bottle:35000, carton:200000, img:'patron-silver.jpeg' },
      { name:'Patrón Añejo', bottle:60000, carton:342000, img:'patron-anejo.jpeg' }
    ]
  },
  Champagnes: {
    accent: '#D4AF37',
    items: [
      { name:'Veuve Clicquot Brut', bottle:38000, carton:216000, img:'veuve-clicquot-brut.jpeg' },
      { name:'Veuve Clicquot Riche', bottle:44000, carton:264000, img:'veuve-clicquot-riche.jpeg' },
      { name:'Laurent Perrier', bottle:30000, carton:180000, img:'laurent-perrier.jpeg' },
      { name:'Moët Brut', bottle:33000, carton:198000, img:'moet-brut.jpeg' },
      { name:'Moët Nectar', bottle:44000, carton:264000, img:'moet-nectar.jpeg' },
      { name:'Moët Impérial', bottle:49000, carton:294000, img:'moet-imperial.jpeg' },
      { name:'Ruinart', bottle:78000, carton:468000, img:'ruinart.jpeg' },
      { name:'Ruinart Brut', bottle:60000, img:'ruinart-brut.jpeg' },
      { name:'Veuve Clicquot Riche 75cl', bottle:48000, carton:288000, img:'veuve-clicquot-riche.jpeg' },
      { name:'Veuve Clicquot Rosé 75cl', bottle:52000, carton:312000, img:'veuve-clicquot-rose-75cl.jpeg' },
      { name:'Elexium 1.5L', bottle:60000, carton:360000, img:'elexium-1-5l.jpeg' },
      { name:'Pierre Grandet Brut', bottle:28000, carton:168000, img:'pierre-grandet-brut.jpeg' },
      { name:'Pierre Grandet Demi-Sec', bottle:28000, carton:168000, img:'pierre-grandet-demi-sec.jpeg' }
    ]
  }
};

var KITS_DATA = [
  { id:'Kit 1', img:'kit-1.jpeg', name:'Kit 1', contents:"Johnnie Walker Red Label - Laurent-Perrier Champagne Brut - Jack Daniel's Tennessee Honey", price:60000 },
  { id:'Kit 2', img:'kit-2.jpeg', name:'Kit 2', contents:"Hennessy Cognac - Moet & Chandon Brut - Jack Daniel's Old No.7", price:80000 },
  { id:'Kit 3', img:'kit-3.jpeg', name:'Kit 3', contents:'Don Julio Anejo Tequila - Ruinart Champagne - Veuve Clicquot Brut', price:160000 },
  { id:'Kit 4', img:'kit-4.jpeg', name:'Kit 4', contents:"Jack Daniel's Old No.7 - Champagne Nicolas Feuillatte - Johnnie Walker Red Label", price:60000 },
  { id:'Kit 5', img:'kit-5.jpeg', name:'Kit 5', contents:'Hennessy Cognac - Laurent-Perrier Champagne Brut - Johnnie Walker Black Label 12 ans', price:80000 },
  { id:'Kit 6', img:'kit-6.jpeg', name:'Kit 6', contents:'Johnnie Walker Double Black - Veuve Clicquot Brut - Casamigos Tequila Blanco', price:125000 },
  { id:'Kit 7', img:'kit-7.jpeg', name:'Kit 7', contents:'Moet & Chandon - Laurent-Perrier - Veuve Clicquot Brut - Hennessy Cognac', price:135000 },
  { id:'Kit 8', img:'kit-8.jpeg', name:'Kit 8', contents:'Ruinart Blanc de Blancs - Veuve Clicquot Rich - Moet Nectar Imperial - Johnnie Walker Double Black', price:205000 }
];

