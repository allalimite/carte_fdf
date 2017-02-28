if(typeof( mds ) == "undefined") {
    var mds = {}
}

mds.constant = {
    
    SRC_WAT: 'WATERMAN',
    SRC_KAOS: 'KAOS',
    SRC_FDS: 'FDS',
    
    LIST_TO_EDIT: 0,
    LIST_EDITED: 1,
    LIST_DELETED: 2,
    LIST_REEDIT: 3,
    
    CONTENT_TEXT: 'TEXT',
    CONTENT_IMAGE: 'IMAGE',
    CONTENT_MULTIMEDIA: 'MULTIMEDIA',
    
    GEO_PAYS: 'PAYS',
    GEO_REG: 'REGION',
    GEO_DEP: 'REGION',
    GEO_COM: 'DEPARTEMENT',
    GEO_QUART: 'QUARTIER',
    GEO_ARRD: 'ARRONDISSEMENT',
    GEO_RUE: 'RUE',
    GEO_ADDR: 'ADRESSE',
    GEO_POI: 'POI',
    
    GEO_CAT: {
        GEO_PAYS: 0,
        GEO_REG: 1,
        GEO_DEP: 2,
        GEO_COM: 3,
        GEO_QUART: 4,
        GEO_ARRD: 5,
        GEO_RUE: 6,
        GEO_ADDR: 7,
        GEO_POI: 8
    },
    
    MONTHS: [
        'Janvier', 
        'Février', 
        'Mars', 
        'Avril',
        'Mai',
        'Juin' ,
        'Juillet', 
        'Août', 
        'Septembre',
        'Octobre', 
        'Novembre', 
        'Décembre'
    ],
    
    WEEK: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ],
    
    FD_CLASS: {
        'PERSONNE': {color: '#222222', text: 'Attaques aux personnes', index: 5},
        'BIEN': {color: '#888888', text: 'Attaques aux biens', index: 4},
        'FEU': {color: '#AAAAAA', text: 'Feux / incendies', index: 3},
        'TRAFFIC': {color: '#555555', text: 'Trafics', index: 2},
        'RELIGION': {color: '#CCCCCC', text: 'Affaires religieuses', index: 1},
        'AUTRE': {color: '#EEEEEE', text: 'Divers', index: 0}
    },
    
    FD_KAOS: {
        'Violences': {count: 0},
        'Viols/Sex': {count: 0},
        'Tentative meurtre': {count: 0},
        'Morts': {count: 0},
        'Vol': {count: 0},
        'Braquage': {count: 0},
        'Fraude': {count: 0},
        'Drogue': {count: 0},
        'Incendies': {count: 0},
        'Autre': {count: 0}
    },
    
    FD_CLASS_SIZE: 6,
    
    FD_CATEGORY: {
        'AGRESSION': {
            icon: 'batte', text: 'Agression', classe: 'PERSONNE', kaos: 'Violences'
        },
        'AGRES_SEX': {
            icon: 'femme', text: 'Agress. sexuelle', classe: 'PERSONNE' , kaos: 'Viols/Sex'
        },
        'AUTRE': {
            icon: 'autre', text: 'Autre', classe: 'AUTRE', kaos: 'Autre'
        },
        'ARRESTATION': {
            icon: 'police', text: 'Arrestation', classe: 'PERSONNE', kaos: 'Autre'
        },
        'BAGARRE': {
            icon: 'baston', text: 'Bagarre', classe: 'PERSONNE', kaos: 'Violences'
        },
        'BRAQUAGE': {
            icon: 'flingue', text: 'Braquage', classe: 'BIEN', kaos: 'Braquage'
        },
        'CAILLASSAGE': {
            icon: 'revolt', text: 'Caillassage', classe: 'PERSONNE', kaos: 'Violences'
        },
        'CADAVRE': {
            icon: 'crime', text: 'Cadavre', classe: 'PERSONNE', kaos: 'Morts'
        },
        'CAMBRIOLAGE': {
            icon: 'villa', text: 'Cambriolage', classe: 'BIEN', kaos: 'Vol'
        },
        'CHRETIEN': {
            icon: 'catho', text: 'Christianisme', classe: 'RELIGION', kaos: 'Autre'
        },
        'CAR_JACKING': {
            icon: 'car', text: 'Car-jacking', classe: 'BIEN', kaos: 'Vol'
        },
        'CLANDESTIN': {
            icon: 'bateau', text: 'Migrons', classe: 'AUTRE', kaos: 'Fraude'
        },
        'CORRUPTION': {
            icon: 'bank', text: 'Corruption', classe: 'TRAFFIC', kaos: 'Fraude'
        },
        'DIVERSITE': {
            icon: 'diversite', text: 'Diversité', classe: 'AUTRE', kaos: 'Autre'
        },
        'DEGRADATION': {
            icon: 'blast', text: 'Dégradations', classe: 'BIEN', kaos: 'Violences'
        },
        'DELINQUANCE': {
            icon: '', text: 'Délinquance', classe: 'AUTRE', kaos: 'Violences'
        },
        'DROGUE': {
            icon: 'skull', text: 'Drogue', classe: 'TRAFFIC', kaos: 'Drogue'
        },
        'EDUCATION': {
            icon: 'ecole', text: 'Education', classe: 'AUTRE', kaos: 'Autre'
        },
        'ENLEVEMENT': {
            icon: 'sequestration', text: 'Enlèvement', classe: 'PERSONNE', kaos: 'Autre'
        },
        'ESCROQUERIE': {
            icon: 'bank', text: 'Escroquerie', classe: 'TRAFFIC', kaos: 'Fraude'
        },
        'EVASION': {
            icon: 'zonzon', text: 'Evasion', classe: 'AUTRE', kaos: 'Autre'
        },
        'EXHIBITION': {
            icon: 'femme', text: 'Exhibitionisme', classe: 'PERSONNE', kaos: 'Viols/Sex'
        },
        'EXTORSION': {
            icon: 'bank', text: 'Extorsion', classe: 'PERSONNE', kaos: 'Vol'
        },
        'FEU_VOITURE': {
            icon: 'feu', text: 'Feu voiture', classe: 'FEU', kaos: 'Incendies'
        },
        'FRANC_MAC': {
            icon: 'FM', text: 'Franc-maçonnerie', classe: 'RELIGION', kaos: 'Autre'
        },
        'FORCENE': {
            icon: '', text: 'Forcené', classe: 'AUTRE', kaos: 'Violences'
        },
        'FUSILLADE': {
            icon: 'flingue', text: 'Fusillade', classe: 'PERSONNE', kaos: 'Violences'
        },
        'JUIF': {
            icon: 'jewish', text: 'Judaïsme', classe: 'RELIGION', kaos: 'Autre'
        },
        'JUSTICE': {
            icon: 'court', text: 'Justice', classe: 'AUTRE', kaos: 'Autre'
        },
        'GITAN': {
            icon: 'camping', text: 'Nomadisme', classe: 'AUTRE', kaos: 'Autre'
        },
        'GO_FAST': {
            icon: 'car', text: 'Go Fast', classe: 'TRAFFIC', kaos: 'Drogue'
        },
        'HALLAL': {
            icon: 'mosquee', text: 'Hallal', classe: 'RELIGION', kaos: 'Autre'
        },
        'HEURT': {
            icon: 'revolt', text: 'Heurts', classe: 'PERSONNE', kaos: 'Violence'
        },
        'HOME_JACKING': {
            icon: 'villa', text: 'Home jacking', classe: 'PERSONNE', kaos: 'Vol'
        },
        'HYGIENE': {
            icon: 'hygiene', text: 'Hygiène', classe: 'AUTRE', kaos: 'Autre'
        },
        'INCENDIE': {
            icon: 'feu', text: 'Incendie', classe: 'FEU', kaos: 'Incendies'
        },
        'IMMIGRATION': {
            icon: 'famille', text: 'Immigration', classe: 'AUTRE', kaos: 'Autre'
        },
        'ISLAM': {
            icon: 'mosquee', text: 'Islam', classe: 'RELIGION', kaos: 'Autre'
        },
        'MEUTRE': {
            icon: 'crime', text: 'Meurtre', classe: 'PERSONNE', kaos: 'Morts'
        },
        'MOSQUEE': {
            icon: 'mosquee', text: 'Mosquee', classe: 'RELIGION', kaos: 'Autre'
        },
        'OUTRAGE_FR': {
            icon: '', text: 'Outrage France', classe: 'AUTRE', kaos: 'Autre'
        },
        'POLITIQUE': {
            icon: 'politique', text: 'Politique', classe: 'AUTRE', kaos: 'Autre'
        },
        'PROSTITUTION': {
            icon: 'femme', text: 'Prostitution', classe: 'TRAFFIC', kaos: 'Viols/Sex'
        },
        'PRIERE_RUE': {
            icon: 'priere', text: 'Prière de rue', classe: 'RELIGION', kaos: 'Autre'
        },
        'PRISE_OTAGE': {
            icon: 'flingue', text: 'Prise d\'otage', classe: 'PERSONNE', kaos: 'Autre'
        },
        'PRISON': {
            icon: 'zonzon', text: 'Prison', classe: 'AUTRE', kaos: 'Autre'
        },
        'RACISME': {
            icon: '', text: 'Racisme', classe: 'AUTRE', kaos: 'Autre'
        },
        'RACKET': {
            icon: 'batte', text: 'Racket', classe: 'PERSONNE', kaos: 'Violences'
        },
        'RAMADAN': {
            icon: 'mosquee', text: 'Ramadan', classe: 'RELIGION', kaos: 'Autre'
        },
        'RODEO': {
            icon: 'car', text: 'Rodéo', classe: 'AUTRE', kaos: 'Violences'
        },
        'ROMS': {
            icon: 'rom', text: 'Roms', classe: 'AUTRE', kaos: 'Autre'
        },
        'SANS_PAPIER': {
            icon: 'bateau', text: 'Sans papiers', classe: 'AUTRE', kaos: 'Fraude'
        },
        'SEQUESTRATION': {
            icon: 'sequestration', text: 'Séquestration', classe: 'PERSONNE', kaos: 'Violences'
        },
        'TORTURE': {
            icon: 'torture', text: 'Torture', classe: 'PERSONNE', kaos: 'Tentative meurtre'
        },
        'TRAFFIC': {
            icon: 'bank', text: 'Trafic', classe: 'TRAFFIC', kaos: 'Fraude'
        },
        'TRANSPORT': {
            icon: 'bus', text: 'Transport', classe: 'AUTRE', kaos: 'Autre'
        },
        'TEL_CLOPE': {
            icon: 'phones', text: 'Tel./cigarette', classe: 'PERSONNE', kaos: 'Vol'
        },
        'TENTATIVE_MEURTRE': {
            icon: 'crime', text: 'Tentative meurtre', classe: 'PERSONNE', kaos: 'Tentative meurtre'
        },
        'TERRORISME': {
            icon: 'bombe', text: 'Terrorisme', classe: 'PERSONNE', kaos: 'Autre'
        },
        'VIOL': {
            icon: 'viol', text: 'Viol', classe: 'PERSONNE', kaos: 'Viols/Sex'
        },
        'VIOLENCE_CONJUGALE': {
            icon: 'loveinterest', text: 'Violence conj.', classe: 'PERSONNE', kaos: 'Violences'
        },
        'VOILE': {
            icon: 'voile', text: 'Voile islamique', classe: 'RELIGION', kaos: 'Autre'
        },
        'VOL': {
            icon: 'supermarket', text: 'Vol', classe: 'BIEN', kaos: 'Vol'
        }
    },
    
    getIconCat: function(fd_cat) {
        if(fd_cat && fd_cat.icon && fd_cat.icon.length > 1) {
            return 'icon/'+fd_cat.icon+'.png';
        } else {
//            console.log('getIconCat not found: '+fd_cat.text);
            return 'icon/firstaid2.png';
        }
    },
    
    getIcon: function(cat) {
        var fd_cat = mds.constant.FD_CATEGORY[cat];
        if(fd_cat && fd_cat.icon && fd_cat.icon.length > 1) {
            return 'icon/'+fd_cat.icon+'.png';
        } else {
//            console.log('getIcon not found: '+fd_cat.text);
            return 'icon/firstaid2.png';
        }
    },
    
    getHeaderColumn: function (pos, col, disp) {
        var res = {
            pos: pos,
            col: col,
            disp: disp
        }
        return res;
    },
    
    INSEE_EMP_HEAD: [
        { pos: 0, col: 'EMP_TOT', disp: 'Emploi total (salarié et non salarié) au lieu de travail en 2008'},
        { pos: 1, col: 'EMP_SAL', disp: "Dont part de l'emploi salarié au lieu de travail en 2008, en %"},
        { pos: 2, col: 'EMP_TVAR', disp: "Variation de l'emploi total au lieu de travail : taux annuel moyen entre 1999 et 2008, en %"},
        { pos: 3, col: 'EMP_TACT', disp: "Taux d'activité des 15 à 64 ans en 2008"},
        { pos: 4, col: 'EMP_TCHOM', disp: "Taux de chômage des 15 à 64 ans en 2008"},
        { pos: 5, col: 'EMP_DABC', disp: "Nombre de demandeurs d'emploi de catégorie ABC au 31 décembre 2010"},
        { pos: 6, col: 'EMP_DA', disp: "dont demandeurs d'emploi de catégorie A au 31 décembre 2010"},
        { pos: 7, col: 'EMP_EST', disp: 'Estimation'},
        { pos: 8, col: 'EMP_CHOM', disp: 'Chômage'}
    ],

    INSEE_ETAB_HEAD: [
        { pos: 9, col: 'ETAB_TOT', disp: "Nombre d'établissements actifs au 31 décembre 2008"},
        { pos: 10, col: 'ETAB_AGR', disp: "Part de l'agriculture, en %"},
        { pos: 11, col: 'ETAB_IND', disp: "Part de l'industrie, en %"},
        { pos: 12, col: 'ETAB_CONS', disp: "Part de la construction, en %"},
        { pos: 13, col: 'ETAB_TER', disp: 'Part du commerce, transports et services divers, en %'},
        { pos: 14, col: 'ETAB_COM_A', disp: 'Dont commerce et réparation auto, en %'},
        { pos: 15, col: 'ETAB_FPUB', disp: "Part de l'administration publique, enseignement, santé et action sociale, en %"},
        { pos: 16, col: 'ETAB_MD10', disp: 'Part des établissements de 1 à 9 salariés, en %'},
        { pos: 17, col: 'ETAB_PD10', disp: 'Part des établissements de 10 salariés ou plus, en %'}
    ],

    INSEE_LOG_HEAD: [
        { pos: 18, col: 'LOG_TOT', disp: "Nombre total de logements en 2008"},
        { pos: 19, col: 'LOG_PRIN', disp: "Part des résidences principales en 2008, en %"},
        { pos: 20, col: 'LOG_SEC', disp: "Part des résidences secondaires (y compris les logements occasionnels) en 2008, en %"},
        { pos: 21, col: 'LOG_VAC', disp: "Part des logements vacants en 2008, en %"},
        { pos: 22, col: 'LOG_PROP', disp: "Part des ménages propriétaires de leur résidence principale en 2008, en %"}
    ],

    INSEE_POP_HEAD: [
        { pos: 23, col: 'POP_TOT', disp: 'Population en 2008'},
        { pos: 24, col: 'POP_DENS', disp: "Densité de la population (nombre d'habitants au km²) en 2008"},
        { pos: 25, col: 'POP_SUP', disp: "Superficie (en km²)"},
        { pos: 26, col: 'POP_VMOY', disp: "Variation de la population : taux annuel moyen entre 1999 et 2008, en %"},
        { pos: 27, col: 'POP_VNAT', disp: "Dont variation due au solde naturel : taux annuel moyen entre 1999 et 2008, en %"},
        { pos: 28, col: 'POP_VES', disp: "Dont variation due au solde apparent des entrées sorties : taux annuel moyen entre 1999 et 2008, en %"},
        { pos: 29, col: 'POP_MEN', disp: "Nombre de ménages en 2008"},
        { pos: 30, col: 'POP_EST', disp: "Population estimée au 1er janvier 2009"},
        { pos: 31, col: 'POP_NAI', disp: "Naissances domiciliées en 2009"},
        { pos: 32, col: 'POP_DEC', disp: "Décès domiciliés en 2009"}
    ],

    INSEE_REV_HEAD: [
        { pos: 33, col: 'REV_NET', disp: "Revenu net déclaré moyen par foyer fiscal en 2008, en euros"},
        { pos: 34, col: 'REV_IMP', disp: "Foyers fiscaux imposables en % de l'ensemble des foyers fiscaux en 2008"},
        { pos: 35, col: 'REV_MED', disp: "Médiane du revenu fiscal des ménages par unité de consommation en 2008, en euros"}
    ]
    
}

