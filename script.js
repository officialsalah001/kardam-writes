const menu=document.querySelector('#menu');
const nav=document.querySelector('#nav');

if(menu&&nav){
  menu.onclick=()=>{
    nav.classList.toggle('open');
  };

  nav.querySelectorAll('a').forEach(a=>{
    a.onclick=()=>{
      nav.classList.remove('open');
    };
  });
}

let cards=[
  ...document.querySelectorAll('#cards article')
];

let buttons=[
  ...document.querySelectorAll('.filters button')
];

const search=document.querySelector('#search');
const none=document.querySelector('#none');

let active='all';

function render(){

  cards=[
    ...document.querySelectorAll('#cards article')
  ];

  const q=(search?.value||'')
    .toLowerCase()
    .trim();

  let n=0;

  cards.forEach(c=>{

    const text=c.innerText.toLowerCase();

    const category=c.dataset.cat;

    const categoryOK=
      active==='all' ||
      category===active;

    const searchOK=
      !q ||
      text.includes(q);

    const show=
      categoryOK &&
      searchOK;

    c.style.display=
      show ? 'block' : 'none';

    if(show) n++;

  });

  if(none){
    none.hidden=n>0;
  }

}

buttons.forEach(b=>{

  b.onclick=()=>{

    buttons.forEach(x=>{
      x.classList.remove('active');
    });

    b.classList.add('active');

    active=b.dataset.filter;

    render();

  };

});

if(search){
  search.oninput=render;
}

document
  .querySelectorAll('[data-j]')
  .forEach(a=>{

    a.onclick=()=>{

      active=a.dataset.j;

      buttons.forEach(b=>{

        b.classList.toggle(
          'active',
          b.dataset.filter===active
        );

      });

      render();

    };

  });

const year=document.querySelector('#year');

if(year){
  year.textContent=
    new Date().getFullYear();
}

/*
  ADD VIDEOS TO NAVIGATION
  Automatically, without editing index.html
*/

if(
  nav &&
  !nav.querySelector(
    'a[href="videos.html"]'
  )
){

  const videoLink=
    document.createElement('a');

  videoLink.href=
    'videos.html';

  videoLink.textContent=
    'Videos';

  nav.appendChild(videoLink);

}

/*
  Refresh homepage cards
*/

window.renderHomeCards=()=>{

  cards=[
    ...document.querySelectorAll(
      '#cards article'
    )
  ];

  render();

};
