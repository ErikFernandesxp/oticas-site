/* ==========================================================================
   CATÁLOGO — produtos e categorias do site.

   Cada produto é uma linha como esta (mantenha as aspas e as vírgulas):
     {"id": "001", "nome": "Armação tartaruga", "categoria": "grau",
      "imagem": "img/catalogo/001.webp", "largura": 734, "altura": 1100,
      "alt": "Descrição da foto", "descricao": "Texto opcional",
      "destaque": true, "instagram": "https://www.instagram.com/p/XXXX/"}
   - categoria: use um "id" da lista OTICA_CATEGORIAS (vazio = só aparece em "Todos")
   - destaque: true mostra o modelo na página inicial (até 8)
   - instagram: link da publicação (opcional)
   - os produtos mais novos devem ficar no topo da lista

   Para trazer as fotos do Instagram de uma vez: tools/importar_instagram.py
   (passo a passo no README). Os modelos abaixo são EXEMPLOS.
   ========================================================================== */
window.OTICA_CATEGORIAS = [
  {
    "id": "grau",
    "nome": "Óculos de grau"
  },
  {
    "id": "sol",
    "nome": "Óculos de sol"
  },
  {
    "id": "clipon",
    "nome": "Clipons"
  },
  {
    "id": "infantil",
    "nome": "Infantil"
  },
  {
    "id": "lentes",
    "nome": "Lentes de contato"
  },
  {
    "id": "acessorios",
    "nome": "Acessórios"
  }
];

window.OTICA_CATALOGO = [
  {
    "id": "001",
    "nome": "Solares redondos degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/001-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares redondos degradê",
    "descricao": "",
    "destaque": true,
    "origem": "d2602004c29a",
    "galeria": [
      {
        "imagem": "img/catalogo/001-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/001-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-001"
  },
  {
    "id": "002",
    "nome": "Solares quadrados oversize",
    "categoria": "sol",
    "imagem": "img/catalogo/002-2.webp",
    "largura": 723,
    "altura": 960,
    "alt": "Solares quadrados oversize",
    "descricao": "",
    "destaque": true,
    "origem": "2142b283de68",
    "galeria": [
      {
        "imagem": "img/catalogo/002-2.webp",
        "largura": 723,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/002-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/002-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/002-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/002-6.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-002"
  },
  {
    "id": "003",
    "nome": "Clipons redondos",
    "categoria": "clipon",
    "imagem": "img/catalogo/003-2.webp",
    "largura": 816,
    "altura": 960,
    "alt": "Clipons redondos",
    "descricao": "",
    "destaque": true,
    "origem": "27458de7fba4",
    "galeria": [
      {
        "imagem": "img/catalogo/003-2.webp",
        "largura": 816,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/003-3.webp",
        "largura": 816,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/003-4.webp",
        "largura": 816,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-003"
  },
  {
    "id": "004",
    "nome": "Clipons com lentes solares",
    "categoria": "clipon",
    "imagem": "img/catalogo/004-2.webp",
    "largura": 765,
    "altura": 960,
    "alt": "Clipons com lentes solares",
    "descricao": "",
    "destaque": false,
    "origem": "aa5a06d79ef2",
    "galeria": [
      {
        "imagem": "img/catalogo/004-2.webp",
        "largura": 765,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/004-3.webp",
        "largura": 765,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/004-4.webp",
        "largura": 765,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/004-5.webp",
        "largura": 765,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-004"
  },
  {
    "id": "005",
    "nome": "Armações gatinho e acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/005.webp",
    "largura": 732,
    "altura": 960,
    "alt": "Armações gatinho e acetato",
    "descricao": "",
    "destaque": true,
    "origem": "3b8bd0f33ffa",
    "tipo": "galeria",
    "codigo": "G-005"
  },
  {
    "id": "006",
    "nome": "Armações redondas e quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/006.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações redondas e quadradas",
    "descricao": "",
    "destaque": true,
    "origem": "c84a5387baab",
    "tipo": "galeria",
    "codigo": "G-006"
  },
  {
    "id": "007",
    "nome": "Armações quadradas oversize",
    "categoria": "grau",
    "imagem": "img/catalogo/007.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações quadradas oversize",
    "descricao": "",
    "destaque": true,
    "origem": "a5ed52797d6f",
    "galeria": [
      {
        "imagem": "img/catalogo/007.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/007-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/007-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/007-4.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-007"
  },
  {
    "id": "009",
    "nome": "Armações metálicas finas",
    "categoria": "grau",
    "imagem": "img/catalogo/009-2.webp",
    "largura": 832,
    "altura": 960,
    "alt": "Armações metálicas finas",
    "descricao": "",
    "destaque": true,
    "origem": "fdc9469f1757",
    "galeria": [
      {
        "imagem": "img/catalogo/009-2.webp",
        "largura": 832,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/009-3.webp",
        "largura": 832,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/009-4.webp",
        "largura": 835,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/009-5.webp",
        "largura": 832,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/009-6.webp",
        "largura": 832,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-009"
  },
  {
    "id": "010",
    "nome": "Armações flutuantes sem aro",
    "categoria": "grau",
    "imagem": "img/catalogo/010-2.webp",
    "largura": 757,
    "altura": 960,
    "alt": "Armações flutuantes sem aro",
    "descricao": "",
    "destaque": false,
    "origem": "e7962c651530",
    "galeria": [
      {
        "imagem": "img/catalogo/010-2.webp",
        "largura": 757,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/010-3.webp",
        "largura": 757,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/010-4.webp",
        "largura": 757,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/010-5.webp",
        "largura": 757,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-010"
  },
  {
    "id": "011",
    "nome": "Armações metálicas quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/011.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações metálicas quadradas",
    "descricao": "",
    "destaque": false,
    "origem": "86702a82d19f",
    "galeria": [
      {
        "imagem": "img/catalogo/011.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/011-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/011-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/011-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/011-5.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/011-6.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-011"
  },
  {
    "id": "012",
    "nome": "Armações redondas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/012-2.webp",
    "largura": 960,
    "altura": 960,
    "alt": "Armações redondas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "bc52eb1c0401",
    "galeria": [
      {
        "imagem": "img/catalogo/012-2.webp",
        "largura": 960,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/012-3.webp",
        "largura": 960,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/012-4.webp",
        "largura": 960,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-012"
  },
  {
    "id": "013",
    "nome": "Armações retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/013.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "800534b626a9",
    "tipo": "galeria",
    "codigo": "G-013"
  },
  {
    "id": "014",
    "nome": "Armações de acetato variadas",
    "categoria": "grau",
    "imagem": "img/catalogo/014.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações de acetato variadas",
    "descricao": "",
    "destaque": false,
    "origem": "c31e367e3d47",
    "galeria": [
      {
        "imagem": "img/catalogo/014.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/014-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/014-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/014-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/014-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/014-6.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-014"
  },
  {
    "id": "015",
    "nome": "Armações quadradas transparentes",
    "categoria": "grau",
    "imagem": "img/catalogo/015-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações quadradas transparentes",
    "descricao": "",
    "destaque": false,
    "origem": "29737d29be4d",
    "galeria": [
      {
        "imagem": "img/catalogo/015-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/015-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/015-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/015-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-015"
  },
  {
    "id": "016",
    "nome": "Armações femininas translúcidas",
    "categoria": "grau",
    "imagem": "img/catalogo/016-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações femininas translúcidas",
    "descricao": "",
    "destaque": false,
    "origem": "63093041d28e",
    "galeria": [
      {
        "imagem": "img/catalogo/016-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-7.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-9.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-10.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-11.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-12.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-13.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-14.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-15.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-16.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-17.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/016-18.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-016"
  },
  {
    "id": "017",
    "nome": "Armações retangulares masculinas",
    "categoria": "grau",
    "imagem": "img/catalogo/017-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações retangulares masculinas",
    "descricao": "",
    "destaque": false,
    "origem": "27383f2e5e48",
    "galeria": [
      {
        "imagem": "img/catalogo/017-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-3.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-7.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-9.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-10.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/017-11.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-017"
  },
  {
    "id": "018",
    "nome": "Solares gatinho e quadrados",
    "categoria": "sol",
    "imagem": "img/catalogo/018-2.webp",
    "largura": 745,
    "altura": 960,
    "alt": "Solares gatinho e quadrados",
    "descricao": "",
    "destaque": true,
    "origem": "fca0a953b186",
    "galeria": [
      {
        "imagem": "img/catalogo/018-2.webp",
        "largura": 745,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-3.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-4.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-5.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-6.webp",
        "largura": 745,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-7.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-8.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-9.webp",
        "largura": 746,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-10.webp",
        "largura": 746,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-11.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-12.webp",
        "largura": 745,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-13.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-14.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-15.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-16.webp",
        "largura": 745,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-17.webp",
        "largura": 745,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-18.webp",
        "largura": 747,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-19.webp",
        "largura": 746,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/018-20.webp",
        "largura": 745,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-018"
  },
  {
    "id": "020",
    "nome": "Solares gatinho coloridos",
    "categoria": "sol",
    "imagem": "img/catalogo/020-2.webp",
    "largura": 872,
    "altura": 960,
    "alt": "Solares gatinho coloridos",
    "descricao": "",
    "destaque": false,
    "origem": "c916c0cedea2",
    "tipo": "galeria",
    "codigo": "G-020"
  },
  {
    "id": "021",
    "nome": "Armações metálicas femininas",
    "categoria": "grau",
    "imagem": "img/catalogo/021-2.webp",
    "largura": 726,
    "altura": 960,
    "alt": "Armações metálicas femininas",
    "descricao": "",
    "destaque": false,
    "origem": "714cfc7a8fe8",
    "galeria": [
      {
        "imagem": "img/catalogo/021-2.webp",
        "largura": 726,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/021-3.webp",
        "largura": 726,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/021-4.webp",
        "largura": 726,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/021-5.webp",
        "largura": 726,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-021"
  },
  {
    "id": "022",
    "nome": "Armações metálicas finas",
    "categoria": "grau",
    "imagem": "img/catalogo/022-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações metálicas finas",
    "descricao": "",
    "destaque": false,
    "origem": "2e862227efb3",
    "galeria": [
      {
        "imagem": "img/catalogo/022-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-7.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-9.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-10.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/022-11.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-022"
  },
  {
    "id": "023",
    "nome": "Solares unissex esportivos",
    "categoria": "sol",
    "imagem": "img/catalogo/023-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares unissex esportivos",
    "descricao": "",
    "destaque": false,
    "origem": "cdc867d738ba",
    "galeria": [
      {
        "imagem": "img/catalogo/023-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/023-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-023"
  },
  {
    "id": "024",
    "nome": "Armações metálicas redondas",
    "categoria": "grau",
    "imagem": "img/catalogo/024-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações metálicas redondas",
    "descricao": "",
    "destaque": false,
    "origem": "aa4002392975",
    "galeria": [
      {
        "imagem": "img/catalogo/024-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/024-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-024"
  },
  {
    "id": "025",
    "nome": "Armações de acetato retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/025-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações de acetato retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "2982f2507315",
    "galeria": [
      {
        "imagem": "img/catalogo/025-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/025-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/025-4.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-025"
  },
  {
    "id": "026",
    "nome": "Armações femininas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/026-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações femininas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "65f388b8a38c",
    "galeria": [
      {
        "imagem": "img/catalogo/026-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/026-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-026"
  },
  {
    "id": "027",
    "nome": "Armações gatinho e quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/027-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações gatinho e quadradas",
    "descricao": "",
    "destaque": false,
    "origem": "cb282dfdd8de",
    "galeria": [
      {
        "imagem": "img/catalogo/027-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/027-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/027-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/027-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-027"
  },
  {
    "id": "028",
    "nome": "Armações infantis de silicone",
    "categoria": "grau",
    "imagem": "img/catalogo/028-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações infantis de silicone",
    "descricao": "",
    "destaque": false,
    "origem": "628ba97e8f46",
    "galeria": [
      {
        "imagem": "img/catalogo/028-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/028-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/028-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/028-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/028-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/028-7.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-028"
  },
  {
    "id": "029",
    "nome": "Solares esportivos espelhados",
    "categoria": "sol",
    "imagem": "img/catalogo/029-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares esportivos espelhados",
    "descricao": "",
    "destaque": false,
    "origem": "9b0ff07b9621",
    "galeria": [
      {
        "imagem": "img/catalogo/029-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/029-3.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-029"
  },
  {
    "id": "030",
    "nome": "Clipons com lente amarela",
    "categoria": "clipon",
    "imagem": "img/catalogo/030-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Clipons com lente amarela",
    "descricao": "",
    "destaque": false,
    "origem": "f202b3f326be",
    "galeria": [
      {
        "imagem": "img/catalogo/030-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/030-3.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/030-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/030-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/030-6.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-030"
  },
  {
    "id": "031",
    "nome": "Armações redondas masculinas",
    "categoria": "grau",
    "imagem": "img/catalogo/031-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações redondas masculinas",
    "descricao": "",
    "destaque": false,
    "origem": "029b89c5f49a",
    "galeria": [
      {
        "imagem": "img/catalogo/031-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/031-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/031-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/031-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-031"
  },
  {
    "id": "032",
    "nome": "Armações masculinas retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/032-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações masculinas retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "67b4d72112e4",
    "galeria": [
      {
        "imagem": "img/catalogo/032-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/032-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-032"
  },
  {
    "id": "033",
    "nome": "Armações metálicas quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/033-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações metálicas quadradas",
    "descricao": "",
    "destaque": false,
    "origem": "4e82f9f1023b",
    "galeria": [
      {
        "imagem": "img/catalogo/033-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/033-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/033-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/033-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-033"
  },
  {
    "id": "034",
    "nome": "Armações metálicas redondas finas",
    "categoria": "grau",
    "imagem": "img/catalogo/034-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações metálicas redondas finas",
    "descricao": "",
    "destaque": false,
    "origem": "99e964e3c919",
    "tipo": "galeria",
    "codigo": "G-034"
  },
  {
    "id": "035",
    "nome": "Armações flutuantes sem aro",
    "categoria": "grau",
    "imagem": "img/catalogo/035-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações flutuantes sem aro",
    "descricao": "",
    "destaque": false,
    "origem": "c064b2cfb0a2",
    "galeria": [
      {
        "imagem": "img/catalogo/035-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/035-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/035-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/035-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-035"
  },
  {
    "id": "036",
    "nome": "Armações masculinas retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/036-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações masculinas retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "e4bd69c23041",
    "galeria": [
      {
        "imagem": "img/catalogo/036-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/036-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/036-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/036-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/036-6.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-036"
  },
  {
    "id": "037",
    "nome": "Armações infantis",
    "categoria": "grau",
    "imagem": "img/catalogo/037-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações infantis",
    "descricao": "",
    "destaque": false,
    "origem": "ac387755720c",
    "galeria": [
      {
        "imagem": "img/catalogo/037-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/037-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/037-4.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-037"
  },
  {
    "id": "038",
    "nome": "Armações infantis",
    "categoria": "grau",
    "imagem": "img/catalogo/038-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações infantis",
    "descricao": "",
    "destaque": false,
    "origem": "ac2ae945663f",
    "galeria": [
      {
        "imagem": "img/catalogo/038-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/038-3.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-038"
  },
  {
    "id": "039",
    "nome": "Armações gatinho",
    "categoria": "grau",
    "imagem": "img/catalogo/039-2.webp",
    "largura": 739,
    "altura": 960,
    "alt": "Armações gatinho",
    "descricao": "",
    "destaque": false,
    "origem": "6fcafbdbf670",
    "galeria": [
      {
        "imagem": "img/catalogo/039-2.webp",
        "largura": 739,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/039-3.webp",
        "largura": 739,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/039-4.webp",
        "largura": 739,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/039-5.webp",
        "largura": 739,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-039"
  },
  {
    "id": "040",
    "nome": "Armações quadradas oversize",
    "categoria": "grau",
    "imagem": "img/catalogo/040-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações quadradas oversize",
    "descricao": "",
    "destaque": false,
    "origem": "b260faca98e9",
    "galeria": [
      {
        "imagem": "img/catalogo/040-2.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/040-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/040-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/040-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/040-6.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-040"
  },
  {
    "id": "041",
    "nome": "Armações retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/041-2.webp",
    "largura": 781,
    "altura": 960,
    "alt": "Armações retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "e773812e4a34",
    "tipo": "galeria",
    "codigo": "G-041"
  },
  {
    "id": "042",
    "nome": "Armações femininas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/042-2.webp",
    "largura": 728,
    "altura": 960,
    "alt": "Armações femininas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "0a9de1b0af76",
    "galeria": [
      {
        "imagem": "img/catalogo/042-2.webp",
        "largura": 728,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/042-3.webp",
        "largura": 727,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/042-4.webp",
        "largura": 728,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-042"
  },
  {
    "id": "043",
    "nome": "Armações redondas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/043-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações redondas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "c13b3b0f11bd",
    "galeria": [
      {
        "imagem": "img/catalogo/043-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/043-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/043-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/043-5.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/043-6.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-043"
  },
  {
    "id": "044",
    "nome": "Armações de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/044-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "71c0e09eed3e",
    "galeria": [
      {
        "imagem": "img/catalogo/044-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/044-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/044-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/044-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/044-6.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/044-7.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-044"
  },
  {
    "id": "045",
    "nome": "Armações metálicas finas",
    "categoria": "grau",
    "imagem": "img/catalogo/045-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações metálicas finas",
    "descricao": "",
    "destaque": false,
    "origem": "0af351f8aeb2",
    "galeria": [
      {
        "imagem": "img/catalogo/045-2.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-7.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-9.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-10.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/045-11.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-045"
  },
  {
    "id": "046",
    "nome": "Armações semi flutuantes",
    "categoria": "grau",
    "imagem": "img/catalogo/046-2.webp",
    "largura": 776,
    "altura": 960,
    "alt": "Armações semi flutuantes",
    "descricao": "",
    "destaque": false,
    "origem": "6413bcd93110",
    "galeria": [
      {
        "imagem": "img/catalogo/046-2.webp",
        "largura": 776,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/046-3.webp",
        "largura": 776,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-046"
  },
  {
    "id": "047",
    "nome": "Armações unissex transparentes",
    "categoria": "grau",
    "imagem": "img/catalogo/047-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações unissex transparentes",
    "descricao": "",
    "destaque": false,
    "origem": "bd28a42a47c9",
    "galeria": [
      {
        "imagem": "img/catalogo/047-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-7.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-9.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-10.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-11.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-12.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-13.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-14.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-15.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-16.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-17.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-18.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/047-19.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-047"
  },
  {
    "id": "048",
    "nome": "Armações redondas transparentes e vinho",
    "categoria": "grau",
    "imagem": "img/catalogo/048-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações redondas transparentes e vinho",
    "descricao": "",
    "destaque": false,
    "origem": "fba6b36a5b2c",
    "galeria": [
      {
        "imagem": "img/catalogo/048-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/048-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/048-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/048-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-048"
  },
  {
    "id": "049",
    "nome": "Armações de acetato retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/049-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações de acetato retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "b205d962fa07",
    "galeria": [
      {
        "imagem": "img/catalogo/049-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-6.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-7.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-8.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-9.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/049-10.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-049"
  },
  {
    "id": "050",
    "nome": "Armações metálicas retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/050.webp",
    "largura": 760,
    "altura": 960,
    "alt": "Armações metálicas retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "bcf8d168a2c7",
    "galeria": [
      {
        "imagem": "img/catalogo/050.webp",
        "largura": 760,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/050-2.webp",
        "largura": 760,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/050-3.webp",
        "largura": 760,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/050-4.webp",
        "largura": 760,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-050"
  },
  {
    "id": "051",
    "nome": "Armações metálicas redondas",
    "categoria": "grau",
    "imagem": "img/catalogo/051-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações metálicas redondas",
    "descricao": "",
    "destaque": false,
    "origem": "6cf59c696da9",
    "tipo": "galeria",
    "codigo": "G-051"
  },
  {
    "id": "052",
    "nome": "Armações femininas quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/052-2.webp",
    "largura": 852,
    "altura": 960,
    "alt": "Armações femininas quadradas",
    "descricao": "",
    "destaque": false,
    "origem": "e91745c3de63",
    "galeria": [
      {
        "imagem": "img/catalogo/052-2.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-3.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-4.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-5.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-6.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-7.webp",
        "largura": 852,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-8.webp",
        "largura": 853,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-9.webp",
        "largura": 853,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/052-10.webp",
        "largura": 852,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-052"
  },
  {
    "id": "053",
    "nome": "Solares redondos coloridos",
    "categoria": "sol",
    "imagem": "img/catalogo/053-2.webp",
    "largura": 758,
    "altura": 903,
    "alt": "Solares redondos coloridos",
    "descricao": "",
    "destaque": false,
    "origem": "9db128712b13",
    "galeria": [
      {
        "imagem": "img/catalogo/053-2.webp",
        "largura": 758,
        "altura": 903
      },
      {
        "imagem": "img/catalogo/053-3.webp",
        "largura": 806,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/053-4.webp",
        "largura": 806,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/053-5.webp",
        "largura": 806,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-053"
  },
  {
    "id": "055",
    "nome": "Solares infantis coração",
    "categoria": "sol",
    "imagem": "img/catalogo/055-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares infantis coração",
    "descricao": "",
    "destaque": false,
    "origem": "24cbcb27acb4",
    "galeria": [
      {
        "imagem": "img/catalogo/055-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/055-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/055-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/055-5.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-055"
  },
  {
    "id": "056",
    "nome": "Solares infantis esportivos",
    "categoria": "sol",
    "imagem": "img/catalogo/056-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares infantis esportivos",
    "descricao": "",
    "destaque": false,
    "origem": "dd8536bd2995",
    "tipo": "galeria",
    "codigo": "G-056"
  },
  {
    "id": "057",
    "nome": "Solares infantis aviador",
    "categoria": "sol",
    "imagem": "img/catalogo/057-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solares infantis aviador",
    "descricao": "",
    "destaque": false,
    "origem": "feaf1f9404ca",
    "tipo": "galeria",
    "codigo": "G-057"
  },
  {
    "id": "058",
    "nome": "Armações quadradas transparentes",
    "categoria": "grau",
    "imagem": "img/catalogo/058-2.webp",
    "largura": 793,
    "altura": 960,
    "alt": "Armações quadradas transparentes",
    "descricao": "",
    "destaque": false,
    "origem": "e2393fdf8e3c",
    "tipo": "galeria",
    "codigo": "G-058"
  },
  {
    "id": "059",
    "nome": "Armações de acetato variadas",
    "categoria": "grau",
    "imagem": "img/catalogo/059-2.webp",
    "largura": 776,
    "altura": 960,
    "alt": "Armações de acetato variadas",
    "descricao": "",
    "destaque": false,
    "origem": "25b5b7b00e7f",
    "galeria": [
      {
        "imagem": "img/catalogo/059-2.webp",
        "largura": 776,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/059-3.webp",
        "largura": 776,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/059-4.webp",
        "largura": 779,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/059-5.webp",
        "largura": 779,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/059-6.webp",
        "largura": 779,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-059"
  },
  {
    "id": "060",
    "nome": "Armações retangulares masculinas",
    "categoria": "grau",
    "imagem": "img/catalogo/060-2.webp",
    "largura": 793,
    "altura": 960,
    "alt": "Armações retangulares masculinas",
    "descricao": "",
    "destaque": false,
    "origem": "1b1872fc2a73",
    "galeria": [
      {
        "imagem": "img/catalogo/060-2.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/060-3.webp",
        "largura": 790,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/060-4.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/060-5.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/060-6.webp",
        "largura": 793,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-060"
  },
  {
    "id": "061",
    "nome": "Solares clássicos",
    "categoria": "sol",
    "imagem": "img/catalogo/061-2.webp",
    "largura": 812,
    "altura": 960,
    "alt": "Solares clássicos",
    "descricao": "",
    "destaque": false,
    "origem": "15e424abcfa2",
    "tipo": "galeria",
    "codigo": "G-061"
  },
  {
    "id": "062",
    "nome": "Armações redondas unissex",
    "categoria": "grau",
    "imagem": "img/catalogo/062-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações redondas unissex",
    "descricao": "",
    "destaque": false,
    "origem": "8bc54fb21a98",
    "galeria": [
      {
        "imagem": "img/catalogo/062-2.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/062-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/062-4.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/062-5.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-062"
  },
  {
    "id": "063",
    "nome": "Armações redondas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/063-2.webp",
    "largura": 793,
    "altura": 960,
    "alt": "Armações redondas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "6a984cff17fd",
    "galeria": [
      {
        "imagem": "img/catalogo/063-2.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/063-3.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/063-4.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/063-5.webp",
        "largura": 793,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-063"
  },
  {
    "id": "064",
    "nome": "Armações quadradas",
    "categoria": "grau",
    "imagem": "img/catalogo/064-2.webp",
    "largura": 799,
    "altura": 960,
    "alt": "Armações quadradas",
    "descricao": "",
    "destaque": false,
    "origem": "12bf72a814b9",
    "galeria": [
      {
        "imagem": "img/catalogo/064-2.webp",
        "largura": 799,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/064-3.webp",
        "largura": 802,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/064-4.webp",
        "largura": 799,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-064"
  },
  {
    "id": "065",
    "nome": "Armações femininas estilo tartaruga",
    "categoria": "grau",
    "imagem": "img/catalogo/065-2.webp",
    "largura": 793,
    "altura": 960,
    "alt": "Armações femininas estilo tartaruga",
    "descricao": "",
    "destaque": false,
    "origem": "100645208c86",
    "galeria": [
      {
        "imagem": "img/catalogo/065-2.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/065-3.webp",
        "largura": 793,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/065-4.webp",
        "largura": 793,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-065"
  },
  {
    "id": "066",
    "nome": "Armações femininas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/066-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações femininas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "0c46b45f4edb",
    "galeria": [
      {
        "imagem": "img/catalogo/066-2.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/066-3.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/066-4.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/066-5.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-066"
  },
  {
    "id": "067",
    "nome": "Armações retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/067-2.webp",
    "largura": 750,
    "altura": 960,
    "alt": "Armações retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "1d4e4ceb76e4",
    "galeria": [
      {
        "imagem": "img/catalogo/067-2.webp",
        "largura": 750,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/067-3.webp",
        "largura": 750,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-067"
  },
  {
    "id": "068",
    "nome": "Armações redondas pretas e tartaruga",
    "categoria": "grau",
    "imagem": "img/catalogo/068-2.webp",
    "largura": 862,
    "altura": 960,
    "alt": "Armações redondas pretas e tartaruga",
    "descricao": "",
    "destaque": false,
    "origem": "754eb028e74e",
    "galeria": [
      {
        "imagem": "img/catalogo/068-2.webp",
        "largura": 862,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/068-3.webp",
        "largura": 862,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/068-4.webp",
        "largura": 862,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-068"
  },
  {
    "id": "069",
    "nome": "Armações metálicas retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/069-2.webp",
    "largura": 728,
    "altura": 960,
    "alt": "Armações metálicas retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "3a020a95b039",
    "tipo": "galeria",
    "codigo": "G-069"
  },
  {
    "id": "071",
    "nome": "Armações femininas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/071-2.webp",
    "largura": 810,
    "altura": 960,
    "alt": "Armações femininas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "a53bd5116f52",
    "galeria": [
      {
        "imagem": "img/catalogo/071-2.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-3.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-4.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-5.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-6.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-7.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-8.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-9.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-10.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-11.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-12.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-13.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-14.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-15.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-16.webp",
        "largura": 810,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-17.webp",
        "largura": 812,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/071-18.webp",
        "largura": 810,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-071"
  },
  {
    "id": "072",
    "nome": "Armações redondas pretas",
    "categoria": "grau",
    "imagem": "img/catalogo/072-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações redondas pretas",
    "descricao": "",
    "destaque": false,
    "origem": "17e3ee920b0c",
    "galeria": [
      {
        "imagem": "img/catalogo/072-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/072-3.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/072-4.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-072"
  },
  {
    "id": "074",
    "nome": "Solares aviador degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/074-2.webp",
    "largura": 854,
    "altura": 960,
    "alt": "Solares aviador degradê",
    "descricao": "",
    "destaque": false,
    "origem": "96334adb2628",
    "galeria": [
      {
        "imagem": "img/catalogo/074-2.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-3.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-4.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-5.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-6.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-7.webp",
        "largura": 854,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/074-8.webp",
        "largura": 854,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-074"
  },
  {
    "id": "075",
    "nome": "Armações esportivas de proteção",
    "categoria": "grau",
    "imagem": "img/catalogo/075-2.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações esportivas de proteção",
    "descricao": "",
    "destaque": false,
    "origem": "b662c679284f",
    "galeria": [
      {
        "imagem": "img/catalogo/075-2.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/075-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/075-4.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/075-5.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/075-6.webp",
        "largura": 720,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-075"
  },
  {
    "id": "076",
    "nome": "Armações masculinas retangulares",
    "categoria": "grau",
    "imagem": "img/catalogo/076-2.webp",
    "largura": 724,
    "altura": 960,
    "alt": "Armações masculinas retangulares",
    "descricao": "",
    "destaque": false,
    "origem": "d2a7a3eebcf2",
    "galeria": [
      {
        "imagem": "img/catalogo/076-2.webp",
        "largura": 724,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/076-3.webp",
        "largura": 720,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/076-4.webp",
        "largura": 724,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-076"
  },
  {
    "id": "077",
    "nome": "Armações redondas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/077-2.webp",
    "largura": 867,
    "altura": 960,
    "alt": "Armações redondas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "64250d04b6a1",
    "galeria": [
      {
        "imagem": "img/catalogo/077-2.webp",
        "largura": 867,
        "altura": 960
      },
      {
        "imagem": "img/catalogo/077-3.webp",
        "largura": 867,
        "altura": 960
      }
    ],
    "tipo": "galeria",
    "codigo": "G-077"
  },
  {
    "id": "090",
    "nome": "Armações de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/090.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "d97178b5f6f0",
    "tipo": "galeria",
    "codigo": "G-090"
  },
  {
    "id": "095",
    "nome": "Armações femininas gatinho",
    "categoria": "grau",
    "imagem": "img/catalogo/095.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações femininas gatinho",
    "descricao": "",
    "destaque": false,
    "origem": "7ce0da22932e",
    "tipo": "galeria",
    "codigo": "G-095"
  },
  {
    "id": "097",
    "nome": "Solares quadrados degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/097.webp",
    "largura": 848,
    "altura": 960,
    "alt": "Solares quadrados degradê",
    "descricao": "",
    "destaque": false,
    "origem": "307a9117740c",
    "tipo": "galeria",
    "codigo": "G-097"
  },
  {
    "id": "098",
    "nome": "Solares gatinho degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/098.webp",
    "largura": 861,
    "altura": 960,
    "alt": "Solares gatinho degradê",
    "descricao": "",
    "destaque": false,
    "origem": "b99e5fc98413",
    "tipo": "galeria",
    "codigo": "G-098"
  },
  {
    "id": "099",
    "nome": "Solares quadrados coloridos",
    "categoria": "sol",
    "imagem": "img/catalogo/099.webp",
    "largura": 827,
    "altura": 960,
    "alt": "Solares quadrados coloridos",
    "descricao": "",
    "destaque": false,
    "origem": "cb126ce7ef2f",
    "tipo": "galeria",
    "codigo": "G-099"
  },
  {
    "id": "100",
    "nome": "Solares quadrados tartaruga",
    "categoria": "sol",
    "imagem": "img/catalogo/100.webp",
    "largura": 823,
    "altura": 960,
    "alt": "Solares quadrados tartaruga",
    "descricao": "",
    "destaque": false,
    "origem": "2a85e71802dd",
    "tipo": "galeria",
    "codigo": "G-100"
  },
  {
    "id": "101",
    "nome": "Solares quadrados pretos",
    "categoria": "sol",
    "imagem": "img/catalogo/101.webp",
    "largura": 780,
    "altura": 960,
    "alt": "Solares quadrados pretos",
    "descricao": "",
    "destaque": false,
    "origem": "2fbd642c2e01",
    "tipo": "galeria",
    "codigo": "G-101"
  },
  {
    "id": "102",
    "nome": "Solares metálicos hexagonais",
    "categoria": "sol",
    "imagem": "img/catalogo/102.webp",
    "largura": 801,
    "altura": 960,
    "alt": "Solares metálicos hexagonais",
    "descricao": "",
    "destaque": false,
    "origem": "b13d788bbb86",
    "tipo": "galeria",
    "codigo": "G-102"
  },
  {
    "id": "103",
    "nome": "Solares redondos metálicos",
    "categoria": "sol",
    "imagem": "img/catalogo/103.webp",
    "largura": 785,
    "altura": 960,
    "alt": "Solares redondos metálicos",
    "descricao": "",
    "destaque": false,
    "origem": "af7235eee2e3",
    "tipo": "galeria",
    "codigo": "G-103"
  },
  {
    "id": "104",
    "nome": "Solares metálicos degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/104.webp",
    "largura": 784,
    "altura": 960,
    "alt": "Solares metálicos degradê",
    "descricao": "",
    "destaque": false,
    "origem": "cfed6ee2a4ab",
    "tipo": "galeria",
    "codigo": "G-104"
  },
  {
    "id": "105",
    "nome": "Solares hexagonais degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/105.webp",
    "largura": 780,
    "altura": 960,
    "alt": "Solares hexagonais degradê",
    "descricao": "",
    "destaque": false,
    "origem": "c45f8a9c8268",
    "tipo": "galeria",
    "codigo": "G-105"
  },
  {
    "id": "106",
    "nome": "Solares hexagonais metálicos",
    "categoria": "sol",
    "imagem": "img/catalogo/106.webp",
    "largura": 816,
    "altura": 960,
    "alt": "Solares hexagonais metálicos",
    "descricao": "",
    "destaque": false,
    "origem": "e1bbd6e4e38f",
    "tipo": "galeria",
    "codigo": "G-106"
  },
  {
    "id": "107",
    "nome": "Solares redondos metálicos",
    "categoria": "sol",
    "imagem": "img/catalogo/107.webp",
    "largura": 800,
    "altura": 960,
    "alt": "Solares redondos metálicos",
    "descricao": "",
    "destaque": false,
    "origem": "4e7c2d7d3f50",
    "tipo": "galeria",
    "codigo": "G-107"
  },
  {
    "id": "108",
    "nome": "Solares redondos pequenos",
    "categoria": "sol",
    "imagem": "img/catalogo/108.webp",
    "largura": 776,
    "altura": 960,
    "alt": "Solares redondos pequenos",
    "descricao": "",
    "destaque": false,
    "origem": "aba23c5b465a",
    "tipo": "galeria",
    "codigo": "G-108"
  },
  {
    "id": "109",
    "nome": "Solares redondos degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/109.webp",
    "largura": 846,
    "altura": 960,
    "alt": "Solares redondos degradê",
    "descricao": "",
    "destaque": false,
    "origem": "ac2aad815909",
    "tipo": "galeria",
    "codigo": "G-109"
  },
  {
    "id": "110",
    "nome": "Solares oversize",
    "categoria": "sol",
    "imagem": "img/catalogo/110.webp",
    "largura": 801,
    "altura": 960,
    "alt": "Solares oversize",
    "descricao": "",
    "destaque": false,
    "origem": "2c4854227937",
    "tipo": "galeria",
    "codigo": "G-110"
  },
  {
    "id": "111",
    "nome": "Solares metálicos quadrados",
    "categoria": "sol",
    "imagem": "img/catalogo/111.webp",
    "largura": 818,
    "altura": 960,
    "alt": "Solares metálicos quadrados",
    "descricao": "",
    "destaque": false,
    "origem": "632fab559126",
    "tipo": "galeria",
    "codigo": "G-111"
  },
  {
    "id": "112",
    "nome": "Solares redondos metálicos degradê",
    "categoria": "sol",
    "imagem": "img/catalogo/112.webp",
    "largura": 851,
    "altura": 960,
    "alt": "Solares redondos metálicos degradê",
    "descricao": "",
    "destaque": false,
    "origem": "a2e347d6bf7f",
    "tipo": "galeria",
    "codigo": "G-112"
  },
  {
    "id": "113",
    "nome": "Solares redondos metálicos",
    "categoria": "sol",
    "imagem": "img/catalogo/113.webp",
    "largura": 834,
    "altura": 960,
    "alt": "Solares redondos metálicos",
    "descricao": "",
    "destaque": false,
    "origem": "876021caad9c",
    "tipo": "galeria",
    "codigo": "G-113"
  },
  {
    "id": "115",
    "nome": "Solares gatinho",
    "categoria": "sol",
    "imagem": "img/catalogo/115.webp",
    "largura": 809,
    "altura": 960,
    "alt": "Solares gatinho",
    "descricao": "",
    "destaque": false,
    "origem": "b201f01afdb1",
    "tipo": "galeria",
    "codigo": "G-115"
  },
  {
    "id": "116",
    "nome": "Solar quadrado preto",
    "categoria": "sol",
    "imagem": "img/catalogo/116.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solar quadrado preto",
    "descricao": "",
    "destaque": false,
    "origem": "ba8f1612b9dd",
    "tipo": "galeria",
    "codigo": "G-116"
  },
  {
    "id": "117",
    "nome": "Solar gatinho tartaruga",
    "categoria": "sol",
    "imagem": "img/catalogo/117.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solar gatinho tartaruga",
    "descricao": "",
    "destaque": false,
    "origem": "016274cffb0a",
    "tipo": "galeria",
    "codigo": "G-117"
  },
  {
    "id": "118",
    "nome": "Solar redondo preto",
    "categoria": "sol",
    "imagem": "img/catalogo/118.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solar redondo preto",
    "descricao": "",
    "destaque": false,
    "origem": "c1ce6cb7141a",
    "tipo": "galeria",
    "codigo": "G-118"
  },
  {
    "id": "119",
    "nome": "Solar redondo espelhado azul",
    "categoria": "sol",
    "imagem": "img/catalogo/119.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solar redondo espelhado azul",
    "descricao": "",
    "destaque": false,
    "origem": "ea98a8a275d9",
    "tipo": "galeria",
    "codigo": "G-119"
  },
  {
    "id": "120",
    "nome": "Solar redondo degradê azul",
    "categoria": "sol",
    "imagem": "img/catalogo/120.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Solar redondo degradê azul",
    "descricao": "",
    "destaque": false,
    "origem": "198093f7041b",
    "tipo": "galeria",
    "codigo": "G-120"
  },
  {
    "id": "121",
    "nome": "Armações esportivas coloridas",
    "categoria": "grau",
    "imagem": "img/catalogo/121.webp",
    "largura": 720,
    "altura": 960,
    "alt": "Armações esportivas coloridas",
    "descricao": "",
    "destaque": false,
    "origem": "7497b5a2b0ed",
    "tipo": "galeria",
    "codigo": "G-121"
  },
  {
    "id": "122",
    "nome": "Armação transparente",
    "categoria": "grau",
    "imagem": "img/catalogo/122.webp",
    "largura": 960,
    "altura": 864,
    "alt": "Armação transparente",
    "descricao": "",
    "destaque": false,
    "origem": "0a438b39575e",
    "tipo": "galeria",
    "codigo": "G-122"
  },
  {
    "id": "123",
    "nome": "Armações quadradas femininas",
    "categoria": "grau",
    "imagem": "img/catalogo/123.webp",
    "largura": 954,
    "altura": 960,
    "alt": "Armações quadradas femininas",
    "descricao": "",
    "destaque": false,
    "origem": "bc12179ccdce",
    "tipo": "galeria",
    "codigo": "G-123"
  },
  {
    "id": "124",
    "nome": "Armações quadradas de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/124.webp",
    "largura": 960,
    "altura": 915,
    "alt": "Armações quadradas de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "eae3d39f3f56",
    "tipo": "galeria",
    "codigo": "G-124"
  },
  {
    "id": "125",
    "nome": "Armações femininas gatinho",
    "categoria": "grau",
    "imagem": "img/catalogo/125.webp",
    "largura": 960,
    "altura": 960,
    "alt": "Armações femininas gatinho",
    "descricao": "",
    "destaque": false,
    "origem": "929a9e095a3d",
    "tipo": "galeria",
    "codigo": "G-125"
  },
  {
    "id": "126",
    "nome": "Armações quadradas coloridas",
    "categoria": "grau",
    "imagem": "img/catalogo/126.webp",
    "largura": 960,
    "altura": 960,
    "alt": "Armações quadradas coloridas",
    "descricao": "",
    "destaque": false,
    "origem": "97bbcde66272",
    "tipo": "galeria",
    "codigo": "G-126"
  },
  {
    "id": "127",
    "nome": "Armações gatinho de acetato",
    "categoria": "grau",
    "imagem": "img/catalogo/127.webp",
    "largura": 960,
    "altura": 960,
    "alt": "Armações gatinho de acetato",
    "descricao": "",
    "destaque": false,
    "origem": "89b3213cdd16",
    "tipo": "galeria",
    "codigo": "G-127"
  }
];
