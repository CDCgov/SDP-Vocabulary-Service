/* eslint-disable */
if(process.env.NODE_ENV !== 'test'){
  (function(i,s,o,g,r,a,m){
    i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments);
    },i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-130404032-1', 'auto');
}

export function gaSend(type, pageview, route) {
  if(process.env.NODE_ENV === 'test'){
    return;
  } else {
    ga(type, pageview, route);
  }
}
